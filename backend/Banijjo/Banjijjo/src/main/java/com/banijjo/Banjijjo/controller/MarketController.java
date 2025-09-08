package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.*;
import com.banijjo.Banjijjo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/market")
@CrossOrigin(origins = "http://localhost:3000")
public class MarketController {
    private final CompanyRepository companyRepo;
    private final MarketOfferingRepository offeringRepo;
    private final PurchaseRepository purchaseRepo;
    private final UserRepository userRepo;
    private final HoldingRepository holdingRepo;
    private final SoldShareRepository soldShareRepo;

    public MarketController(CompanyRepository companyRepo, MarketOfferingRepository offeringRepo, PurchaseRepository purchaseRepo, UserRepository userRepo, HoldingRepository holdingRepo, SoldShareRepository soldShareRepo) {
        this.companyRepo = companyRepo; this.offeringRepo = offeringRepo; this.purchaseRepo = purchaseRepo; this.userRepo = userRepo; this.holdingRepo = holdingRepo; this.soldShareRepo = soldShareRepo;
    }

    private User me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return null;
        return userRepo.findByEmail(auth.getName()).orElse(null);
    }

    // PUBLIC catalog
    @GetMapping("/companies")
    public List<Company> companies() { return companyRepo.findAll(); }

    @GetMapping("/offerings")
    public List<MarketOffering> offerings() { return offeringRepo.findAll(); }

    // PUBLIC: lightweight offerings view for dashboard (read-only)
    @GetMapping("/dashboard/offerings")
    public ResponseEntity<?> dashboardOfferings() {
        // Return current admin-posted offerings with company, remaining, and price
        List<Map<String, Object>> res = offeringRepo.findAll().stream().map(o -> {
            Map<String, Object> row = new HashMap<>();
            row.put("id", o.getId());
            row.put("company", o.getCompany());
            row.put("remainingShares", o.getRemainingShares());
            row.put("pricePerShare", o.getPricePerShare());
            return row;
        }).toList();
        return ResponseEntity.ok(res);
    }

    // ADMIN: register a company (owned by admin)
    @PostMapping("/admin/company")
    public ResponseEntity<?> createCompany(@RequestBody Map<String, String> body) {
        User u = me(); if (u == null || !"admin".equalsIgnoreCase(u.getRole())) return ResponseEntity.status(403).body("Forbidden");
        String symbol = body.getOrDefault("symbol", "").trim();
        String name = body.getOrDefault("name", "").trim();
        String description = body.getOrDefault("description", "");
        if (symbol.isEmpty() || name.isEmpty()) return ResponseEntity.badRequest().body("Symbol and name required");
        Company c = new Company(symbol, name, description, u.getId());
        return ResponseEntity.created(URI.create("/market/companies")).body(companyRepo.save(c));
    }

    // ADMIN: create an offering to sell shares
    @PostMapping("/admin/offer")
    public ResponseEntity<?> offer(@RequestBody Map<String, Object> body) {
        User u = me(); if (u == null || !"admin".equalsIgnoreCase(u.getRole())) return ResponseEntity.status(403).body("Forbidden");
        String symbol = String.valueOf(body.get("symbol"));
        int shares = Integer.parseInt(String.valueOf(body.get("shares")));
        double price = Double.parseDouble(String.valueOf(body.get("price")));
        Company c = companyRepo.findBySymbolIgnoreCase(symbol).orElse(null);
        if (c == null) return ResponseEntity.badRequest().body("Company not found");
        if (!c.getOwnerId().equals(u.getId())) return ResponseEntity.status(403).body("Not owner of company");
        MarketOffering o = new MarketOffering();
        o.setCompany(c); o.setTotalShares(shares); o.setRemainingShares(shares); o.setPricePerShare(price);
        return ResponseEntity.created(URI.create("/market/offerings")).body(offeringRepo.save(o));
    }

    // USER: buy from offering
    @PostMapping("/buy")
    @Transactional
    public ResponseEntity<?> buy(@RequestBody Map<String, Object> body) {
        User u = me(); if (u == null) return ResponseEntity.status(401).body("Unauthorized");
        Long offeringId = Long.parseLong(String.valueOf(body.get("offeringId")));
        int qty = Integer.parseInt(String.valueOf(body.get("quantity")));
        MarketOffering o = offeringRepo.findById(offeringId).orElse(null);
        if (o == null) return ResponseEntity.badRequest().body("Offering not found");
        if (qty <= 0 || qty > o.getRemainingShares()) return ResponseEntity.badRequest().body("Invalid quantity");
        o.setRemainingShares(o.getRemainingShares() - qty);
        offeringRepo.save(o);
        Purchase p = new Purchase();
        p.setOffering(o); p.setBuyerId(u.getId()); p.setQuantity(qty); p.setPricePerShare(o.getPricePerShare());
        purchaseRepo.save(p);
        // increase user's holdings for this company
        Holding h = holdingRepo.findByOwnerId(u.getId()).stream().filter(x -> x.getCompany().getId().equals(o.getCompany().getId()) && x.getStatus() == HoldingStatus.OWNED).findFirst().orElse(null);
        if (h == null) {
            h = new Holding();
            h.setCompany(o.getCompany());
            h.setOwnerId(u.getId());
            h.setQuantity(qty);
            h.setStatus(HoldingStatus.OWNED);
        } else {
            h.setQuantity(h.getQuantity() + qty);
        }
        holdingRepo.save(h);
        return ResponseEntity.created(URI.create("/market/monitor")).body(p);
    }

    // ADMIN: monitor company sales
    @GetMapping("/admin/monitor")
    public ResponseEntity<?> monitor() {
        User u = me(); if (u == null || !"admin".equalsIgnoreCase(u.getRole())) return ResponseEntity.status(403).build();
        List<Company> my = companyRepo.findAll().stream().filter(c -> u.getId().equals(c.getOwnerId())).toList();
        List<Map<String, Object>> res = new java.util.ArrayList<>();
        for (Company c : my) {
            List<MarketOffering> offs = offeringRepo.findByCompanyIdOrderByCreatedAtDesc(c.getId());
            int total = offs.stream().mapToInt(MarketOffering::getTotalShares).sum();
            int remaining = offs.stream().mapToInt(MarketOffering::getRemainingShares).sum();
            int sold = total - remaining;
            double revenue = purchaseRepo.findByOfferingCompanyId(c.getId()).stream()
                    .mapToDouble(pp -> pp.getPricePerShare() * pp.getQuantity()).sum();
            Map<String, Object> row = new HashMap<>();
            row.put("company", c);
            row.put("offerings", offs);
            row.put("soldShares", sold);
            row.put("remainingShares", remaining);
            row.put("revenue", revenue);
            res.add(row);
        }
        return ResponseEntity.ok(res);
    }

    // USER: my holdings and sold history
    @GetMapping("/my/holdings")
    public ResponseEntity<?> myHoldings() {
        User u = me(); if (u == null) return ResponseEntity.status(401).build();
        Map<String, Object> res = new HashMap<>();
        res.put("holdings", holdingRepo.findByOwnerId(u.getId()));
        res.put("sold", soldShareRepo.findBySellerIdOrderBySoldAtDesc(u.getId()));
        return ResponseEntity.ok(res);
    }

    // USER: list a holding for sale (status -> FOR_SALE)
    @PostMapping("/my/holdings/{holdingId}/sell")
    @Transactional
    public ResponseEntity<?> listForSale(@PathVariable Long holdingId, @RequestBody Map<String, Object> body) {
        User u = me(); if (u == null) return ResponseEntity.status(401).build();
        double price = Double.parseDouble(String.valueOf(body.getOrDefault("price", 0)));
        Holding h = holdingRepo.findById(holdingId).orElse(null);
        if (h == null || !h.getOwnerId().equals(u.getId())) return ResponseEntity.status(404).body("Holding not found");
        if (h.getQuantity() <= 0) return ResponseEntity.badRequest().body("No shares to sell");
        h.setStatus(HoldingStatus.FOR_SALE);
        h.setAskPricePerShare(price > 0 ? price : h.getAskPricePerShare());
        holdingRepo.save(h);
        return ResponseEntity.ok(h);
    }

    // PUBLIC: list of others' holdings that are for sale (exclude me)
    @GetMapping("/listings")
    public ResponseEntity<?> publicListings() {
        User u = me(); if (u == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(holdingRepo.findByStatusAndOwnerIdNot(HoldingStatus.FOR_SALE, u.getId()));
    }

    // USER: buy from another user's listing; transfers shares, records SoldShare
    @PostMapping("/listings/{holdingId}/buy")
    @Transactional
    public ResponseEntity<?> buyListing(@PathVariable Long holdingId, @RequestBody Map<String, Object> body) {
        User buyer = me(); if (buyer == null) return ResponseEntity.status(401).build();
        int qty = Integer.parseInt(String.valueOf(body.getOrDefault("quantity", 0)));
        Holding listing = holdingRepo.findById(holdingId).orElse(null);
        if (listing == null || listing.getStatus() != HoldingStatus.FOR_SALE) return ResponseEntity.status(404).body("Listing not found");
        if (listing.getOwnerId().equals(buyer.getId())) return ResponseEntity.badRequest().body("Cannot buy your own listing");
        if (qty <= 0 || qty > listing.getQuantity()) return ResponseEntity.badRequest().body("Invalid quantity");

        // transfer qty from seller to buyer
        // reduce seller holding
        listing.setQuantity(listing.getQuantity() - qty);
        if (listing.getQuantity() == 0) {
            // consumed listing -> back to OWNED with 0? better: delete
            holdingRepo.delete(listing);
        } else {
            holdingRepo.save(listing);
        }

        // add to buyer holdings (OWNED)
        Holding buyerHolding = holdingRepo.findByOwnerId(buyer.getId()).stream()
                .filter(x -> x.getCompany().getId().equals(listing.getCompany().getId()) && x.getStatus() == HoldingStatus.OWNED)
                .findFirst().orElse(null);
        if (buyerHolding == null) {
            buyerHolding = new Holding();
            buyerHolding.setCompany(listing.getCompany());
            buyerHolding.setOwnerId(buyer.getId());
            buyerHolding.setStatus(HoldingStatus.OWNED);
            buyerHolding.setQuantity(qty);
        } else {
            buyerHolding.setQuantity(buyerHolding.getQuantity() + qty);
        }
        holdingRepo.save(buyerHolding);

        // record sold history
        SoldShare ss = new SoldShare();
        ss.setCompany(listing.getCompany());
        ss.setSellerId(listing.getOwnerId());
        ss.setBuyerId(buyer.getId());
        ss.setQuantity(qty);
        ss.setPricePerShare(listing.getAskPricePerShare() != null ? listing.getAskPricePerShare() : 0.0);
        soldShareRepo.save(ss);

        Map<String, Object> res = new HashMap<>();
        res.put("buyerHolding", buyerHolding);
        res.put("remainingListing", listing.getId() == null ? null : listing);
        res.put("sold", ss);
        return ResponseEntity.ok(res);
    }
}

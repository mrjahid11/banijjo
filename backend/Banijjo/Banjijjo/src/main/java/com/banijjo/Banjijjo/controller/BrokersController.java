package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.Company;
import com.banijjo.Banjijjo.model.Purchase;
import com.banijjo.Banjijjo.model.SoldShare;
import com.banijjo.Banjijjo.repository.CompanyRepository;
import com.banijjo.Banjijjo.repository.PurchaseRepository;
import com.banijjo.Banjijjo.repository.SoldShareRepository;
import com.banijjo.Banjijjo.repository.TradeRepository;
import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/brokers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "http://192.168.*:*"}, allowCredentials = "true")
public class BrokersController {

    private final PurchaseRepository purchaseRepo;
    private final SoldShareRepository soldRepo;
    private final CompanyRepository companyRepo;
    private final UserRepository userRepo;

    public BrokersController(PurchaseRepository purchaseRepo, SoldShareRepository soldRepo, TradeRepository tradeRepo, CompanyRepository companyRepo, UserRepository userRepo) {
        this.purchaseRepo = purchaseRepo;
        this.soldRepo = soldRepo;
        this.companyRepo = companyRepo;
        this.userRepo = userRepo;
    }

    private User me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return null;
        return userRepo.findByEmail(auth.getName()).orElse(null);
    }

    private boolean isBrokerOrAdmin(User u) {
        if (u == null || u.getRole() == null) return false;
        String r = u.getRole().toLowerCase(Locale.ROOT);
        return r.equals("broker") || r.equals("admin");
    }

    @GetMapping("/overview")
    public ResponseEntity<?> overview(@RequestParam(required = false) Long companyId,
                                      @RequestParam(required = false) String from,
                                      @RequestParam(required = false) String to) {
        User u = me();
        if (!isBrokerOrAdmin(u)) return ResponseEntity.status(403).build();

        Instant fromTs;
        Instant toTs;
        if (from != null && to != null) {
            fromTs = Instant.parse(from);
            toTs = Instant.parse(to);
        } else {
            // default: today UTC
            ZonedDateTime startOfDay = ZonedDateTime.now(ZoneOffset.UTC).toLocalDate().atStartOfDay(ZoneOffset.UTC);
            fromTs = startOfDay.toInstant();
            toTs = Instant.now();
        }

        List<Purchase> purchases = companyId == null ?
                purchaseRepo.findByPurchasedAtBetween(fromTs, toTs) :
                purchaseRepo.findByOfferingCompanyIdAndPurchasedAtBetween(companyId, fromTs, toTs);
        List<SoldShare> sells = companyId == null ?
                soldRepo.findBySoldAtBetween(fromTs, toTs) :
                soldRepo.findByCompanyIdAndSoldAtBetween(companyId, fromTs, toTs);

        int totalBuys = purchases.size();
        int totalSells = sells.size();
        int volumeBuy = purchases.stream().mapToInt(Purchase::getQuantity).sum();
        int volumeSell = sells.stream().mapToInt(SoldShare::getQuantity).sum();
        double notionalBuy = purchases.stream().mapToDouble(p -> p.getQuantity() * p.getPricePerShare()).sum();
        double notionalSell = sells.stream().mapToDouble(s -> s.getQuantity() * s.getPricePerShare()).sum();

        Map<String, Object> res = new HashMap<>();
        res.put("from", fromTs);
        res.put("to", toTs);
        res.put("totalBuys", totalBuys);
        res.put("totalSells", totalSells);
        res.put("volumeBuy", volumeBuy);
        res.put("volumeSell", volumeSell);
        res.put("notionalBuy", notionalBuy);
        res.put("notionalSell", notionalSell);

        // per company breakdown for top 5
        Map<Long, Integer> volByCompany = new HashMap<>();
        purchases.forEach(p -> volByCompany.merge(p.getOffering().getCompany().getId(), p.getQuantity(), Integer::sum));
        sells.forEach(s -> volByCompany.merge(s.getCompany().getId(), s.getQuantity(), Integer::sum));

        List<Map<String, Object>> topCompanies = volByCompany.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue(), a.getValue()))
                .limit(5)
                .map(e -> {
                    Optional<Company> c = companyRepo.findById(e.getKey());
                    Map<String, Object> m = new HashMap<>();
                    m.put("companyId", e.getKey());
                    m.put("company", c.map(Company::getName).orElse("#"));
                    m.put("symbol", c.map(Company::getSymbol).orElse("?"));
                    m.put("volume", e.getValue());
                    return m;
                }).collect(Collectors.toList());
        res.put("topCompanies", topCompanies);

        return ResponseEntity.ok(res);
    }

    @GetMapping("/trades/recent")
    public ResponseEntity<?> recentTrades(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "20") int size) {
        User u = me();
        if (!isBrokerOrAdmin(u)) return ResponseEntity.status(403).build();

        // Simple approach: fetch latest N purchases and sells, merge and sort by timestamp desc
        // Repositories don't have paging for custom sort fields, so fetch last 200 and slice
        Instant from = Instant.now().minus(Duration.ofDays(7));
        List<Purchase> purchases = purchaseRepo.findByPurchasedAtBetween(from, Instant.now());
        List<SoldShare> sells = soldRepo.findBySoldAtBetween(from, Instant.now());

        List<Map<String, Object>> merged = new ArrayList<>();
        purchases.forEach(p -> {
            Map<String, Object> m = new HashMap<>();
            m.put("type", "BUY");
            m.put("timestamp", p.getPurchasedAt());
            m.put("companyId", p.getOffering().getCompany().getId());
            m.put("symbol", p.getOffering().getCompany().getSymbol());
            m.put("company", p.getOffering().getCompany().getName());
            m.put("quantity", p.getQuantity());
            m.put("price", p.getPricePerShare());
            merged.add(m);
        });
        sells.forEach(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("type", "SELL");
            m.put("timestamp", s.getSoldAt());
            m.put("companyId", s.getCompany().getId());
            m.put("symbol", s.getCompany().getSymbol());
            m.put("company", s.getCompany().getName());
            m.put("quantity", s.getQuantity());
            m.put("price", s.getPricePerShare());
            merged.add(m);
        });

        merged.sort((a, b) -> ((Instant)b.get("timestamp")).compareTo((Instant)a.get("timestamp")));
        int fromIndex = Math.max(0, page * size);
        int toIndex = Math.min(merged.size(), fromIndex + size);
        List<Map<String, Object>> content = fromIndex < merged.size() ? merged.subList(fromIndex, toIndex) : Collections.emptyList();
        Map<String, Object> res = new HashMap<>();
        res.put("content", content);
        res.put("total", merged.size());
        res.put("page", page);
        res.put("size", size);
        return ResponseEntity.ok(res);
    }
}

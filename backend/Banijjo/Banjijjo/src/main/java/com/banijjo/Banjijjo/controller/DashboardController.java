package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.*;
import com.banijjo.Banjijjo.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000/")
public class DashboardController {

    private final UserRepository userRepo;
    private final HoldingRepository holdingRepo;
    private final SoldShareRepository soldShareRepo;
    private final PurchaseRepository purchaseRepo;

    public DashboardController(UserRepository userRepo, HoldingRepository holdingRepo,
                               SoldShareRepository soldShareRepo, PurchaseRepository purchaseRepo) {
        this.userRepo = userRepo; this.holdingRepo = holdingRepo; this.soldShareRepo = soldShareRepo; this.purchaseRepo = purchaseRepo;
    }

    private User me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return null;
        return userRepo.findByEmail(auth.getName()).orElse(null);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestParam(defaultValue = "Trader") String name) {
        Map<String, Object> res = new HashMap<>();
        res.put("greeting", "Welcome, " + name + " 👋");

        User u = me();
        if (u == null) {
            // Anonymous view with defaults
            res.put("balance", 0);
            res.put("todayPnl", 0);
            res.put("positions", List.of());
            return ResponseEntity.ok(res);
        }
        res.put("userId", u.getId());

        // Balance: naive placeholder (not tracked elsewhere). Could be computed from deposits/withdrawals.
        res.put("balance", 0);

        // Positions from holdings (OWNED)
        List<Holding> holdings = holdingRepo.findByOwnerIdAndStatus(u.getId(), HoldingStatus.OWNED);
        List<Map<String, Object>> positions = new ArrayList<>();
        double totalTodayPnl = 0.0;
        for (Holding h : holdings) {
            Company c = h.getCompany();
            String symbol = c.getSymbol();

            // Average price from purchases for this user and company
            List<Purchase> myBuys = purchaseRepo.findByBuyerId(u.getId());
            double totalQty = 0;
            double totalCost = 0;
            for (Purchase p : myBuys) {
                if (p.getOffering() != null && p.getOffering().getCompany().getId().equals(c.getId())) {
                    totalQty += p.getQuantity();
                    totalCost += p.getQuantity() * p.getPricePerShare();
                }
            }
            double avgPrice = totalQty > 0 ? (totalCost / totalQty) : 0.0;

            // Last traded price approximation: prefer most recent SoldShare, else last Purchase price, else avgPrice
            double lastPrice = avgPrice;
            var recentSold = soldShareRepo.findTopByCompanyIdOrderBySoldAtDesc(c.getId());
            if (recentSold.isPresent()) {
                lastPrice = recentSold.get().getPricePerShare();
            } else {
                // fallback to my most recent purchase for this company
                Purchase lastMyPurchase = null;
                for (Purchase p : myBuys) {
                    if (p.getOffering() != null && p.getOffering().getCompany().getId().equals(c.getId())) {
                        if (lastMyPurchase == null || p.getPurchasedAt().isAfter(lastMyPurchase.getPurchasedAt())) {
                            lastMyPurchase = p;
                        }
                    }
                }
                if (lastMyPurchase != null) lastPrice = lastMyPurchase.getPricePerShare();
            }

            // Simple PnL: (lastPrice - avgPrice) * quantity
            double pnl = (lastPrice - avgPrice) * h.getQuantity();
            totalTodayPnl += pnl; // using same value for lack of intraday delta source

            Map<String, Object> row = new HashMap<>();
            row.put("symbol", symbol);
            row.put("quantity", h.getQuantity());
            row.put("avgPrice", avgPrice);
            row.put("pnl", pnl);
            positions.add(row);
        }
        res.put("positions", positions);
        res.put("todayPnl", totalTodayPnl);

        return ResponseEntity.ok(res);
    }
}

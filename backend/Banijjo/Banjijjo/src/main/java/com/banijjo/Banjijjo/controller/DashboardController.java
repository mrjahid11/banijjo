package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000/")
public class DashboardController {

    private final UserRepository userRepo;

    public DashboardController(UserRepository userRepo) { this.userRepo = userRepo; }

    @GetMapping("/summary")
    public Map<String, Object> getSummary(@RequestParam(defaultValue = "Trader") String name) {
        Map<String, Object> res = new HashMap<>();
        res.put("greeting", "Welcome, " + name + " 👋");
        res.put("balance", 12500);
        res.put("todayPnl", 73.42);
        try {
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null) {
                var user = userRepo.findByEmail(auth.getName()).orElse(null);
                if (user != null) res.put("userId", user.getId());
            }
        } catch (Exception ignored) {}
        List<Map<String, Object>> positions = new ArrayList<>();
        positions.add(Map.of("symbol", "AAPL", "quantity", 10, "avgPrice", 180.0, "pnl", 12.4));
        positions.add(Map.of("symbol", "MSFT", "quantity", 5, "avgPrice", 320.0, "pnl", -4.1));
        res.put("positions", positions);
        return res;
    }
}

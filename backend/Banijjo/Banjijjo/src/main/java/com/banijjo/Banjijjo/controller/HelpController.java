package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.Company;
import com.banijjo.Banjijjo.model.HelpRequest;
import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.repository.CompanyRepository;
import com.banijjo.Banjijjo.repository.HelpRequestRepository;
import com.banijjo.Banjijjo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/help")
@CrossOrigin(origins = "http://localhost:3000")
public class HelpController {
    private final HelpRequestRepository helpRepo;
    private final CompanyRepository companyRepo;
    private final UserRepository userRepo;

    public HelpController(HelpRequestRepository helpRepo, CompanyRepository companyRepo, UserRepository userRepo) {
        this.helpRepo = helpRepo; this.companyRepo = companyRepo; this.userRepo = userRepo;
    }

    private User me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return null;
        return userRepo.findByEmail(auth.getName()).orElse(null);
    }

    // User: create a help request
    @PostMapping("/request")
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
        User u = me(); if (u == null) return ResponseEntity.status(401).body("Unauthorized");
        if ("admin".equalsIgnoreCase(u.getRole())) {
            return ResponseEntity.status(403).body("Admins cannot create help requests. Use the admin dashboard to view and update requests.");
        }
        Long companyId;
        try { companyId = Long.parseLong(body.getOrDefault("companyId", "")); } catch (Exception e) { return ResponseEntity.badRequest().body("Invalid companyId"); }
        String issueType = body.getOrDefault("issueType", "OTHER");
        String description = body.getOrDefault("description", "").trim();
        if (description.isEmpty()) return ResponseEntity.badRequest().body("Description required");
        Company c = companyRepo.findById(companyId).orElse(null);
        if (c == null) return ResponseEntity.badRequest().body("Company not found");
        HelpRequest r = new HelpRequest();
        r.setCompany(c); r.setUserId(u.getId()); r.setIssueType(issueType); r.setDescription(description);
        return ResponseEntity.created(URI.create("/help/me")).body(helpRepo.save(r));
    }

    // User: list own help requests
    @GetMapping("/me")
    public ResponseEntity<?> myRequests() {
        User u = me(); if (u == null) return ResponseEntity.status(401).body("Unauthorized");
        return ResponseEntity.ok(helpRepo.findByUserIdOrderByCreatedAtDesc(u.getId()));
    }

    // Admin (company owner): list help requests for their companies
    @GetMapping("/admin")
    public ResponseEntity<?> adminList() {
        User u = me(); if (u == null || !"admin".equalsIgnoreCase(u.getRole())) return ResponseEntity.status(403).build();
        List<Company> my = companyRepo.findAll().stream().filter(c -> u.getId().equals(c.getOwnerId())).toList();
        List<Map<String, Object>> res = new java.util.ArrayList<>();
        for (Company c : my) {
            Map<String, Object> row = new HashMap<>();
            row.put("company", c);
            row.put("requests", helpRepo.findByCompanyIdOrderByCreatedAtDesc(c.getId()));
            res.add(row);
        }
        return ResponseEntity.ok(res);
    }

    // Admin: update status
    @PostMapping("/admin/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User u = me(); if (u == null || !"admin".equalsIgnoreCase(u.getRole())) return ResponseEntity.status(403).build();
        HelpRequest r = helpRepo.findById(id).orElse(null); if (r == null) return ResponseEntity.notFound().build();
        // verify ownership
        if (!r.getCompany().getOwnerId().equals(u.getId())) return ResponseEntity.status(403).build();
        String s = body.getOrDefault("status", "");
        try {
            r.setStatus(HelpRequest.Status.valueOf(s.toUpperCase()));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Invalid status");
        }
        return ResponseEntity.ok(helpRepo.save(r));
    }
}

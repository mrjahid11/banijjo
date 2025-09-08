package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.ChatMessage;
import com.banijjo.Banjijjo.model.Company;
import com.banijjo.Banjijjo.model.Purchase;
import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.repository.ChatMessageRepository;
import com.banijjo.Banjijjo.repository.CompanyRepository;
import com.banijjo.Banjijjo.repository.PurchaseRepository;
import com.banijjo.Banjijjo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {
    private final ChatMessageRepository chatRepo;
    private final CompanyRepository companyRepo;
    private final PurchaseRepository purchaseRepo;
    private final UserRepository userRepo;

    public ChatController(ChatMessageRepository chatRepo, CompanyRepository companyRepo, PurchaseRepository purchaseRepo, UserRepository userRepo) {
        this.chatRepo = chatRepo; this.companyRepo = companyRepo; this.purchaseRepo = purchaseRepo; this.userRepo = userRepo;
    }

    private User me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return null;
        return userRepo.findByEmail(auth.getName()).orElse(null);
    }

    private boolean hasChatAccess(Long userId, Company company) {
        // Sum value of purchases for this user and company
        List<Purchase> purchases = purchaseRepo.findByBuyerId(userId);
        double total = purchases.stream()
                .filter(p -> p.getOffering() != null && p.getOffering().getCompany().getId().equals(company.getId()))
                .mapToDouble(p -> p.getPricePerShare() * p.getQuantity())
                .sum();
        return total >= 20.0;
    }

    // Companies this user can chat with (spent at least $20)
    @GetMapping("/companies")
    public ResponseEntity<?> myChatCompanies() {
        User u = me(); if (u == null) return ResponseEntity.status(401).build();
        List<Company> companies = companyRepo.findAll();
        List<Company> eligible = new ArrayList<>();
        for (Company c : companies) {
            if (hasChatAccess(u.getId(), c)) eligible.add(c);
        }
        return ResponseEntity.ok(eligible);
    }

    // Messages between me and the company owner
    @GetMapping("/{companyId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long companyId) {
        User u = me(); if (u == null) return ResponseEntity.status(401).build();
        Company c = companyRepo.findById(companyId).orElse(null);
        if (c == null) return ResponseEntity.status(404).body("Company not found");
        if (!hasChatAccess(u.getId(), c) && !Objects.equals(u.getId(), c.getOwnerId()))
            return ResponseEntity.status(403).body("No access to chat");

        List<ChatMessage> all = chatRepo.findByCompanyOrderBySentAtAsc(c);
        Long adminId = c.getOwnerId();
        List<ChatMessage> convo = all.stream()
                .filter(m ->
                        (Objects.equals(m.getSenderId(), u.getId()) && Objects.equals(m.getRecipientId(), adminId)) ||
                        (Objects.equals(m.getSenderId(), adminId) && Objects.equals(m.getRecipientId(), u.getId()))
                ).toList();
        return ResponseEntity.ok(convo);
    }

    // Send a message to the company admin (from user) or to a specific user (from admin)
    @PostMapping("/{companyId}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable Long companyId, @RequestBody Map<String, Object> body) {
        User u = me(); if (u == null) return ResponseEntity.status(401).build();
        Company c = companyRepo.findById(companyId).orElse(null);
        if (c == null) return ResponseEntity.status(404).body("Company not found");

        String content = String.valueOf(body.getOrDefault("content", "")).trim();
        if (content.isEmpty()) return ResponseEntity.badRequest().body("Message content required");

        Long adminId = c.getOwnerId();

        // Determine recipient
        Long recipientId;
        if (Objects.equals(u.getId(), adminId)) {
            // Admin sending; needs a target userId
            Object to = body.get("toUserId");
            if (to == null) return ResponseEntity.badRequest().body("toUserId required for admin");
            recipientId = Long.parseLong(String.valueOf(to));
            // Admin can reply to users who have access
            if (!hasChatAccess(recipientId, c)) return ResponseEntity.status(403).body("User not eligible");
        } else {
            // Normal user sending to admin; must have access
            if (!hasChatAccess(u.getId(), c)) return ResponseEntity.status(403).body("No access to chat");
            recipientId = adminId;
        }

        ChatMessage m = new ChatMessage();
        m.setCompany(c);
        m.setSenderId(u.getId());
        m.setRecipientId(recipientId);
        m.setContent(content);
        ChatMessage saved = chatRepo.save(m);
        return ResponseEntity.created(URI.create("/chat/" + companyId + "/messages")).body(saved);
    }
}

package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.dto.PasswordChangeRequest;
import com.banijjo.Banjijjo.dto.PasswordResetRequest;
import com.banijjo.Banjijjo.dto.ProfileUpdateRequest;
import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.banijjo.Banjijjo.util.PasswordUtil;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    // basic hashing util (not BCrypt) to avoid adding full security stack here

    // In lieu of real auth, accept a userId query param; in real apps, use JWT/session
    @GetMapping
    public ResponseEntity<User> getProfile(@RequestParam Long userId) {
        return userRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestParam Long userId,
                                              @RequestBody ProfileUpdateRequest req) {
        Optional<User> opt = userRepository.findById(userId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        User u = opt.get();
        if (req.getName() != null) u.setName(req.getName());
        if (req.getEmail() != null) u.setEmail(req.getEmail());
        User saved = userRepository.save(u);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestParam Long userId,
                                            @RequestBody PasswordChangeRequest req) {
        Optional<User> opt = userRepository.findById(userId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        User u = opt.get();
    String stored = u.getPassword();
    if (stored == null || !PasswordUtil.matches(req.getCurrentPassword(), stored)) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }
    u.setPassword(PasswordUtil.hash(req.getNewPassword()));
        userRepository.save(u);
        return ResponseEntity.ok().build();
    }

    // Basic forgot-password: locate by email and set a new password (no email token)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest req) {
        Optional<User> opt = userRepository.findByEmail(req.getEmail());
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        User u = opt.get();
    u.setPassword(PasswordUtil.hash(req.getNewPassword()));
        userRepository.save(u);
        return ResponseEntity.created(URI.create("/profile?userId=" + u.getId())).build();
    }
}

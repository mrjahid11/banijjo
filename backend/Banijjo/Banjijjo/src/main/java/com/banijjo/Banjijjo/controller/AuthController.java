package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.dto.AuthDtos.AuthResponse;
import com.banijjo.Banjijjo.dto.AuthDtos.LoginRequest;
import com.banijjo.Banjijjo.dto.AuthDtos.SignupRequest;
import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.repository.UserRepository;
import com.banijjo.Banjijjo.security.JwtService;
import com.banijjo.Banjijjo.util.PasswordUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email, req.password));
    } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        User u = userRepository.findByEmail(req.email).orElseThrow();
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", u.getRole());
        String token = jwtService.generateToken(u.getEmail(), claims);
        return ResponseEntity.ok(new AuthResponse(u.getId(), u.getEmail(), u.getName(), u.getRole(), token));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        if (userRepository.findByEmail(req.email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        User u = new User();
        u.setName(req.name);
        u.setUsername(req.username);
        u.setEmail(req.email);
        u.setRole(req.role == null ? "user" : req.role);
        u.setType(req.type == null ? "basic" : req.type);
        u.setPassword(PasswordUtil.hash(req.password));
        User saved = userRepository.save(u);
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", saved.getRole());
        String token = jwtService.generateToken(saved.getEmail(), claims);
        return ResponseEntity.created(URI.create("/profile?userId=" + saved.getId()))
                .body(new AuthResponse(saved.getId(), saved.getEmail(), saved.getName(), saved.getRole(), token));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stateless JWT: client clears token; server acknowledges.
        return ResponseEntity.ok("Logged out");
    }
}

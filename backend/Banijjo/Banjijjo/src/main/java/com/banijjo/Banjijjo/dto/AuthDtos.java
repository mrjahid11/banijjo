package com.banijjo.Banjijjo.dto;

public class AuthDtos {
    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class SignupRequest {
        public String name;
        public String username;
        public String email;
        public String password;
        public String role;
        public String type;
    }

    public static class AuthResponse {
        public Long userId;
        public String email;
        public String name;
        public String role;
        public String token;
        public AuthResponse(Long userId, String email, String name, String role, String token) {
            this.userId = userId; this.email = email; this.name = name; this.role = role; this.token = token;
        }
    }
}

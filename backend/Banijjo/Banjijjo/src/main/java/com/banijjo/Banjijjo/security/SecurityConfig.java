package com.banijjo.Banjijjo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.banijjo.Banjijjo.util.PasswordUtil;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, UserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/auth/**", "/h2-console/**").permitAll()
                // Allow unauthenticated password reset endpoint
                .requestMatchers(HttpMethod.POST, "/profile/reset-password").permitAll()
                // Community: allow viewing without auth, require auth for write operations
                // But protect user-specific listing
                .requestMatchers(HttpMethod.GET, "/community/mine").authenticated()
                .requestMatchers(HttpMethod.GET, "/community/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/community/create", "/community/post", "/community/comment", "/community/like").authenticated()
                .requestMatchers(HttpMethod.GET, "/", "/error").permitAll()
                .requestMatchers("/profile/**", "/admin/**").authenticated()
                    .requestMatchers(HttpMethod.GET, "/blog/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/blog/create").authenticated()
                // Help endpoints
                .requestMatchers(HttpMethod.POST, "/help/request").authenticated()
                .requestMatchers(HttpMethod.GET, "/help/me").authenticated()
                .requestMatchers("/help/admin/**").authenticated()
                // Market endpoints
                .requestMatchers(HttpMethod.GET, "/market/companies", "/market/offerings").permitAll()
                .requestMatchers(HttpMethod.POST, "/market/buy").authenticated()
                .requestMatchers("/market/admin/**").authenticated()
                .anyRequest().permitAll()
            )
            .headers(h -> h.frameOptions(f -> f.disable()))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Allow CRA when it runs on alternative ports (3000, 3001, 3002, etc.)
        // and common loopback hostnames.
        config.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:*",
            "http://127.0.0.1:*"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.addAllowedHeader("*");
        config.setExposedHeaders(Arrays.asList("Authorization"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return PasswordUtil.hash(rawPassword.toString());
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return PasswordUtil.matches(rawPassword.toString(), encodedPassword);
            }
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}

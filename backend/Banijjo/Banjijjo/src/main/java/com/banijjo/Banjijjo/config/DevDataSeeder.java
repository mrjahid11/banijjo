package com.banijjo.Banjijjo.config;

import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import com.banijjo.Banjijjo.util.PasswordUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("dev")
public class DevDataSeeder {

    @Bean
    CommandLineRunner seedUsers(UserRepository repo) {
        return new CommandLineRunner() {
            @Override
            public void run(String... args) {
                if (repo.count() == 0) {
                User u1 = new User();
                u1.setName("Admin User");
                u1.setUsername("admin");
                u1.setEmail("admin@example.com");
                    u1.setPassword(PasswordUtil.hash("admin"));
                u1.setType("internal");
                u1.setRole("admin");

                User u2 = new User();
                u2.setName("Broker Bob");
                u2.setUsername("brokerbob");
                u2.setEmail("broker@example.com");
                    u2.setPassword(PasswordUtil.hash("broker"));
                u2.setType("broker");
                u2.setRole("broker");

                User u3 = new User();
                u3.setName("Alice Investor");
                u3.setUsername("alice");
                u3.setEmail("alice@example.com");
                    u3.setPassword(PasswordUtil.hash("password"));
                u3.setType("retail");
                u3.setRole("user");

                repo.save(u1);
                repo.save(u2);
                repo.save(u3);
                }
            }
        };
    }
}

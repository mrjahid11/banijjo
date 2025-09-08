package com.banijjo.Banjijjo.config;

import com.banijjo.Banjijjo.model.Company;
import com.banijjo.Banjijjo.model.User;
import com.banijjo.Banjijjo.repository.CompanyRepository;
import com.banijjo.Banjijjo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DevDataInitializer implements CommandLineRunner {
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DevDataInitializer(CompanyRepository companyRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed basic data only if no companies exist yet
        if (companyRepository.count() > 0) {
            return;
        }

        // Ensure a dev admin exists (used as owner for seeded companies)
        String adminEmail = "admin@banijjo.local";
        User admin = userRepository.findByEmail(adminEmail).orElseGet(() -> {
            User u = new User();
            u.setName("Dev Admin");
            u.setUsername("admin");
            u.setEmail(adminEmail);
            u.setPassword(passwordEncoder.encode("admin123"));
            u.setRole("admin");
            u.setType("organisation");
            return userRepository.save(u);
        });

        // Seed a few companies owned by the dev admin
        companyRepository.save(new Company("BNJJ", "Banijjo Securities", "Primary brokerage for Banijjo platform.", admin.getId()));
        companyRepository.save(new Company("GLBI", "Global Investments", "International investment services.", admin.getId()));
        companyRepository.save(new Company("ALPH", "Alpha Capital", "Wealth and asset management.", admin.getId()));
        companyRepository.save(new Company("BLUS", "BlueSky Markets", "Retail trading and education.", admin.getId()));
    }
}

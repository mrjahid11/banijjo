package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findBySymbolIgnoreCase(String symbol);
}

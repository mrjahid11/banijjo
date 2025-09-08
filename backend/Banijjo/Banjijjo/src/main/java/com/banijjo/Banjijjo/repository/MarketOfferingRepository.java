package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.MarketOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarketOfferingRepository extends JpaRepository<MarketOffering, Long> {
    List<MarketOffering> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
}

package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.SoldShare;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.List;

public interface SoldShareRepository extends JpaRepository<SoldShare, Long> {
    List<SoldShare> findBySellerIdOrderBySoldAtDesc(Long sellerId);
    List<SoldShare> findBySoldAtBetween(Instant from, Instant to);
    List<SoldShare> findByCompanyIdAndSoldAtBetween(Long companyId, Instant from, Instant to);
    List<SoldShare> findByBuyerIdOrderBySoldAtDesc(Long buyerId);
    java.util.Optional<SoldShare> findTopByCompanyIdOrderBySoldAtDesc(Long companyId);
}

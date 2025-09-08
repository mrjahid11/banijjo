package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByOfferingCompanyId(Long companyId);
    List<Purchase> findByBuyerId(Long buyerId);
    List<Purchase> findByPurchasedAtBetween(Instant from, Instant to);
    List<Purchase> findByOfferingCompanyIdAndPurchasedAtBetween(Long companyId, Instant from, Instant to);
}

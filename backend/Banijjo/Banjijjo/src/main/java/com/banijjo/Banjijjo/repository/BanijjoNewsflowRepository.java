package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.BanijjoNewsflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BanijjoNewsflowRepository extends JpaRepository<BanijjoNewsflow, Long> {
    Optional<BanijjoNewsflow> findFirstBySymbolIgnoreCase(String symbol);
}

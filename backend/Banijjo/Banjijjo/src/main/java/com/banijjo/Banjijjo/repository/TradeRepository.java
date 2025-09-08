package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, Long> {
    List<Trade> findByPortfolioId(Long portfolioId);
    List<Trade> findByPortfolioIdAndTimestampBetween(Long portfolioId, Instant from, Instant to);
}

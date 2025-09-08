package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.MarketStatusConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketStatusConfigRepository extends JpaRepository<MarketStatusConfig, Long> {
    MarketStatusConfig findTopByOrderByIdDesc(); // get latest config
}

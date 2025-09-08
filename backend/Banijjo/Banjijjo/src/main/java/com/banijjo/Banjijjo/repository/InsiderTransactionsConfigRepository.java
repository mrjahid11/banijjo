package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.InsiderTransactionsConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsiderTransactionsConfigRepository extends JpaRepository<InsiderTransactionsConfig, Long> {
    InsiderTransactionsConfig findTopByOrderByIdDesc(); // Always get latest config
}

package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.CurrencyExchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyExchangeRepository extends JpaRepository<CurrencyExchange, Long> {
    CurrencyExchange findTopByOrderByIdDesc(); // always get the latest config
}

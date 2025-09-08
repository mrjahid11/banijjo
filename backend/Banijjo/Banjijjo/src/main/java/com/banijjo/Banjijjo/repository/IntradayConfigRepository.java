package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Intraday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IntradayConfigRepository extends JpaRepository<Intraday, Long> {
    Intraday findTopByOrderByIdDesc(); // always get the latest config
}

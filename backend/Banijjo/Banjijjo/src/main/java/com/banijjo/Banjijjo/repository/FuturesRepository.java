package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Futures;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FuturesRepository extends JpaRepository<Futures, Long> {
    Futures findTopByOrderByIdDesc(); // get the latest config
}

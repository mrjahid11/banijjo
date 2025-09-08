package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.ForexConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForexConfigRepository extends JpaRepository<ForexConfig, Long> {
    ForexConfig findTopByOrderByIdDesc(); // always get the latest config
}

package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.TopGainersLosersConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TopGainersLosersConfigRepository extends JpaRepository<TopGainersLosersConfig, Long> {
    TopGainersLosersConfig findTopByOrderByIdDesc(); // Always get latest config
}

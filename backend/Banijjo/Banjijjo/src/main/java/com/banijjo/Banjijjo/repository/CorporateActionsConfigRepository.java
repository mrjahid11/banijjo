package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.CorporateActions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CorporateActionsConfigRepository extends JpaRepository<CorporateActions, Long> {
    CorporateActions findTopByOrderByIdDesc(); // fetch latest config
}

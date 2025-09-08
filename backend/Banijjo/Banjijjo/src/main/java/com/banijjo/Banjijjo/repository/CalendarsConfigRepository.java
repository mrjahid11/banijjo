package com.banijjo.Banjijjo.repository;

import com.banijjo.Banjijjo.model.Calendars;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarsConfigRepository extends JpaRepository<Calendars, Long> {
    Calendars findTopByOrderByIdDesc(); // Always fetch the latest config
}

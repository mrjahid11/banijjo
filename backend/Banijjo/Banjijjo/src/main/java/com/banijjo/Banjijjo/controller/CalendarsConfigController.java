package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.Calendars;
import com.banijjo.Banjijjo.repository.CalendarsConfigRepository;
import com.banijjo.Banjijjo.service.CalendarsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/config/calendars")
@CrossOrigin(origins = "http://localhost:3000/")
public class CalendarsConfigController {

    @Autowired
    private CalendarsConfigRepository repository;

    @Autowired
    private CalendarsService service;

    // Save config
    @PostMapping("/add")
    public Calendars addConfig(@RequestBody Calendars config) {
        return repository.save(config);
    }

    // Get latest config
    @GetMapping("/latest")
    public Calendars getLatestConfig() {
        return repository.findTopByOrderByIdDesc();
    }

    // Get all configs
    @GetMapping("/all")
    public List<Calendars> getAllConfigs() {
        return repository.findAll();
    }

    // Call Earnings Calendar API
    @GetMapping("/earnings")
    public String getEarningsCalendar(
            @RequestParam(required = false) String symbol,
            @RequestParam(required = false) String horizon) {
        return service.getEarningsCalendar(symbol, horizon);
    }

    // Call IPO Calendar API
    @GetMapping("/ipo")
    public String getIPOCalendar() {
        return service.getIPOCalendar();
    }
}

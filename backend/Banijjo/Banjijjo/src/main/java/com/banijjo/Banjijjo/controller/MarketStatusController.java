package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.MarketStatusConfig;
import com.banijjo.Banjijjo.repository.MarketStatusConfigRepository;
import com.banijjo.Banjijjo.service.MarketStatusService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/config/market-status")
@CrossOrigin(origins = "http://localhost:3000/")
public class MarketStatusController {

    @Autowired
    private MarketStatusConfigRepository repository;

    @Autowired
    private MarketStatusService service;

    // Add new config
    @PostMapping("/add")
    public MarketStatusConfig addConfig(@RequestBody MarketStatusConfig config) {
        return repository.save(config);
    }

    // Get latest config
    @GetMapping("/latest")
    public MarketStatusConfig getLatestConfig() {
        return repository.findTopByOrderByIdDesc();
    }

    // Get all configs
    @GetMapping("/all")
    public List<MarketStatusConfig> getAllConfigs() {
        return repository.findAll();
    }

    // Fetch real-time market status from Alpha Vantage
    @GetMapping("/status")
    public JsonNode getMarketStatus() {
        return service.getMarketStatus();
    }
}

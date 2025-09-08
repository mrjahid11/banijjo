package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.TopGainersLosersConfig;
import com.banijjo.Banjijjo.repository.TopGainersLosersConfigRepository;
import com.banijjo.Banjijjo.service.TopGainersLosersService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/config/top-gainers-losers")
@CrossOrigin(origins = "http://localhost:3000/")
public class TopGainersLosersController {

    @Autowired
    private TopGainersLosersConfigRepository repository;

    @Autowired
    private TopGainersLosersService service;

    // Add new config
    @PostMapping("/add")
    public TopGainersLosersConfig addConfig(@RequestBody TopGainersLosersConfig config) {
        return repository.save(config);
    }

    // Get latest config
    @GetMapping("/latest")
    public TopGainersLosersConfig getLatestConfig() {
        return repository.findTopByOrderByIdDesc();
    }

    // Get all configs
    @GetMapping("/all")
    public List<TopGainersLosersConfig> getAllConfigs() {
        return repository.findAll();
    }

    // Fetch top gainers, losers, and most active tickers
    @GetMapping("/data")
    public JsonNode getTopGainersLosers() {
        return service.getTopGainersLosers();
    }
}

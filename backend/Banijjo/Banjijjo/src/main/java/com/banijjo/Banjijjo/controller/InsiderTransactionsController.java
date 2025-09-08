package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.InsiderTransactionsConfig;
import com.banijjo.Banjijjo.repository.InsiderTransactionsConfigRepository;
import com.banijjo.Banjijjo.service.InsiderTransactionsService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/config/insider-transactions")
@CrossOrigin(origins = "http://localhost:3000/")
public class InsiderTransactionsController {

    @Autowired
    private InsiderTransactionsConfigRepository repository;

    @Autowired
    private InsiderTransactionsService service;

    // Add new config
    @PostMapping("/add")
    public InsiderTransactionsConfig addConfig(@RequestBody InsiderTransactionsConfig config) {
        return repository.save(config);
    }

    // Get latest config
    @GetMapping("/latest")
    public InsiderTransactionsConfig getLatestConfig() {
        return repository.findTopByOrderByIdDesc();
    }

    // Get all configs
    @GetMapping("/all")
    public List<InsiderTransactionsConfig> getAllConfigs() {
        return repository.findAll();
    }

    // Fetch insider transactions
    @GetMapping("/data")
    public JsonNode getInsiderTransactions(@RequestParam(required = false) String symbol) {
        return service.getInsiderTransactions(symbol);
    }
}

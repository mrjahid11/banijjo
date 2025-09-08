package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.CorporateActions;
import com.banijjo.Banjijjo.repository.CorporateActionsConfigRepository;
import com.banijjo.Banjijjo.service.CorporateActionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/config/corporate-actions")
@CrossOrigin(origins = "http://localhost:3000/")
public class CorporateActionsConfigController {

    @Autowired
    private CorporateActionsConfigRepository repository;

    @Autowired
    private CorporateActionsService service;

    // Save config
    @PostMapping("/add")
    public CorporateActions addConfig(@RequestBody CorporateActions config) {
        return repository.save(config);
    }

    // Get latest config
    @GetMapping("/latest")
    public CorporateActions getLatestConfig() {
        return repository.findTopByOrderByIdDesc();
    }

    // Get all configs
    @GetMapping("/all")
    public List<CorporateActions> getAllConfigs() {
        return repository.findAll();
    }

    // Call Dividends API
    @GetMapping("/dividends")
    public String getDividends(
            @RequestParam(required = false) String symbol,
            @RequestParam(required = false) String datatype) {
        return service.getDividends(symbol, datatype);
    }

    // Call Splits API
    @GetMapping("/splits")
    public String getSplits(
            @RequestParam(required = false) String symbol,
            @RequestParam(required = false) String datatype) {
        return service.getSplits(symbol, datatype);
    }
}

package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.CurrencyExchange;
import com.banijjo.Banjijjo.repository.CurrencyExchangeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/config/currency")
@CrossOrigin(origins = "http://localhost:3000/")
public class CurrencyExchangeConfigController {

    @Autowired
    private CurrencyExchangeRepository repository;

    @PostMapping("/add")
    public CurrencyExchange addConfig(@RequestBody CurrencyExchange config) {
        return repository.save(config);
    }

    @GetMapping("/latest")
    public CurrencyExchange getLatestConfig() {
        return repository.findTopByOrderByIdDesc();
    }

    @GetMapping("/all")
    public List<CurrencyExchange> getAllConfigs() {
        return repository.findAll();
    }
}

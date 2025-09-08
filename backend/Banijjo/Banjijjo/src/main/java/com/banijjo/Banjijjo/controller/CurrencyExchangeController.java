package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.service.CurrencyExchangeService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/currency")
@CrossOrigin(origins = "http://localhost:3000/")
public class CurrencyExchangeController {

    private final CurrencyExchangeService service;

    @Autowired
    public CurrencyExchangeController(CurrencyExchangeService service) {
        this.service = service;
    }

    // Example: GET /currency?from=BTC&to=EUR
    @GetMapping
    public JsonNode getExchangeRate(
            @RequestParam String from,
            @RequestParam String to
    ) {
        return service.getExchangeRate(from, to);
    }
}

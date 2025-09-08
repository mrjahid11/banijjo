package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.service.ForexService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/forex")
@CrossOrigin(origins = "http://localhost:3000/")
public class ForexController {

    private final ForexService service;

    @Autowired
    public ForexController(ForexService service) {
        this.service = service;
    }

    // Example: GET /forex?function=CURRENCY_EXCHANGE_RATE&fromSymbol=USD&toSymbol=JPY
    @GetMapping
    public JsonNode getForexData(
            @RequestParam String function,
            @RequestParam String fromSymbol,
            @RequestParam String toSymbol,
            @RequestParam(required = false) String interval,
            @RequestParam(required = false) String outputsize
    ) {
        return service.getForexData(function, fromSymbol, toSymbol, interval, outputsize);
    }
}

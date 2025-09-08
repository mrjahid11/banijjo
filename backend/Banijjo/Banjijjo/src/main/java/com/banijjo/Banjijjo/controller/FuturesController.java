package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.service.FuturesService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/futures")
@CrossOrigin(origins = "http://localhost:3000/")
public class FuturesController {

    private final FuturesService service;

    @Autowired
    public FuturesController(FuturesService service) {
        this.service = service;
    }

    // Example: GET /futures?function=WTI&interval=daily
    @GetMapping
    public JsonNode getFuturesData(
            @RequestParam String function,
            @RequestParam(required = false) String interval
    ) {
        return service.getCommodityData(function, interval);
    }
}

package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.service.BanijjoOptionsService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000/")
public class BanijjoOptionsController {
    private final BanijjoOptionsService banijjoOptionsService;

    @Autowired
    public BanijjoOptionsController(BanijjoOptionsService banijjoOptionsService) {
        this.banijjoOptionsService = banijjoOptionsService;
    }

    @GetMapping("/options/{symbol}")
    public JsonNode getNews(@PathVariable String symbol) {
        return banijjoOptionsService.getRealTimeOptionsData(symbol);

    }
}
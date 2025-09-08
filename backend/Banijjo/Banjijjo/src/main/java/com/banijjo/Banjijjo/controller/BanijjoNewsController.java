package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.service.BanijjoNewsflowServices;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/community/newsflow")
@CrossOrigin(origins = "http://localhost:3000/")
public class BanijjoNewsController {

    private final BanijjoNewsflowServices banijjoNewsflowServices;

    @Autowired
    public BanijjoNewsController(BanijjoNewsflowServices banijjoNewsflowServices) {
        this.banijjoNewsflowServices = banijjoNewsflowServices;
    }

    @GetMapping("/{symbol}")
    public JsonNode getNews(@PathVariable String symbol) {
        return banijjoNewsflowServices.getStockData(symbol);
    }
}

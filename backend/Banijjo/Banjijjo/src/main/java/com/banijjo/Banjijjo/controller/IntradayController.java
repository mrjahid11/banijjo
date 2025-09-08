package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.service.IntradayService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/intraday")
@CrossOrigin(origins = "http://localhost:3000/")
public class IntradayController {

    private final IntradayService intradayService;

    @Autowired
    public IntradayController(IntradayService intradayService) {
        this.intradayService = intradayService;
    }

    // Example: GET /intraday/IBM?interval=5min&month=2009-01&outputsize=full
    @GetMapping("/{symbol}")
    public JsonNode getIntraday(
            @PathVariable String symbol,
            @RequestParam(required = false) String interval,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String outputsize
    ) {
        return intradayService.getIntradayData(symbol, interval, month, outputsize);
    }
}

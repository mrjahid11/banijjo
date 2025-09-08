package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.StockQuote;
import com.banijjo.Banjijjo.service.StockQuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stocks/quote")
@CrossOrigin(origins = "http://localhost:3000/")
public class StockQuoteController {

    @Autowired
    private StockQuoteService quoteService;

    @GetMapping
    public StockQuote getQuote(
            @RequestParam String symbol,
            @RequestParam(required = false) String datatype
    ) {
        return quoteService.fetchQuote(symbol, datatype);
    }
}
package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.Intraday;
import com.banijjo.Banjijjo.repository.IntradayConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/config/intraday")
@CrossOrigin(origins = "http://localhost:3000/")
public class IntradayConfigController {

    @Autowired
    private IntradayConfigRepository repository;

    @PostMapping("/add")
    public Intraday addConfig(@RequestBody Intraday config) {
        return repository.save(config);
    }

    @GetMapping("/latest")
    public Intraday getLatestConfig() {
        return repository.findTopByOrderByIdDesc();
    }

    @GetMapping("/all")
    public List<Intraday> getAllConfigs() {
        return repository.findAll();
    }
}

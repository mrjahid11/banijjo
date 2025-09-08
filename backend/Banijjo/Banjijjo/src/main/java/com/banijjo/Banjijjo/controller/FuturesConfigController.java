package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.Futures;
import com.banijjo.Banjijjo.repository.FuturesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/config/futures")
@CrossOrigin(origins = "http://localhost:3000/")
public class FuturesConfigController {

    @Autowired
    private FuturesRepository repository;

    @PostMapping("/add")
    public Futures addConfig(@RequestBody Futures config) {
        return repository.save(config);
    }

    @GetMapping("/latest")
    public Futures getLatestConfig() {
        return repository.findTopByOrderByIdDesc();
    }

    @GetMapping("/all")
    public List<Futures> getAllConfigs() {
        return repository.findAll();
    }
}

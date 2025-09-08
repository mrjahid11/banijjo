package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.model.ForexConfig;
import com.banijjo.Banjijjo.repository.ForexConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/config/forex")
@CrossOrigin(origins = "http://localhost:3000/")
public class ForexConfigController {

    @Autowired
    private ForexConfigRepository repository;

    @PostMapping("/add")
    public ForexConfig addConfig(@RequestBody ForexConfig config) {
        return repository.save(config);
    }

    @GetMapping("/latest")
    public ForexConfig getLatestConfig() {
        return repository.findTopByOrderByIdDesc();
    }

    @GetMapping("/all")
    public List<ForexConfig> getAllConfigs() {
        return repository.findAll();
    }
}

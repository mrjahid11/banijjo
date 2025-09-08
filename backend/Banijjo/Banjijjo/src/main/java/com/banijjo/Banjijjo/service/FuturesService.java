package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.Futures;
import com.banijjo.Banjijjo.repository.FuturesRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FuturesService {

    private final FuturesRepository repository;

    @Autowired
    public FuturesService(FuturesRepository repository) {
        this.repository = repository;
    }

    public JsonNode getCommodityData(String function, String interval) {
        try {
            Futures config = repository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("Futures API config not found in DB!");
            }

            String url = config.getApiUrl()
                    + "?function=" + function
                    + "&interval=" + (interval != null ? interval : config.getDefaultInterval())
                    + "&apikey=" + config.getApiKey();

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Error fetching futures data: " + e.getMessage(), e);
        }
    }
}

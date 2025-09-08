package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.ForexConfig;
import com.banijjo.Banjijjo.repository.ForexConfigRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ForexService {

    private final ForexConfigRepository repository;

    @Autowired
    public ForexService(ForexConfigRepository repository) {
        this.repository = repository;
    }

    public JsonNode getForexData(String function, String fromSymbol, String toSymbol, String interval, String outputsize) {
        try {
            ForexConfig config = repository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("Forex API config not found in DB!");
            }

            String url = config.getApiUrl()
                    + "?function=" + function
                    + "&from_symbol=" + fromSymbol
                    + "&to_symbol=" + toSymbol;

            if (interval != null) {
                url += "&interval=" + interval;
            } else if (config.getDefaultInterval() != null) {
                url += "&interval=" + config.getDefaultInterval();
            }

            if (outputsize != null) {
                url += "&outputsize=" + outputsize;
            }

            url += "&apikey=" + config.getApiKey();

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Error fetching forex data: " + e.getMessage(), e);
        }
    }
}

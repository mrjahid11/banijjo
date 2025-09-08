package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.MarketStatusConfig;
import com.banijjo.Banjijjo.repository.MarketStatusConfigRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MarketStatusService {

    private final MarketStatusConfigRepository configRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public MarketStatusService(MarketStatusConfigRepository configRepository, RestTemplate restTemplate) {
        this.configRepository = configRepository;
        this.restTemplate = restTemplate;
    }

    public JsonNode getMarketStatus() {
        try {
            MarketStatusConfig config = configRepository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("MarketStatus API config not found in DB!");
            }

            String url = config.getApiUrl()
                    + "?function=MARKET_STATUS"
                    + "&apikey=" + config.getApiKey();

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Error fetching market status: " + e.getMessage(), e);
        }
    }
}

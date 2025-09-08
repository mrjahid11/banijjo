package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.TopGainersLosersConfig;
import com.banijjo.Banjijjo.repository.TopGainersLosersConfigRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TopGainersLosersService {

    private final TopGainersLosersConfigRepository configRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public TopGainersLosersService(TopGainersLosersConfigRepository configRepository, RestTemplate restTemplate) {
        this.configRepository = configRepository;
        this.restTemplate = restTemplate;
    }

    public JsonNode getTopGainersLosers() {
        try {
            TopGainersLosersConfig config = configRepository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("TopGainersLosers API config not found in DB!");
            }

            String url = config.getApiUrl()
                    + "?function=TOP_GAINERS_LOSERS"
                    + "&apikey=" + config.getApiKey();

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Error fetching top gainers/losers data: " + e.getMessage(), e);
        }
    }
}

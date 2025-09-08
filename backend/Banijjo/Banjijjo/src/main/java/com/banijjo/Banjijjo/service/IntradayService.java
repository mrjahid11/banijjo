package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.Intraday;
import com.banijjo.Banjijjo.repository.IntradayConfigRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class IntradayService {

    private final IntradayConfigRepository configRepository;

    @Autowired
    public IntradayService(IntradayConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    public JsonNode getIntradayData(String symbol, String interval, String month, String outputsize) {
        try {
            Intraday config = configRepository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("Intraday API config not found in DB!");
            }

            String url = config.getApiUrl()
                    + "?function=TIME_SERIES_INTRADAY"
                    + "&symbol=" + symbol
                    + "&interval=" + (interval != null ? interval : config.getDefaultInterval())
                    + "&adjusted=" + config.isAdjusted()
                    + "&extended_hours=" + config.isExtendedHours();

            if (month != null) {
                url += "&month=" + month;
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
            throw new RuntimeException("Error fetching intraday data: " + e.getMessage(), e);
        }
    }
}

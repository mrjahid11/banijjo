package com.banijjo.Banjijjo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BanijjoOptionsService {
    public final String API_key = "TY12BBUJFDGIF62G";
    public final String API_url = "https://www.alphavantage.co/query";

    public JsonNode getRealTimeOptionsData(String symbol) {
        try {
            String url = API_url
                    + "?function=HISTORICAL_OPTIONS"
                    + "&symbol=" + symbol
                    + "&apikey=" + API_key;
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Error Fetching Data for Options: " + e.getMessage(), e);
        }
    }
}
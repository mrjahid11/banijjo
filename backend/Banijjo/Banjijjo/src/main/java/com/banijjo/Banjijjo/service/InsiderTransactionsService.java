package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.InsiderTransactionsConfig;
import com.banijjo.Banjijjo.repository.InsiderTransactionsConfigRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class InsiderTransactionsService {

    private final InsiderTransactionsConfigRepository configRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public InsiderTransactionsService(InsiderTransactionsConfigRepository configRepository, RestTemplate restTemplate) {
        this.configRepository = configRepository;
        this.restTemplate = restTemplate;
    }

    public JsonNode getInsiderTransactions(String symbol) {
        try {
            InsiderTransactionsConfig config = configRepository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("InsiderTransactions API config not found in DB!");
            }

            String finalSymbol = (symbol != null && !symbol.isEmpty())
                    ? symbol
                    : config.getDefaultSymbol();

            String url = config.getApiUrl()
                    + "?function=INSIDER_TRANSACTIONS"
                    + "&symbol=" + finalSymbol
                    + "&apikey=" + config.getApiKey();

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Error fetching insider transactions: " + e.getMessage(), e);
        }
    }
}

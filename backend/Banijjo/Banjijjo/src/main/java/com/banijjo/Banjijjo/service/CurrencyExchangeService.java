package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.CurrencyExchange;
import com.banijjo.Banjijjo.repository.CurrencyExchangeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CurrencyExchangeService {

    private final CurrencyExchangeRepository repository;

    @Autowired
    public CurrencyExchangeService(CurrencyExchangeRepository repository) {
        this.repository = repository;
    }

    public JsonNode getExchangeRate(String fromCurrency, String toCurrency) {
        try {
            CurrencyExchange config = repository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("Currency Exchange API config not found in DB!");
            }

            String url = config.getApiUrl()
                    + "?function=CURRENCY_EXCHANGE_RATE"
                    + "&from_currency=" + fromCurrency
                    + "&to_currency=" + toCurrency
                    + "&apikey=" + config.getApiKey();

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readTree(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Error fetching currency exchange rate: " + e.getMessage(), e);
        }
    }
}

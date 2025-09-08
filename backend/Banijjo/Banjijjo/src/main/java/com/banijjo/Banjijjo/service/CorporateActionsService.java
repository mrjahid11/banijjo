package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.CorporateActions;
import com.banijjo.Banjijjo.repository.CorporateActionsConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CorporateActionsService {

    private final CorporateActionsConfigRepository configRepository;

    @Autowired
    public CorporateActionsService(CorporateActionsConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    // Fetch Dividends
    public String getDividends(String symbol, String datatype) {
        try {
            CorporateActions config = configRepository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("Dividends API config not found in DB!");
            }

            String url = config.getApiUrl()
                    + "?function=DIVIDENDS"
                    + "&symbol=" + (symbol != null ? symbol : config.getDefaultSymbol())
                    + "&datatype=" + (datatype != null ? datatype : config.getDefaultDatatype())
                    + "&apikey=" + config.getApiKey();

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Error fetching Dividends: " + e.getMessage(), e);
        }
    }

    // Fetch Splits
    public String getSplits(String symbol, String datatype) {
        try {
            CorporateActions config = configRepository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("Splits API config not found in DB!");
            }

            String url = config.getApiUrl()
                    + "?function=SPLITS"
                    + "&symbol=" + (symbol != null ? symbol : config.getDefaultSymbol())
                    + "&datatype=" + (datatype != null ? datatype : config.getDefaultDatatype())
                    + "&apikey=" + config.getApiKey();

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Error fetching Splits: " + e.getMessage(), e);
        }
    }
}

package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.BanijjoNewsflow;
import com.banijjo.Banjijjo.repository.BanijjoNewsflowRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BanijjoNewsflowServices {

    // Do not change: per your request, keeping the same name and URL
    public final String API_KEY = "TY12BBUJFDGIF62G";
    public final String API_URL = "https://www.alphavantage.co/query";

    private final BanijjoNewsflowRepository newsflowRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public BanijjoNewsflowServices(BanijjoNewsflowRepository newsflowRepository) {
        this.newsflowRepository = newsflowRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public JsonNode getStockData(String symbol) {
        try {
            // Persist or reuse the symbol (simple repository usage to fit MVC+Repo)
            BanijjoNewsflow entity = newsflowRepository
                    .findFirstBySymbolIgnoreCase(symbol)
                    .orElseGet(() -> {
                        BanijjoNewsflow nf = new BanijjoNewsflow();
                        nf.setSymbol(symbol);
                        return newsflowRepository.save(nf);
                    });

            // Build the Alpha Vantage query (unchanged base URL and API key variable names/values)
            String url = API_URL
                    + "?function=NEWS_SENTIMENT"
                    + "&tickers=" + entity.getSymbol()
                    + "&apikey=" + API_KEY;

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return objectMapper.readTree(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Error Fetching Stock Data: " + e.getMessage(), e);
        }
    }
}

package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.Calendars;
import com.banijjo.Banjijjo.repository.CalendarsConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CalendarsService {

    private final CalendarsConfigRepository configRepository;

    @Autowired
    public CalendarsService(CalendarsConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    // Fetch Earnings Calendar
    public String getEarningsCalendar(String symbol, String horizon) {
        try {
            Calendars config = configRepository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("Earnings Calendar API config not found in DB!");
            }

            String url = config.getApiUrl()
                    + "?function=EARNINGS_CALENDAR"
                    + (symbol != null ? "&symbol=" + symbol : (config.getDefaultSymbol() != null ? "&symbol=" + config.getDefaultSymbol() : ""))
                    + "&horizon=" + (horizon != null ? horizon : config.getDefaultHorizon())
                    + "&apikey=" + config.getApiKey();

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Error fetching Earnings Calendar: " + e.getMessage(), e);
        }
    }

    // Fetch IPO Calendar
    public String getIPOCalendar() {
        try {
            Calendars config = configRepository.findTopByOrderByIdDesc();
            if (config == null) {
                throw new RuntimeException("IPO Calendar API config not found in DB!");
            }

            String url = config.getApiUrl()
                    + "?function=IPO_CALENDAR"
                    + "&apikey=" + config.getApiKey();

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            return response.getBody();

        } catch (Exception e) {
            throw new RuntimeException("Error fetching IPO Calendar: " + e.getMessage(), e);
        }
    }
}

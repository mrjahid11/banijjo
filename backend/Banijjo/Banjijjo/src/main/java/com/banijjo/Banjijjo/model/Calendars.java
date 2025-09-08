package com.banijjo.Banjijjo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Calendars {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String apiKey;    // Alpha Vantage API key
    private String apiUrl;    // Base URL (https://www.alphavantage.co/query)
    private String defaultSymbol; // Optional default symbol (e.g. IBM)
    private String defaultHorizon; // Default horizon (3month, 6month, 12month)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public void setApiUrl(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    public String getDefaultSymbol() {
        return defaultSymbol;
    }

    public void setDefaultSymbol(String defaultSymbol) {
        this.defaultSymbol = defaultSymbol;
    }

    public String getDefaultHorizon() {
        return defaultHorizon;
    }

    public void setDefaultHorizon(String defaultHorizon) {
        this.defaultHorizon = defaultHorizon;
    }
}

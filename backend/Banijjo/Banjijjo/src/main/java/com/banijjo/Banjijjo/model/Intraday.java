package com.banijjo.Banjijjo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Intraday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String apiKey;           // Alpha Vantage API key
    private String apiUrl;           // Base URL for API (e.g., https://www.alphavantage.co/query)
    private String defaultInterval;  // e.g., 5min, 15min
    private boolean adjusted;        // true or false
    private boolean extendedHours;   // true or false

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

    public String getDefaultInterval() {
        return defaultInterval;
    }

    public void setDefaultInterval(String defaultInterval) {
        this.defaultInterval = defaultInterval;
    }

    public boolean isAdjusted() {
        return adjusted;
    }

    public void setAdjusted(boolean adjusted) {
        this.adjusted = adjusted;
    }

    public boolean isExtendedHours() {
        return extendedHours;
    }

    public void setExtendedHours(boolean extendedHours) {
        this.extendedHours = extendedHours;
    }
}

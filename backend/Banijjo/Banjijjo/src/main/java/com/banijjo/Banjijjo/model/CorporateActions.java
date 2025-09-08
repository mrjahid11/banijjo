package com.banijjo.Banjijjo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CorporateActions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String apiKey;        // Alpha Vantage API key
    private String apiUrl;        // Base URL (https://www.alphavantage.co/query)
    private String defaultSymbol; // Default ticker symbol (e.g., IBM)
    private String defaultDatatype; // json or csv (default: json)

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

    public String getDefaultDatatype() {
        return defaultDatatype;
    }

    public void setDefaultDatatype(String defaultDatatype) {
        this.defaultDatatype = defaultDatatype;
    }
}

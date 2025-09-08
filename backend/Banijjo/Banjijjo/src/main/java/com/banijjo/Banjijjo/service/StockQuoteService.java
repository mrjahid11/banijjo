package com.banijjo.Banjijjo.service;

import com.banijjo.Banjijjo.model.StockQuote;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class StockQuoteService {
    private static final String API_KEY = "TY12BBUJFDGIF62G"; // replace with your key
    private static final String BASE_URL = "https://www.alphavantage.co/query";

    public StockQuote fetchQuote(String symbol, String datatype) {
        RestTemplate restTemplate = new RestTemplate();
        String url = BASE_URL + "?function=GLOBAL_QUOTE&symbol=" + symbol
                + "&datatype=" + (datatype != null ? datatype : "json")
                + "&apikey=" + API_KEY;

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if(response != null && response.containsKey("Global Quote")) {
            Map<String, Object> quoteMap = (Map<String, Object>) response.get("Global Quote");
            StockQuote quote = new StockQuote();
            quote.setSymbol((String) quoteMap.get("01. symbol"));
            quote.setOpen((String) quoteMap.get("02. open"));
            quote.setHigh((String) quoteMap.get("03. high"));
            quote.setLow((String) quoteMap.get("04. low"));
            quote.setPrice((String) quoteMap.get("05. price"));
            quote.setVolume((String) quoteMap.get("06. volume"));
            quote.setLatestTradingDay((String) quoteMap.get("07. latest trading day"));
            quote.setPreviousClose((String) quoteMap.get("08. previous close"));
            quote.setChange((String) quoteMap.get("09. change"));
            quote.setChangePercent((String) quoteMap.get("10. change percent"));
            return quote;
        }

        return null;
    }
}

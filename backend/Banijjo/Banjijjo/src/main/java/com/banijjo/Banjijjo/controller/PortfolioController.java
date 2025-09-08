package com.banijjo.Banjijjo.controller;

import com.banijjo.Banjijjo.dto.PositionDto;
import com.banijjo.Banjijjo.dto.TradeRequest;
import com.banijjo.Banjijjo.model.Portfolio;
import com.banijjo.Banjijjo.model.Trade;
import com.banijjo.Banjijjo.repository.PortfolioRepository;
import com.banijjo.Banjijjo.repository.TradeRepository;
import com.banijjo.Banjijjo.util.CsvExportUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/portfolios")
@CrossOrigin("http://localhost:3000/")
public class PortfolioController {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TradeRepository tradeRepository;

    // Portfolios CRUD (minimal)
    @GetMapping
    public List<Portfolio> list(@RequestParam Long userId) {
        return portfolioRepository.findByUserId(userId);
    }

    @PostMapping
    public Portfolio create(@RequestParam Long userId, @RequestParam String name) {
        return portfolioRepository.save(new Portfolio(userId, name));
    }

    // Trades
    @GetMapping("/{portfolioId}/trades")
    public List<Trade> trades(@PathVariable Long portfolioId) {
        return tradeRepository.findByPortfolioId(portfolioId);
    }

    @PostMapping("/{portfolioId}/trades")
    public Trade addTrade(@PathVariable Long portfolioId, @RequestBody TradeRequest req) {
        Trade t = new Trade();
        t.setPortfolioId(portfolioId);
        t.setSymbol(req.getSymbol());
        t.setSide(req.getSide());
        t.setQuantity(req.getQuantity());
        t.setPrice(req.getPrice());
        t.setTimestamp(Instant.now());
        return tradeRepository.save(t);
    }

    // Positions & PnL (using average cost; market price assumed as last trade price per symbol for demo)
    @GetMapping("/{portfolioId}/summary")
    public Map<String, Object> summary(@PathVariable Long portfolioId) {
        List<Trade> trades = tradeRepository.findByPortfolioId(portfolioId);
        Map<String, List<Trade>> bySymbol = trades.stream().collect(Collectors.groupingBy(Trade::getSymbol));
        List<PositionDto> positions = new ArrayList<>();
        double totalPnl = 0.0;
        for (Map.Entry<String, List<Trade>> e : bySymbol.entrySet()) {
            String symbol = e.getKey();
            List<Trade> ts = e.getValue();
            ts.sort(Comparator.comparing(Trade::getTimestamp));

            int qty = 0;
            double avg = 0.0;
            double lastPrice = ts.get(ts.size() - 1).getPrice();

            for (Trade t : ts) {
                if ("BUY".equalsIgnoreCase(t.getSide())) {
                    double cost = avg * qty + t.getPrice() * t.getQuantity();
                    qty += t.getQuantity();
                    avg = qty == 0 ? 0 : cost / qty;
                } else { // SELL
                    qty -= t.getQuantity();
                    if (qty < 0) qty = 0; // simplify: avoid negatives in demo
                }
            }
            double pnl = (lastPrice - avg) * qty;
            totalPnl += pnl;
            positions.add(new PositionDto(symbol, qty, avg, pnl));
        }
        Map<String, Object> res = new HashMap<>();
        res.put("positions", positions);
        res.put("totalPnl", totalPnl);
        return res;
    }

    // Export trades within date range as CSV
    @GetMapping(value = "/{portfolioId}/export", produces = "text/csv")
    public ResponseEntity<byte[]> export(
            @PathVariable Long portfolioId,
            @RequestParam(required = false) Long from,
            @RequestParam(required = false) Long to) {
        Instant fromTs = from != null ? Instant.ofEpochMilli(from) : Instant.EPOCH;
        Instant toTs = to != null ? Instant.ofEpochMilli(to) : Instant.now();
        List<Trade> trades = tradeRepository.findByPortfolioIdAndTimestampBetween(portfolioId, fromTs, toTs);
        List<String[]> rows = new ArrayList<>();
        rows.add(new String[] {"id", "timestamp", "symbol", "side", "quantity", "price"});
        for (Trade t : trades) {
            rows.add(new String[] {
                    String.valueOf(t.getId()),
                    t.getTimestamp().toString(),
                    t.getSymbol(),
                    t.getSide(),
                    String.valueOf(t.getQuantity()),
                    String.valueOf(t.getPrice())
            });
        }
        byte[] csv = CsvExportUtil.toCsv(rows);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=trades.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}

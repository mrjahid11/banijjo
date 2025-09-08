package com.banijjo.Banjijjo.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "trades")
public class Trade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long portfolioId;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private String side; // BUY or SELL

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price; // per share

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    public Trade() {}

    public Trade(Long portfolioId, String symbol, String side, int quantity, double price) {
        this.portfolioId = portfolioId;
        this.symbol = symbol;
        this.side = side;
        this.quantity = quantity;
        this.price = price;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPortfolioId() { return portfolioId; }
    public void setPortfolioId(Long portfolioId) { this.portfolioId = portfolioId; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getSide() { return side; }
    public void setSide(String side) { this.side = side; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}

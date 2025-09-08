package com.banijjo.Banjijjo.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "market_offerings")
public class MarketOffering {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Company company;

    @Column(nullable = false)
    private int totalShares;

    @Column(nullable = false)
    private int remainingShares;

    @Column(nullable = false)
    private double pricePerShare;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public int getTotalShares() { return totalShares; }
    public void setTotalShares(int totalShares) { this.totalShares = totalShares; }
    public int getRemainingShares() { return remainingShares; }
    public void setRemainingShares(int remainingShares) { this.remainingShares = remainingShares; }
    public double getPricePerShare() { return pricePerShare; }
    public void setPricePerShare(double pricePerShare) { this.pricePerShare = pricePerShare; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

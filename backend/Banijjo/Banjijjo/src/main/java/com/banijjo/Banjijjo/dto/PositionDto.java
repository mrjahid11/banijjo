package com.banijjo.Banjijjo.dto;

public class PositionDto {
    private String symbol;
    private int quantity;
    private double avgPrice;
    private double pnl;

    public PositionDto() {}

    public PositionDto(String symbol, int quantity, double avgPrice, double pnl) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.avgPrice = avgPrice;
        this.pnl = pnl;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getAvgPrice() {
        return avgPrice;
    }

    public void setAvgPrice(double avgPrice) {
        this.avgPrice = avgPrice;
    }

    public double getPnl() {
        return pnl;
    }

    public void setPnl(double pnl) {
        this.pnl = pnl;
    }
}

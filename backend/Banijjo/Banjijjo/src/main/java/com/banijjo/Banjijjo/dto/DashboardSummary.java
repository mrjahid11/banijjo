package com.banijjo.Banjijjo.dto;

import java.util.List;

public class DashboardSummary {
    private String greeting;
    private double balance;
    private double todayPnl;
    private List<PositionDto> positions;

    public DashboardSummary() {}

    public DashboardSummary(String greeting, double balance, double todayPnl, List<PositionDto> positions) {
        this.greeting = greeting;
        this.balance = balance;
        this.todayPnl = todayPnl;
        this.positions = positions;
    }

    public String getGreeting() {
        return greeting;
    }

    public void setGreeting(String greeting) {
        this.greeting = greeting;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public double getTodayPnl() {
        return todayPnl;
    }

    public void setTodayPnl(double todayPnl) {
        this.todayPnl = todayPnl;
    }

    public List<PositionDto> getPositions() {
        return positions;
    }

    public void setPositions(List<PositionDto> positions) {
        this.positions = positions;
    }
}

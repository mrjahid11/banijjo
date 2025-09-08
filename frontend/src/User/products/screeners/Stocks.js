import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./Stocks.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Stocks = () => {
  const [symbol, setSymbol] = useState("IBM");
  const [interval, setInterval] = useState("5min");
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:8080/intraday/${symbol}?interval=${interval}`
      );
      const timeSeries = res.data["Time Series (1min)"] || {};
      // Convert to array and sort by datetime
      const dataArray = Object.keys(timeSeries)
        .map((time) => ({
          time,
          open: parseFloat(timeSeries[time]["1. open"]),
          high: parseFloat(timeSeries[time]["2. high"]),
          low: parseFloat(timeSeries[time]["3. low"]),
          close: parseFloat(timeSeries[time]["4. close"]),
          volume: parseInt(timeSeries[time]["5. volume"]),
        }))
        .sort((a, b) => new Date(a.time) - new Date(b.time));
      setStockData(dataArray);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch stock data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [symbol, interval]);

  const chartData = {
    labels: stockData.map((d) => d.time),
    datasets: [
      {
        label: "Close Price",
        data: stockData.map((d) => d.close),
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
        tension: 0.2,
      },
      {
        label: "Open Price",
        data: stockData.map((d) => d.open),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `${symbol} Intraday (${interval})` },
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: "#444" },
      },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "#444" },
      },
    },
  };

  return (
    <div className="stocks-container">
      <h1 className="stocks-title">{symbol} Intraday Stock Chart</h1>

      <div className="stocks-controls">
        <label>
          Symbol:{" "}
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
        </label>
        <label>
          Interval:{" "}
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <option value="1min">1min</option>
            <option value="5min">5min</option>
            <option value="15min">15min</option>
            <option value="30min">30min</option>
            <option value="60min">60min</option>
          </select>
        </label>
        <button onClick={fetchStockData}>Fetch Data</button>
      </div>

      {loading && <p className="loading">Loading data...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && stockData.length > 0 && (
        <div className="stocks-chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default Stocks;

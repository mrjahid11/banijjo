import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "./Options.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const OptionsSummary = ({
  symbol,
  expiration,
  dataDate,
  totalCallVolume,
  totalPutVolume,
  totalCallOI,
  totalPutOI,
  putCallRatio,
  avgCallIV,
  avgPutIV,
}) => (
  <>
    <h1 className="options-title">Historical Options Data for {symbol}</h1>
    <h2 className="options-subtitle">
      Expiration: {expiration} | Data as of: {dataDate}
    </h2>
    <div className="options-summary">
      <div className="summary-card">
        <h3>Total Call Volume</h3>
        <p>{totalCallVolume}</p>
      </div>
      <div className="summary-card">
        <h3>Total Put Volume</h3>
        <p>{totalPutVolume}</p>
      </div>
      <div className="summary-card">
        <h3>Total Call OI</h3>
        <p>{totalCallOI}</p>
      </div>
      <div className="summary-card">
        <h3>Total Put OI</h3>
        <p>{totalPutOI}</p>
      </div>
      <div className="summary-card">
        <h3>Put/Call Ratio (OI)</h3>
        <p>{putCallRatio}</p>
      </div>
      <div className="summary-card">
        <h3>Avg Call IV</h3>
        <p>{avgCallIV}</p>
      </div>
      <div className="summary-card">
        <h3>Avg Put IV</h3>
        <p>{avgPutIV}</p>
      </div>
    </div>
  </>
);

const OptionsChain = ({ strikes, calls, puts }) => (
  <div className="options-chain-container">
    <h2 className="section-title">Options Chain</h2>
    <div className="options-table-container">
      <table className="options-table">
        <thead>
          <tr>
            <th colSpan="12">Calls</th>
            <th></th>
            <th colSpan="12">Puts</th>
          </tr>
          <tr>
            <th>Bid (Size)</th>
            <th>Ask (Size)</th>
            <th>Last</th>
            <th>Mark</th>
            <th>Volume</th>
            <th>OI</th>
            <th>IV</th>
            <th>Delta</th>
            <th>Gamma</th>
            <th>Theta</th>
            <th>Vega</th>
            <th>Rho</th>
            <th>Strike</th>
            <th>Bid (Size)</th>
            <th>Ask (Size)</th>
            <th>Last</th>
            <th>Mark</th>
            <th>Volume</th>
            <th>OI</th>
            <th>IV</th>
            <th>Delta</th>
            <th>Gamma</th>
            <th>Theta</th>
            <th>Vega</th>
            <th>Rho</th>
          </tr>
        </thead>
        <tbody>
          {strikes.map((strike) => {
            const call = calls.find((o) => o.strike === strike);
            const put = puts.find((o) => o.strike === strike);
            return (
              <tr key={strike}>
                <td>{call ? `${call.bid} (${call.bid_size})` : "-"}</td>
                <td>{call ? `${call.ask} (${call.ask_size})` : "-"}</td>
                <td>{call?.last || "-"}</td>
                <td>{call?.mark || "-"}</td>
                <td>{call?.volume || "-"}</td>
                <td>{call?.open_interest || "-"}</td>
                <td>{call?.implied_volatility || "-"}</td>
                <td>{call?.delta || "-"}</td>
                <td>{call?.gamma || "-"}</td>
                <td>{call?.theta || "-"}</td>
                <td>{call?.vega || "-"}</td>
                <td>{call?.rho || "-"}</td>
                <td className="strike-column">{strike}</td>
                <td>{put ? `${put.bid} (${put.bid_size})` : "-"}</td>
                <td>{put ? `${put.ask} (${put.ask_size})` : "-"}</td>
                <td>{put?.last || "-"}</td>
                <td>{put?.mark || "-"}</td>
                <td>{put?.volume || "-"}</td>
                <td>{put?.open_interest || "-"}</td>
                <td>{put?.implied_volatility || "-"}</td>
                <td>{put?.delta || "-"}</td>
                <td>{put?.gamma || "-"}</td>
                <td>{put?.theta || "-"}</td>
                <td>{put?.vega || "-"}</td>
                <td>{put?.rho || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const CombinedChart = ({ strikes, calls, puts, chartOptions }) => {
  const combinedData = {
    labels: strikes,
    datasets: [
      {
        label: "Call Volume",
        data: strikes.map((strike) => {
          const call = calls.find((o) => o.strike === strike);
          return parseInt(call?.volume || 0);
        }),
        borderColor: "#0000FF", // Blue
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        yAxisID: "y",
        fill: true,
      },
      {
        label: "Put Volume",
        data: strikes.map((strike) => {
          const put = puts.find((o) => o.strike === strike);
          return parseInt(put?.volume || 0);
        }),
        borderColor: "#FF0000", // Red
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        yAxisID: "y",
        fill: true,
      },
      {
        label: "Call Open Interest",
        data: strikes.map((strike) => {
          const call = calls.find((o) => o.strike === strike);
          return parseInt(call?.open_interest || 0);
        }),
        borderColor: "#008000", // Green
        backgroundColor: "rgba(0, 128, 0, 0.1)",
        yAxisID: "y1",
        fill: true,
      },
      {
        label: "Put Open Interest",
        data: strikes.map((strike) => {
          const put = puts.find((o) => o.strike === strike);
          return parseInt(put?.open_interest || 0);
        }),
        borderColor: "#000000", // Black
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        yAxisID: "y1",
        fill: true,
      },
    ],
  };

  const combinedOptions = {
    ...chartOptions,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Volume",
          color: "#000000",
        },
        grid: {
          color: "#E0E0E0",
        },
        ticks: {
          color: "#000000",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Open Interest",
          color: "#000000",
        },
        grid: {
          drawOnChartArea: false,
          color: "#E0E0E0",
        },
        ticks: {
          color: "#000000",
        },
      },
      x: {
        grid: {
          color: "#E0E0E0",
        },
        ticks: {
          color: "#000000",
        },
      },
    },
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: "Volume and Open Interest by Strike",
        color: "#000000",
      },
      legend: {
        labels: {
          color: "#000000",
        },
      },
    },
  };

  return (
    <div className="options-charts-container">
      <h2 className="section-title">
        Overview: Volume and Open Interest by Strike
      </h2>
      <div className="chart-wrapper">
        <Line data={combinedData} options={combinedOptions} />
      </div>
    </div>
  );
};

const VolatilityChart = ({ strikes, calls, puts, chartOptions }) => {
  const ivChartData = {
    labels: strikes,
    datasets: [
      {
        label: "Call IV",
        data: strikes.map((strike) => {
          const call = calls.find((o) => o.strike === strike);
          return parseFloat(call?.implied_volatility || 0);
        }),
        borderColor: "#0000FF", // Blue
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        fill: true,
      },
      {
        label: "Put IV",
        data: strikes.map((strike) => {
          const put = puts.find((o) => o.strike === strike);
          return parseFloat(put?.implied_volatility || 0);
        }),
        borderColor: "#FF0000", // Red
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        fill: true,
      },
    ],
  };

  const ivOptions = {
    ...chartOptions,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Implied Volatility",
          color: "#000000",
        },
        grid: {
          color: "#E0E0E0",
        },
        ticks: {
          color: "#000000",
        },
      },
      x: {
        grid: {
          color: "#E0E0E0",
        },
        ticks: {
          color: "#000000",
        },
      },
    },
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: "Implied Volatility by Strike",
        color: "#000000",
      },
      legend: {
        labels: {
          color: "#000000",
        },
      },
    },
  };

  return (
    <div className="options-charts-container">
      <h2 className="section-title">Implied Volatility by Strike</h2>
      <div className="chart-wrapper">
        <Line data={ivChartData} options={ivOptions} />
      </div>
    </div>
  );
};

const Options = () => {
  const [optionsData, setOptionsData] = useState([]);
  const [calls, setCalls] = useState([]);
  const [puts, setPuts] = useState([]);
  const [strikes, setStrikes] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [expiration, setExpiration] = useState("");
  const [dataDate, setDataDate] = useState("");
  const [totalCallVolume, setTotalCallVolume] = useState(0);
  const [totalPutVolume, setTotalPutVolume] = useState(0);
  const [totalCallOI, setTotalCallOI] = useState(0);
  const [totalPutOI, setTotalPutOI] = useState(0);
  const [avgCallIV, setAvgCallIV] = useState("N/A");
  const [avgPutIV, setAvgPutIV] = useState("N/A");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await axios.get(
          "http://localhost:8080/products/options/IBM"
        );
        const data = result.data.data;
        setOptionsData(data);

        const filteredCalls = data
          .filter((o) => o.type === "call")
          .sort((a, b) => parseFloat(a.strike) - parseFloat(b.strike));
        const filteredPuts = data
          .filter((o) => o.type === "put")
          .sort((a, b) => parseFloat(a.strike) - parseFloat(b.strike));

        setCalls(filteredCalls);
        setPuts(filteredPuts);

        const uniqueStrikes = [
          ...new Set([
            ...filteredCalls.map((o) => o.strike),
            ...filteredPuts.map((o) => o.strike),
          ]),
        ].sort((a, b) => parseFloat(a) - parseFloat(b));
        setStrikes(uniqueStrikes);

        if (data.length > 0) {
          setSymbol(data[0].symbol);
          setExpiration(data[0].expiration);
          setDataDate(data[0].date);
        }

        const callVol = filteredCalls.reduce(
          (sum, o) => sum + parseInt(o.volume || 0),
          0
        );
        const putVol = filteredPuts.reduce(
          (sum, o) => sum + parseInt(o.volume || 0),
          0
        );
        const callOI = filteredCalls.reduce(
          (sum, o) => sum + parseInt(o.open_interest || 0),
          0
        );
        const putOI = filteredPuts.reduce(
          (sum, o) => sum + parseInt(o.open_interest || 0),
          0
        );

        setTotalCallVolume(callVol);
        setTotalPutVolume(putVol);
        setTotalCallOI(callOI);
        setTotalPutOI(putOI);

        const callIVSum = filteredCalls.reduce(
          (sum, o) => sum + parseFloat(o.implied_volatility || 0),
          0
        );
        const putIVSum = filteredPuts.reduce(
          (sum, o) => sum + parseFloat(o.implied_volatility || 0),
          0
        );
        setAvgCallIV(
          filteredCalls.length > 0
            ? (callIVSum / filteredCalls.length).toFixed(5)
            : "N/A"
        );
        setAvgPutIV(
          filteredPuts.length > 0
            ? (putIVSum / filteredPuts.length).toFixed(5)
            : "N/A"
        );
      } catch (error) {
        console.error("Error fetching options data: ", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Options Data by Strike" },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
  };

  const putCallRatio =
    totalCallOI > 0 ? (totalPutOI / totalCallOI).toFixed(2) : "N/A";

  if (loading) {
    return (
      <div className="options-container">
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="options-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="options-container">
      <OptionsSummary
        symbol={symbol}
        expiration={expiration}
        dataDate={dataDate}
        totalCallVolume={totalCallVolume}
        totalPutVolume={totalPutVolume}
        totalCallOI={totalCallOI}
        totalPutOI={totalPutOI}
        putCallRatio={putCallRatio}
        avgCallIV={avgCallIV}
        avgPutIV={avgPutIV}
      />
      <div className="view-buttons">
        <button
          className={currentView === "overview" ? "active" : ""}
          onClick={() => setCurrentView("overview")}
        >
          Overview
        </button>
        <button
          className={currentView === "chain" ? "active" : ""}
          onClick={() => setCurrentView("chain")}
        >
          Chain
        </button>
        <button
          className={currentView === "volatility" ? "active" : ""}
          onClick={() => setCurrentView("volatility")}
        >
          Volatility
        </button>
      </div>
      {currentView === "overview" && (
        <CombinedChart
          strikes={strikes}
          calls={calls}
          puts={puts}
          chartOptions={chartOptions}
        />
      )}
      {currentView === "chain" && (
        <OptionsChain strikes={strikes} calls={calls} puts={puts} />
      )}
      {currentView === "volatility" && (
        <VolatilityChart
          strikes={strikes}
          calls={calls}
          puts={puts}
          chartOptions={chartOptions}
        />
      )}
    </div>
  );
};

export default Options;

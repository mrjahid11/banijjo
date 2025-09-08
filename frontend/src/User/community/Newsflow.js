import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Newsflow.css";

const Newsflow = () => {
  const [news, setNews] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("Stock");

  const topicToTicker = {
    All: "AAPL",
    Coin: "COIN",
    Crypto: "CRYPTO:BTC",
    Forex: "FOREX:USD",
  };

  useEffect(() => {
    const ticker = topicToTicker[selectedTopic] || "AAPL";
    const loadNews = async () => {
      try {
        setNews([]); // Clear previous news
        const result = await axios.get(
          `http://localhost:8080/community/newsflow/${ticker}`
        );
        setNews(result.data.feed); // feed array contains news items
      } catch (error) {
        console.error("Error loading news: ", error);
      }
    };
    loadNews();
  }, [selectedTopic]);

  const getSentimentClass = (label) => {
    switch (label) {
      case "Bullish":
        return "sentiment bullish";
      case "Somewhat-Bullish":
        return "sentiment somewhat-bullish";
      case "Neutral":
        return "sentiment neutral";
      case "Somewhat-Bearish":
        return "sentiment somewhat-bearish";
      case "Bearish":
        return "sentiment bearish";
      default:
        return "sentiment neutral";
    }
  };

  return (
    <>
      <style>{`
        .newsflow-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #f8f9fa;
        }
        .newsflow-title {
          text-align: center;
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 2rem;
          font-weight: 600;
        }
        .topics-selector {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
          gap: 1rem;
        }
        .topics-selector button {
          padding: 0.75rem 1.5rem;
          border: none;
          background-color: #e9ecef;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 500;
          color: #495057;
          transition: all 0.3s ease;
        }
        .topics-selector button:hover {
          background-color: #dee2e6;
        }
        .topics-selector button.active {
          background-color: #007bff;
          color: white;
        }
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .news-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .news-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .news-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .news-content {
          padding: 1.5rem;
        }
        .news-headline {
          font-size: 1.25rem;
          color: #222;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .news-summary {
          color: #666;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        .news-authors,
        .news-topics {
          color: #888;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        .sentiment {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }
        .sentiment.bullish {
          background-color: #d4f4e2;
          color: #28a745;
        }
        .sentiment.somewhat-bullish {
          background-color: #e8f5e9;
          color: #4caf50;
        }
        .sentiment.neutral {
          background-color: #f0f0f0;
          color: #6c757d;
        }
        .sentiment.somewhat-bearish {
          background-color: #ffebee;
          color: #f44336;
        }
        .sentiment.bearish {
          background-color: #f8d7da;
          color: #dc3545;
        }
        .read-more {
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
          display: inline-block;
          transition: color 0.3s ease;
        }
        .read-more:hover {
          color: #0056b3;
          text-decoration: underline;
        }
        .text-center {
          text-align: center;
          color: #666;
          font-size: 1rem;
        }
      `}</style>
      <div className="newsflow-container">
        <h1 className="newsflow-title">Latest {selectedTopic} News</h1>
        <div className="topics-selector">
          {Object.keys(topicToTicker).map((topic) => (
            <button
              key={topic}
              className={selectedTopic === topic ? "active" : ""}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
        <div className="news-grid">
          {news.length === 0 ? (
            <p className="text-center">Loading news...</p>
          ) : (
            news.map((item, index) => (
              <div key={index} className="news-card">
                {item.banner_image && (
                  <img
                    src={item.banner_image}
                    alt={item.title}
                    className="news-image"
                  />
                )}
                <div className="news-content">
                  <h3 className="news-headline">{item.title}</h3>
                  <p className="news-summary">{item.summary}</p>

                  {/* Authors */}
                  {item.authors && item.authors.length > 0 && (
                    <p className="news-authors">
                      <strong>By:</strong> {item.authors.join(", ")}
                    </p>
                  )}

                  {/* Topics */}
                  {item.topics && item.topics.length > 0 && (
                    <p className="news-topics">
                      <strong>Topics:</strong>{" "}
                      {item.topics.map((t) => t.topic).join(", ")}
                    </p>
                  )}

                  {/* Sentiment badge */}
                  <span
                    className={getSentimentClass(item.overall_sentiment_label)}
                  >
                    {item.overall_sentiment_label}
                  </span>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-more"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Newsflow;

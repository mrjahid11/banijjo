import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Crypto = () => {
  const [cryptoData, setCryptoData] = useState(null);
  const [forexData, setForexData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cryptoResponse = await axios.get(
        "http://localhost:8080/currency?from=BTC&to=EUR"
      );
      const forexResponse = await axios.get(
        "http://localhost:8080/currency?from=USD&to=JPY"
      );
      setCryptoData(cryptoResponse.data);
      setForexData(forexResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Currency & Crypto Rates</h2>
      <div className="text-center mb-3">
        <Button variant="primary" onClick={fetchData}>
          Refresh Data
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row className="g-4">
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Crypto: BTC → EUR</Card.Title>
                {cryptoData ? (
                  <>
                    <p>
                      <strong>From:</strong> BTC
                    </p>
                    <p>
                      <strong>To:</strong> EUR
                    </p>
                    <p>
                      <strong>Rate:</strong>{" "}
                      {cryptoData.rate || cryptoData.value}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {cryptoData.timestamp || new Date().toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p>Data not available</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Forex: USD → JPY</Card.Title>
                {forexData ? (
                  <>
                    <p>
                      <strong>From:</strong> USD
                    </p>
                    <p>
                      <strong>To:</strong> JPY
                    </p>
                    <p>
                      <strong>Rate:</strong> {forexData.rate || forexData.value}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {forexData.timestamp || new Date().toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p>Data not available</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Crypto;

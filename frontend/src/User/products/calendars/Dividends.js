import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Form } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dividends = () => {
  const [symbol, setSymbol] = useState("IBM");
  const [dividends, setDividends] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch dividends from backend
  const fetchDividends = async (ticker) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/config/corporate-actions/dividends?symbol=${ticker}&datatype=json`
      );
      setDividends(response.data.dividends || []); // assuming response has "dividends" array
    } catch (error) {
      console.error("Error fetching dividends:", error);
      setDividends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDividends(symbol);
  }, [symbol]);

  return (
    <Container
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 className="text-center mb-4">Dividends Data</h2>

      {/* Symbol Selector */}
      <Form.Group className="mb-4" controlId="symbolSelect">
        <Form.Label>Select Symbol:</Form.Label>
        <Form.Select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option value="IBM">IBM</option>
          <option value="AAPL">AAPL</option>
          <option value="MSFT">MSFT</option>
          <option value="GOOGL">GOOGL</option>
          <option value="AMZN">AMZN</option>
          {/* Add more symbols as needed */}
        </Form.Select>
      </Form.Group>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Ex-Dividend Date</th>
              <th>Payment Date</th>
              <th>Record Date</th>
              <th>Declared Date</th>
              <th>Dividend Amount</th>
            </tr>
          </thead>
          <tbody>
            {dividends.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              dividends.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.exDate}</td>
                  <td>{item.paymentDate}</td>
                  <td>{item.recordDate}</td>
                  <td>{item.declaredDate}</td>
                  <td>{item.dividend}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Dividends;

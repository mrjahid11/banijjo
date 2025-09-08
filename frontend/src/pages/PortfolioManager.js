import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function PortfolioManager() {
  const [userId] = useState(() => Number(localStorage.getItem("userId")) || 1);
  const [portfolios, setPortfolios] = useState([]);
  const [newName, setNewName] = useState("");
  const [selected, setSelected] = useState(null);
  const [trades, setTrades] = useState([]);
  const [positions, setPositions] = useState([]);
  const [totalPnl, setTotalPnl] = useState(0);

  const loadPortfolios = useCallback(async () => {
    const res = await axios.get("http://localhost:8080/portfolios", { params: { userId } });
    setPortfolios(res.data || []);
  }, [userId]);

  useEffect(() => {
    // Load portfolios whenever userId changes
    loadPortfolios();
  }, [loadPortfolios]);

  useEffect(() => {
    // Auto-select first portfolio after portfolios load if none selected yet
    if (!selected && portfolios && portfolios.length) {
      setSelected(portfolios[0].id);
    }
  }, [portfolios, selected]);

  useEffect(() => {
    async function load() {
      // Only fetch when we have a valid numeric id
      if (selected === null || selected === undefined) return;
      const tr = await axios.get(`http://localhost:8080/portfolios/${selected}/trades`);
      setTrades(tr.data || []);
      const sum = await axios.get(`http://localhost:8080/portfolios/${selected}/summary`);
      setPositions(sum.data?.positions || []);
      setTotalPnl(sum.data?.totalPnl || 0);
    }
    load();
  }, [selected]);

  async function createPortfolio(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await axios.post("http://localhost:8080/portfolios", null, { params: { userId, name: newName } });
    setNewName("");
    // Set the newly created portfolio as selected
    if (res?.data?.id) setSelected(res.data.id);
    await loadPortfolios();
  }

  async function addTrade(e) {
    e.preventDefault();
    if (selected === null || selected === undefined) return;
    const form = e.target;
    const payload = {
      symbol: form.symbol.value,
      side: form.side.value,
      quantity: Number(form.quantity.value),
      price: Number(form.price.value)
    };
    await axios.post(`http://localhost:8080/portfolios/${selected}/trades`, payload);
    form.reset();
    const tr = await axios.get(`http://localhost:8080/portfolios/${selected}/trades`);
    setTrades(tr.data || []);
    const sum = await axios.get(`http://localhost:8080/portfolios/${selected}/summary`);
    setPositions(sum.data?.positions || []);
    setTotalPnl(sum.data?.totalPnl || 0);
  }

  const exportHref = useMemo(() => selected ? `http://localhost:8080/portfolios/${selected}/export` : "#", [selected]);

  return (
    <div className="container mt-4">
      <h3>Portfolio Manager</h3>

      <div className="row mt-3">
        <div className="col-md-4">
          <h5>Portfolios</h5>
          <ul className="list-group mb-3">
            {portfolios.map(p => (
              <li key={p.id} className={`list-group-item d-flex justify-content-between align-items-center ${selected===p.id? 'active' : ''}`} style={{cursor:'pointer'}} onClick={() => setSelected(p.id)}>
                <span>{p.name}</span>
                <span className="badge bg-secondary">#{p.id}</span>
              </li>
            ))}
            {!portfolios.length && <li className="list-group-item">No portfolios yet</li>}
          </ul>

          <form onSubmit={createPortfolio} className="d-flex gap-2">
            <input className="form-control" placeholder="New portfolio name" value={newName} onChange={e=>setNewName(e.target.value)} />
            <button className="btn btn-primary" type="submit">Create</button>
          </form>
        </div>

        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Trades</h5>
            <a href={exportHref} className="btn btn-outline-secondary" target="_blank" rel="noreferrer" aria-disabled={!selected} onClick={e=>{ if(!selected){ e.preventDefault(); } }}>Export CSV</a>
          </div>
          <table className="table table-sm table-striped">
            <thead>
              <tr>
                <th>Time</th><th>Symbol</th><th>Side</th><th>Qty</th><th>Price</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(t => (
                <tr key={t.id}>
                  <td>{t.timestamp}</td>
                  <td>{t.symbol}</td>
                  <td>{t.side}</td>
                  <td>{t.quantity}</td>
                  <td>{t.price}</td>
                </tr>
              ))}
              {!trades.length && <tr><td colSpan={5}>No trades</td></tr>}
            </tbody>
          </table>

          <h5 className="mt-4">Add Trade</h5>
          <form onSubmit={addTrade} className="row g-2">
            <div className="col-md-3"><input name="symbol" className="form-control" placeholder="Symbol" required /></div>
            <div className="col-md-2">
              <select name="side" className="form-select">
                <option>BUY</option>
                <option>SELL</option>
              </select>
            </div>
            <div className="col-md-2"><input name="quantity" type="number" min="1" className="form-control" placeholder="Qty" required /></div>
            <div className="col-md-2"><input name="price" type="number" step="0.0001" min="0" className="form-control" placeholder="Price" required /></div>
            <div className="col-md-3"><button className="btn btn-success w-100" type="submit">Add</button></div>
          </form>

          <h5 className="mt-4">Positions & PnL</h5>
          <div className="mb-2">Total P&L: <strong>{totalPnl.toFixed(2)}</strong></div>
          <table className="table table-sm table-bordered">
            <thead>
              <tr>
                <th>Symbol</th><th>Qty</th><th>Avg Price</th><th>P&L</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(p => (
                <tr key={p.symbol}>
                  <td>{p.symbol}</td>
                  <td>{p.quantity}</td>
                  <td>{p.avgPrice.toFixed(4)}</td>
                  <td>{p.pnl.toFixed(2)}</td>
                </tr>
              ))}
              {!positions.length && <tr><td colSpan={4}>No positions</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import client from "../api/client";
import { publicListings, buyFromListing, dashboardOfferings, myChatCompanies, getMessages, sendMessage } from "../api/market";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ greeting: "", balance: 0, todayPnl: 0, positions: [] });
  const [listings, setListings] = useState([]);
  const [adminOfferings, setAdminOfferings] = useState([]);
  const [buyQty, setBuyQty] = useState({});
  // Chat state
  const [chatCompanies, setChatCompanies] = useState([]);
  const [activeCompany, setActiveCompany] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    client
      .get("/api/dashboard/summary", { params: { name: "Trader" } })
      .then((res) => {
        if (!isMounted) return;
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.response?.data || err.message);
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ls = await publicListings();
        if (!mounted) return;
        setListings(ls || []);
      } catch (e) {
        // ignore for public dashboard view; may require auth
      }
      try {
        const offs = await dashboardOfferings();
        if (!mounted) return;
        setAdminOfferings(offs || []);
      } catch {}
      try {
        const comps = await myChatCompanies();
        if (!mounted) return;
        setChatCompanies(comps || []);
        // auto-select first company if any
        if ((comps || []).length && !activeCompany) setActiveCompany(comps[0]);
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  // Load messages when active company changes; poll every 5s
  useEffect(() => {
    let mounted = true;
    let intervalId;
    async function load() {
      if (!activeCompany) return;
      try {
        const msgs = await getMessages(activeCompany.id);
        if (!mounted) return;
        setMessages(msgs || []);
        // scroll to bottom
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
      } catch {}
    }
    load();
    intervalId = setInterval(load, 5000);
    return () => { mounted = false; clearInterval(intervalId); };
  }, [activeCompany]);

  const onBuy = async (row) => {
    const qty = parseInt(buyQty[row.id] ?? 0);
    if (!qty || qty <= 0 || qty > row.quantity) return alert("Invalid quantity");
    await buyFromListing(row.id, qty);
    // refresh listings after buy
    const ls = await publicListings();
    setListings(ls || []);
    // simple feedback
    alert("Purchase successful");
  };

  const onSend = async () => {
    if (!activeCompany || !msgInput.trim()) return;
    const content = msgInput.trim();
    setMsgInput("");
    try {
      await sendMessage(activeCompany.id, content);
      const msgs = await getMessages(activeCompany.id);
      setMessages(msgs || []);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    } catch (e) {
      alert(e?.response?.data || e.message);
    }
  };

  if (loading) return <div className="container py-5">Loading dashboard...</div>;
  if (error) return <div className="container py-5 text-danger">{String(error)}</div>;

  return (
    <>
    <style>{`
  /* High-contrast palette and component styles */
  /* Default (light-leaning) styles */
  .dash-hero { background: #0b132b; color: #ffffff; border-radius: 12px; padding: 24px; }
  .metric { background: #111827; color: #ffffff; border-radius: 10px; padding: 16px; box-shadow: 0 0 0 1px #0f172a inset; }
  .metric h6 { color: #e5e7eb; font-weight: 600; margin-bottom: 6px; }
  .metric .val { font-size: 1.6rem; font-weight: 800; color: #ffffff; }

  .positions { background: #ffffff; color: #111111; border-radius: 12px; padding: 16px; box-shadow: 0 0 0 1px #d0d7de inset; }
  .positions h5 { color: #111111; }
  .positions small { color: #495057 !important; }
  .positions table { width: 100%; color: #111111; }
  .positions .table thead th { background: #0f172a; color: #ffffff; border-color: #0f172a; }
  .positions .table tbody tr:nth-child(even) { background: #fafafa; }
  .positions .table td, .positions .table th { border-color: #d0d7de; }

  .pill { padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 0.9rem; letter-spacing: .2px; }
  .pill.green { background: #d1fae5; color: #065f46; box-shadow: 0 0 0 1px #10b981 inset; }
  .pill.red { background: #fee2e2; color: #991b1b; box-shadow: 0 0 0 1px #ef4444 inset; }

  .layout { display: grid; grid-template-columns: 280px 1fr; gap: 16px; }
  .sidebar { background: #f8f9fa; color: #111111; border-radius: 12px; padding: 12px; height: 100%; box-shadow: 0 0 0 1px #d0d7de inset; }
  .chat-list-item { padding: 10px 12px; border-radius: 8px; cursor: pointer; color: #111111; }
  .chat-list-item:hover { background: #e9ecef; }
  .chat-list-item.active { background: #0d6efd; color: #ffffff; }
  .chat-list-item.active .text-muted { color: #e5e7eb !important; }

  .chat-panel { background: #ffffff; color: #111111; border-radius: 12px; padding: 12px; display: flex; flex-direction: column; min-height: 420px; box-shadow: 0 0 0 1px #d0d7de inset; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 8px; }
  .msg { margin: 6px 0; max-width: 70%; padding: 10px 14px; border-radius: 12px; box-shadow: 0 0 0 1px #d0d7de inset; }
  .msg.me { margin-left: auto; background: #0d6efd; color: #ffffff; box-shadow: none; }
  .msg.them { margin-right: auto; background: #e9ecef; color: #111111; }
  .msg .text-muted { color: #374151 !important; opacity: 0.9; }

  /* Inputs and buttons with stronger contrast */
  .input-group-text { background: #111111; color: #ffffff; border: 1px solid #111111; }
  .form-control { background: #ffffff; color: #111111; border: 2px solid #111111; }
  .form-control::placeholder { color: #495057; }
  /* Remove the strong blue focus ring here to keep inputs consistent with site theme
    and avoid a bright blue halo on the dashboard search input. Keep a subtle border change. */
  .form-control:focus { outline: none; border-color: rgba(17,17,17,0.9); box-shadow: none; }
  .btn-outline-success { color: #0f5132; border-color: #0f5132; }
  .btn-outline-success:hover { background: #198754; color: #ffffff; border-color: #198754; }
  .btn-primary { background: #0d6efd; border-color: #0d6efd; font-weight: 700; }
  .btn-primary:disabled { background: #6c757d; border-color: #6c757d; }

  /* Dark-mode overrides when ThemeContext sets data-bs-theme="dark" on <html> */
  [data-bs-theme="dark"] .dash-hero { background: #071028; color: #e6eef8; }
  [data-bs-theme="dark"] .metric { background: #071028; color: #e6eef8; box-shadow: 0 0 0 1px #0b1323 inset; }
  [data-bs-theme="dark"] .metric h6 { color: #cfe7ff; }

  [data-bs-theme="dark"] .positions { background: #071026; color: #e6eef8; box-shadow: 0 0 0 1px #0f172a inset; }
  [data-bs-theme="dark"] .positions h5 { color: #e6eef8; }
  [data-bs-theme="dark"] .positions small { color: #9fb3c7 !important; }
  [data-bs-theme="dark"] .positions .table thead th { background: #071028; color: #e6eef8; border-color: #071028; }
  [data-bs-theme="dark"] .positions .table tbody tr:nth-child(even) { background: #071726; }
  [data-bs-theme="dark"] .positions .table td, [data-bs-theme="dark"] .positions .table th { border-color: #0b2233; }

  [data-bs-theme="dark"] .pill.green { background: #083926; color: #bff0d8; box-shadow: 0 0 0 1px #10b981 inset; }
  [data-bs-theme="dark"] .pill.red { background: #3b0d0d; color: #ffd6d6; box-shadow: 0 0 0 1px #ef4444 inset; }

  [data-bs-theme="dark"] .sidebar { background: #071026; color: #e6eef8; box-shadow: 0 0 0 1px #0b1323 inset; }
  [data-bs-theme="dark"] .chat-list-item { color: #dbeefc; }
  [data-bs-theme="dark"] .chat-list-item:hover { background: #0b2233; }
  [data-bs-theme="dark"] .chat-list-item.active { background: #0b5bff; color: #ffffff; }

  [data-bs-theme="dark"] .chat-panel { background: #071026; color: #e6eef8; box-shadow: 0 0 0 1px #0b1323 inset; }
  [data-bs-theme="dark"] .msg { box-shadow: none; }
  [data-bs-theme="dark"] .msg.them { background: #082033; color: #d7eaf7; }
  [data-bs-theme="dark"] .msg.me { background: #0d6efd; color: #ffffff; }

  [data-bs-theme="dark"] .input-group-text { background: #071026; color: #e6eef8; border: 1px solid #0b1323; }
  [data-bs-theme="dark"] .form-control { background: #071026; color: #e6eef8; border: 1px solid #0b1323; }
  [data-bs-theme="dark"] .form-control::placeholder { color: #6c8797; }
  /* dark-mode: avoid bright blue halo; use subtle highlight consistent with dark panels */
  [data-bs-theme="dark"] .form-control:focus { box-shadow: none; border-color: rgba(255,255,255,0.06); }

  `}</style>
      <div className="container my-4 layout">
        {/* Sidebar: chat companies */}
        <div className="sidebar">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="m-0">Chats</h6>
            <small className="text-muted">Eligible</small>
          </div>
          {chatCompanies?.length ? chatCompanies.map(c => (
            <div key={c.id}
                 className={`chat-list-item ${activeCompany?.id === c.id ? 'active' : ''}`}
                 onClick={() => setActiveCompany(c)}>
              <div className="fw-semibold">{c.name}</div>
              <div className="text-muted" style={{fontSize: 12}}>{c.symbol}</div>
            </div>
          )) : (
            <div className="text-muted" style={{fontSize: 13}}>Buy $20+ from a company to unlock chat.</div>
          )}
        </div>

        <div>
        <div className="dash-hero mb-3">
          <h4 className="mb-1">{data.greeting}</h4>
          <small className="text-light">Your minimal trading dashboard</small>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="metric">
              <h6>Cash Balance</h6>
              <div className="val">${data.balance.toLocaleString()}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="metric">
              <h6>Today's PnL</h6>
              <div className="val">{data.todayPnl >= 0 ? "+" : ""}{data.todayPnl.toFixed(2)}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="metric">
              <h6>Open Positions</h6>
              <div className="val">{data.positions?.length || 0}</div>
            </div>
          </div>
        </div>

  <div className="positions">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">Positions</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Qty</th>
                  <th>Avg Price</th>
                  <th>PnL</th>
                </tr>
              </thead>
              <tbody>
                {data.positions?.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.symbol}</td>
                    <td>{p.quantity}</td>
                    <td>{p.avgPrice}</td>
                    <td>
                      <span className={`pill ${p.pnl >= 0 ? "green" : "red"}`}>
                        {p.pnl >= 0 ? "+" : ""}{p.pnl.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Offerings (read-only) */}
        <div className="positions mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">Admin Offerings</h5>
            <small className="text-muted">Current company offerings</small>
          </div>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Symbol</th>
                  <th>Remaining</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {adminOfferings?.length ? adminOfferings.map((row) => (
                  <tr key={row.id}>
                    <td>{row.company?.name}</td>
                    <td><code>{row.company?.symbol}</code></td>
                    <td>{row.remainingShares}</td>
                    <td>${Number(row.pricePerShare).toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">No active offerings</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Community Market: Other users' listings */}
        <div className="positions mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">For Sale by Others</h5>
            <small className="text-muted">See shares listed by the community</small>
          </div>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Symbol</th>
                  <th>Quantity</th>
                  <th>Ask Price</th>
                  <th style={{minWidth: 200}}>Buy</th>
                </tr>
              </thead>
              <tbody>
                {listings?.length ? listings.map(row => (
                  <tr key={row.id}>
                    <td>{row.company?.name}</td>
                    <td><code>{row.company?.symbol}</code></td>
                    <td>{row.quantity}</td>
                    <td>${row.askPricePerShare?.toFixed?.(2) ?? '-'}</td>
                    <td>
                      <div className="input-group input-group-sm" style={{maxWidth: 260}}>
                        <span className="input-group-text">Qty</span>
                        <input type="number" className="form-control" min="1" max={row.quantity}
                          value={buyQty[row.id] ?? ''}
                          onChange={e => setBuyQty({ ...buyQty, [row.id]: e.target.value })}
                        />
                        <button className="btn btn-outline-success" onClick={() => onBuy(row)}>Buy</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">No listings available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chat panel */}
        <div className="chat-panel mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="m-0">Chat {activeCompany ? `with ${activeCompany.name}` : ''}</h6>
          </div>
          <div className="chat-messages">
            {messages?.length ? messages.map(m => (
              <div key={m.id} className={`msg ${m.senderId === data?.userId ? 'me' : 'them'}`}>
                <div style={{fontSize: 12}} className="text-muted">{new Date(m.sentAt).toLocaleString()}</div>
                <div>{m.content}</div>
              </div>
            )) : (
              <div className="text-muted" style={{fontSize: 13}}>No messages yet.</div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="input-group mt-2">
            <input
              type="text"
              className="form-control"
              placeholder={activeCompany ? "Type a message" : "Select a company on the left"}
              value={msgInput}
              disabled={!activeCompany}
              onChange={e => setMsgInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') onSend(); }}
            />
            <button className="btn btn-primary" onClick={onSend} disabled={!activeCompany || !msgInput.trim()}>Send</button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

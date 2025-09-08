import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
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
    axios
      .get("http://localhost:8080/api/dashboard/summary", { params: { name: "Trader" } })
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
  /* Modern, vibrant dashboard theme with glassmorphism and gradients */
  .dash-hero {
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    color: #fff;
    border-radius: 18px;
    padding: 32px 28px 24px 28px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
    backdrop-filter: blur(6px);
    border: 1.5px solid rgba(255,255,255,0.18);
    position: relative;
    overflow: hidden;
  }
  .dash-hero::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 120px; height: 120px;
    background: radial-gradient(circle, #fff3 0%, #0000 80%);
    border-radius: 50%;
    z-index: 0;
  }
  .dash-hero h4, .dash-hero small { position: relative; z-index: 1; }

  .metric {
    background: rgba(255,255,255,0.18);
    color: #fff;
    border-radius: 14px;
    padding: 20px 18px;
    box-shadow: 0 4px 24px 0 rgba(106,17,203,0.10);
    border: 1.5px solid rgba(255,255,255,0.18);
    backdrop-filter: blur(4px);
    transition: transform 0.15s;
  }
  .metric:hover { transform: translateY(-4px) scale(1.03); box-shadow: 0 8px 32px 0 rgba(37,117,252,0.18); }
  .metric h6 { color: #e0e7ff; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.5px; }
  .metric .val { font-size: 2.1rem; font-weight: 900; color: #fff; text-shadow: 0 2px 8px #2575fc44; }

  .positions {
    background: rgba(255,255,255,0.75);
    color: #222;
    border-radius: 16px;
    padding: 20px 18px;
    box-shadow: 0 2px 16px 0 rgba(106,17,203,0.08);
    border: 1.5px solid #e0e7ff;
    margin-bottom: 0.5rem;
    backdrop-filter: blur(2px);
  }
  .positions h5 { color: #2575fc; font-weight: 800; }
  .positions small { color: #6a11cb !important; }
  .positions table { width: 100%; color: #222; }
  .positions .table thead th {
    background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
    color: #fff;
    border-color: #6a11cb;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .positions .table tbody tr:nth-child(even) { background: #f3f6fd; }
  .positions .table td, .positions .table th { border-color: #e0e7ff; }

  .pill {
    padding: 4px 14px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: .3px;
    box-shadow: 0 2px 8px #2575fc22;
  }
  .pill.green {
    background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
    color: #065f46;
    border: 1.5px solid #43e97b;
  }
  .pill.red {
    background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);
    color: #991b1b;
    border: 1.5px solid #fa709a;
  }

  .layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;
  }
  .sidebar {
    background: rgba(255,255,255,0.85);
    color: #222;
    border-radius: 16px;
    padding: 18px 12px;
    height: 100%;
    box-shadow: 0 2px 16px 0 rgba(37,117,252,0.08);
    border: 1.5px solid #e0e7ff;
    backdrop-filter: blur(2px);
  }
  .chat-list-item {
    padding: 12px 14px;
    border-radius: 10px;
    cursor: pointer;
    color: #222;
    font-weight: 600;
    margin-bottom: 6px;
    transition: background 0.15s, color 0.15s;
  }
  .chat-list-item:hover {
    background: linear-gradient(90deg, #e0e7ff 0%, #f3f6fd 100%);
  }
  .chat-list-item.active {
    background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
    color: #fff;
    box-shadow: 0 2px 8px #2575fc22;
  }
  .chat-list-item.active .text-muted { color: #e0e7eb !important; }

  .chat-panel {
    background: rgba(255,255,255,0.85);
    color: #222;
    border-radius: 16px;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    min-height: 420px;
    box-shadow: 0 2px 16px 0 rgba(37,117,252,0.08);
    border: 1.5px solid #e0e7ff;
    backdrop-filter: blur(2px);
  }
  .chat-messages { flex: 1; overflow-y: auto; padding: 8px; }
  .msg {
    margin: 8px 0;
    max-width: 70%;
    padding: 12px 18px;
    border-radius: 16px;
    box-shadow: 0 2px 8px #2575fc22;
    font-size: 1.05rem;
    font-weight: 500;
    background: #f3f6fd;
    color: #222;
    transition: background 0.15s, color 0.15s;
  }
  .msg.me {
    margin-left: auto;
    background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
    color: #fff;
    box-shadow: 0 2px 8px #2575fc44;
  }
  .msg.them {
    margin-right: auto;
    background: #f3f6fd;
    color: #222;
  }
  .msg .text-muted { color: #374151 !important; opacity: 0.9; }

  /* Inputs and buttons with stronger contrast and modern look */
  .input-group-text {
    background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
    color: #fff;
    border: none;
    font-weight: 700;
    border-radius: 8px 0 0 8px;
  }
  .form-control {
    background: #f3f6fd;
    color: #222;
    border: 2px solid #6a11cb;
    border-radius: 0 8px 8px 0;
    font-weight: 600;
    transition: border 0.15s, box-shadow 0.15s;
  }
  .form-control::placeholder { color: #6a11cb; }
  .form-control:focus {
    outline: none;
    border-color: #2575fc;
    box-shadow: 0 0 0 3px rgba(37,117,252,0.18);
  }
  .btn-outline-success {
    color: #43e97b;
    border-color: #43e97b;
    font-weight: 700;
    background: #fff;
    border-radius: 8px;
    transition: background 0.15s, color 0.15s;
  }
  .btn-outline-success:hover {
    background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
    color: #065f46;
    border-color: #38f9d7;
  }
  .btn-primary {
    background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
    border: none;
    font-weight: 800;
    border-radius: 8px;
    box-shadow: 0 2px 8px #2575fc22;
    transition: background 0.15s, box-shadow 0.15s;
  }
  .btn-primary:disabled {
    background: #bdbdbd;
    border: none;
    color: #fff;
  }
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

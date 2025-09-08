import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { brokerOverview, brokerRecentTrades } from '../../api/market';

export default function BrokerDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState(null);
  const [trades, setTrades] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState(null);
  const [themeVariant, setThemeVariant] = useState('dark'); // 'dark' | 'light'
  const size = 20;

  const fmtInt = (n) => (n || n === 0) ? n.toLocaleString() : '-';
  const fmtUsd = (n) => (n || n === 0) ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) : '-';

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const [ov, rec] = await Promise.all([
        brokerOverview(),
        brokerRecentTrades(page, size)
      ]);
      setKpi(ov);
      setTrades(rec.content || []);
      setTotal(rec.total || 0);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        setError('Please sign in to view the Broker Dashboard.');
      } else if (status === 403) {
        setError('Access denied. Broker or admin role required.');
      } else {
        setError('Failed to load broker data.');
      }
      setAutoRefresh(false);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => refresh(), 5000);
    return () => clearInterval(id);
  }, [autoRefresh, refresh]);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / size)), [total, size]);
  const maxTopVol = useMemo(() => {
    const vols = kpi?.topCompanies?.map(c => c.volume) || [1];
    return Math.max(1, ...vols);
  }, [kpi]);

  return (
  <div className={`broker-layout ${themeVariant === 'light' ? 'broker-light' : ''}`}>
      <style>{`
        .broker-layout { --bg1: #0b1020; --bg2: #121a33; --accent: #4cc9f0; --accent-2: #b5179e; --positive:#16db65; --negative:#ff4d6d; --glass: rgba(255,255,255,0.06); --glass-border: rgba(255,255,255,0.12); }
        .broker-hero { background: radial-gradient(1200px 400px at 10% -30%, var(--accent)/0.25, transparent 70%), linear-gradient(160deg, var(--bg1), var(--bg2)); color: #e9f2ff; padding: 2.25rem 0 4.5rem; position: relative; overflow: hidden; }
        .broker-hero h1 { font-weight: 800; letter-spacing: 0.4px; }
        .broker-hero .sub { opacity: 0.85; }
        .pulse-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; background: var(--positive); box-shadow: 0 0 0 rgba(22,219,101,0.7); animation: pulse 1.5s infinite; }
        .pulse-dot.off { background: #6c757d; box-shadow: none; animation: none; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(22,219,101,0.7); } 70% { box-shadow: 0 0 0 12px rgba(22,219,101,0); } 100% { box-shadow: 0 0 0 0 rgba(22,219,101,0); } }
        .kpi-track { position: relative; margin-top: -2.75rem; }
        .kpi-pill { backdrop-filter: blur(6px); background: var(--glass); border: 1px solid var(--glass-border); border-radius: 16px; padding: 1rem 1.25rem; color: #e6eaf2; min-width: 220px; box-shadow: 0 10px 20px rgba(0,0,0,0.25); }
        .kpi-icon { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; margin-right: 10px; }
        .kpi-icon.buy { background: rgba(22,219,101,0.15); color: var(--positive); }
        .kpi-icon.sell { background: rgba(255,77,109,0.15); color: var(--negative); }
        .kpi-icon.usd { background: rgba(76,201,240,0.15); color: var(--accent); }
        .glass-card { backdrop-filter: blur(8px); background: var(--glass); border: 1px solid var(--glass-border); border-radius: 16px; overflow: hidden; }
        .glass-card .card-header { background: transparent; color: #dbe7ff; border-bottom: 1px solid var(--glass-border); }
        .table-modern thead th { color: #aeb8d4; font-weight: 600; border-bottom-color: var(--glass-border); }
        .table-modern tbody tr { transition: background-color 0.2s ease; }
        .table-modern tbody tr:hover { background-color: rgba(255,255,255,0.04); }
        .badge-buy { background: rgba(22,219,101,0.15); color: var(--positive); border: 1px solid rgba(22,219,101,0.35); }
        .badge-sell { background: rgba(255,77,109,0.15); color: var(--negative); border: 1px solid rgba(255,77,109,0.35); }
        .row-buy { box-shadow: inset 3px 0 0 var(--positive); }
        .row-sell { box-shadow: inset 3px 0 0 var(--negative); }
        .toolbar { gap: 8px; }
        .toolbar .btn { border-radius: 12px; }
  /* Light variant overrides */
  .broker-light { --bg1: #f7f9fc; --bg2: #e9eff8; --accent: #3a86ff; --accent-2: #8338ec; --positive:#0a7f43; --negative:#d90429; --glass: rgba(255,255,255,0.85); --glass-border: rgba(0,0,0,0.08); }
  .broker-light .broker-hero { color: #0f172a; }
  .broker-light .glass-card .card-header { color: #0f172a; }
  .broker-light .table-modern thead th { color: #475569; }
  /* Volume bar */
  .vol-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 8px; overflow: hidden; }
  .broker-light .vol-bar { background: rgba(0,0,0,0.06); }
  .vol-bar-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); }
      `}</style>

      {/* Hero */}
      <div className="broker-hero">
        <div className="container">
          {error && (
            <div className="alert alert-warning mb-3" role="alert">{error}</div>
          )}
          <div className="d-flex flex-wrap align-items-end justify-content-between">
            <div>
              <h1 className="mb-1">Broker Console</h1>
              <div className="sub">Live flow monitor · distinct from main dashboard</div>
            </div>
            <div className="d-flex align-items-center">
              <span className={`pulse-dot ${autoRefresh ? '' : 'off'}`} />
              <div className="form-check form-switch m-0 ms-2">
                <input className="form-check-input" type="checkbox" id="autoRefresh" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
                <label className="form-check-label" htmlFor="autoRefresh">Auto refresh</label>
              </div>
              <button className="btn btn-sm btn-outline-light ms-2" onClick={refresh}><i className="fa fa-rotate" /> Refresh</button>
              <div className="btn-group ms-2" role="group" aria-label="Theme variant">
                <button className={`btn btn-sm ${themeVariant==='dark' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setThemeVariant('dark')}>Neon Dark</button>
                <button className={`btn btn-sm ${themeVariant==='light' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setThemeVariant('light')}>Light Pro</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI pills */}
      <div className="container kpi-track">
        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center kpi-pill">
              <div className="kpi-icon buy"><i className="fa fa-arrow-trend-up" /></div>
              <div>
                <div className="text-uppercase small">Buys</div>
                <div className="fw-bold fs-5">{fmtInt(kpi?.totalBuys)}</div>
                <div className="small text-secondary">Volume {fmtInt(kpi?.volumeBuy)}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center kpi-pill">
              <div className="kpi-icon sell"><i className="fa fa-arrow-trend-down" /></div>
              <div>
                <div className="text-uppercase small">Sells</div>
                <div className="fw-bold fs-5">{fmtInt(kpi?.totalSells)}</div>
                <div className="small text-secondary">Volume {fmtInt(kpi?.volumeSell)}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center kpi-pill">
              <div className="kpi-icon usd"><i className="fa fa-sack-dollar" /></div>
              <div>
                <div className="text-uppercase small">Notional Buy</div>
                <div className="fw-bold fs-6">{fmtUsd(kpi?.notionalBuy)}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center kpi-pill">
              <div className="kpi-icon usd"><i className="fa fa-money-bill-trend-up" /></div>
              <div>
                <div className="text-uppercase small">Notional Sell</div>
                <div className="fw-bold fs-6">{fmtUsd(kpi?.notionalSell)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container my-4">
        <div className="row g-4">
          {/* Top Companies */}
          <div className="col-12 col-lg-4">
            <div className="glass-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>Top Companies (by volume)</span>
                <span className="text-secondary small">{kpi?.topCompanies?.length ? `${kpi.topCompanies.length} shown` : ''}</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-modern mb-0 align-middle">
                    <thead>
                      <tr>
                        <th style={{width: 40}}>#</th>
                        <th>Symbol</th>
                        <th>Company</th>
                        <th className="text-end">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpi?.topCompanies?.length ? kpi.topCompanies.map((c, idx) => (
                        <tr key={c.companyId}>
                          <td className="text-muted">{idx + 1}</td>
                          <td className="fw-semibold">{c.symbol}</td>
                          <td>{c.company}</td>
                          <td>
                            <div className="vol-bar mt-1">
                              <div className="vol-bar-fill" style={{ width: `${Math.round((c.volume / maxTopVol) * 100)}%` }} />
                            </div>
                            <div className="small text-secondary text-end mt-1">{fmtInt(c.volume)}</div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="text-center p-3">{loading ? 'Loading...' : 'No data'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Trades */}
          <div className="col-12 col-lg-8">
            <div className="glass-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>Recent Trades</span>
                <div className="toolbar d-flex">
                  <button className="btn btn-sm btn-outline-light" onClick={refresh}><i className="fa fa-rotate" /> Refresh</button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-modern table-hover mb-0 align-middle">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Symbol</th>
                        <th>Company</th>
                        <th className="text-end">Qty</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Notional</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.length ? trades.map((t, idx) => (
                        <tr key={idx} className={t.type === 'BUY' ? 'row-buy' : 'row-sell'}>
                          <td className="text-nowrap">{new Date(t.timestamp).toLocaleString()}</td>
                          <td>{t.type === 'BUY' ? <span className="badge badge-buy">BUY</span> : <span className="badge badge-sell">SELL</span>}</td>
                          <td className="fw-semibold">{t.symbol}</td>
                          <td className="text-truncate" style={{maxWidth: 180}}>{t.company}</td>
                          <td className="text-end">{fmtInt(t.quantity)}</td>
                          <td className="text-end">{fmtUsd(t.price)}</td>
                          <td className="text-end">{fmtUsd(t.price * t.quantity)}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={7} className="text-center p-3">{loading ? 'Loading...' : 'No recent trades'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div className="text-muted small">Total: {fmtInt(total)}</div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-secondary" disabled={page === 0} onClick={() => setPage(p => Math.max(0, p-1))}>Prev</button>
                  <button className="btn btn-sm btn-outline-secondary" disabled={(page+1) >= pages} onClick={() => setPage(p => p+1)}>Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

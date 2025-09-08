import React, { useEffect, useMemo, useState } from "react";
import { listOfferings, buyShares } from "../../api/market";

export default function MarketBuy() {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listOfferings();
        setOfferings(data);
      } catch (e) {
        setError(String(e?.response?.data || e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return offerings;
    return offerings.filter(o =>
      o.company?.name?.toLowerCase().includes(q) ||
      o.company?.symbol?.toLowerCase().includes(q)
    );
  }, [offerings, search]);

  const onBuy = async () => {
    if (!selected) return;
    const id = selected.id;
    const q = Number(qty);
    if (!Number.isInteger(q) || q <= 0) { setToast({ type: "danger", msg: "Enter a valid quantity" }); return; }
    if (q > selected.remainingShares) { setToast({ type: "warning", msg: "Quantity exceeds remaining shares" }); return; }
    try {
      setBusy(true);
      await buyShares(id, q);
      setToast({ type: "success", msg: `Purchased ${q} shares of ${selected.company.symbol}` });
      // update remaining locally
      setOfferings(prev => prev.map(o => o.id === id ? { ...o, remainingShares: o.remainingShares - q } : o));
      setSelected(null);
    } catch (e) {
      setToast({ type: "danger", msg: String(e?.response?.data || e.message || e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Market Offerings</h2>
      <div className="d-flex gap-2 mb-3">
        <input className="form-control" placeholder="Search by symbol or company" value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      {toast && (
        <div className={`alert alert-${toast.type} alert-dismissible`} role="alert">
          {toast.msg}
          <button type="button" className="btn-close" onClick={() => setToast(null)}></button>
        </div>
      )}
      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="alert alert-secondary">No offerings found.</div>
      ) : (
        <div className="row g-3">
          {filtered.map(o => (
            <div className="col-md-4" key={o.id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{o.company.symbol}</h5>
                    <span className="badge bg-dark">${o.pricePerShare.toFixed(2)}</span>
                  </div>
                  <h6 className="text-muted">{o.company.name}</h6>
                  <p className="mb-2">Remaining: <strong>{o.remainingShares}</strong> / {o.totalShares}</p>
                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-primary w-100" onClick={() => { setSelected(o); setQty(1); }}>Buy</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Buy {selected.company.symbol}</h5>
                <button type="button" className="btn-close" onClick={() => setSelected(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Price per share: <strong>${selected.pricePerShare.toFixed(2)}</strong></p>
                <p>Remaining: <strong>{selected.remainingShares}</strong></p>
                <div className="input-group">
                  <span className="input-group-text">Qty</span>
                  <input type="number" className="form-control" min="1" max={selected.remainingShares} value={qty} onChange={e=>setQty(e.target.value)} />
                </div>
                <p className="mt-2">Total: <strong>${(Number(qty||0)*selected.pricePerShare).toFixed(2)}</strong></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" disabled={busy} onClick={onBuy}>{busy ? "Processing..." : "Confirm Buy"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

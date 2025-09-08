import React, { useEffect, useState } from "react";
import { adminMonitor, adminCreateCompany, adminCreateOffer } from "../../api/market";

export default function AdminMonitor() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ symbol: "", name: "", description: "" });
  const [offer, setOffer] = useState({ symbol: "", shares: 100, price: 10 });
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminMonitor();
      setData(res);
    } catch (e) {
      setError(String(e?.response?.data || e.message || e));
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const createCompany = async () => {
    if (!form.symbol || !form.name) return alert("Symbol and name required");
    try { setBusy(true); await adminCreateCompany(form); await load(); setForm({ symbol: "", name: "", description: "" }); }
    catch (e) { alert(String(e?.response?.data || e.message || e)); }
    finally { setBusy(false); }
  };
  const createOffer = async () => {
    if (!offer.symbol) return alert("Symbol required");
    try { setBusy(true); await adminCreateOffer(offer); await load(); setOffer({ symbol: "", shares: 100, price: 10 }); }
    catch (e) { alert(String(e?.response?.data || e.message || e)); }
    finally { setBusy(false); }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Admin Monitor</h2>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5>Create Company</h5>
              <div className="row g-2">
                <div className="col-md-3"><input className="form-control" placeholder="Symbol" value={form.symbol} onChange={e=>setForm({ ...form, symbol: e.target.value })} /></div>
                <div className="col-md-4"><input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} /></div>
                <div className="col-md-5"><input className="form-control" placeholder="Description" value={form.description} onChange={e=>setForm({ ...form, description: e.target.value })} /></div>
                <div className="col-12"><button className="btn btn-primary" disabled={busy} onClick={createCompany}>Create</button></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5>Create Offering</h5>
              <div className="row g-2">
                <div className="col-md-3"><input className="form-control" placeholder="Symbol" value={offer.symbol} onChange={e=>setOffer({ ...offer, symbol: e.target.value })} /></div>
                <div className="col-md-3"><input type="number" min="1" className="form-control" placeholder="Shares" value={offer.shares} onChange={e=>setOffer({ ...offer, shares: Number(e.target.value) })} /></div>
                <div className="col-md-3"><input type="number" step="0.01" min="0" className="form-control" placeholder="Price" value={offer.price} onChange={e=>setOffer({ ...offer, price: Number(e.target.value) })} /></div>
                <div className="col-md-3"><button className="btn btn-primary w-100" disabled={busy} onClick={createOffer}>Offer</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : data.length === 0 ? (
        <div className="alert alert-secondary">No companies yet. Create one above.</div>
      ) : (
        <div className="row g-3">
          {data.map((item, idx) => (
            <div className="col-md-6" key={idx}>
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{item.company.symbol} — {item.company.name}</h5>
                    <span className="badge bg-success">Revenue ${item.revenue?.toFixed(2)}</span>
                  </div>
                  <p className="text-muted mb-2">{item.company.description || "No description"}</p>
                  <div className="d-flex gap-3 mb-2">
                    <div><strong>Sold:</strong> {item.soldShares}</div>
                    <div><strong>Remaining:</strong> {item.remainingShares}</div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead><tr><th>#</th><th>Offering</th><th>Price</th><th>Remaining</th></tr></thead>
                      <tbody>
                        {item.offerings.map((o, i) => (
                          <tr key={o.id}><td>{i+1}</td><td>{o.totalShares}</td><td>${o.pricePerShare.toFixed(2)}</td><td>{o.remainingShares}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

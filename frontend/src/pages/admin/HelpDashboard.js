import React, { useEffect, useState } from "react";
import { adminHelpDashboard, updateHelpStatus } from "../../api/help";

const STATUS = ["PENDING", "WORKING", "SOLVED"];

export default function HelpDashboard() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const data = await adminHelpDashboard();
      setRows(data);
    } catch (e) {
      setError("Failed to load");
    }
  };

  useEffect(() => { load(); }, []);

  const change = async (id, status) => {
    try {
      await updateHelpStatus(id, status);
      await load();
    } catch (e) {
      setError("Failed to update status");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Help Requests (Admin)</h2>
      {error && <div className="alert alert-danger">{String(error)}</div>}
      {rows.map((row) => (
        <div key={row.company.id} className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>{row.company.name} ({row.company.symbol})</strong>
            <span className="text-muted">{row.requests.length} requests</span>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-sm align-middle">
              <thead><tr><th>ID</th><th>User</th><th>Type</th><th>Status</th><th>Created</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {row.requests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.userId}</td>
                    <td>{r.issueType}</td>
                    <td><span className={`badge ${r.status === 'SOLVED' ? 'bg-success' : r.status === 'WORKING' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{r.status}</span></td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                    <td style={{maxWidth: 400}}>{r.description}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        {STATUS.map(s => (
                          <button key={s} className={`btn ${s===r.status ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => change(r.id, s)}>{s}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {row.requests.length === 0 && <tr><td colSpan={7} className="text-muted">No requests</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {rows.length === 0 && <div className="text-muted">No companies or requests found.</div>}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { createHelpRequest, myHelpRequests } from "../api/help";
import { listCompanies } from "../api/market";

const ISSUE_TYPES = [
  { value: "ACCOUNT", label: "Account & Verification" },
  { value: "TRADE", label: "Trade / Order Issue" },
  { value: "WITHDRAWAL", label: "Deposit/Withdrawal" },
  { value: "OTHER", label: "Other" },
];

export default function HelpCenter() {
  const role = (localStorage.getItem("user_role") || "").toLowerCase();
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [issueType, setIssueType] = useState("ACCOUNT");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sampleMode, setSampleMode] = useState(false);

  const DEFAULT_COMPANIES = [
    { id: "sample-1", name: "Banijjo Securities", symbol: "BNJJ" },
    { id: "sample-2", name: "Global Investments", symbol: "GLBI" },
    { id: "sample-3", name: "Alpha Capital", symbol: "ALPH" },
    { id: "sample-4", name: "BlueSky Markets", symbol: "BLUS" },
  ];

  useEffect(() => {
    (async () => {
      try {
        const cs = await listCompanies();
        if (Array.isArray(cs) && cs.length > 0) {
          setCompanies(cs);
          setSampleMode(false);
          // Auto-select first company for convenience
          setCompanyId(String(cs[0].id));
        } else {
          setCompanies(DEFAULT_COMPANIES);
          setSampleMode(true);
          setCompanyId("");
        }
        const mine = await myHelpRequests();
        setRequests(mine);
      } catch (e) {
        // Fall back to sample companies if API fails
  setCompanies(DEFAULT_COMPANIES);
  setSampleMode(true);
  setCompanyId("");
        setError("Failed to load companies; showing sample list.");
      }
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (sampleMode) {
      setError("Companies are not configured yet. Please contact an admin to add companies.");
      return;
    }
    if (!companyId || !description.trim()) {
      setError("Please select a company and describe your issue.");
      return;
    }
    setSubmitting(true);
    try {
      await createHelpRequest({ companyId, issueType, description: description.trim() });
      setSuccess("Request sent successfully.");
      setDescription(""); setIssueType("ACCOUNT"); setCompanyId("");
      const mine = await myHelpRequests();
      setRequests(mine);
    } catch (e) {
      setError(e?.response?.data || "Failed to send request");
    } finally { setSubmitting(false); }
  };

  if (role === "admin") {
    return (
      <div className="container py-4">
        <h2 className="mb-3">Help Center</h2>
        <div className="alert alert-info">
          Admins cannot create help requests. Go to the admin dashboard to view and update requests.
        </div>
        <a href="/admin/help" className="btn btn-primary">Open Help Requests Dashboard</a>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Help Center</h2>
      <p className="text-muted">Submit a request to a company admin. You'll be notified here of status changes.</p>

      {error && <div className="alert alert-danger">{String(error)}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={onSubmit} className="card p-3 mb-4">
        {sampleMode && (
          <div className="alert alert-info">
            These are sample companies. You can browse the list, but cannot submit a help request until a company is configured by an admin.
          </div>
        )}
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Company</label>
            <select className="form-select" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Issue type</label>
            <select className="form-select" value={issueType} onChange={(e) => setIssueType(e.target.value)}>
              {ISSUE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label">Describe your issue</label>
            <textarea rows={4} className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Shortly describe your issue..." />
          </div>
        </div>
        <div className="mt-3">
          <button disabled={submitting || sampleMode} className="btn btn-primary" title={sampleMode ? 'Admin must add companies before you can submit' : ''}>
            {submitting ? 'Sending...' : 'Send request'}
          </button>
        </div>
      </form>

      <h5 className="mb-2">My requests</h5>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>ID</th><th>Company</th><th>Type</th><th>Status</th><th>Created</th><th>Description</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.company?.name || '-'}</td>
                <td>{r.issueType}</td>
                <td>
                  <span className={`badge ${r.status === 'SOLVED' ? 'bg-success' : r.status === 'WORKING' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{r.status}</span>
                </td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
                <td style={{maxWidth: 400}}>{r.description}</td>
              </tr>
            ))}
            {requests.length === 0 && <tr><td colSpan={6} className="text-muted">No requests yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

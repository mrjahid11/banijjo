import React, { useEffect, useState } from "react";
import { getProfile, changePassword as apiChangePassword } from "../api/auth";
import { listMyBlogs, photoUrl, documentUrl } from "../api/blog";

export default function Profile() {
  // In a real app, userId comes from auth; for now, mock with localStorage or default 1
  const [userId] = useState(() => Number(localStorage.getItem("userId")) || 1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdStatus, setPwdStatus] = useState("");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getProfile(userId);
        if (!cancelled && data) {
          setName(data.name || "");
          setEmail(data.email || "");
        }
      } catch (e) {
        if (!cancelled) setStatus("Failed to load profile");
      }
    }
    load();
    async function loadBlogs() {
      try {
        const data = await listMyBlogs();
        if (!cancelled) setBlogs(data);
      } catch {}
    }
    loadBlogs();
    return () => { cancelled = true; };
  }, [userId]);

  async function saveProfile(e) {
    e.preventDefault();
    setStatus("");
    try {
      // simple update via fetch to keep example short using client if needed
      const res = await fetch(`http://localhost:8080/profile?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
      if (!res.ok) throw new Error("Update failed");
      setStatus("Profile updated");
    } catch (e) {
      setStatus("Update failed");
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwdStatus("");
    try {
  await apiChangePassword(userId, currentPassword, newPassword);
      setPwdStatus("Password changed");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      setPwdStatus(e?.response?.data || "Change failed");
    }
  }

  return (
    <div className="container mt-4">
      <h3>My Profile</h3>
      <div className="mb-3">
        <a href="/portfolios" className="btn btn-outline-primary">Open Portfolio Manager</a>
      </div>
      {status && <div className="alert alert-info mt-2">{status}</div>}

      <form onSubmit={saveProfile} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">Save</button>
      </form>

      <h5>Change Password</h5>
      {pwdStatus && <div className="alert alert-info mt-2">{pwdStatus}</div>}
      <form onSubmit={changePassword}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input type="password" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button className="btn btn-secondary" type="submit">Change Password</button>
      </form>

      <hr className="my-4" />
      <div className="d-flex justify-content-between align-items-center">
        <h5>My Blogs</h5>
        <a className="btn btn-sm btn-outline-primary" href="/blog/create">Write a Blog</a>
      </div>
      {blogs.length === 0 ? (
        <div className="alert alert-info mt-2">You haven't posted any blogs yet.</div>
      ) : (
        <div className="row g-3 mt-2">
          {blogs.map(b => (
            <div className="col-md-6" key={b.id}>
              <div className="card h-100">
                {b.hasPhoto && (
                  <img src={photoUrl(b.id)} className="card-img-top" alt={b.title} style={{ objectFit: "cover", maxHeight: 180 }} />
                )}
                <div className="card-body">
                  <h6 className="card-title">{b.title}</h6>
                  <p className="card-text text-muted mb-1">{b.genre} • {new Date(b.createdAt).toLocaleString()}</p>
                  {b.hasDocument && (
                    <a className="btn btn-sm btn-outline-secondary" href={documentUrl(b.id)} target="_blank" rel="noreferrer">View Document</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

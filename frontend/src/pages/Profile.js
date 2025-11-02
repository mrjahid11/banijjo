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
  const [tab, setTab] = useState('profile');

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
    <div className="container my-4">
      <style>{`
        .profile-shell { display: grid; grid-template-columns: 300px 1fr; gap: 24px; }
        .profile-card { background: #0b0b0b; color: #e6eef8; border-radius: 12px; padding: 20px; }
        .avatar { width: 120px; height: 120px; border-radius: 999px; object-fit: cover; border: 3px solid rgba(255,255,255,0.06); }
        .stat { font-weight:700; font-size:1.05rem; }
        .pill { background: rgba(255,255,255,0.03); padding:6px 10px; border-radius:999px; }
        .tab-pane { padding: 8px 0; }
      `}</style>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="m-0">My Profile</h3>
        <div>
          <a href="/portfolios" className="btn btn-outline-primary me-2">Portfolio</a>
          <a href="/blog/create" className="btn btn-primary">Write Blog</a>
        </div>
      </div>

      <div className="profile-shell">
        <div className="profile-card">
          <div className="text-center mb-3">
            <img src={photoUrl(userId)} alt="avatar" className="avatar mb-2" onError={(e)=>{e.target.src='/favicon.ico'}} />
            <h5 className="mb-0">{name || 'User'}</h5>
            <div className="text-muted small">{email}</div>
          </div>

          <div className="d-flex justify-content-between mt-3">
            <div>
              <div className="text-muted small">Joined</div>
              <div className="stat">{/* placeholder */}2023</div>
            </div>
            <div>
              <div className="text-muted small">Blogs</div>
              <div className="stat">{blogs.length}</div>
            </div>
            <div>
              <div className="text-muted small">Role</div>
              <div className="pill">{localStorage.getItem('user_role') || 'Member'}</div>
            </div>
          </div>

          <div className="mt-4">
            <a className="btn btn-outline-light w-100 mb-2" href="/profile">Edit Profile</a>
            <a className="btn btn-outline-secondary w-100" href="/more/help">Help & Support</a>
          </div>
        </div>

        <div>
          <ul className="nav nav-pills mb-3">
            <li className="nav-item">
              <button className={`nav-link ${tab==='profile'?'active':''}`} onClick={()=>setTab('profile')}>Profile</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab==='security'?'active':''}`} onClick={()=>setTab('security')}>Security</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab==='blogs'?'active':''}`} onClick={()=>setTab('blogs')}>Blogs</button>
            </li>
          </ul>

          <div className="tab-content">
            {tab==='profile' && (
              <div className="tab-pane">
                {status && <div className="alert alert-info">{status}</div>}
                <form onSubmit={saveProfile} className="mb-3">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full name</label>
                      <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-primary">Save changes</button>
                  </div>
                </form>
              </div>
            )}

            {tab==='security' && (
              <div className="tab-pane">
                {pwdStatus && <div className="alert alert-info">{pwdStatus}</div>}
                <form onSubmit={changePassword} className="mb-3">
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-control" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div>
                    <button className="btn btn-secondary">Change Password</button>
                  </div>
                </form>
                <div className="mt-4">
                  <h6>Connected accounts</h6>
                  <p className="text-muted">No connected accounts yet. Connect Google, GitHub, or your broker for quick sign-in.</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-light">Connect Google</button>
                    <button className="btn btn-outline-light">Connect GitHub</button>
                  </div>
                </div>
              </div>
            )}

            {tab==='blogs' && (
              <div className="tab-pane">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0">My Blogs</h5>
                  <a className="btn btn-sm btn-primary" href="/blog/create">Write a Blog</a>
                </div>
                {blogs.length === 0 ? (
                  <div className="alert alert-info">You haven't posted any blogs yet.</div>
                ) : (
                  <div className="row g-3">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

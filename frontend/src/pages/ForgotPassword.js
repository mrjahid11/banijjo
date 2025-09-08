import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");

  async function submit(e) {
    e.preventDefault();
    setStatus("");
    try {
      await axios.post("http://localhost:8080/profile/reset-password", { email, newPassword });
      setStatus("Password reset. You can now sign in.");
      setEmail("");
      setNewPassword("");
    } catch (e) {
      setStatus("Reset failed");
    }
  }

  return (
    <div className="container mt-4">
      <h3>Reset Password</h3>
      {status && <div className="alert alert-info mt-2">{status}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">Reset</button>
      </form>
    </div>
  );
}

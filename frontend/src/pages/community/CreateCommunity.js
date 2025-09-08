import React, { useState } from "react";
import { createCommunity } from "../../api/community";

export default function CreateCommunity() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const ownerId = Number(localStorage.getItem("userId"));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }
    try {
      const res = await createCommunity(ownerId, name.trim(), description.trim());
      alert(`Community created: ${res.name}`);
      setName(""); setDescription("");
    } catch (e) {
      const msg = e?.response?.data || (e?.response?.status === 401 || e?.response?.status === 403 ?
        "Please sign in again to create a community." : "Failed to create");
      setError(msg);
    }
  };

  return (
    <div className="container py-4">
      <h2>Create a Community</h2>
  {error && <div className="alert alert-danger">{String(error)}</div>}
      <form onSubmit={onSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">Create</button>
      </form>
    </div>
  );
}

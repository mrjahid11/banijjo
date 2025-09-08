import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyCommunities } from "../../api/community";

export default function MyCommunities() {
  const [communities, setCommunities] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const ownerId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (!ownerId) return;
    fetchMyCommunities(ownerId).then(setCommunities).catch((e) => {
      const data = e?.response?.data;
      setError(typeof data === 'string' ? data : (data?.message || "Failed to load"));
    });
  }, [ownerId]);

  return (
    <div className="container py-4">
      <h2>My Communities</h2>
  {error && <div className="alert alert-danger">{String(error)}</div>}
      <ul className="list-group mt-3">
        {communities.map((c) => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold">{c.name}</div>
              <div className="text-muted small">{c.description}</div>
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => navigate(`/community/post/create?communityId=${c.id}`)}>
              Create Post
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

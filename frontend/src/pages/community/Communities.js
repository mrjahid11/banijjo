import React, { useEffect, useState } from "react";
import { fetchCommunities } from "../../api/community";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  useEffect(() => { fetchCommunities().then(setCommunities).catch(console.error); }, []);
  return (
    <div className="container py-4">
      <h2>All Communities</h2>
      <div className="mt-2">
        <a className="btn btn-sm btn-outline-primary" href="/community/mine">Create a post in one of my communities</a>
      </div>
      <ul className="list-group mt-3">
        {communities.map(c => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold">{c.name}</div>
              <div className="text-muted small">{c.description}</div>
            </div>
            <span className="badge bg-secondary">Owner: {c.owner?.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

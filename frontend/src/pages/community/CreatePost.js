import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchCommunities, createPost } from "../../api/community";

export default function CreatePost() {
  const [communities, setCommunities] = useState([]);
  const [communityId, setCommunityId] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const authorId = Number(localStorage.getItem("userId"));
  const { search } = useLocation();

  useEffect(() => { 
    fetchCommunities().then(setCommunities).catch(console.error);
    const params = new URLSearchParams(search);
    const pre = params.get("communityId");
    if (pre) setCommunityId(String(pre));
  }, [search]);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await createPost(authorId, Number(communityId), content);
      alert(`Post created in ${res.community?.name || "community"}`);
      setContent("");
    } catch (e) {
      const msg = e?.response?.status === 401 || e?.response?.status === 403 ?
        "Please sign in again to create a post." : (e?.response?.data || "Failed to create post");
      setError(msg);
    }
  };

  return (
    <div className="container py-4">
      <h2>Create Post</h2>
  {error && <div className="alert alert-danger">{String(error)}</div>}
      <form onSubmit={onSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Community</label>
          <select className="form-select" value={communityId} onChange={e=>setCommunityId(e.target.value)} required>
            <option value="" disabled>Select community</option>
            {communities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea className="form-control" value={content} onChange={e=>setContent(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit">Post</button>
      </form>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { listBlogs, photoUrl, documentUrl } from "../../api/blog";
import "./BlogList.css";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await listBlogs();
        if (!cancelled) setBlogs(data);
      } catch (e) {
        if (!cancelled) setError("Failed to load blogs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const genres = useMemo(() => {
    const g = new Set();
    blogs.forEach(b => b.genre && g.add(b.genre));
    return ["All", ...Array.from(g).sort((a,b)=>a.localeCompare(b))];
  }, [blogs]);

  const filtered = useMemo(() => {
    let items = blogs;
    if (activeGenre !== "All") items = items.filter(b => (b.genre || "").toLowerCase() === activeGenre.toLowerCase());
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(b => (b.title||"").toLowerCase().includes(q) || (b.content||"").toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "oldest":
        items = [...items].sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
        break;
      case "title":
        items = [...items].sort((a,b)=>(a.title||"").localeCompare(b.title||""));
        break;
      default:
        items = [...items].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    }
    return items;
  }, [blogs, activeGenre, query, sortBy]);

  const timeAgo = (iso) => {
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const sec = Math.max(1, Math.floor(diff/1000));
      const units = [
        [60, "s"],
        [60, "m"],
        [24, "h"],
        [7, "d"],
        [4.345, "w"],
        [12, "mo"],
      ];
      let val = sec, label = "s";
      for (const [step, l] of units) {
        if (val < step) { label = l; break; }
        val = Math.floor(val/step); label = l;
      }
      return `${val}${label} ago`;
    } catch { return ""; }
  };

  const onShare = async (b) => {
    try {
      const url = `${window.location.origin}/blog`;
      await navigator.clipboard.writeText(url);
      setCopiedId(b.id);
      setTimeout(()=>setCopiedId(null), 1500);
    } catch {}
  };

  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="blog-toolbar">
        <div className="left">
          <h3 className="mb-0">Blogs</h3>
          <div className="genre-pills">
            {genres.map(g => (
              <button key={g} className={`pill ${activeGenre===g?"active":""}`} onClick={()=>setActiveGenre(g)}>{g}</button>
            ))}
          </div>
        </div>
        <div className="right">
          <input className="form-control" placeholder="Search by title or content" value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="form-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title A→Z</option>
          </select>
          <a className="btn btn-primary vertical" href="/blog/create" aria-label="Write a Blog">
            <i className="fa fa-pen" aria-hidden="true"></i>
          </a>
        </div>
      </div>

      {loading ? (
        <div className="row g-3">
          {Array.from({length:6}).map((_,i)=> (
            <div className="col-md-6" key={i}>
              <div className="card skeleton h-100">
                <div className="skeleton-img shimmer" />
                <div className="card-body">
                  <div className="skeleton-line shimmer w-75" />
                  <div className="skeleton-line shimmer w-50 mt-2" />
                  <div className="skeleton-line shimmer w-100 mt-4" />
                  <div className="skeleton-line shimmer w-90 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="icon">📝</div>
              <h5>No blogs match your filters</h5>
              <p>Try clearing the search or switching the genre.</p>
              <a className="btn btn-outline-primary" href="/blog/create">Write your first blog</a>
            </div>
          )}
          <div className="row g-3">
            {filtered.map(b => (
              <div className="col-md-6" key={b.id}>
                <div className="card blog-card h-100">
                  {b.hasPhoto ? (
                    <div className="media-wrap">
                      <img src={photoUrl(b.id)} className="card-img-top" alt={b.title} />
                      {b.genre && <span className="badge genre-badge">{b.genre}</span>}
                    </div>
                  ) : (
                    <div className="media-placeholder">
                      <span className="badge genre-badge">{b.genre || "General"}</span>
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title mb-1">{b.title}</h5>
                    <div className="meta text-muted mb-2">
                      <span>{timeAgo(b.createdAt)}</span>
                      <span className="dot">•</span>
                      <span>{b.author?.name || b.author?.email || 'Unknown'}</span>
                    </div>
                    <p className="card-text preview-text">{b.content?.length > 250 ? b.content.slice(0, 250) + '…' : b.content}</p>
                  </div>
                  <div className="card-footer d-flex gap-2">
                    {b.hasDocument && (
                      <a className="btn btn-sm btn-outline-secondary" href={documentUrl(b.id)} target="_blank" rel="noreferrer">
                        <i className="fas fa-file-pdf me-1" /> Document
                      </a>
                    )}
                    <button className="btn btn-sm btn-outline-primary" onClick={()=>onShare(b)}>
                      <i className="fas fa-share-alt me-1" /> {copiedId===b.id?"Copied!":"Share"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

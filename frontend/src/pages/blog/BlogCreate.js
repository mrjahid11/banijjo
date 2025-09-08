import React, { useState } from "react";
import { createBlog } from "../../api/blog";

export default function BlogCreate() {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("");
    setError("");
    const max = 10 * 1024 * 1024; // 10MB
    if (photo && photo.size > max) return setError("Photo is larger than 10MB");
    if (document && document.size > max) return setError("Document is larger than 10MB");
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("genre", genre);
      fd.append("content", content);
      if (photo) fd.append("photo", photo);
      if (document) fd.append("document", document);
      await createBlog(fd);
      setStatus("Blog posted");
      setTitle(""); setGenre(""); setContent(""); setPhoto(null); setDocument(null);
    } catch (e) {
      const raw = e?.response?.data;
      const msg = (raw && typeof raw === 'object' && raw.message)
        ? raw.message
        : (typeof raw === 'string' ? raw : (e?.message || 'Failed to post blog'));
      setError(msg);
    }
  }

  const onPhotoChange = (e) => {
    setError("");
    const f = e.target.files?.[0] || null;
    if (!f) return setPhoto(null);
    const max = 10 * 1024 * 1024;
    if (f.size > max) { setError("Photo is larger than 10MB"); return; }
    setPhoto(f);
  };

  const onDocChange = (e) => {
    setError("");
    const f = e.target.files?.[0] || null;
    if (!f) return setDocument(null);
    const max = 10 * 1024 * 1024;
    if (f.size > max) { setError("Document is larger than 10MB"); return; }
    setDocument(f);
  };

  return (
    <div className="container mt-4">
      <h3>Write a Blog</h3>
  {status && <div className="alert alert-success">{String(status)}</div>}
  {error && <div className="alert alert-danger">{String(error)}</div>}
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Genre</label>
          <input className="form-control" value={genre} onChange={e => setGenre(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea className="form-control" rows={6} value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Photo (optional)</label>
          <input type="file" accept="image/*" className="form-control" onChange={onPhotoChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Document (PDF, optional)</label>
          <input type="file" accept="application/pdf" className="form-control" onChange={onDocChange} />
        </div>
        <button className="btn btn-primary" type="submit">Post</button>
        <a className="btn btn-link ms-2" href="/blog">Back to blogs</a>
      </form>
    </div>
  );
}

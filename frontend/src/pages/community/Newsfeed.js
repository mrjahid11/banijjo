import React, { useEffect, useState } from "react";
import { fetchNewsfeed, likePost, addComment, fetchPostComments } from "../../api/community";

export default function Newsfeed() {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [openComments, setOpenComments] = useState({}); // { [postId]: { loading, items } }
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    fetchNewsfeed().then(setPosts).catch(console.error);
  }, []);

  const onLike = async (postId) => {
    try {
      const res = await likePost(postId, userId);
      if (res?.status === 201) {
        setPosts(ps => ps.map(p => p.id === postId ? { ...p, likeCount: (p.likeCount || 0) + 1 } : p));
      }
    } catch (e) { console.error(e); }
  };
  const onComment = async (postId) => {
    if (!comment.trim()) return;
    try {
      await addComment(postId, userId, comment);
      setComment("");
      // Refresh comments if pane is open
      if (openComments[postId]) {
        const items = await fetchPostComments(postId);
        setOpenComments(st => ({ ...st, [postId]: { loading: false, items } }));
      }
    } catch (e) { console.error(e); }
  };

  const toggleReadComments = async (postId) => {
    const cur = openComments[postId];
    if (cur) {
      // collapse
      setOpenComments(st => { const n = { ...st }; delete n[postId]; return n; });
      return;
    }
    setOpenComments(st => ({ ...st, [postId]: { loading: true, items: [] } }));
    try {
      const items = await fetchPostComments(postId);
      setOpenComments(st => ({ ...st, [postId]: { loading: false, items } }));
    } catch (e) {
      setOpenComments(st => ({ ...st, [postId]: { loading: false, items: [] } }));
      console.error(e);
    }
  };

  return (
    <div className="container py-4">
      <h2>Newsfeed</h2>
      {posts.map(p => (
        <div key={p.id} className="card my-3">
          <div className="card-body">
            <div className="small text-muted">Community: {p.community?.name} • By: {p.author?.name}</div>
            <p className="mt-2 mb-3">{p.content}</p>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onLike(p.id)}>
              <i className="far fa-thumbs-up me-1" /> Like {typeof p.likeCount === 'number' ? `(${p.likeCount})` : ''}
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleReadComments(p.id)}>
              Read comments
            </button>
            <div className="input-group mt-2">
              <input className="form-control" placeholder="Write a comment" value={comment} onChange={e => setComment(e.target.value)} />
              <button className="btn btn-primary" onClick={() => onComment(p.id)}>Comment</button>
            </div>
            {openComments[p.id] && (
              <div className="mt-3">
                {openComments[p.id].loading ? (
                  <div className="text-muted">Loading comments...</div>
                ) : (
                  <ul className="list-group">
                    {openComments[p.id].items.length === 0 && (
                      <li className="list-group-item text-muted">No comments yet.</li>
                    )}
                    {openComments[p.id].items.map(c => (
                      <li key={c.id} className="list-group-item">
                        <div className="small text-muted">By: {c.author?.name}</div>
                        <div>{c.content}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

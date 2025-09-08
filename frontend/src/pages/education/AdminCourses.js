import React, { useEffect, useMemo, useState } from 'react';
import { adminCreateCourse, adminDeleteCourse, adminMyCourses, adminUpdateCourse } from '../../api/market';

export default function AdminCourses() {
  const [list, setList] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', syllabus: '', scheduleNotes: '', startAt: '', endAt: '' });
  const role = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;

  const load = async () => {
    try { setList(await adminMyCourses()); } catch {}
  };
  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    // Convert empty strings to null for dates
    if (!payload.startAt) delete payload.startAt; if (!payload.endAt) delete payload.endAt;
    try {
      setCreating(true);
      await adminCreateCourse(payload);
      setForm({ title: '', description: '', syllabus: '', scheduleNotes: '', startAt: '', endAt: '' });
      await load();
    } catch (err) { alert(err?.response?.data || err.message); } finally { setCreating(false); }
  };

  const onUpdate = async (id, patch) => {
    try { await adminUpdateCourse(id, patch); await load(); } catch (e) { alert(e?.response?.data || e.message); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await adminDeleteCourse(id); await load(); } catch (e) { alert(e?.response?.data || e.message); }
  };

  if (role !== 'admin') return <div className="container py-4">Forbidden</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-3">Course Management</h3>
  <form className="card p-3 mb-4" onSubmit={onCreate}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input className="form-control" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Start (ISO)</label>
            <input className="form-control" placeholder="2025-09-10T10:00:00Z" value={form.startAt} onChange={e=>setForm({...form, startAt:e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label">End (ISO)</label>
            <input className="form-control" placeholder="2025-09-10T12:00:00Z" value={form.endAt} onChange={e=>setForm({...form, endAt:e.target.value})} />
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          </div>
          <div className="col-12">
            <label className="form-label">Syllabus</label>
            <textarea className="form-control" rows={3} value={form.syllabus} onChange={e=>setForm({...form, syllabus:e.target.value})} />
          </div>
          <div className="col-12">
            <label className="form-label">Schedule Notes</label>
            <input className="form-control" value={form.scheduleNotes} onChange={e=>setForm({...form, scheduleNotes:e.target.value})} />
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" disabled={creating}>
            {creating && (<span className="spinner-border spinner-border-sm me-2" />)}
            Create Course
          </button>
        </div>
      </form>

      <div className="card p-3">
        <h5>My Courses</h5>
        <div className="table-responsive mt-2">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="fw-semibold d-flex align-items-center gap-2">
                      <span>{c.title}</span>
                      <span className={`badge text-bg-${(() => { const now=new Date(); const s=c.startAt?new Date(c.startAt):null; const e=c.endAt?new Date(c.endAt):null; return s&&now<s?'info':e&&now>e?'secondary':'success';})()}`}>
                        {(() => { const now=new Date(); const s=c.startAt?new Date(c.startAt):null; const e=c.endAt?new Date(c.endAt):null; return s&&now<s?'Upcoming':e&&now>e?'Completed':'Ongoing';})()}
                      </span>
                    </div>
                    <div className="text-muted small">{c.description}</div>
                  </td>
                  <td>
                    <div className="small">Start: {c.startAt ? new Date(c.startAt).toLocaleString() : '-'}</div>
                    <div className="small">End: {c.endAt ? new Date(c.endAt).toLocaleString() : '-'}</div>
                    <div className="small text-muted">{c.scheduleNotes}</div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-secondary" onClick={()=>onUpdate(c.id, { title: prompt('New title', c.title) ?? c.title })}>Rename</button>
                      <button className="btn btn-outline-danger" onClick={()=>onDelete(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!list.length && (
                <tr><td colSpan={3} className="text-center text-muted">No courses yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

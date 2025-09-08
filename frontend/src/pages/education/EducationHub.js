import React, { useEffect, useState } from 'react';
import { enrollCourse, getCourse, listCourses, adminCreateCourse, myEnrollments } from '../../api/market';
import { getToken } from '../../api/client';

export default function EducationHub() {
  const [courses, setCourses] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    syllabus: '',
    scheduleNotes: '',
    startAt: '', // datetime-local
    endAt: '' // datetime-local
  });
  const isAdmin = (localStorage.getItem('user_role') || '').toLowerCase() === 'admin';
  const hasToken = !!getToken();
  const canAdminCreate = isAdmin && hasToken;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all|upcoming|ongoing|completed
  const [toast, setToast] = useState(null); // {msg, variant}

  useEffect(() => { (async () => {
    setLoadingList(true);
    try {
      setCourses(await listCourses());
    } catch {}
    try {
      const mine = await myEnrollments();
      const ids = new Set((mine || []).map(e => e.course?.id).filter(Boolean));
      setEnrolledIds(ids);
    } catch {}
    setLoadingList(false);
  })(); }, []);

  const openDetails = async (id) => {
    setLoading(true);
    try { setActive(await getCourse(id)); } finally { setLoading(false); }
  };

  const onEnroll = async (id) => {
    // Optimistic: mark as enrolled immediately
    setEnrolledIds(prev => new Set(prev).add(id));
    try {
      await enrollCourse(id);
      setToast({ msg: 'Enrolled successfully', variant: 'success' });
    } catch (e) {
      // If already enrolled, keep it; otherwise rollback
      const status = e?.response?.status;
      const msg = e?.response?.data || e.message;
      if (!(status === 400 && String(msg).toLowerCase().includes('already'))) {
        setEnrolledIds(prev => { const n = new Set(prev); n.delete(id); return n; });
        setToast({ msg, variant: 'danger' });
      }
    }
  };

  const toISOOrNull = (s) => s ? new Date(s).toISOString() : null;

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { alert('Title is required'); return; }
    setCreating(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || '',
        syllabus: form.syllabus || '',
        scheduleNotes: form.scheduleNotes || '',
        startAt: toISOOrNull(form.startAt),
        endAt: toISOOrNull(form.endAt)
      };
      const created = await adminCreateCourse(payload);
      // Refresh list and focus details on the newly created course
      const updated = await listCourses();
      setCourses(updated);
      setActive(created);
      setForm({ title: '', description: '', syllabus: '', scheduleNotes: '', startAt: '', endAt: '' });
      setToast({ msg: 'Course created', variant: 'success' });
    } catch (e2) {
      const status = e2?.response?.status;
      const msg = e2?.response?.data || e2.message;
      if (status === 401 || status === 403) {
        setToast({ msg: 'Session expired or not authorized. Please sign in again.', variant: 'warning' });
        try { localStorage.removeItem('auth_token'); } catch {}
        window.location.href = '/signin';
      } else {
        setToast({ msg, variant: 'danger' });
      }
    } finally {
      setCreating(false);
    }
  };

  const statusOf = (c) => {
    const now = new Date();
    const s = c.startAt ? new Date(c.startAt) : null;
    const e = c.endAt ? new Date(c.endAt) : null;
    if (s && now < s) return 'Upcoming';
    if (e && now > e) return 'Completed';
    return 'Ongoing';
  };

  const matchesQuery = (c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (c.title || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.syllabus || '').toLowerCase().includes(q)
    );
  };

  const matchesFilter = (c) => {
    const s = statusOf(c).toLowerCase();
    return filter === 'all' || s === filter;
  };

  const filtered = courses.filter(c => matchesQuery(c) && matchesFilter(c));

  return (
    <div className="container py-4">
      <h3 className="mb-3">Education Hub</h3>
      <div className="row g-3">
        {isAdmin && (
          <div className="col-12">
            <div className="card p-3">
              <h5 className="mb-3">Create a Course (Admin)</h5>
              {!hasToken && (
                <div className="alert alert-warning py-2">
                  You appear to be admin but not signed in. Please sign in again to create courses.
                </div>
              )}
              <form onSubmit={onCreate} className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title<span className="text-danger">*</span></label>
                  <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Investing 101" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Schedule Notes</label>
                  <input className="form-control" value={form.scheduleNotes} onChange={e => setForm({ ...form, scheduleNotes: e.target.value })} placeholder="Weekly live sessions, Q&A Fridays" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Start At</label>
                  <input type="datetime-local" className="form-control" value={form.startAt} onChange={e => setForm({ ...form, startAt: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">End At</label>
                  <input type="datetime-local" className="form-control" value={form.endAt} onChange={e => setForm({ ...form, endAt: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Short Description</label>
                  <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What learners will get out of this course" />
                </div>
                <div className="col-12">
                  <label className="form-label">Syllabus / Outline</label>
                  <textarea className="form-control" rows={4} value={form.syllabus} onChange={e => setForm({ ...form, syllabus: e.target.value })} placeholder={"Week 1: Basics\nWeek 2: Risk & Diversification\n..."} />
                </div>
                <div className="col-12 d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary" disabled={creating || !canAdminCreate}>{creating ? 'Creating…' : 'Create Course'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="col-md-6">
          <div className="card p-3 h-100">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Available Courses</h5>
            </div>
            <div className="row g-2 mt-2">
              <div className="col-8">
                <input className="form-control" placeholder="Search by title, description, syllabus" value={query} onChange={e=>setQuery(e.target.value)} />
              </div>
              <div className="col-4 d-flex justify-content-end align-items-center gap-2">
                {['all','upcoming','ongoing','completed'].map(f => (
                  <button key={f} className={`btn btn-sm ${filter===f? 'btn-dark':'btn-outline-secondary'}`} onClick={()=>setFilter(f)}>{f[0].toUpperCase()+f.slice(1)}</button>
                ))}
              </div>
            </div>
            <div className="list-group mt-2">
              {loadingList && (
                <div className="list-group-item">
                  <div className="placeholder-glow">
                    <span className="placeholder col-6"></span>
                    <div className="mt-2"><span className="placeholder col-10"></span></div>
                  </div>
                </div>
              )}
              {!loadingList && filtered.map(c => (
                <div key={c.id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold d-flex align-items-center gap-2">
                      <span>{c.title}</span>
                      <span className={`badge text-bg-${statusOf(c)==='Upcoming'?'info':statusOf(c)==='Completed'?'secondary':'success'}`}>{statusOf(c)}</span>
                    </div>
                    <div className="text-muted small">{c.description}</div>
                    <div className="small text-muted">
                      <strong>Start:</strong> {c.startAt ? new Date(c.startAt).toLocaleString() : '-'}
                      <span className="mx-2">|</span>
                      <strong>End:</strong> {c.endAt ? new Date(c.endAt).toLocaleString() : '-'}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openDetails(c.id)}>Details</button>
                    {enrolledIds.has(c.id) ? (
                      <button className="btn btn-sm btn-secondary" disabled>Enrolled</button>
                    ) : (
                      <button className="btn btn-sm btn-success" onClick={() => onEnroll(c.id)}>Enroll</button>
                    )}
                  </div>
                </div>
              ))}
              {!loadingList && !filtered.length && <div className="text-muted p-2">No courses match your search</div>}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 h-100">
            <h5>Course Details</h5>
            {!active && <div className="text-muted">Select a course to view details</div>}
            {active && (
              <div className="mt-2">
                <h6 className="mb-1">{active.title}</h6>
                <div className="text-muted">{active.description}</div>
                <hr />
                <div>
                  <div className="small"><strong>Start:</strong> {active.startAt ? new Date(active.startAt).toLocaleString() : '-'}</div>
                  <div className="small"><strong>End:</strong> {active.endAt ? new Date(active.endAt).toLocaleString() : '-'}</div>
                  {active.scheduleNotes && <div className="small text-muted">{active.scheduleNotes}</div>}
                </div>
                {active.syllabus && (<>
                  <hr />
                  <div>
                    <div className="fw-semibold">Syllabus</div>
                    <pre className="small" style={{whiteSpace:'pre-wrap'}}>{active.syllabus}</pre>
                  </div>
                </>)}
                <div className="mt-3">
                  {enrolledIds.has(active.id) ? (
                    <button className="btn btn-secondary" disabled>Enrolled</button>
                  ) : (
                    <button className="btn btn-success" disabled={loading} onClick={() => onEnroll(active.id)}>Enroll</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {toast && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <div className={`toast show align-items-center text-bg-${toast.variant||'success'} border-0`} role="alert">
            <div className="d-flex">
              <div className="toast-body">{toast.msg}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={()=>setToast(null)}></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

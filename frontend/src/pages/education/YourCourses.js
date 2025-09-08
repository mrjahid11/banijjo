import React, { useEffect, useMemo, useState } from 'react';
import { myEnrollments, unenrollCourse } from '../../api/market';

export default function YourCourses() {
  const [enrolled, setEnrolled] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const list = await myEnrollments();
      setEnrolled(list);
      if (list.length) setActive(list[0]); else setActive(null);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const onUnenroll = async (courseId) => {
    if (!window.confirm('Unenroll from this course?')) return;
    try { await unenrollCourse(courseId); await load(); } catch (e) { alert(e?.response?.data || e.message); }
  };

  const statusOf = (c) => {
    if (!c) return '';
    const now = new Date();
    const s = c.startAt ? new Date(c.startAt) : null;
    const e = c.endAt ? new Date(c.endAt) : null;
    if (s && now < s) return 'Upcoming';
    if (e && now > e) return 'Completed';
    return 'Ongoing';
  };

  const countByStatus = useMemo(() => {
    const acc = { Upcoming: 0, Ongoing: 0, Completed: 0 };
    for (const it of enrolled) acc[statusOf(it.course)] = (acc[statusOf(it.course)] || 0) + 1;
    return acc;
  }, [enrolled]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Your Courses</h3>
        <div className="d-flex gap-2">
          <span className="badge text-bg-info">Upcoming {countByStatus.Upcoming || 0}</span>
          <span className="badge text-bg-success">Ongoing {countByStatus.Ongoing || 0}</span>
          <span className="badge text-bg-secondary">Completed {countByStatus.Completed || 0}</span>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-md-5">
          <div className="card p-3 h-100">
            <h6>Enrolled</h6>
            <div className="list-group mt-2">
              {loading && (
                <div className="list-group-item">
                  <div className="placeholder-glow">
                    <span className="placeholder col-7"></span>
                    <div className="mt-1"><span className="placeholder col-5"></span></div>
                  </div>
                </div>
              )}
              {!loading && enrolled.map(e => (
                <button type="button" key={e.id} className={`list-group-item list-group-item-action ${active?.id===e.id?'active':''}`} onClick={()=>setActive(e)}>
                  <div className="fw-semibold">{e.course?.title}</div>
                  <div className="small">Enrolled at: {new Date(e.enrolledAt).toLocaleString()}</div>
                </button>
              ))}
              {!loading && !enrolled.length && <div className="text-muted">No enrollments</div>}
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card p-3 h-100">
            <h6>Details</h6>
            {!active && <div className="text-muted">Select a course</div>}
            {active && (
              <div className="mt-2">
                <h5 className="mb-1">{active.course?.title}</h5>
                <div className="text-muted">{active.course?.description}</div>
                <hr />
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className={`badge text-bg-${statusOf(active.course)==='Upcoming'?'info':statusOf(active.course)==='Completed'?'secondary':'success'}`}>{statusOf(active.course)}</span>
                </div>
                <div className="small"><strong>Start:</strong> {active.course?.startAt ? new Date(active.course.startAt).toLocaleString() : '-'}</div>
                <div className="small"><strong>End:</strong> {active.course?.endAt ? new Date(active.course.endAt).toLocaleString() : '-'}</div>
                {active.course?.scheduleNotes && <div className="small text-muted">{active.course.scheduleNotes}</div>}
                {active.course?.syllabus && (<>
                  <hr />
                  <div className="fw-semibold">Syllabus</div>
                  <pre className="small" style={{whiteSpace:'pre-wrap'}}>{active.course.syllabus}</pre>
                </>)}
                <div className="mt-3 d-flex gap-2">
                  <a className="btn btn-outline-secondary" href="/education">Explore more courses</a>
                  <button className="btn btn-outline-danger" onClick={()=>onUnenroll(active.course.id)}>Unenroll</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

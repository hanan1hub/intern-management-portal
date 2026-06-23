import { useState, useEffect } from 'react';
import { getMyTasks, submitTask } from '../../api/internPortalApi';
import { formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

function deadlineTag(deadline, status) {
  if (!deadline) return null;
  const now   = new Date();
  const due   = new Date(deadline);
  const diffH = (due - now) / 3600000;
  if (status === 'completed') return { label: formatDate(deadline), color: '#6b7280', icon: 'bi-calendar-check' };
  if (diffH < 0)  return { label: `Overdue — ${formatDate(deadline)}`, color: '#dc2626', icon: 'bi-exclamation-circle-fill' };
  if (diffH < 24) return { label: `Due today — ${formatDate(deadline)}`, color: '#d97706', icon: 'bi-alarm-fill' };
  return { label: `Due ${formatDate(deadline)}`, color: '#2563eb', icon: 'bi-calendar-event' };
}

export default function InternTasks() {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');     // '' | 'pending' | 'completed'

  /* submit modal state */
  const [submitting,   setSubmitting]   = useState(null);   // task being submitted
  const [note,         setNote]         = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError,  setSubmitError]  = useState('');

  const load = () =>
    getMyTasks()
      .then(setTasks)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const filtered = filter ? tasks.filter((t) => t.status === filter) : tasks;
  const pending   = tasks.filter((t) => t.status === 'pending').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  const openSubmit = (task) => { setSubmitting(task); setNote(''); setSubmitError(''); };
  const closeSubmit = () => { setSubmitting(null); setNote(''); setSubmitError(''); };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setSubmitError('');
    try {
      await submitTask(submitting.id, { submission_note: note });
      closeSubmit();
      load();
    } catch {
      setSubmitError('Failed to submit task. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <Loader text="Loading tasks..." />;

  return (
    <>
      <div className="page-enter">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 className="page-title mb-0">My Tasks</h2>
            <p className="text-muted small mb-0">{pending} pending · {completed} completed</p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="d-flex gap-2 mb-4">
          {[['', 'All'], ['pending', 'Pending'], ['completed', 'Completed']].map(([val, lbl]) => (
            <button
              key={val}
              className={`btn btn-sm rounded-pill ${filter === val ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilter(val)}
            >
              {lbl}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox fs-2 d-block mb-2" />No tasks found.
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filtered.map((task) => {
              const dl      = deadlineTag(task.deadline, task.status);
              const isDone  = task.status === 'completed';
              return (
                <div key={task.id} className={`card border-0 shadow-sm ${isDone ? 'opacity-75' : ''}`}>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start gap-3">
                      <i className={`bi ${isDone ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} mt-1 fs-5`} />
                      <div className="flex-grow-1">
                        <div className={`fw-semibold ${isDone ? 'text-decoration-line-through text-muted' : ''}`}>
                          {task.title}
                        </div>
                        {task.description && (
                          <p className="text-muted small mb-2 mt-1">{task.description}</p>
                        )}
                        <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                          <span className={`badge ${isDone ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                            {task.status}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            <i className="bi bi-clock me-1" />Assigned {formatDate(task.created_at)}
                          </span>
                          {dl && (
                            <span style={{ fontSize: '0.75rem', color: dl.color, fontWeight: 600 }}>
                              <i className={`bi ${dl.icon} me-1`} />{dl.label}
                            </span>
                          )}
                        </div>

                        {/* Submission note (if completed) */}
                        {isDone && task.submission_note && (
                          <div className="mt-3 p-3 rounded-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                            <div className="small fw-semibold text-success mb-1">
                              <i className="bi bi-chat-left-text me-1" />Your submission note
                            </div>
                            <div className="small text-muted">{task.submission_note}</div>
                          </div>
                        )}
                        {isDone && task.submitted_at && (
                          <div className="mt-2 small text-muted">
                            <i className="bi bi-check-all me-1 text-success" />
                            Submitted {formatDate(task.submitted_at)}
                          </div>
                        )}
                      </div>

                      {!isDone && (
                        <button
                          className="btn btn-sm btn-success flex-shrink-0"
                          onClick={() => openSubmit(task)}
                        >
                          <i className="bi bi-check-lg me-1" />Submit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit task modal */}
      {submitting && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-check-circle me-2 text-success" />Submit Task
                </h5>
                <button className="btn-close" onClick={closeSubmit} disabled={submitLoading} />
              </div>
              <div className="modal-body">
                {submitError && (
                  <div className="alert alert-danger py-2 small">{submitError}</div>
                )}
                <p className="fw-semibold mb-3">{submitting.title}</p>
                <label className="form-label fw-medium">
                  Submission Note <span className="text-muted small">(optional)</span>
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Describe what you did, share a link, add any notes for your admin..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeSubmit} disabled={submitLoading}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleSubmit} disabled={submitLoading}>
                  {submitLoading
                    ? <><span className="spinner-border spinner-border-sm me-1" />Submitting...</>
                    : <><i className="bi bi-check-lg me-1" />Mark as Completed</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

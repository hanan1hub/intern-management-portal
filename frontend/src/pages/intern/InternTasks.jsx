import { useState, useEffect, useRef } from 'react';
import { getMyTasks, submitTask, fileUrl } from '../../api/internPortalApi';
import { formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

function deadlineTag(deadline, status) {
  if (!deadline) return null;
  const now   = new Date();
  const due   = new Date(deadline);
  const diffH = (due - now) / 3600000;
  if (status === 'completed') return { label: formatDate(deadline),                       color: '#6b7280', icon: 'bi-calendar-check'         };
  if (diffH < 0)              return { label: `Overdue — ${formatDate(deadline)}`,        color: '#dc2626', icon: 'bi-exclamation-circle-fill' };
  if (diffH < 24)             return { label: `Due today — ${formatDate(deadline)}`,      color: '#d97706', icon: 'bi-alarm-fill'              };
  return                             { label: `Due ${formatDate(deadline)}`,               color: '#2563eb', icon: 'bi-calendar-event'          };
}

function fileIcon(mime) {
  if (!mime) return 'bi-file-earmark';
  if (mime.startsWith('image/'))                                        return 'bi-file-earmark-image';
  if (mime === 'application/pdf')                                       return 'bi-file-earmark-pdf';
  if (mime.includes('word') || mime.includes('document'))              return 'bi-file-earmark-word';
  if (mime.includes('excel') || mime.includes('spreadsheet'))          return 'bi-file-earmark-excel';
  if (mime.includes('powerpoint') || mime.includes('presentation'))    return 'bi-file-earmark-ppt';
  if (mime.includes('zip') || mime.includes('compressed') || mime.includes('tar') || mime.includes('rar')) return 'bi-file-earmark-zip';
  if (mime.startsWith('text/'))                                         return 'bi-file-earmark-text';
  return 'bi-file-earmark';
}

function fileIconColor(mime) {
  if (!mime) return '#6b7280';
  if (mime.startsWith('image/'))          return '#8b5cf6';
  if (mime === 'application/pdf')         return '#dc2626';
  if (mime.includes('word'))              return '#2563eb';
  if (mime.includes('excel'))             return '#16a34a';
  if (mime.includes('powerpoint'))        return '#d97706';
  if (mime.includes('zip') || mime.includes('rar')) return '#d97706';
  if (mime.startsWith('text/'))           return '#0891b2';
  return '#6b7280';
}

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1048576)    return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function InternTasks() {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');

  const [submitting,    setSubmitting]    = useState(null);
  const [note,          setNote]          = useState('');
  const [file,          setFile]          = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError,   setSubmitError]   = useState('');
  const fileInputRef = useRef(null);

  const load = () => getMyTasks().then(setTasks).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered  = filter ? tasks.filter((t) => t.status === filter) : tasks;
  const pending   = tasks.filter((t) => t.status === 'pending').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  const openSubmit = (task) => {
    setSubmitting(task); setNote(''); setFile(null); setSubmitError('');
  };
  const closeSubmit = () => {
    setSubmitting(null); setNote(''); setFile(null); setSubmitError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f && f.size > 20 * 1024 * 1024) {
      setSubmitError('File is too large. Maximum size is 20 MB.');
      e.target.value = '';
      return;
    }
    setFile(f || null);
    setSubmitError('');
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setSubmitError('');
    try {
      await submitTask(submitting.id, { note, file });
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
              const dl     = deadlineTag(task.deadline, task.status);
              const isDone = task.status === 'completed';
              const fUrl   = fileUrl(task.submission_file_path);

              return (
                <div key={task.id} className={`card border-0 shadow-sm ${isDone ? 'opacity-80' : ''}`}>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start gap-3">
                      <i className={`bi ${isDone ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} mt-1 fs-5 flex-shrink-0`} />
                      <div className="flex-grow-1 min-w-0">
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

                        {/* Submission details */}
                        {isDone && (
                          <div className="mt-3">
                            {task.submission_note && (
                              <div className="p-3 rounded-3 mb-2" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <div className="small fw-semibold text-success mb-1">
                                  <i className="bi bi-chat-left-text me-1" />Your submission note
                                </div>
                                <div className="small text-muted">{task.submission_note}</div>
                              </div>
                            )}
                            {fUrl && (
                              <div className="p-2 rounded-3 d-flex align-items-center gap-2" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                                <i className={`bi ${fileIcon(task.submission_file_mime)} fs-5`} style={{ color: fileIconColor(task.submission_file_mime), flexShrink: 0 }} />
                                <div className="flex-grow-1 min-w-0">
                                  <div className="small fw-semibold text-truncate">{task.submission_file_original}</div>
                                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>{formatBytes(task.submission_file_size)}</div>
                                </div>
                                <a
                                  href={fUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  download={task.submission_file_original}
                                  className="btn btn-sm btn-outline-primary flex-shrink-0"
                                >
                                  <i className="bi bi-download" />
                                </a>
                              </div>
                            )}
                            {task.submitted_at && (
                              <div className="mt-2 small text-muted">
                                <i className="bi bi-check-all me-1 text-success" />
                                Submitted {formatDate(task.submitted_at)}
                              </div>
                            )}
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
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-triangle me-2" />{submitError}
                  </div>
                )}
                <p className="fw-semibold mb-3">{submitting.title}</p>

                {/* Submission note */}
                <div className="mb-3">
                  <label className="form-label fw-medium">
                    Submission Note <span className="text-muted small">(optional)</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Describe what you did, share a link, add any notes..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                {/* File upload */}
                <div className="mb-1">
                  <label className="form-label fw-medium">
                    Attach File <span className="text-muted small">(optional · max 20 MB)</span>
                  </label>
                  <div
                    className="rounded-3 p-3 text-center"
                    style={{ border: '2px dashed #cbd5e1', cursor: 'pointer', background: '#f8fafc' }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f) {
                        if (f.size > 20 * 1024 * 1024) { setSubmitError('File is too large. Maximum size is 20 MB.'); return; }
                        setFile(f); setSubmitError('');
                      }
                    }}
                  >
                    {file ? (
                      <div className="d-flex align-items-center gap-2 justify-content-center">
                        <i className={`bi ${fileIcon(file.type)} fs-4`} style={{ color: fileIconColor(file.type) }} />
                        <div className="text-start">
                          <div className="small fw-semibold text-truncate" style={{ maxWidth: 220 }}>{file.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>{formatBytes(file.size)}</div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-1"
                          onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        >
                          <i className="bi bi-x" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <i className="bi bi-cloud-upload fs-3 text-muted d-block mb-1" />
                        <div className="small text-muted">Click to browse or drag &amp; drop a file</div>
                        <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                          PDF, Word, Excel, images, ZIP and more
                        </div>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="d-none"
                    onChange={handleFileChange}
                  />
                </div>
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

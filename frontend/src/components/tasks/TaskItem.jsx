import { formatDate, statusBadgeClass } from '../../utils/helpers';
import { fileUrl } from '../../api/internPortalApi';

function deadlineInfo(deadline, status) {
  if (!deadline) return null;
  const now   = new Date();
  const due   = new Date(deadline);
  const diffH = (due - now) / 3600000;
  if (status === 'completed') return { label: `Due ${formatDate(deadline)}`,               color: '#6b7280', icon: 'bi-calendar-check'         };
  if (diffH < 0)              return { label: `Overdue — ${formatDate(deadline)}`,         color: '#dc2626', icon: 'bi-exclamation-circle-fill' };
  if (diffH < 24)             return { label: `Due today — ${formatDate(deadline)}`,       color: '#d97706', icon: 'bi-alarm-fill'              };
  return                             { label: `Due ${formatDate(deadline)}`,               color: '#2563eb', icon: 'bi-calendar-event'          };
}

function fileIcon(mime) {
  if (!mime) return 'bi-file-earmark';
  if (mime.startsWith('image/'))                                     return 'bi-file-earmark-image';
  if (mime === 'application/pdf')                                    return 'bi-file-earmark-pdf';
  if (mime.includes('word') || mime.includes('document'))           return 'bi-file-earmark-word';
  if (mime.includes('excel') || mime.includes('spreadsheet'))       return 'bi-file-earmark-excel';
  if (mime.includes('powerpoint') || mime.includes('presentation')) return 'bi-file-earmark-ppt';
  if (mime.includes('zip') || mime.includes('rar'))                 return 'bi-file-earmark-zip';
  if (mime.startsWith('text/'))                                      return 'bi-file-earmark-text';
  return 'bi-file-earmark';
}

function fileIconColor(mime) {
  if (!mime) return '#6b7280';
  if (mime.startsWith('image/'))    return '#8b5cf6';
  if (mime === 'application/pdf')   return '#dc2626';
  if (mime.includes('word'))        return '#2563eb';
  if (mime.includes('excel'))       return '#16a34a';
  if (mime.includes('powerpoint'))  return '#d97706';
  if (mime.includes('zip') || mime.includes('rar')) return '#d97706';
  if (mime.startsWith('text/'))     return '#0891b2';
  return '#6b7280';
}

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024)    return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function TaskItem({ task, onToggle, loading }) {
  const dl   = deadlineInfo(task.deadline, task.status);
  const fUrl = fileUrl(task.submission_file_path);

  return (
    <div className={`task-item card shadow-sm mb-2 border-0 ${task.status === 'completed' ? 'task-done' : ''}`}>
      <div className="card-body py-3 d-flex align-items-start gap-3">
        <div className="form-check mt-1">
          <input
            className="form-check-input task-checkbox"
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => onToggle(task.id, task.status)}
            disabled={loading}
            id={`task-${task.id}`}
          />
        </div>
        <div className="flex-grow-1 min-w-0">
          <label
            htmlFor={`task-${task.id}`}
            className={`fw-medium mb-0 task-title ${task.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}`}
          >
            {task.title}
          </label>
          {task.description && (
            <p className="text-muted small mb-1 mt-1">{task.description}</p>
          )}
          <div className="d-flex align-items-center flex-wrap gap-2 mt-1">
            <span className={`badge ${statusBadgeClass(task.status)}`}>{task.status}</span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-clock me-1" />{formatDate(task.created_at)}
            </span>
            {task.intern_name && (
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-person me-1" />{task.intern_name}
              </span>
            )}
            {dl && (
              <span style={{ fontSize: '0.75rem', color: dl.color, fontWeight: 600 }}>
                <i className={`bi ${dl.icon} me-1`} />{dl.label}
              </span>
            )}
          </div>

          {/* Submission note */}
          {task.submission_note && (
            <div className="mt-2 p-2 rounded-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div className="small fw-semibold text-success mb-1">
                <i className="bi bi-chat-left-text-fill me-1" />Intern&apos;s submission note
              </div>
              <div className="small text-muted">{task.submission_note}</div>
              {task.submitted_at && (
                <div className="small text-muted mt-1">
                  <i className="bi bi-calendar-check me-1" />Submitted {formatDate(task.submitted_at)}
                </div>
              )}
            </div>
          )}

          {/* Attached file */}
          {fUrl && (
            <div className="mt-2 p-2 rounded-3 d-flex align-items-center gap-2" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <i className={`bi ${fileIcon(task.submission_file_mime)} fs-5 flex-shrink-0`} style={{ color: fileIconColor(task.submission_file_mime) }} />
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
                title="Download file"
              >
                <i className="bi bi-download me-1" />Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

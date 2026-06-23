import { formatDate, statusBadgeClass } from '../../utils/helpers';

function deadlineInfo(deadline, status) {
  if (!deadline) return null;
  const now = new Date();
  const due = new Date(deadline);
  const diffMs = due - now;
  const diffH  = diffMs / (1000 * 60 * 60);

  if (status === 'completed') {
    return { label: `Due ${formatDate(deadline)}`, color: '#6b7280', icon: 'bi-calendar-check' };
  }
  if (diffMs < 0) {
    return { label: `Overdue — ${formatDate(deadline)}`, color: '#dc2626', icon: 'bi-exclamation-circle-fill' };
  }
  if (diffH < 24) {
    return { label: `Due today — ${formatDate(deadline)}`, color: '#d97706', icon: 'bi-alarm-fill' };
  }
  return { label: `Due ${formatDate(deadline)}`, color: '#2563eb', icon: 'bi-calendar-event' };
}

export default function TaskItem({ task, onToggle, loading }) {
  const dl = deadlineInfo(task.deadline, task.status);

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
        </div>
      </div>
    </div>
  );
}

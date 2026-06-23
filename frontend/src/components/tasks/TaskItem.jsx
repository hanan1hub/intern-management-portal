import { formatDate, statusBadgeClass } from '../../utils/helpers';

export default function TaskItem({ task, onToggle, loading }) {
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
          <div className="d-flex align-items-center gap-2 mt-1">
            <span className={`badge ${statusBadgeClass(task.status)}`}>{task.status}</span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-clock me-1" />{formatDate(task.created_at)}
            </span>
            {task.intern_name && (
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-person me-1" />{task.intern_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

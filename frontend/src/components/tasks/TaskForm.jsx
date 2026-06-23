import { useState } from 'react';
import { validateTaskForm } from '../../utils/validators';

const EMPTY = { intern_id: '', title: '', description: '', deadline: '' };

export default function TaskForm({ interns, defaultInternId, onSubmit, onClose, error }) {
  const [form, setForm]     = useState({ ...EMPTY, intern_id: defaultInternId || '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateTaskForm(form);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    setErrors({});
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        intern_id: parseInt(form.intern_id),
        deadline: form.deadline || null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-plus-square me-2" />Assign New Task
            </h5>
            <button className="btn-close" onClick={onClose} disabled={loading} />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2">
                  <i className="bi bi-exclamation-triangle me-2" />{error}
                </div>
              )}

              {!defaultInternId && (
                <div className="mb-3">
                  <label className="form-label fw-medium">Assign To <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${errors.intern_id ? 'is-invalid' : ''}`}
                    value={form.intern_id}
                    onChange={set('intern_id')}
                  >
                    <option value="">Select intern...</option>
                    {interns.map((i) => (
                      <option key={i.id} value={i.id}>{i.name} — {i.department}</option>
                    ))}
                  </select>
                  {errors.intern_id && <div className="invalid-feedback">{errors.intern_id}</div>}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label fw-medium">Task Title <span className="text-danger">*</span></label>
                <input
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  value={form.title}
                  onChange={set('title')}
                  placeholder="e.g. Complete onboarding documentation"
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Description <span className="text-muted small">(optional)</span></label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Add more details..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">
                  Deadline <span className="text-muted small">(optional)</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-calendar-event text-muted" />
                  </span>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={form.deadline}
                    onChange={set('deadline')}
                  />
                  {form.deadline && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setForm((p) => ({ ...p, deadline: '' }))}
                      title="Clear deadline"
                    >
                      <i className="bi bi-x" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                  : <><i className="bi bi-check-lg me-1" />Assign Task</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

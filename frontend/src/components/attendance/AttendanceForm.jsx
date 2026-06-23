import { useState } from 'react';
import { today } from '../../utils/helpers';
import { validateAttendanceForm } from '../../utils/validators';

export default function AttendanceForm({ interns, onSubmit, error }) {
  const [form, setForm]     = useState({ intern_id: '', date: today(), status: 'present', notes: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateAttendanceForm(form);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    setErrors({});
    setSuccess('');
    setLoading(true);
    try {
      await onSubmit({ ...form, intern_id: parseInt(form.intern_id) });
      setSuccess('Attendance marked successfully!');
      setForm((prev) => ({ ...prev, intern_id: '', notes: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-white fw-semibold">
        <i className="bi bi-calendar-plus me-2 text-primary" />Mark Attendance
      </div>
      <div className="card-body">
        {success && (
          <div className="alert alert-success py-2">
            <i className="bi bi-check-circle me-2" />{success}
          </div>
        )}
        {error && (
          <div className="alert alert-danger py-2">
            <i className="bi bi-exclamation-triangle me-2" />{error}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-medium">Intern <span className="text-danger">*</span></label>
              <select
                className={`form-select ${errors.intern_id ? 'is-invalid' : ''}`}
                value={form.intern_id}
                onChange={set('intern_id')}
              >
                <option value="">Select intern...</option>
                {interns.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
              {errors.intern_id && <div className="invalid-feedback">{errors.intern_id}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-medium">Date <span className="text-danger">*</span></label>
              <input
                type="date"
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                value={form.date}
                onChange={set('date')}
              />
              {errors.date && <div className="invalid-feedback">{errors.date}</div>}
            </div>

            <div className="col-md-2">
              <label className="form-label fw-medium">Status <span className="text-danger">*</span></label>
              <select
                className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                value={form.status}
                onChange={set('status')}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
              {errors.status && <div className="invalid-feedback">{errors.status}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-medium">Notes <span className="text-muted small">(optional)</span></label>
              <input
                className="form-control"
                value={form.notes}
                onChange={set('notes')}
                placeholder="Any notes..."
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                  : <><i className="bi bi-check-lg me-1" />Mark Attendance</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

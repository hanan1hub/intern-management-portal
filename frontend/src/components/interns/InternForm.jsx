import { useState } from 'react';
import { validateInternForm } from '../../utils/validators';

const DEPARTMENTS = [
  'Computer Science', 'Data Science', 'Electrical Engineering',
  'Artificial Intelligence', 'Software Engineering', 'Mechanical Engineering',
  'Civil Engineering', 'Physics', 'Mathematics', 'Chemistry',
  'Bioinformatics', 'Cyber Security', 'Other',
];

const EMPTY = { name: '', email: '', department: '', joining_date: '' };

export default function InternForm({ intern, onSubmit, onClose, error }) {
  const [form, setForm]     = useState(intern
    ? { name: intern.name, email: intern.email, department: intern.department,
        joining_date: intern.joining_date?.split('T')[0] || '' }
    : EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateInternForm(form);
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return; }
    setErrors({});
    setLoading(true);
    try {
      await onSubmit(form);
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
              <i className={`bi ${intern ? 'bi-pencil' : 'bi-person-plus'} me-2`} />
              {intern ? 'Edit Intern' : 'Add New Intern'}
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

              <div className="mb-3">
                <label className="form-label fw-medium">Full Name <span className="text-danger">*</span></label>
                <input
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={form.name}
                  onChange={set('name')}
                  placeholder="e.g. Ahmed Ali"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Email <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={form.email}
                  onChange={set('email')}
                  placeholder="e.g. ahmed@example.com"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Department <span className="text-danger">*</span></label>
                <select
                  className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                  value={form.department}
                  onChange={set('department')}
                >
                  <option value="">Select department...</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <div className="invalid-feedback">{errors.department}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Joining Date <span className="text-danger">*</span></label>
                <input
                  type="date"
                  className={`form-control ${errors.joining_date ? 'is-invalid' : ''}`}
                  value={form.joining_date}
                  onChange={set('joining_date')}
                />
                {errors.joining_date && <div className="invalid-feedback">{errors.joining_date}</div>}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                  : <><i className="bi bi-check-lg me-1" />{intern ? 'Update' : 'Add Intern'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

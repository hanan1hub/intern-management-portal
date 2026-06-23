import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword as resetPasswordApi } from '../api/authApi';
import { extractError } from '../utils/helpers';

export default function ResetPassword() {
  const [searchParams]  = useSearchParams();
  const token           = searchParams.get('token') || '';
  const navigate        = useNavigate();

  const [form,        setForm]        = useState({ new_password: '', confirm: '' });
  const [showPw,      setShowPw]      = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.new_password) { setError('Please enter a new password.'); return; }
    if (form.new_password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.new_password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (!token) { setError('Invalid reset link. Please request a new one.'); return; }

    setLoading(true); setError('');
    try {
      await resetPasswordApi({ token, new_password: form.new_password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="login-card card shadow-lg border-0" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-body p-4 p-sm-5">

          <div className="text-center mb-4">
            <div className="mb-3">
              <i className="bi bi-shield-lock-fill text-warning" style={{ fontSize: '2.5rem' }} />
            </div>
            <h4 className="fw-bold mb-1">Reset Password</h4>
            <p className="text-muted small mb-0">Intern Management Portal — Admin</p>
          </div>

          {!token && (
            <div className="alert alert-danger text-center small">
              <i className="bi bi-exclamation-triangle me-2" />
              Invalid or missing reset link. Please request a new one from the login page.
            </div>
          )}

          {success ? (
            <div className="text-center py-2">
              <div className="mb-3" style={{ fontSize: '3rem' }}>✅</div>
              <h6 className="fw-bold text-success mb-2">Password Updated!</h6>
              <p className="text-muted small">Redirecting you to the login page in a moment...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="alert alert-danger py-2 small mb-3">
                  <i className="bi bi-exclamation-triangle me-2" />{error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label fw-medium">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock-fill text-muted" />
                    </span>
                    <input
                      type={showPw ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Min. 6 characters"
                      value={form.new_password}
                      onChange={set('new_password')}
                      autoFocus
                      disabled={!token}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-light border-start-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowPw((p) => !p)}
                      tabIndex={-1}
                    >
                      <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'} text-muted`} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock-fill text-muted" />
                    </span>
                    <input
                      type={showPw ? 'text' : 'password'}
                      className={`form-control ${form.confirm && form.confirm !== form.new_password ? 'is-invalid' : ''}`}
                      placeholder="Repeat new password"
                      value={form.confirm}
                      onChange={set('confirm')}
                      disabled={!token}
                    />
                    {form.confirm && form.confirm !== form.new_password && (
                      <div className="invalid-feedback">Passwords do not match</div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-warning fw-semibold w-100 py-2"
                  disabled={loading || !token}
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2" />Updating...</>
                    : <><i className="bi bi-shield-check me-2" />Set New Password</>}
                </button>
              </form>
            </>
          )}

          <div className="text-center mt-3">
            <button
              className="btn btn-link btn-sm p-0 text-muted"
              style={{ fontSize: '0.8rem', textDecoration: 'none' }}
              onClick={() => navigate('/login')}
            >
              <i className="bi bi-arrow-left me-1" />Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

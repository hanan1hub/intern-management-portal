import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  login as adminLoginApi,
  internLogin as internLoginApi,
  forgotPassword as forgotPasswordApi,
} from '../api/authApi';
import { extractError } from '../utils/helpers';

function ForgotPasswordModal({ onClose }) {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true); setError('');
    try {
      await forgotPasswordApi({ email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-key-fill text-warning me-2" />Forgot Password
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body pt-2">
            {sent ? (
              <div className="text-center py-3">
                <div className="mb-3" style={{ fontSize: '3rem' }}>📧</div>
                <h6 className="fw-bold mb-2">Check your email</h6>
                <p className="text-muted small mb-0">
                  If that email is registered, a password reset link has been sent.
                  The link expires in <strong>1 hour</strong>.
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted small mb-3">
                  Enter the email address linked to your admin account and we'll send you a reset link.
                </p>
                {error && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-triangle me-2" />{error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Admin Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-envelope text-muted" />
                      </span>
                      <input
                        type="text"
                        inputMode="email"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        className="form-control"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        autoFocus
                      />
                    </div>
                    <div className="form-text">
                      Make sure you've set an email in your <strong>Profile</strong> page first.
                    </div>
                  </div>
                  <button type="submit" className="btn btn-warning fw-semibold w-100" disabled={loading}>
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                      : <><i className="bi bi-send me-2" />Send Reset Link</>}
                  </button>
                </form>
              </>
            )}
          </div>
          {sent && (
            <div className="modal-footer border-0 pt-0">
              <button className="btn btn-primary w-100" onClick={onClose}>
                <i className="bi bi-check me-1" />Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const [tab,            setTab]            = useState('admin');
  const [form,           setForm]           = useState({ identifier: '', password: '' });
  const [showPassword,   setShowPassword]   = useState(false);
  const [error,          setError]          = useState('');
  const [loading,        setLoading]        = useState(false);
  const [showForgot,     setShowForgot]     = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const switchTab = (t) => {
    if (t === tab) return;
    setTab(t);
    setForm({ identifier: '', password: '' });
    setError('');
    setShowPassword(false);
  };

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier.trim() || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (tab === 'admin') {
        const res = await adminLoginApi({ username: form.identifier.trim(), password: form.password });
        login(res.token, res.username, 'admin');
        navigate('/');
      } else {
        const res = await internLoginApi({ email: form.identifier.trim(), password: form.password });
        login(res.token, res.name, 'intern');
        navigate('/intern');
      }
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = tab === 'admin';

  return (
    <>
      <div className="login-bg min-vh-100 d-flex align-items-center justify-content-center p-3">
        <div className="login-card card shadow-lg border-0" style={{ width: '100%', maxWidth: 440 }}>
          <div className="card-body p-4 p-sm-5">

            {/* Header */}
            <div className="text-center mb-4">
              <div className="mb-3">
                <i className="bi bi-people-fill text-primary" style={{ fontSize: '2.5rem' }} />
              </div>
              <h4 className="fw-bold mb-1">Intern Management Portal</h4>
              <p className="text-muted small mb-0">Sign in to continue</p>
            </div>

            {/* Role tabs */}
            <div className="d-flex rounded-3 p-1 mb-4" style={{ background: '#f1f5f9' }}>
              {[['admin', 'bi-shield-lock', 'Admin'], ['intern', 'bi-person-badge', 'Intern']].map(([t, icon, label]) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => switchTab(t)}
                  className="btn flex-fill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    background: tab === t ? '#fff' : 'transparent',
                    color:      tab === t ? '#0f172a' : '#64748b',
                    boxShadow:  tab === t ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                    transition: 'all 0.18s',
                    border: 'none',
                  }}
                >
                  <i className={`bi ${icon}`} /> {label}
                </button>
              ))}
            </div>

            {error && (
              <div className="alert alert-danger py-2 small mb-3">
                <i className="bi bi-exclamation-triangle me-2" />{error}
              </div>
            )}

            {/* key={tab} forces a full DOM remount on tab switch,
                preventing browser autocomplete/autocorrect from carrying
                over stale values between Admin and Intern forms */}
            <form key={tab} onSubmit={handleSubmit} noValidate autoComplete="off">
              <div className="mb-3">
                <label className="form-label fw-medium">
                  {isAdmin ? 'Username' : 'Email Address'}
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className={`bi ${isAdmin ? 'bi-person' : 'bi-envelope'} text-muted`} />
                  </span>
                  <input
                    type="text"
                    inputMode={isAdmin ? 'text' : 'email'}
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoComplete={isAdmin ? 'username' : 'email'}
                    className="form-control"
                    placeholder={isAdmin ? 'Enter username' : 'Enter your email'}
                    value={form.identifier}
                    onChange={set('identifier')}
                  />
                </div>
              </div>

              <div className="mb-1">
                <label className="form-label fw-medium">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-lock text-muted" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set('password')}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light border-start-0"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`} />
                  </button>
                </div>
              </div>

              {/* Forgot password — admin tab only */}
              {isAdmin && (
                <div className="text-end mb-3 mt-1">
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-muted"
                    style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                    onClick={() => setShowForgot(true)}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              {!isAdmin && <div className="mb-3" />}

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                  : <><i className="bi bi-box-arrow-in-right me-2" />Sign in as {isAdmin ? 'Admin' : 'Intern'}</>}
              </button>
            </form>

            <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.78rem' }}>
              {isAdmin
                ? <>Default: <code>admin / admin123</code></>
                : <>Credentials are emailed to you when your account is created.</>}
            </p>
          </div>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as adminLoginApi, internLogin as internLoginApi } from '../api/authApi';
import { extractError } from '../utils/helpers';

export default function Login() {
  const [tab,     setTab]     = useState('admin'); // 'admin' | 'intern'
  const [form,    setForm]    = useState({ identifier: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const switchTab = (t) => { setTab(t); setForm({ identifier: '', password: '' }); setError(''); };

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
        const res = await adminLoginApi({ username: form.identifier, password: form.password });
        login(res.token, res.username, 'admin');
        navigate('/');
      } else {
        const res = await internLoginApi({ email: form.identifier, password: form.password });
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

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-medium">
                {isAdmin ? 'Username' : 'Email Address'}
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className={`bi ${isAdmin ? 'bi-person' : 'bi-envelope'} text-muted`} />
                </span>
                <input
                  type={isAdmin ? 'text' : 'email'}
                  className="form-control"
                  placeholder={isAdmin ? 'admin' : 'your@email.com'}
                  value={form.identifier}
                  onChange={set('identifier')}
                  autoFocus
                  autoComplete={isAdmin ? 'username' : 'email'}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-lock text-muted" />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                : <><i className="bi bi-box-arrow-in-right me-2" />
                    Sign in as {isAdmin ? 'Admin' : 'Intern'}</>}
            </button>
          </form>

          <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.78rem' }}>
            {isAdmin
              ? <>Default: <code>admin / admin123</code></>
              : <>Credentials are sent to your email when your account is created.</>}
          </p>
        </div>
      </div>
    </div>
  );
}

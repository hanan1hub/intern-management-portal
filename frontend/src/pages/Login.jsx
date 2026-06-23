import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/authApi';
import { extractError } from '../utils/helpers';

export default function Login() {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }           = useAuth();
  const navigate            = useNavigate();

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError('Please enter your username and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { token, username } = await loginApi(form);
      login(token, username);
      navigate('/');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg min-vh-100 d-flex align-items-center justify-content-center">
      <div className="login-card card shadow-lg border-0 p-2" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div className="login-icon mb-3">
              <i className="bi bi-people-fill text-primary" style={{ fontSize: '2.5rem' }} />
            </div>
            <h4 className="fw-bold">Intern Management Portal</h4>
            <p className="text-muted small">Sign in to your admin account</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small">
              <i className="bi bi-exclamation-triangle me-2" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label fw-medium">Username</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-person text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="admin"
                  value={form.username}
                  onChange={set('username')}
                  autoFocus
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
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-medium" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                : <><i className="bi bi-box-arrow-in-right me-2" />Sign In</>}
            </button>
          </form>

          <p className="text-center text-muted small mt-3 mb-0">
            Default credentials: <code>admin / admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}

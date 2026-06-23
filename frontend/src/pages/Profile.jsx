import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/authApi';
import { extractError, formatDate } from '../utils/helpers';

export default function Profile() {
  const { username, login: setAuth } = useAuth();

  const [profile, setProfile]   = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  /* ── Username form ── */
  const [uForm, setUForm]       = useState({ username: '' });
  const [uLoading, setULoading] = useState(false);
  const [uSuccess, setUSuccess] = useState('');
  const [uError, setUError]     = useState('');

  /* ── Password form ── */
  const [pForm, setPForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [pLoading, setPLoading] = useState(false);
  const [pSuccess, setPSuccess] = useState('');
  const [pError, setPError]     = useState('');

  useEffect(() => {
    getProfile()
      .then((data) => { setProfile(data); setUForm({ username: data.username }); })
      .catch((err) => setUError(extractError(err)))
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setUError(''); setUSuccess('');
    if (!uForm.username.trim()) { setUError('Username cannot be empty'); return; }
    if (uForm.username === profile.username) { setUError('No change detected'); return; }
    setULoading(true);
    try {
      const res = await updateProfile({ username: uForm.username });
      setProfile(res.admin);
      setAuth(res.token, res.admin.username);
      setUSuccess('Username updated successfully!');
    } catch (err) {
      setUError(extractError(err));
    } finally {
      setULoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPError(''); setPSuccess('');
    if (!pForm.current_password) { setPError('Current password is required'); return; }
    if (!pForm.new_password) { setPError('New password is required'); return; }
    if (pForm.new_password.length < 6) { setPError('New password must be at least 6 characters'); return; }
    if (pForm.new_password !== pForm.confirm) { setPError('Passwords do not match'); return; }
    setPLoading(true);
    try {
      const res = await updateProfile({
        current_password: pForm.current_password,
        new_password: pForm.new_password,
      });
      setAuth(res.token, res.admin.username);
      setPSuccess('Password changed successfully!');
      setPForm({ current_password: '', new_password: '', confirm: '' });
    } catch (err) {
      setPError(extractError(err));
    } finally {
      setPLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="page-title mb-0">Admin Profile</h2>
        <p className="text-muted small mb-0">Manage your account settings</p>
      </div>

      <div className="row g-4">
        {/* ── Profile card ── */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="profile-avatar mx-auto mb-3">
                {(profile?.username || username || 'A').charAt(0).toUpperCase()}
              </div>
              <h5 className="fw-bold mb-1">{profile?.username || username}</h5>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle mb-3">
                Administrator
              </span>
              {profile?.created_at && (
                <p className="text-muted small mb-0">
                  <i className="bi bi-calendar me-1" />
                  Member since {formatDate(profile.created_at)}
                </p>
              )}
              {loadingProfile && (
                <div className="spinner-border spinner-border-sm text-primary mt-2" />
              )}
            </div>
          </div>
        </div>

        {/* ── Forms ── */}
        <div className="col-lg-8">
          <div className="d-flex flex-column gap-4">

            {/* Update username */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pb-0">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-person-gear me-2 text-primary" />Update Username
                </h6>
              </div>
              <div className="card-body">
                {uSuccess && (
                  <div className="alert alert-success py-2 small">
                    <i className="bi bi-check-circle me-2" />{uSuccess}
                  </div>
                )}
                {uError && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-triangle me-2" />{uError}
                  </div>
                )}
                <form onSubmit={handleUsernameUpdate}>
                  <div className="row g-3 align-items-end">
                    <div className="col-md-8">
                      <label className="form-label fw-medium">New Username</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-person text-muted" />
                        </span>
                        <input
                          className="form-control"
                          value={uForm.username}
                          onChange={(e) => setUForm({ username: e.target.value })}
                          placeholder="Enter new username"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <button className="btn btn-primary w-100" type="submit" disabled={uLoading}>
                        {uLoading
                          ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                          : <><i className="bi bi-check-lg me-1" />Save</>}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Change password */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pb-0">
                <h6 className="fw-bold mb-0">
                  <i className="bi bi-shield-lock me-2 text-warning" />Change Password
                </h6>
              </div>
              <div className="card-body">
                {pSuccess && (
                  <div className="alert alert-success py-2 small">
                    <i className="bi bi-check-circle me-2" />{pSuccess}
                  </div>
                )}
                {pError && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-triangle me-2" />{pError}
                  </div>
                )}
                <form onSubmit={handlePasswordUpdate}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Current Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock text-muted" />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        value={pForm.current_password}
                        onChange={(e) => setPForm((p) => ({ ...p, current_password: e.target.value }))}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock-fill text-muted" />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        value={pForm.new_password}
                        onChange={(e) => setPForm((p) => ({ ...p, new_password: e.target.value }))}
                        placeholder="Min. 6 characters"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Confirm New Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock-fill text-muted" />
                      </span>
                      <input
                        type="password"
                        className={`form-control ${
                          pForm.confirm && pForm.confirm !== pForm.new_password ? 'is-invalid' : ''
                        }`}
                        value={pForm.confirm}
                        onChange={(e) => setPForm((p) => ({ ...p, confirm: e.target.value }))}
                        placeholder="Repeat new password"
                      />
                      {pForm.confirm && pForm.confirm !== pForm.new_password && (
                        <div className="invalid-feedback">Passwords do not match</div>
                      )}
                    </div>
                  </div>
                  <button className="btn btn-warning fw-medium" type="submit" disabled={pLoading}>
                    {pLoading
                      ? <><span className="spinner-border spinner-border-sm me-1" />Changing...</>
                      : <><i className="bi bi-shield-check me-1" />Change Password</>}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getMe } from '../../api/internPortalApi';
import { formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

export default function InternProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then(setProfile).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading profile..." />;
  if (!profile) return null;

  const initials = profile.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const fields = [
    { icon: 'bi-person-fill',    label: 'Full Name',     value: profile.name       },
    { icon: 'bi-envelope-fill',  label: 'Email',         value: profile.email      },
    { icon: 'bi-building',       label: 'Department',    value: profile.department },
    { icon: 'bi-calendar-fill',  label: 'Joining Date',  value: formatDate(profile.joining_date) },
    { icon: 'bi-clock-history',  label: 'Account Created', value: formatDate(profile.created_at)  },
  ];

  return (
    <div className="page-enter">
      <div className="mb-4">
        <h2 className="page-title mb-0">My Profile</h2>
        <p className="text-muted small mb-0">Your intern account details</p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-lg-6">

          {/* Avatar + name card */}
          <div className="card border-0 text-center p-4 mb-4">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white"
              style={{
                width: 96, height: 96, borderRadius: '50%', fontSize: '2rem',
                background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
              }}
            >
              {initials}
            </div>
            <h5 className="fw-bold mb-1">{profile.name}</h5>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
              <i className="bi bi-person-badge me-1" />{profile.department} Intern
            </span>
          </div>

          {/* Details */}
          <div className="card border-0">
            <div className="card-header bg-white border-0">
              <span className="fw-semibold">
                <i className="bi bi-info-circle me-2 text-primary" />Account Information
              </span>
            </div>
            <div className="card-body p-0">
              {fields.map(({ icon, label, value }) => (
                <div key={label} className="d-flex align-items-center gap-3 px-4 py-3 border-bottom">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                    style={{ width: 36, height: 36, background: '#eff6ff' }}
                  >
                    <i className={`bi ${icon} text-primary`} />
                  </div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    <div className="fw-medium small">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-muted text-center small mt-3">
            <i className="bi bi-info-circle me-1" />
            To update your profile details, contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

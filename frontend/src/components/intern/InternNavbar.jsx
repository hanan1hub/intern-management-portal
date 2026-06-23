import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/intern',            label: 'Dashboard',  icon: 'bi-speedometer2',    end: true },
  { to: '/intern/tasks',      label: 'My Tasks',   icon: 'bi-check2-square'              },
  { to: '/intern/attendance', label: 'Attendance', icon: 'bi-calendar-check'             },
  { to: '/intern/profile',    label: 'My Profile', icon: 'bi-person-circle'              },
];

export default function InternNavbar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const activeCls = ({ isActive }) =>
    `nav-link px-3 py-2 rounded-2 d-flex align-items-center gap-2${isActive ? ' active' : ''}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ background: 'var(--nav-bg)' }}>
      <div className="container-fluid px-4">

        <NavLink to="/intern" className="navbar-brand d-flex align-items-center gap-2 fw-bold me-4">
          <div className="brand-icon d-flex align-items-center justify-content-center rounded-2">
            <i className="bi bi-person-badge-fill" />
          </div>
          InternPortal
        </NavLink>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`navbar-collapse${open ? ' show' : ' collapse'}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
            {NAV_LINKS.map(({ to, label, icon, end }) => (
              <li className="nav-item" key={to}>
                <NavLink to={to} end={end} className={activeCls} onClick={() => setOpen(false)}>
                  <i className={`bi ${icon}`} />{label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2 mb-2 mb-lg-0">
            <div
              className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <div className="nav-avatar">{(username || 'I').charAt(0).toUpperCase()}</div>
              <span className="small fw-medium text-white">{username}</span>
              <span className="badge rounded-pill ms-1" style={{ background: '#0dcaf0', fontSize: '0.65rem' }}>
                Intern
              </span>
            </div>
            <button
              className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right" />
              <span className="d-none d-lg-inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

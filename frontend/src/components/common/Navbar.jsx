import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/',           label: 'Dashboard',  icon: 'bi-speedometer2',     end: true },
  { to: '/interns',    label: 'Interns',    icon: 'bi-person-lines-fill' },
  { to: '/tasks',      label: 'Tasks',      icon: 'bi-check2-square'     },
  { to: '/attendance', label: 'Attendance', icon: 'bi-calendar-check'    },
];

export default function Navbar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen]         = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const activeCls = ({ isActive }) =>
    `nav-link px-3 py-2 rounded-2 d-flex align-items-center gap-2${isActive ? ' active' : ''}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ background: 'var(--nav-bg)' }}>
      <div className="container-fluid px-4">

        {/* Brand */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold me-4">
          <div className="brand-icon d-flex align-items-center justify-content-center rounded-2">
            <i className="bi bi-people-fill" />
          </div>
          InternPortal
        </NavLink>

        {/* Hamburger — React-controlled, no Bootstrap JS needed */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Collapsible content */}
        <div className={`navbar-collapse${open ? ' show' : ' collapse'}`} id="navbarMain">
          {/* Nav links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
            {NAV_LINKS.map(({ to, label, icon, end }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={activeCls}
                  onClick={() => setOpen(false)}
                >
                  <i className={`bi ${icon}`} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right side — profile dropdown */}
          <div className="d-flex align-items-center gap-2 mb-2 mb-lg-0">
            <div className="position-relative">
              <button
                className="btn btn-sm d-flex align-items-center gap-2 text-white border border-white border-opacity-25 rounded-pill px-3 py-1"
                style={{ background: 'rgba(255,255,255,0.12)' }}
                onClick={() => setProfileOpen((v) => !v)}
              >
                <div className="nav-avatar">{(username || 'A').charAt(0).toUpperCase()}</div>
                <span className="small fw-medium">{username}</span>
                <i className={`bi bi-chevron-${profileOpen ? 'up' : 'down'} small`} />
              </button>

              {profileOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ zIndex: 1040 }}
                    onClick={() => setProfileOpen(false)}
                  />
                  {/* Dropdown */}
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg py-1"
                    style={{ minWidth: 200, zIndex: 1050 }}
                  >
                    <div className="px-3 py-2 border-bottom">
                      <div className="fw-semibold text-dark small">{username}</div>
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>Administrator</div>
                    </div>
                    <NavLink
                      to="/profile"
                      className="dropdown-item d-flex align-items-center gap-2 py-2 px-3"
                      onClick={() => { setProfileOpen(false); setOpen(false); }}
                    >
                      <i className="bi bi-person-gear text-primary" />
                      <span className="small">Manage Profile</span>
                    </NavLink>
                    <div className="dropdown-divider my-1" />
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right" />
                      <span className="small">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

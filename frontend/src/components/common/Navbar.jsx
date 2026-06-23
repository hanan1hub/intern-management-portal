import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? ' active fw-semibold' : ''}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid px-4">
        <span className="navbar-brand fw-bold">
          <i className="bi bi-people-fill me-2" />
          InternPortal
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className={linkClass} end>
                <i className="bi bi-speedometer2 me-1" />Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/interns" className={linkClass}>
                <i className="bi bi-person-lines-fill me-1" />Interns
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tasks" className={linkClass}>
                <i className="bi bi-check2-square me-1" />Tasks
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/attendance" className={linkClass}>
                <i className="bi bi-calendar-check me-1" />Attendance
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <span className="text-white-50 small">
              <i className="bi bi-person-circle me-1" />{username}
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1" />Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

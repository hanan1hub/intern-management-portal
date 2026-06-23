import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMe, getMyTasks, getMyAttendance } from '../../api/internPortalApi';
import { formatDate } from '../../utils/helpers';
import { useCountUp } from '../../hooks/useCountUp';
import Loader from '../../components/common/Loader';

function MiniStat({ label, value, icon, color }) {
  const display = useCountUp(value ?? 0);
  return (
    <div className="col-6 col-lg-3">
      <div className="card border-0 stats-card h-100">
        <div className="card-body d-flex align-items-center gap-3 p-4">
          <div className={`stats-icon rounded-3 ${color}`}>
            <i className={`bi ${icon} fs-4 text-white`} />
          </div>
          <div>
            <div className="stats-value">{display}</div>
            <div className="text-muted small mt-1">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InternDashboard() {
  const { username } = useAuth();
  const [profile,    setProfile]    = useState(null);
  const [tasks,      setTasks]      = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([getMe(), getMyTasks(), getMyAttendance()])
      .then(([p, t, a]) => { setProfile(p); setTasks(t); setAttendance(a); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading your dashboard..." />;

  const total     = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending   = total - completed;
  const present   = attendance.filter((a) => a.status === 'present').length;

  const recent = tasks.slice(0, 5);

  return (
    <div className="page-enter">
      {/* Welcome banner */}
      <div className="card border-0 mb-4 overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a5f,#0d6efd)' }}>
        <div className="card-body p-4 d-flex align-items-center gap-4">
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {(username || 'I').charAt(0).toUpperCase()}
          </div>
          <div className="text-white">
            <h4 className="fw-bold mb-1">Welcome back, {username}!</h4>
            {profile && (
              <p className="mb-0 opacity-75 small">
                <i className="bi bi-building me-1" />{profile.department}
                <span className="mx-2">·</span>
                <i className="bi bi-calendar me-1" />Joined {formatDate(profile.joining_date)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <MiniStat label="Total Tasks"     value={total}     icon="bi-list-task"          color="bg-primary" />
        <MiniStat label="Completed"       value={completed} icon="bi-check-circle-fill"  color="bg-success" />
        <MiniStat label="Pending"         value={pending}   icon="bi-hourglass-split"    color="bg-warning" />
        <MiniStat label="Days Present"    value={present}   icon="bi-calendar-check"     color="bg-info"    />
      </div>

      {/* Recent tasks */}
      <div className="card border-0">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <span className="fw-semibold">
            <i className="bi bi-list-task me-2 text-primary" />Recent Tasks
          </span>
          <Link to="/intern/tasks" className="btn btn-sm btn-outline-primary">View All</Link>
        </div>
        <div className="card-body p-0">
          {recent.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-3 d-block mb-2" />No tasks assigned yet.
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {recent.map((task) => {
                const overdue = task.deadline && task.status !== 'completed' && new Date(task.deadline) < new Date();
                return (
                  <li key={task.id} className="list-group-item d-flex align-items-start gap-3 py-3 px-4">
                    <i className={`bi ${task.status === 'completed' ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} mt-1`} />
                    <div className="flex-grow-1 min-w-0">
                      <div className={`fw-medium small ${task.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}`}>
                        {task.title}
                      </div>
                      <div className="d-flex gap-2 mt-1 flex-wrap">
                        <span className={`badge ${task.status === 'completed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                          {task.status}
                        </span>
                        {task.deadline && (
                          <span className="small" style={{ color: overdue ? '#dc2626' : '#64748b' }}>
                            <i className="bi bi-calendar-event me-1" />{formatDate(task.deadline)}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

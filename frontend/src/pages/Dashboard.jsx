import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/dashboard/StatsCard';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import { getStats } from '../api/dashboardApi';
import { extractError } from '../utils/helpers';

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title mb-0">Dashboard</h2>
          <p className="text-muted small mb-0">Overview of your intern management system</p>
        </div>
      </div>

      {loading && <Loader text="Loading dashboard..." />}
      {error   && <ErrorAlert message={error} />}

      {stats && (
        <>
          <div className="row g-4 mb-5">
            <StatsCard
              title="Total Interns"
              value={stats.totalInterns}
              icon="bi-people-fill"
              colorClass="bg-primary"
            />
            <StatsCard
              title="Total Tasks"
              value={stats.totalTasks}
              icon="bi-list-task"
              colorClass="bg-info"
            />
            <StatsCard
              title="Completed Tasks"
              value={stats.completedTasks}
              icon="bi-check-circle-fill"
              colorClass="bg-success"
            />
            <StatsCard
              title="Pending Tasks"
              value={stats.pendingTasks}
              icon="bi-hourglass-split"
              colorClass="bg-warning"
            />
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white fw-semibold border-0 pb-0">
                  <i className="bi bi-bar-chart me-2 text-primary" />Interns by Department
                </div>
                <div className="card-body">
                  {stats.internsByDepartment.length === 0 ? (
                    <p className="text-muted text-center py-3">No data yet</p>
                  ) : (
                    stats.internsByDepartment.map((row) => {
                      const pct = stats.totalInterns > 0
                        ? Math.round((row.count / stats.totalInterns) * 100)
                        : 0;
                      return (
                        <div key={row.department} className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="small fw-medium">{row.department}</span>
                            <span className="small text-muted">{row.count} intern{row.count !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="progress" style={{ height: 8 }}>
                            <div
                              className="progress-bar bg-primary"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white fw-semibold border-0 pb-0">
                  <i className="bi bi-calendar-check me-2 text-primary" />Today's Attendance
                </div>
                <div className="card-body">
                  {stats.todayAttendance.length === 0 ? (
                    <p className="text-muted text-center py-3">
                      No attendance marked today.{' '}
                      <Link to="/attendance" className="text-primary">Mark now →</Link>
                    </p>
                  ) : (
                    <div className="d-flex gap-3 flex-wrap">
                      {stats.todayAttendance.map((row) => (
                        <div key={row.status} className="text-center p-3 rounded-3 bg-light flex-fill">
                          <div className="fs-3 fw-bold">{row.count}</div>
                          <div className="text-capitalize text-muted small">{row.status}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body d-flex gap-3 flex-wrap">
                  <Link to="/interns" className="btn btn-outline-primary">
                    <i className="bi bi-person-plus me-2" />Add New Intern
                  </Link>
                  <Link to="/tasks" className="btn btn-outline-success">
                    <i className="bi bi-plus-square me-2" />Assign Task
                  </Link>
                  <Link to="/attendance" className="btn btn-outline-info">
                    <i className="bi bi-calendar-check me-2" />Mark Attendance
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

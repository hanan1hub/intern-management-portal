import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/dashboard/StatsCard';
import QuickActions from '../components/common/QuickActions';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import TaskForm from '../components/tasks/TaskForm';
import InternForm from '../components/interns/InternForm';
import { getStats } from '../api/dashboardApi';
import { getAll as getAllInterns } from '../api/internsApi';
import { create as createIntern } from '../api/internsApi';
import { create as createTask } from '../api/tasksApi';
import { extractError } from '../utils/helpers';

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const [showInternForm, setShowInternForm] = useState(false);
  const [showTaskForm,   setShowTaskForm]   = useState(false);
  const [formError,      setFormError]      = useState('');

  const load = () => {
    Promise.all([getStats(), getAllInterns()])
      .then(([s, i]) => { setStats(s); setInterns(i); })
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAddIntern = async (data) => {
    setFormError('');
    try {
      await createIntern(data);
      setShowInternForm(false);
      load();
    } catch (err) { setFormError(extractError(err)); }
  };

  const handleAddTask = async (data) => {
    setFormError('');
    try {
      await createTask(data);
      setShowTaskForm(false);
      load();
    } catch (err) { setFormError(extractError(err)); }
  };

  return (
    <div className="page-enter">
      {/* Left-side quick actions panel */}
      <QuickActions
        onAddIntern={() => { setFormError(''); setShowInternForm(true); }}
        onAssignTask={() => { setFormError(''); setShowTaskForm(true); }}
      />

      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="page-title mb-0">Dashboard</h2>
          <p className="text-muted small mb-0">Overview of your intern management system</p>
        </div>
      </div>

      {loading && <Loader text="Loading dashboard..." />}
      {error   && <ErrorAlert message={error} />}

      {stats && (
        <>
          {/* Stats row */}
          <div className="row g-4 mb-4">
            <StatsCard title="Total Interns"   value={stats.totalInterns}   icon="bi-people-fill"       colorClass="bg-primary" delay={0}   />
            <StatsCard title="Total Tasks"     value={stats.totalTasks}     icon="bi-list-task"         colorClass="bg-info"    delay={80}  />
            <StatsCard title="Completed Tasks" value={stats.completedTasks} icon="bi-check-circle-fill" colorClass="bg-success" delay={160} />
            <StatsCard title="Pending Tasks"   value={stats.pendingTasks}   icon="bi-hourglass-split"   colorClass="bg-warning" delay={240} />
          </div>

          {/* Second row */}
          <div className="row g-4">
            {/* Dept breakdown */}
            <div className="col-lg-7">
              <div className="card h-100">
                <div className="card-header bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
                  <span className="fw-semibold text-heading">
                    <i className="bi bi-bar-chart-line me-2 text-primary" />Interns by Department
                  </span>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                    {stats.totalInterns} total
                  </span>
                </div>
                <div className="card-body pt-3">
                  {stats.internsByDepartment.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox text-muted fs-3 d-block mb-2" />
                      <p className="text-muted small mb-2">No interns yet.</p>
                      <button className="btn btn-sm btn-primary" onClick={() => setShowInternForm(true)}>
                        <i className="bi bi-person-plus me-1" />Add First Intern
                      </button>
                    </div>
                  ) : (
                    stats.internsByDepartment.map((row) => {
                      const pct = stats.totalInterns > 0
                        ? Math.round((row.count / stats.totalInterns) * 100) : 0;
                      return (
                        <div key={row.department} className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="small fw-medium">{row.department}</span>
                            <span className="small text-muted">{row.count}</span>
                          </div>
                          <div className="progress" style={{ height: 7 }}>
                            <div className="progress-bar bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Today attendance + task summary */}
            <div className="col-lg-5 d-flex flex-column gap-4">
              <div className="card">
                <div className="card-header bg-white border-0 pb-0">
                  <span className="fw-semibold text-heading">
                    <i className="bi bi-calendar-check me-2 text-primary" />Today's Attendance
                  </span>
                </div>
                <div className="card-body pt-3">
                  {stats.todayAttendance.length === 0 ? (
                    <div className="text-center py-2">
                      <p className="text-muted small mb-2">No attendance marked today.</p>
                      <Link to="/attendance" className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-calendar-check me-1" />Mark Now
                      </Link>
                    </div>
                  ) : (
                    <div className="d-flex gap-2 flex-wrap">
                      {stats.todayAttendance.map((row) => {
                        const colors = { present: '#16a34a', absent: '#dc2626', late: '#d97706' };
                        return (
                          <div
                            key={row.status}
                            className="flex-fill text-center p-3 rounded-3"
                            style={{ background: `${colors[row.status]}14`, border: `1px solid ${colors[row.status]}30` }}
                          >
                            <div className="fs-4 fw-bold" style={{ color: colors[row.status] }}>
                              {row.count}
                            </div>
                            <div className="text-capitalize small fw-medium" style={{ color: colors[row.status] }}>
                              {row.status}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Task completion rate */}
              <div className="card">
                <div className="card-header bg-white border-0 pb-0">
                  <span className="fw-semibold text-heading">
                    <i className="bi bi-check2-all me-2 text-success" />Task Completion
                  </span>
                </div>
                <div className="card-body pt-3">
                  {stats.totalTasks === 0 ? (
                    <p className="text-muted small text-center py-1 mb-0">No tasks assigned yet.</p>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small fw-medium">Completion Rate</span>
                        <span className="small fw-bold text-success">
                          {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                        </span>
                      </div>
                      <div className="progress mb-3" style={{ height: 10 }}>
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                        />
                      </div>
                      <div className="d-flex justify-content-between text-muted small">
                        <span><span className="text-success fw-semibold">{stats.completedTasks}</span> completed</span>
                        <span><span className="text-warning fw-semibold">{stats.pendingTasks}</span> pending</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick action modals */}
      {showInternForm && (
        <InternForm
          intern={null}
          onSubmit={handleAddIntern}
          onClose={() => { setShowInternForm(false); setFormError(''); }}
          error={formError}
        />
      )}
      {showTaskForm && (
        <TaskForm
          interns={interns}
          onSubmit={handleAddTask}
          onClose={() => { setShowTaskForm(false); setFormError(''); }}
          error={formError}
        />
      )}
    </div>
  );
}

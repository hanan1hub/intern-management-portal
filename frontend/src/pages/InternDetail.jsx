import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOne } from '../api/internsApi';
import { useTasks } from '../hooks/useTasks';
import { useAttendance } from '../hooks/useAttendance';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import AttendanceTable from '../components/attendance/AttendanceTable';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import { formatDate, extractError } from '../utils/helpers';

export default function InternDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [intern, setIntern] = useState(null);
  const [loadingIntern, setLoadingIntern] = useState(true);
  const [internError, setInternError]     = useState('');
  const [showTaskForm, setShowTaskForm]   = useState(false);
  const [taskFormError, setTaskFormError] = useState('');
  const [toggleLoading, setToggleLoading] = useState(null);

  const { tasks, loading: tasksLoading, error: tasksError, addTask, toggleStatus } = useTasks({ intern_id: id });
  const { records, loading: attLoading, error: attError } = useAttendance({ intern_id: id });

  useEffect(() => {
    getOne(id)
      .then(setIntern)
      .catch((err) => setInternError(extractError(err)))
      .finally(() => setLoadingIntern(false));
  }, [id]);

  const handleAddTask = async (data) => {
    setTaskFormError('');
    try {
      await addTask(data);
      setShowTaskForm(false);
    } catch (err) {
      setTaskFormError(extractError(err));
    }
  };

  const handleToggle = async (taskId, status) => {
    setToggleLoading(taskId);
    try { await toggleStatus(taskId, status); }
    finally { setToggleLoading(null); }
  };

  if (loadingIntern) return <Loader />;
  if (internError)   return <ErrorAlert message={internError} />;
  if (!intern)       return null;

  return (
    <div>
      <div className="mb-4">
        <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => navigate('/interns')}>
          <i className="bi bi-arrow-left me-1" />Back to Interns
        </button>
        <div className="card shadow-sm border-0">
          <div className="card-body d-flex align-items-center gap-4 p-4">
            <div className="intern-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 64, height: 64, fontSize: '1.5rem', flexShrink: 0 }}>
              {intern.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow-1">
              <h3 className="mb-1 fw-bold">{intern.name}</h3>
              <div className="d-flex flex-wrap gap-3 text-muted small">
                <span><i className="bi bi-envelope me-1" />{intern.email}</span>
                <span>
                  <i className="bi bi-building me-1" />
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle ms-1">
                    {intern.department}
                  </span>
                </span>
                <span><i className="bi bi-calendar me-1" />Joined {formatDate(intern.joining_date)}</span>
              </div>
            </div>
            <Link to="/interns" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-pencil me-1" />Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold mb-0">
              <i className="bi bi-check2-square me-2 text-primary" />Tasks
              <span className="badge bg-secondary ms-2">{tasks.length}</span>
            </h5>
            <button className="btn btn-sm btn-primary" onClick={() => setShowTaskForm(true)}>
              <i className="bi bi-plus me-1" />Assign Task
            </button>
          </div>
          <TaskList
            tasks={tasks}
            loading={tasksLoading}
            error={tasksError}
            onToggle={handleToggle}
            toggleLoading={toggleLoading}
          />
        </div>

        <div className="col-lg-5">
          <h5 className="fw-semibold mb-3">
            <i className="bi bi-calendar-check me-2 text-primary" />Attendance History
            <span className="badge bg-secondary ms-2">{records.length}</span>
          </h5>
          <AttendanceTable records={records} loading={attLoading} error={attError} />
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          interns={[intern]}
          defaultInternId={intern.id}
          onSubmit={handleAddTask}
          onClose={() => { setShowTaskForm(false); setTaskFormError(''); }}
          error={taskFormError}
        />
      )}
    </div>
  );
}

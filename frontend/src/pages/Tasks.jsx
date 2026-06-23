import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useInterns } from '../hooks/useInterns';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import ErrorAlert from '../components/common/ErrorAlert';
import { extractError } from '../utils/helpers';

export default function Tasks() {
  const [filters, setFilters]     = useState({ status: '', intern_id: '' });
  const [showForm, setShowForm]   = useState(false);
  const [formError, setFormError] = useState('');
  const [toggleLoading, setToggleLoading] = useState(null);

  const { tasks, loading, error, addTask, toggleStatus } = useTasks(filters);
  const { interns } = useInterns();

  const handleAddTask = async (data) => {
    setFormError('');
    try {
      await addTask(data);
      setShowForm(false);
    } catch (err) {
      setFormError(extractError(err));
    }
  };

  const handleToggle = async (taskId, status) => {
    setToggleLoading(taskId);
    try { await toggleStatus(taskId, status); }
    finally { setToggleLoading(null); }
  };

  const pending   = tasks.filter((t) => t.status === 'pending').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  return (
    <>
      <div className="page-enter">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="page-title mb-0">Tasks</h2>
            <p className="text-muted small mb-0">
              {pending} pending &middot; {completed} completed
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => { setFormError(''); setShowForm(true); }}>
            <i className="bi bi-plus-square me-2" />Assign Task
          </button>
        </div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label fw-medium small text-muted">Filter by Status</label>
                <div className="btn-group w-100">
                  {['', 'pending', 'completed'].map((s) => (
                    <button
                      key={s}
                      className={`btn btn-sm ${filters.status === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setFilters((prev) => ({ ...prev, status: s }))}
                    >
                      {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-md-5">
                <label className="form-label fw-medium small text-muted">Filter by Intern</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.intern_id}
                  onChange={(e) => setFilters((prev) => ({ ...prev, intern_id: e.target.value }))}
                >
                  <option value="">All Interns</option>
                  {interns.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button
                  className="btn btn-sm btn-outline-secondary w-100"
                  onClick={() => setFilters({ status: '', intern_id: '' })}
                >
                  <i className="bi bi-arrow-counterclockwise me-1" />Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        <TaskList
          tasks={tasks}
          loading={loading}
          error={null}
          onToggle={handleToggle}
          toggleLoading={toggleLoading}
        />
      </div>

      {showForm && (
        <TaskForm
          interns={interns}
          onSubmit={handleAddTask}
          onClose={() => { setShowForm(false); setFormError(''); }}
          error={formError}
        />
      )}
    </>
  );
}

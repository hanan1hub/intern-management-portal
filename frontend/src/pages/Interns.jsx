import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInterns } from '../hooks/useInterns';
import InternFilters from '../components/interns/InternFilters';
import InternForm from '../components/interns/InternForm';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/common/Loader';
import ErrorAlert from '../components/common/ErrorAlert';
import { formatDate, extractError } from '../utils/helpers';

const DEPARTMENTS = [
  'Computer Science', 'Data Science', 'Electrical Engineering',
  'Artificial Intelligence', 'Software Engineering', 'Mechanical Engineering',
  'Civil Engineering', 'Physics', 'Mathematics', 'Chemistry',
  'Bioinformatics', 'Cyber Security', 'Other',
];

export default function Interns() {
  const [filters, setFilters]       = useState({ search: '', department: '' });
  const [showForm, setShowForm]     = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError]   = useState('');
  const [deleting, setDeleting]     = useState(false);

  const { interns, loading, error, addIntern, editIntern, deleteIntern } = useInterns(filters);

  const openAdd  = ()      => { setEditTarget(null); setFormError(''); setShowForm(true); };
  const openEdit = (intern) => { setEditTarget(intern); setFormError(''); setShowForm(true); };
  const closeForm = ()     => { setShowForm(false); setEditTarget(null); setFormError(''); };

  const handleFormSubmit = async (data) => {
    setFormError('');
    try {
      editTarget ? await editIntern(editTarget.id, data) : await addIntern(data);
      closeForm();
    } catch (err) {
      setFormError(extractError(err));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteIntern(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="page-enter">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="page-title mb-0">Interns</h2>
            <p className="text-muted small mb-0">Manage all interns in the portal</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            <i className="bi bi-person-plus me-2" />Add Intern
          </button>
        </div>

        <InternFilters filters={filters} onChange={setFilters} departments={DEPARTMENTS} />

        {loading && <Loader />}
        {error   && <ErrorAlert message={error} />}

        {!loading && !error && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 pb-0 d-flex justify-content-between align-items-center">
              <span className="fw-semibold">
                <i className="bi bi-person-lines-fill me-2 text-primary" />All Interns
              </span>
              <span className="badge bg-secondary">{interns.length}</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Joining Date</th>
                      <th style={{ width: 120 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interns.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-5 text-muted">
                          <i className="bi bi-inbox fs-3 d-block mb-2" />
                          No interns found
                        </td>
                      </tr>
                    ) : (
                      interns.map((intern, idx) => (
                        <tr key={intern.id}>
                          <td className="text-muted small">{idx + 1}</td>
                          <td>
                            <Link
                              to={`/interns/${intern.id}`}
                              className="fw-medium text-decoration-none text-primary"
                            >
                              <i className="bi bi-person-circle me-2 text-muted" />
                              {intern.name}
                            </Link>
                          </td>
                          <td className="text-muted">{intern.email}</td>
                          <td>
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                              {intern.department}
                            </span>
                          </td>
                          <td className="text-muted small">{formatDate(intern.joining_date)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                title="Edit intern"
                                onClick={() => openEdit(intern)}
                              >
                                <i className="bi bi-pencil" />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete intern"
                                onClick={() => setDeleteTarget(intern)}
                              >
                                <i className="bi bi-trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <InternForm
          intern={editTarget}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
          error={formError}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete intern "${deleteTarget.name}"? This will permanently remove their tasks and attendance records.`}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}

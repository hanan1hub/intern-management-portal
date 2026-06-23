import { formatDate, statusBadgeClass } from '../../utils/helpers';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';

export default function AttendanceTable({ records, loading, error }) {
  if (loading) return <Loader text="Loading attendance..." />;
  if (error)   return <ErrorAlert message={error} />;

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white fw-semibold">
        <i className="bi bi-table me-2 text-primary" />Attendance Records
        <span className="badge bg-secondary ms-2">{records.length}</span>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Intern</th>
                <th>Department</th>
                <th>Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    <i className="bi bi-inbox d-block fs-3 mb-2" />
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-medium">{r.intern_name}</td>
                    <td><span className="badge bg-primary-subtle text-primary">{r.department}</span></td>
                    <td>{formatDate(r.date)}</td>
                    <td>
                      <span className={`badge ${statusBadgeClass(r.status)} text-capitalize`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-muted small">{r.notes || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

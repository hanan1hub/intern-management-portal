import { useState, useEffect } from 'react';
import { getMyAttendance } from '../../api/internPortalApi';
import { formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

const STATUS_STYLE = {
  present: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', icon: 'bi-check-circle-fill' },
  absent:  { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: 'bi-x-circle-fill'     },
  late:    { bg: '#fffbeb', border: '#fde68a', color: '#d97706', icon: 'bi-clock-fill'         },
};

export default function InternAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAttendance()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading attendance..." />;

  const present = records.filter((r) => r.status === 'present').length;
  const absent  = records.filter((r) => r.status === 'absent').length;
  const late    = records.filter((r) => r.status === 'late').length;
  const rate    = records.length ? Math.round((present / records.length) * 100) : 0;

  return (
    <div className="page-enter">
      <div className="mb-4">
        <h2 className="page-title mb-0">My Attendance</h2>
        <p className="text-muted small mb-0">{records.length} records total</p>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Present', count: present, ...STATUS_STYLE.present },
          { label: 'Absent',  count: absent,  ...STATUS_STYLE.absent  },
          { label: 'Late',    count: late,     ...STATUS_STYLE.late    },
        ].map(({ label, count, bg, border, color, icon }) => (
          <div key={label} className="col-4">
            <div className="card border-0 text-center p-3 h-100"
              style={{ background: bg, border: `1px solid ${border}` }}>
              <i className={`bi ${icon} fs-4 mb-1`} style={{ color }} />
              <div className="fw-bold fs-4" style={{ color }}>{count}</div>
              <div className="small fw-medium" style={{ color }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance rate bar */}
      {records.length > 0 && (
        <div className="card border-0 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <span className="fw-medium small">Attendance Rate</span>
              <span className="fw-bold small text-success">{rate}%</span>
            </div>
            <div className="progress" style={{ height: 10 }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Records table */}
      {records.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-calendar-x fs-2 d-block mb-2" />No attendance records yet.
        </div>
      ) : (
        <div className="card border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const s = STATUS_STYLE[r.status] || STATUS_STYLE.present;
                    return (
                      <tr key={r.id}>
                        <td className="fw-medium">{formatDate(r.date)}</td>
                        <td>
                          <span
                            className="badge"
                            style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                          >
                            <i className={`bi ${s.icon} me-1`} />
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </span>
                        </td>
                        <td className="text-muted small">{r.notes || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

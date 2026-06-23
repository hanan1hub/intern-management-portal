import { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useInterns } from '../hooks/useInterns';
import AttendanceForm from '../components/attendance/AttendanceForm';
import AttendanceTable from '../components/attendance/AttendanceTable';
import { today, extractError } from '../utils/helpers';

export default function Attendance() {
  const [dateFilter, setDateFilter] = useState(today());
  const [formError, setFormError]   = useState('');

  const { records, loading, error, markAttendance } = useAttendance(
    dateFilter ? { date: dateFilter } : {}
  );
  const { interns } = useInterns();

  const handleMark = async (data) => {
    setFormError('');
    try {
      await markAttendance(data);
    } catch (err) {
      setFormError(extractError(err));
    }
  };

  return (
    <div className="page-enter">
      <div className="mb-4">
        <h2 className="page-title mb-0">Attendance</h2>
        <p className="text-muted small mb-0">Mark and view intern attendance records</p>
      </div>

      <AttendanceForm interns={interns} onSubmit={handleMark} error={formError} />

      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body d-flex align-items-center gap-3">
          <label className="fw-medium mb-0 text-nowrap">Filter by Date:</label>
          <input
            type="date"
            className="form-control form-control-sm"
            style={{ maxWidth: 200 }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          {dateFilter && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setDateFilter('')}
            >
              Show All
            </button>
          )}
        </div>
      </div>

      <AttendanceTable records={records} loading={loading} error={error} />
    </div>
  );
}

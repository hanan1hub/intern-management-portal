import { useState, useEffect, useCallback } from 'react';
import * as attendanceApi from '../api/attendanceApi';
import { extractError } from '../utils/helpers';

export function useAttendance(filters = {}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceApi.getAll(filters);
      setRecords(data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const markAttendance = async (data) => {
    const created = await attendanceApi.mark(data);
    await fetchAttendance();
    return created;
  };

  return { records, loading, error, fetchAttendance, markAttendance };
}

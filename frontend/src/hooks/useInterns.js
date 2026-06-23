import { useState, useEffect, useCallback } from 'react';
import * as internsApi from '../api/internsApi';
import { extractError } from '../utils/helpers';

export function useInterns(filters = {}) {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchInterns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await internsApi.getAll(filters);
      setInterns(data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchInterns(); }, [fetchInterns]);

  const addIntern = async (data) => {
    const created = await internsApi.create(data);
    setInterns((prev) => [created, ...prev]);
    return created;
  };

  const editIntern = async (id, data) => {
    const updated = await internsApi.update(id, data);
    setInterns((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  };

  const deleteIntern = async (id) => {
    await internsApi.remove(id);
    setInterns((prev) => prev.filter((i) => i.id !== id));
  };

  return { interns, loading, error, fetchInterns, addIntern, editIntern, deleteIntern };
}

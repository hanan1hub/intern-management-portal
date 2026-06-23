import { useState, useEffect, useCallback } from 'react';
import * as tasksApi from '../api/tasksApi';
import { extractError } from '../utils/helpers';

export function useTasks(filters = {}) {
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.getAll(filters);
      setTasks(data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async (data) => {
    const created = await tasksApi.create(data);
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const updated = await tasksApi.updateStatus(id, newStatus);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  return { tasks, loading, error, fetchTasks, addTask, toggleStatus };
}

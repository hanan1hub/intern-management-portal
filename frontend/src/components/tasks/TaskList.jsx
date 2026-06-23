import TaskItem from './TaskItem';
import Loader from '../common/Loader';
import ErrorAlert from '../common/ErrorAlert';

export default function TaskList({ tasks, loading, error, onToggle, toggleLoading }) {
  if (loading) return <Loader text="Loading tasks..." />;
  if (error)   return <ErrorAlert message={error} />;
  if (!tasks.length) {
    return (
      <div className="text-center py-4 text-muted">
        <i className="bi bi-inbox fs-3 d-block mb-2" />
        No tasks found
      </div>
    );
  }
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          loading={toggleLoading === task.id}
        />
      ))}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ACTIONS = [
  { icon: 'bi-person-plus-fill', label: 'Add Intern',       color: '#0d6efd', action: 'add-intern'  },
  { icon: 'bi-plus-square-fill', label: 'Assign Task',      color: '#198754', action: 'assign-task' },
  { icon: 'bi-calendar-check-fill', label: 'Attendance',    color: '#0dcaf0', action: 'attendance'  },
  { icon: 'bi-speedometer2',     label: 'Dashboard',        color: '#6f42c1', action: 'dashboard'   },
];

export default function QuickActions({ onAddIntern, onAssignTask }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleClick = (action) => {
    if (action === 'add-intern'  && onAddIntern)  { onAddIntern();        return; }
    if (action === 'assign-task' && onAssignTask) { onAssignTask();       return; }
    if (action === 'attendance')  navigate('/attendance');
    if (action === 'dashboard')   navigate('/');
  };

  return (
    <div className="quick-actions-bar" aria-label="Quick actions">
      {ACTIONS.map(({ icon, label, color, action }) => (
        <button
          key={action}
          className={`qa-btn${hovered === action ? ' qa-btn--open' : ''}`}
          style={{ '--qa-color': color }}
          onMouseEnter={() => setHovered(action)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleClick(action)}
          title={label}
        >
          <span className="qa-icon">
            <i className={`bi ${icon}`} />
          </span>
          <span className="qa-label">{label}</span>
        </button>
      ))}
    </div>
  );
}

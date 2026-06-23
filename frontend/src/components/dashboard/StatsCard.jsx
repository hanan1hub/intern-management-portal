import { useCountUp } from '../../hooks/useCountUp';

export default function StatsCard({ title, value, icon, colorClass, delay = 0 }) {
  const displayValue = useCountUp(value ?? 0);

  return (
    <div className="col-sm-6 col-xl-3 stats-col" style={{ animationDelay: `${delay}ms` }}>
      <div className="card stats-card border-0 h-100">
        <div className="card-body d-flex align-items-center gap-3 p-4">
          <div className={`stats-icon rounded-3 ${colorClass}`}>
            <i className={`bi ${icon} fs-4 text-white`} />
          </div>
          <div>
            <div className="stats-value">{displayValue}</div>
            <div className="text-muted small mt-1">{title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

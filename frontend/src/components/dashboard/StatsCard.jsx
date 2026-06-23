export default function StatsCard({ title, value, icon, colorClass, subtitle }) {
  return (
    <div className="col-sm-6 col-xl-3">
      <div className={`card stats-card border-0 shadow-sm h-100`}>
        <div className="card-body d-flex align-items-center gap-3 p-4">
          <div className={`stats-icon rounded-3 p-3 ${colorClass}`}>
            <i className={`bi ${icon} fs-4 text-white`} />
          </div>
          <div>
            <div className="stats-value fw-bold fs-3 lh-1">{value ?? '—'}</div>
            <div className="text-muted small mt-1">{title}</div>
            {subtitle && <div className="text-muted" style={{ fontSize: '0.72rem' }}>{subtitle}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

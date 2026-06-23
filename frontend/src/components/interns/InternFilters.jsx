export default function InternFilters({ filters, onChange, departments }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                value={filters.search}
                onChange={(e) => onChange({ ...filters, search: e.target.value })}
              />
              {filters.search && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => onChange({ ...filters, search: '' })}
                >
                  <i className="bi bi-x" />
                </button>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={filters.department}
              onChange={(e) => onChange({ ...filters, department: e.target.value })}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => onChange({ search: '', department: '' })}
            >
              <i className="bi bi-arrow-counterclockwise me-1" />Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

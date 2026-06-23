export default function CredentialsModal({ intern, onClose }) {
  const copy = (text) => navigator.clipboard?.writeText(text);

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title">
              <i className="bi bi-check-circle-fill text-success me-2" />Intern Account Created
            </h5>
          </div>
          <div className="modal-body">
            <p className="text-muted small mb-3">
              A welcome email with login credentials has been sent to <strong>{intern.email}</strong>.
              Keep a copy below as backup in case the email is delayed.
            </p>

            <div className="rounded-3 p-3 mb-3" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
              <div className="fw-semibold small text-muted mb-2 text-uppercase" style={{ letterSpacing: '0.05em' }}>
                Login Credentials
              </div>

              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Email</div>
                  <code className="text-dark">{intern.email}</code>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => copy(intern.email)} title="Copy">
                  <i className="bi bi-clipboard" />
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2">
                <div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>Password</div>
                  <code className="text-dark fs-6">{intern.generatedPassword}</code>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => copy(intern.generatedPassword)} title="Copy">
                  <i className="bi bi-clipboard" />
                </button>
              </div>
            </div>

            <div className="alert alert-warning py-2 small mb-0">
              <i className="bi bi-shield-exclamation me-1" />
              This password is shown only once. Save it now if you need to share manually.
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-primary w-100" onClick={onClose}>
              <i className="bi bi-check me-1" />Got it, Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

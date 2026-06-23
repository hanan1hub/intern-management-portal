export default function ConfirmModal({ message, onConfirm, onClose, loading }) {
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title text-danger">
              <i className="bi bi-exclamation-triangle me-2" />Confirm Delete
            </h5>
            <button className="btn-close" onClick={onClose} disabled={loading} />
          </div>
          <div className="modal-body pt-2">
            <p className="text-muted">{message}</p>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-1" />Deleting...</>
                : <><i className="bi bi-trash me-1" />Delete</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2" />
      {message}
      {onDismiss && (
        <button type="button" className="btn-close" onClick={onDismiss} />
      )}
    </div>
  );
}

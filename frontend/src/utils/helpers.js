export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const today = () => new Date().toISOString().split('T')[0];

export const statusBadgeClass = (status) => {
  switch (status) {
    case 'completed': return 'bg-success';
    case 'pending':   return 'bg-warning text-dark';
    case 'present':   return 'bg-success';
    case 'absent':    return 'bg-danger';
    case 'late':      return 'bg-warning text-dark';
    default:          return 'bg-secondary';
  }
};

export const extractError = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.errors?.[0]?.msg ||
  'Something went wrong. Please try again.';

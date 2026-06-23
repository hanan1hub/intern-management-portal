export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateInternForm = ({ name, email, department, joining_date }) => {
  const errors = {};
  if (!name?.trim()) errors.name = 'Name is required';
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!department?.trim()) errors.department = 'Department is required';
  if (!joining_date) errors.joining_date = 'Joining date is required';
  return errors;
};

export const validateTaskForm = ({ title, intern_id }) => {
  const errors = {};
  if (!title?.trim()) errors.title = 'Task title is required';
  if (!intern_id) errors.intern_id = 'Please select an intern';
  return errors;
};

export const validateAttendanceForm = ({ intern_id, date, status }) => {
  const errors = {};
  if (!intern_id) errors.intern_id = 'Please select an intern';
  if (!date) errors.date = 'Date is required';
  if (!status) errors.status = 'Status is required';
  return errors;
};

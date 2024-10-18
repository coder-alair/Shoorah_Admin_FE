import validator from 'validator';

function changePassValidations(data) {
  const errors = {};
  if (validator.isEmpty(data.password.trim())) errors.password = 'Please enter password.';
  else if (data.password.length < 6) errors.password = 'Password must be greater than 6 digit.';
  if (validator.isEmpty(data.newPassword.trim())) errors.newPassword = 'Please enter new password.';
  else if (data.newPassword.length < 6)
    errors.newPassword = 'New Password must be greater than 6 digit.';
  if (validator.isEmpty(data.confirmPassword.trim()))
    errors.confirmPassword = 'Please enter confirm password.';
  else if (data.confirmPassword.length < 6)
    errors.confirmPassword = 'Confirm New Password must be greater than 6 digit.';
  if (data.newPassword.trim() !== data.confirmPassword.trim())
    errors.confirmPassword = 'New password and confirm password do not match.';
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default changePassValidations;

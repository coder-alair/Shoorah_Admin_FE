import validator from 'validator';

function resetPasswordValidation(data) {
  const errors = {};

  if (validator.isEmpty(data.otp.trim())) errors.otp = 'Please enter OTP.';

  if (validator.isEmpty(data.new_password.trim()))
    errors.new_password = 'Please enter new password.';
  else if (data.new_password.length < 6)
    errors.new_password = 'New Password must be greater than 6 digit.';
  if (validator.isEmpty(data.confirm_password.trim()))
    errors.confirm_password = 'Please enter confirm password.';
  else if (data.confirm_password.length < 6)
    errors.confirm_password = 'Confirm Password must be greater than 6 digit.';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default resetPasswordValidation;

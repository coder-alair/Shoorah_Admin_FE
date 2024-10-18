import validator from 'validator';

function AddUserValidation(data) {
  const errors = {};

  // Regular expression to allow only letters and spaces
  const nameRegex = /^[A-Za-z\s]+$/;

  if (!validator.isLength(data.firstName?.trim(), { min: 1 })) {
    errors.firstName = 'Please enter the first name.';
  } else if (!nameRegex.test(data.firstName?.trim())) {
    errors.firstName = 'First name should contain only letters and spaces.';
  }

  if (!validator.isLength(data.lastName?.trim(), { min: 1 })) {
    errors.lastName = 'Please enter the last name.';
  } else if (!nameRegex.test(data.lastName?.trim())) {
    errors.lastName = 'Last name should contain only letters and spaces.';
  }

  if (validator.isEmpty(data.email.trim())) {
    errors.email = 'Please enter the email address.';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  
  return { errors, isValid: Object.keys(errors).length === 0 };
}

export default AddUserValidation;

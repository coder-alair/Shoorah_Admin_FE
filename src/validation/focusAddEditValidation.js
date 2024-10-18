import validator from 'validator';

function FocusAddEditValidation(data) {
  const errors = {};

  if (validator.isEmpty(data.name.trim())) errors.name = 'Please enter focus name.';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default FocusAddEditValidation;

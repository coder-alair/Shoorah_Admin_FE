import validator from 'validator';

function EditUserValidation(data) {
  const errors = {};
  const nameRegex = /^[A-Za-z\s]+$/;
  console.log({ data });

  if (!validator.isLength(data?.name?.trim())) {
    errors.name = 'Please enter the name.';
  } else if (!nameRegex.test(data?.name?.trim())) {
    errors.name = 'Name should contain only letters and spaces.';
  }
  if (validator.isEmpty(data?.email?.trim()))
    errors.email = 'Please enter the registered email address.';
  else if (!validator.isEmail(data?.email)) errors.email = 'Please enter valid email address.';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default EditUserValidation;

import validator from 'validator';

function AddCmsValidation(data) {
  const errors = {};
  if (validator.isEmpty(data.title?.trim())) errors.title = 'Please enter the title.';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddCmsValidation;

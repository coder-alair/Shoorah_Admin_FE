import validator from 'validator';

function AddEditRitualsVali(data) {
  const errors = {};
  if (validator.isEmpty(data?.ideaName?.trim())) errors.ideaName = 'Please enter the title.';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddEditRitualsVali;

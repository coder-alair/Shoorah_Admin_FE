import validator from 'validator';

function AddEditRitualsVali(data, focusList) {
  const errors = {};
  if (validator.isEmpty(data.ritualName.trim())) errors.ritualName = 'Please enter the title.';
  if (!focusList) errors.focus = 'Please select the Category.';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddEditRitualsVali;

import validator from 'validator';

function AddEditGratituteVali(data, focusList) {
  const errors = {};
  if (validator.isEmpty(data.gratitudeTitle.trim()))
    errors.gratitudeTitle = 'Please enter the title.';
  if (focusList.length === 0) errors.focus = 'Please select the focus.';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddEditGratituteVali;

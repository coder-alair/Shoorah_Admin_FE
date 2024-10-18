import validator from 'validator';

function affirmationValidation(data, focusList) {
  const errors = {};
  if (data.affirmationType === 2) {
    if (validator.isEmpty(data.name)) errors.name = 'Please enter affirmation name.';
    // if (validator.isEmpty(data.description)) errors.description = 'Please enter description.';
    if (focusList?.length === 0) errors.focus = 'Please select affirmation focus.';
  } else if (data.affirmationType === 1) {
    if (!data.csvFile) errors.csv = 'Please select csv file.';
    if (focusList?.length === 0) errors.focus = 'Please select affirmation focus.';
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default affirmationValidation;

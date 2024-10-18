import validator from 'validator';

function AddEditBreathworkVali(data,expertId) {
  const errors = {};

  if (validator.isEmpty(data.breathworkTitle.trim()))
    errors.breathworkTitle = 'Please enter the title.';
  if (validator.isEmpty(data.description.trim()))
    errors.description = 'Please enter the description.';
  if (!expertId?.id )
    errors.expertId = 'Please select expert.';
  console.log({ errors });
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddEditBreathworkVali;

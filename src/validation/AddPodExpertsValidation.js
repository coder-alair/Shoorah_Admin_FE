import validator from 'validator';

function AddPodExpertsValidation(data) {
  const errors = {};

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!validator.isLength(data.name?.trim(), { min: 1 })) {
    errors.name = 'Please enter the full name.';
  } else if (!nameRegex.test(data.name?.trim())) {
    errors.name = 'First name should contain only letters and spaces.';
  }

  // if (!validator.isLength(data.description, { min: 1 })) {
  //   errors.description = 'Please enter the description.';
  // } else if (!nameRegex.test(data.description)) {
  //   errors.description = 'Comment should contain only letters and spaces.';
  // }

  // if (!data.image) {
  //   errors.image = 'Please select the profile.';
  // }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export default AddPodExpertsValidation;

import validator from 'validator';

function cmsValidation(data, content) {
  const errors = {};

  if (!content || content?.replace(/ /g, '') === '<p></p>') {
    errors.message = 'Please enter description';
  }
  if (validator.isEmpty(data.title.trim())) errors.title = 'Please enter title';

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default cmsValidation;

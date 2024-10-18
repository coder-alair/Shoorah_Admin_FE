import validator from 'validator';

function contentApprovalValidation(data) {
  const errors = {};
  if (data?.status === 0 || data?.status === 2) {
    if (validator.isEmpty(data.comment.trim())) errors.comment = 'Please enter comment.';
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default contentApprovalValidation;

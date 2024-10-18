import validator from 'validator';

function AddPushNotificationVali(data, selectedEmailList) {
  const errors = {};

  if (validator.isEmpty(data.title.trim())) errors.title = 'Please enter the title.';
  if (validator.isEmpty(data.message.trim())) errors.message = 'Please enter the message.';

  if (data?.sentToUser === 4) {
    if (selectedEmailList?.length === 0) errors.email_ids = 'Please select email address.';
  }
  if (!data?.sentToUser && !data?.sentToDepartment) {
    errors.sent_to_user = 'Please select atleast one user or department.';
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddPushNotificationVali;

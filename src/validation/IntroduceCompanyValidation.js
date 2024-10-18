import validator from 'validator';

export default function IntroduceCompanyValidation(data) {
  const errors = {};

  if (validator.isEmpty(data.company_name.trim()))
    errors.company_name = 'Please enter the company name.';
  if (validator.isEmpty(data.company_email.trim()))
    errors.company_email = 'Please enter the email address.';
  else if (!validator.isEmail(data.company_email))
    errors.company_email = 'Please enter valid email address.';
  if (validator.isEmpty(data.company_address.trim()))
    errors.company_address = 'Please enter the company address.';
  if (validator.isEmpty(data.contact_person.trim()))
    errors.contact_person = 'Please enter the contact person.';
  if (data.other_admin_emails) {
    const tempArr = data.other_admin_emails?.split(',');
    tempArr.some((data) => {
      if (!validator.isEmail(data.trim())) {
        errors.other_admin_emails = 'Please enter valid email address.';
        return true;
      }
      return false;
    });
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

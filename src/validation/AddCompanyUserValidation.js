import { format, isAfter, isBefore, isValid, parseISO, subYears } from 'date-fns';
import validator from 'validator';

function AddCompanyUserValidation(data) {
  const errors = {};
  const nameRegex = /^[A-Za-z\s]+$/;

  if (!validator.isLength(data?.name?.trim())) {
    errors.name = 'Please enter the name.';
  } else if (!nameRegex.test(data?.name?.trim())) {
    errors.name = 'Name should contain only letters and spaces.';
  }

  if (validator.isEmpty(data.email.trim())) errors.email = 'Please enter the email address.';
  else if (!validator.isEmail(data.email)) errors.email = 'Please enter valid email address.';

  const employeeIdTrimmed = data.employee_id.trim();
  if (validator.isEmpty(employeeIdTrimmed)) {
    errors.employee_id = 'Please enter employee id.';
  } else if (!validator.isNumeric(employeeIdTrimmed)) {
    errors.employee_id = 'Employee id must be a number.';
  }

  const dobTrimmed = data.dob.trim();
  if (validator.isEmpty(dobTrimmed)) {
    errors.dob = 'Please enter date of birth.';
  } else {
    const year = parseInt(data.dob.slice(0, 4), 10);
    if (year < format(subYears(new Date(), 90), 'yyyy')) {
      console.log(year < format(subYears(new Date(), 90), 'yyyy'));
      errors.dob = `Year must be ${format(subYears(new Date(), 90), 'yyyy')} or later.`;
    } else {
      const minAgeDate = subYears(new Date(), 6); // 6 years ago
      const minDate = parseISO(format(subYears(new Date(), 90), 'yyyy-MM-dd')); // Minimum allowed date
      const enteredDate = parseISO(data.dob);

      if (!isValid(enteredDate)) {
        errors.dob = 'Please enter a valid date.';
      } else if (isAfter(enteredDate, minAgeDate)) {
        errors.dob = 'You must be at least 6 years old.';
      } else if (isBefore(enteredDate, minDate)) {
        errors.dob = `Date of birth must be after ${format(
          subYears(new Date(), 90),
          'yyyy-MM-dd'
        )}.`;
      }
    }
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddCompanyUserValidation;

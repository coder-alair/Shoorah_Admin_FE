import moment from 'moment/moment';
import validator from 'validator';

function AddCompanyValidation(data) {
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
    tempArr.for((data) => {
      if (!validator.isEmail(data.trim())) {
        return (errors.other_admin_emails = 'Please enter valid email address.');
      }
    });
  }
  if (data.no_of_seat_bought <= 0) {
    errors.no_of_seat_bought = 'Please enter at least 1 seat.';
  }

  if (!data.b2bPlan) {
    errors.b2bplan = 'Please choose a valid plan.';
  }
  if (!data.plan) {
    errors.plan = 'Please choose a valid payment type.';
  }

  if (data.seat_price > 10) {
    errors.seat_price = 'Please choose a valid seat price.';
  }

  console.log(data.contract_end_date);
  if (!data.contract_start_date) {
    errors.contract_start_date = 'Contract start date cannot be null.';
  }
  if (!data.contract_end_date) {
    errors.contract_end_date = 'Contract end date cannot be null.';
  }

  const startDate = moment(data.contract_start_date);
  const endDate = moment(data.contract_end_date);

  console.log({ startDate });
  console.log({ endDate });
  console.log({ A: endDate.diff(startDate, 'days', true) < 1 });

  if (endDate.diff(startDate, 'days', true) < 1) {
    errors.contract_end_date = 'Contract duration should be at least 1 day.';
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default AddCompanyValidation;

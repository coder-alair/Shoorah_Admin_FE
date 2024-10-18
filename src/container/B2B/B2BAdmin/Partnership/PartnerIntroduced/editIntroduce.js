import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronUpIcon, PencilIcon } from '@heroicons/react/24/outline';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Switch,
  Transition
} from '@headlessui/react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  addMonthOnDate,
  currentDateWithFormat,
  errorToast,
  getFileType,
  successToast,
  useOutsideClick
} from '../../../../../utils/helper';
import AddCompanyValidation from '../../../../../validation/AddCompanyVali';
import { Api } from '../../../../../api';
import Loader from '../../../../../component/common/Loader';
import Breadcrumb from '../../../../../component/common/Breadcrumb';
import {
  B2BPLANS,
  BUSINESS_PLAN_ANNUAL_DROPDOWN,
  BUSINESS_PLAN_MONTHLY_DROPDOWN,
  BUSINESS_PLAN_ONE_TIME_DROPDOWN,
  BUSINESS_PLAN_SIXMONTHS_DROPDOWN,
  CORPORATE_PLAN_ANNUAL_DROPDOWN,
  CORPORATE_PLAN_MONTHLY_DROPDOWN,
  CORPORATE_PLAN_ONE_TIME_DROPDOWN,
  CORPORATE_PLAN_SIXMONTHS_DROPDOWN,
  CURRENCY,
  CompanyTypeData,
  ENTERPRICE_PLAN_ANNUAL_DROPDOWN,
  ENTERPRICE_PLAN_MONTHLY_DROPDOWN,
  ENTERPRICE_PLAN_ONE_TIME_DROPDOWN,
  ENTERPRICE_PLAN_SIXMONTHS_DROPDOWN,
  MONTHS,
  TEAM_PLAN_ANNUAL_DROPDOWN,
  TEAM_PLAN_MONTHLY_DROPDOWN,
  TEAM_PLAN_ONE_TIME_DROPDOWN,
  TEAM_PLAN_SIXMONTHS_DROPDOWN,
  TRIAL_DAYS_COUNTS
} from '../../../../../utils/constants';
import NOPhoto from '../../../../../assets/images/no-photo.png';
import { Calendar } from 'react-date-range';
import { addMonths, addYears, format, subDays } from 'date-fns';

const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

function EditIntroduce() {
  const location = useLocation();
  const company = location.state;
  const pages = [
    { name: 'Partners introduced', href: '/partner-introduced', current: false },
    {
      name: `edit introduce company`,
      href: '/partners-introduce/edit-introduce',
      current: true
    }
  ];

  const navigate = useNavigate();
  let currentDate = currentDateWithFormat(new Date());
  let contlength = '12';
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [companyData, setCompanyData] = useState({
    company_logo: null,
    logoUpdated: false,
    company_name: '',
    company_email: '',
    company_address: '',
    contact_person: '',
    contact_number: '',
    salesman: '',
    no_of_seat_bought: 0,
    seat_price: 0,
    seat_active: false,
    contract_start_date: currentDate,
    contract_end_date: currentDateWithFormat(addMonthOnDate(currentDate, contlength)),
    contract_length: contlength,
    contract_progress: false,
    b2b_interest_via: '',
    terms_agreed: false,
    contract_sent: false,
    contract_signed: false,
    invoice_raised: false,
    payment_complete: false,
    restrict_company: false,
    currency: 'gbp',
    company_type: '',
    other_admin_emails: '',
    shuru_usage: true,
    peap_usage: true,
    plan: 'Monthly',
    vat_tax: false,
    discount: 0,
    product: '',
    b2bPlan: '',
    auto_renew: true,
    introduce_by: ''
  });
  const [valid, setValid] = useState({});
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState(0);
  const [secondaryAmount, setSecondaryAmount] = useState(0);
  const [trial, setTrial] = useState(false);
  const [trialDays, setTrialDays] = useState(TRIAL_DAYS_COUNTS[0].value);
  const [planList, setPlanList] = useState(TEAM_PLAN_ONE_TIME_DROPDOWN);
  const [b2bPlan, setB2BPlan] = useState('');
  const [product, setProduct] = useState(TEAM_PLAN_ONE_TIME_DROPDOWN[0].value);
  const [trialDaysLeft, setTrialDaysLeft] = useState(null);
  const [check, setCheck] = useState(false);
  const calendarStartRef = useRef();
  const calendarEndRef = useRef();
  const [showContractStartCalendar, setShowContractStartCalendar] = useState(false);
  const [showContractEndCalendar, setShowContractEndCalendar] = useState(false);
  const [contractStartDate, setContractStartDate] = useState(null);
  const [contractEndDate, setContractEndDate] = useState(null);
  const [contractStartMinDate, setContractStartMinDate] = useState(
    formatDate(subDays(new Date(), 30))
  );

  useEffect(() => {
    if (company.id) {
      setEmail(company.email);
      setCompanyData({
        ...companyData,
        company_logo: company.company_logo,
        company_name: company.name,
        company_email: company.email,
        company_address: company.companyAddress,
        contact_person: company.contactPerson,
        contact_number: company.mobile,
        company_type: company.companyType,
        introduce_by: company.partnerId
      });
      setNumber(company?.mobile ? company?.mobile.toString() : '');
    }
  }, []);

  const handleImageChange = (event) => {
    if (
      event?.target?.files &&
      event.target.files.length > 0 &&
      event.target.files[0].name.match(/\.(jpg|jpeg|png)$/i)
    ) {
      errorToast(
        `The specified file ${event?.target?.files[0].name} could not be uploaded. Please upload JPG, JPEG, PNG image.`
      );
    } else if (event?.target?.files[0]?.size > 1048576) {
      errorToast(`File size should be less than 1MB`);
    } else {
      const file = event.target.files[0];
      if (file) {
        setImage(file);
        setCompanyData({
          ...companyData,
          company_logo: URL.createObjectURL(file),
          logoUpdated: true
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contract_end_date') {
      setCompanyData({ ...companyData, [name]: value, contract_length: -1 });
    } else if (name === 'contract_length') {
      if (companyData.contract_length !== '-1') {
        setCompanyData({
          ...companyData,
          [name]: value,
          contract_end_date: currentDateWithFormat(
            addMonthOnDate(companyData.contract_start_date, value)
          )
        });
        setContractEndDate(
          formatDate(addMonthOnDate(companyData.contract_start_date, parseInt(value)))
        );
      }
    } else if (name === 'seat_price') {
      setCompanyData({
        ...companyData,
        seat_price: e.target.selectedIndex,
        product: e.target.value
      });
      setProduct(e.target.value);
      calculatePrice();
    } else {
      setCompanyData({ ...companyData, [name]: value });
      calculatePrice();
    }
  };

  const handleClick = () => {
    setValid({
      ...valid,
      isSubmit: false,
      errors: null,
      isValid: false
    });
    const validate = AddCompanyValidation(companyData);
    setValid({
      ...valid,
      isSubmit: true,
      errors: validate.errors,
      isValid: validate.isValid
    });
    if (validate.isValid) {
      setLoader(true);
      if (company._id) {
        let stripePlan = getCurrentStripePlan();

        const data = {
          company_name: companyData.company_name?.trim(),
          company_address: companyData.company_address?.trim(),
          contact_person: companyData.contact_person?.trim(),
          contact_number: number,
          no_of_seat_bought: companyData.no_of_seat_bought,
          seat_price: companyData.seat_price,
          seat_active: companyData.seat_active,
          salesman: companyData.salesman,
          contract_start_date: companyData.contract_start_date,
          contract_end_date: companyData.contract_end_date,
          contract_progress: companyData.contract_progress,
          b2b_interest_via: companyData.b2b_interest_via,
          terms_agreed: companyData.terms_agreed,
          contract_sent: companyData.contract_sent,
          contract_signed: companyData.contract_signed,
          invoice_raised: companyData.invoice_raised,
          payment_complete: companyData.payment_complete,
          restrict_company: companyData.restrict_company,
          shuru_usage: companyData.shuru_usage,
          currency: companyData.currency,
          company_type: companyData.company_type,
          other_admin_emails: companyData.other_admin_emails?.split(','),
          peap_usage: companyData.peap_usage,
          plan: companyData.plan,
          vatTax: companyData.vat_tax === 'true' ? true : false,
          discount: companyData.discount,
          auto_renew: companyData.auto_renew,
          trial,
          trialDays,
          paymentCheck: check,
          product: stripePlan,
          b2bPlan: companyData.b2bPlan,

          introduce_by: companyData.introduce_by
        };
        if (companyData.company_email.trim() !== email.trim()) {
          data.company_email = companyData.company_email?.trim();
        }
        if (companyData.logoUpdated) {
          data.company_logo = image?.type ? getFileType(image) : '';
        }
        Api.addCompany(data)
          .then((response) => {
            setLoader(false);
            if (response.status === 200) {
              if (companyData.logoUpdated) {
                if (response.data.meta.uploadURL) {
                  axios
                    .put(response.data.meta.uploadURL, image, {
                      headers: {
                        'content-type': `${image?.type?.split('/')[0]}/${
                          image?.name?.split('.')[1]
                        }`
                      }
                    })
                    .then((response) => {
                      successToast('Company is updated successfully !');
                      navigate(-1);
                    })
                    .catch((err) => {
                      errorToast('Something went wrong with image upload !');
                      navigate(-1);
                    });
                }
              } else {
                successToast('Company is updated successfully !');
                navigate(-1);
              }
            }
          })
          .catch((err) => {
            setLoader(false);
          });
      } else {
        let stripePlan = getCurrentStripePlan();

        let otherAdminEmails =
          companyData.other_admin_emails.length > 0
            ? companyData.other_admin_emails?.split(',')
            : [];
        const data = {
          company_logo: image?.type ? getFileType(image) : null,
          company_name: companyData.company_name,
          company_email: companyData.company_email,
          company_address: companyData.company_address,
          contact_person: companyData.contact_person,
          contact_number: number,
          no_of_seat_bought: companyData.no_of_seat_bought,
          seat_price: companyData.seat_price,
          seat_active: companyData.seat_active,
          salesman: companyData.salesman,
          contract_start_date: companyData.contract_start_date,
          contract_end_date: companyData.contract_end_date,
          contract_progress: companyData.contract_progress,
          b2b_interest_via: companyData.b2b_interest_via,
          terms_agreed: companyData.terms_agreed,
          contract_sent: companyData.contract_sent,
          contract_signed: companyData.contract_signed,
          invoice_raised: companyData.invoice_raised,
          payment_complete: companyData.payment_complete,
          restrict_company: companyData.restrict_company,
          currency: companyData.currency,
          company_type: companyData.company_type,
          other_admin_emails: otherAdminEmails,
          shuru_usage: companyData.shuru_usage,
          peap_usage: companyData.peap_usage,
          plan: companyData.plan,
          vatTax: companyData.vat_tax === 'true' ? true : false,
          discount: companyData.discount,
          auto_renew: companyData.auto_renew,
          trial,
          trialDays,
          paymentCheck: check,
          product: stripePlan,
          b2bPlan: companyData.b2bPlan,
          introduce_by: companyData.introduce_by
        };
        Api.addCompany(data)
          .then((res) => {
            setLoader(false);
            if (res.status === 200) {
              if (res.data.meta.uploadURL) {
                axios
                  .put(res.data.meta.uploadURL, image, {
                    headers: {
                      'content-type': `${image?.type?.split('/')[0]}/${image?.name?.split('.')[1]}`
                    }
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      successToast('Company is created successfully !');
                      navigate(-1);
                    }
                  })
                  .catch((err) => {
                    errorToast('Something went wrong with image upload !');
                  });
              } else {
                successToast('Company is created successfully !');
                navigate(-1);
              }
            }
          })
          .catch((err) => {
            setLoader(false);
          });
      }
      setLoader(false);
    }
  };

  const handleSelectContractStartRange = (e) => {
    setShowContractStartCalendar(false);
    setContractStartDate(formatDate(e));
    setCompanyData({
      ...companyData,
      contract_start_date: formatDate(e)
    });
  };

  const handleSelectContractEndRange = (e) => {
    setShowContractEndCalendar(false);
    setContractEndDate(formatDate(e));
    setCompanyData({
      ...companyData,
      contract_end_date: formatDate(e)
    });
  };

  useOutsideClick(calendarStartRef, () => {
    if (showContractStartCalendar) setShowContractStartCalendar(!showContractStartCalendar);
  });

  useOutsideClick(calendarEndRef, () => {
    if (showContractEndCalendar) setShowContractEndCalendar(!showContractEndCalendar);
  });

  const calculatePrice = () => {
    let startDate = new Date(companyData.contract_start_date);
    let endDate = new Date(companyData.contract_end_date);
    let differenceInMillis = endDate - startDate;
    let differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);
    let differenceInMonths = differenceInDays / 30;
    let contract_length = Math.round(differenceInMonths);

    let amount = companyData.seat_price * companyData.no_of_seat_bought;
    amount = amount * parseInt(contract_length);

    if (companyData.vat_tax === 'true') {
      amount = amount + Math.round((amount * 20) / 100);
    }

    if (companyData.plan && companyData.discount) {
      amount = amount - (amount * companyData.discount) / 100;
    }
    setAmount(Math.round(amount));
  };

  const calculateSecondPrice = () => {
    let amt = companyData.seat_price * companyData.no_of_seat_bought;

    if (companyData.plan && companyData.discount) {
      amt = amt - (amt * companyData.discount) / 100;
    }

    if (companyData.vat_tax === 'true') {
      amt = amt + Math.round((amt * 20) / 100);
    }

    if (companyData.plan === 'Monthly') {
      amt = amt;
    } else if (companyData.plan === 'Semi Annual') {
      amt = amt * 6;
    } else if (companyData.plan === 'Annual') {
      amt = amt * 12;
    } else if (companyData.plan === 'One Time') {
      amt = amount;
    }

    setSecondaryAmount(Math.round(amt));
  };

  useEffect(() => {
    calculatePrice();
    calculateSecondPrice();
  }, [
    companyData.plan,
    companyData.product,
    companyData.contract_length,
    companyData.vat_tax,
    companyData.discount,
    companyData.contract_end_date,
    companyData.contract_start_date,
    b2bPlan,
    product,
    companyData.no_of_seat_bought,
    companyData.seat_price
  ]);

  const getCurrentStripePlan = () => {
    let stripePlan = '';
    switch (companyData.b2bPlan) {
      case 'com.shoorah.teamplan':
        {
          switch (companyData.plan) {
            case 'Monthly':
              {
                let plan = TEAM_PLAN_MONTHLY_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'Semi Annual':
              {
                let plan = TEAM_PLAN_SIXMONTHS_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'Annual':
              {
                let plan = TEAM_PLAN_ANNUAL_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'One Time':
              {
                let plan = TEAM_PLAN_ONE_TIME_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
          }
        }
        break;

      case 'com.shoorah.businessplan':
        {
          console.log('hserse');
          switch (companyData.plan) {
            case 'Monthly':
              {
                let plan = BUSINESS_PLAN_MONTHLY_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'Semi Annual':
              {
                console.log('slhdflasjh');
                console.log(companyData.seat_price);

                let plan = BUSINESS_PLAN_SIXMONTHS_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'Annual':
              {
                let plan = BUSINESS_PLAN_ANNUAL_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'One Time':
              {
                let plan = BUSINESS_PLAN_ONE_TIME_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
          }
        }
        break;

      case 'com.shoorah.corporateplan':
        {
          switch (companyData.plan) {
            case 'Monthly':
              {
                let plan = CORPORATE_PLAN_MONTHLY_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'Semi Annual':
              {
                let plan = CORPORATE_PLAN_SIXMONTHS_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'Annual':
              {
                let plan = CORPORATE_PLAN_ANNUAL_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'One Time':
              {
                let plan = CORPORATE_PLAN_ONE_TIME_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
          }
        }
        break;

      case 'com.shoorah.enterpriseplan':
        {
          switch (companyData.plan) {
            case 'Monthly':
              {
                let plan = ENTERPRICE_PLAN_MONTHLY_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'Semi Annual':
              {
                let plan = ENTERPRICE_PLAN_SIXMONTHS_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'Annual':
              {
                let plan = ENTERPRICE_PLAN_ANNUAL_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
            case 'One Time':
              {
                let plan = ENTERPRICE_PLAN_ONE_TIME_DROPDOWN.filter((item) => {
                  return item.name === companyData.seat_price;
                });
                stripePlan = plan.length ? plan[0]?.value : null;
              }
              break;
          }
        }
        break;
    }
    return stripePlan;
  };

  return (
    <div>
      {loader ? <Loader /> : null}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Users | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-4 mx-3 rounded-3xl p-4 bg-white dark:bg-shoorah-darkBgTabColor dark:text-white">
        <div className="flex flex-row items-center relative">
          <div className=" relative">
            <img
              loading='lazy'
              src={
                companyData?.company_logo && !companyData?.company_logo.includes('null')
                  ? companyData?.company_logo
                  : NOPhoto
              }
              className="h-[158px] w-[158px] rounded-lg"
            />
            <input
              type="file"
              id="file"
              className="absolute w-full h-full inset-0 cursor-pointer opacity-0 z-20"
              //   style={{ display: "none" }}
              name="image"
              accept="image/jpeg,image/jpg,image/png"
              multiple={false}
              data-original-title="upload photos"
              onChange={handleImageChange}
            />
          </div>
          <label htmlFor="file" or="file" className="ml-4">
            <PencilIcon className="text-[#3A47AB] w-[22px] h-[22px] inline cursor-pointer" />
            <input
              type="file"
              id="file"
              style={{ display: 'none' }}
              name="image"
              accept="image/jpeg,image/jpg,image/png"
              multiple={false}
              data-original-title="upload photos"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full justify-between rounded-lg mt-6">
                <span className="text-lg font-medium">Company Info</span>
                <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </DisclosureButton>
              <DisclosurePanel className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_name">
                    Company Name <span className="text-red-700">*</span>
                  </label>
                  <input
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    type="text"
                    value={companyData.company_name}
                    id="company_name"
                    name="company_name"
                    onChange={handleChange}
                    placeholder="Enter Name"
                  />
                  {valid.isSubmit && valid?.errors?.company_name && (
                    <span className="text-sm text-red-700">{valid?.errors?.company_name}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_address">
                    Company Address
                  </label>
                  <input
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    type="text"
                    value={companyData.company_address}
                    id="company_address"
                    name="company_address"
                    onChange={handleChange}
                    placeholder="Enter Address"
                  />
                  {valid.isSubmit && valid?.errors?.company_address && (
                    <span className="text-sm text-red-700">{valid?.errors?.company_address}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_email">
                    Company Email <span className="text-red-700">*</span>
                  </label>
                  <input
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    type="email"
                    value={companyData.company_email}
                    id="company_email"
                    name="company_email"
                    onChange={handleChange}
                    placeholder="Enter Email"
                  />
                  {valid.isSubmit && valid?.errors?.company_email && (
                    <span className="text-sm text-red-700">{valid?.errors?.company_email}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contact_person">
                    Contact Person
                  </label>
                  <input
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    type="text"
                    value={companyData.contact_person}
                    id="contact_person"
                    name="contact_person"
                    onChange={handleChange}
                    placeholder="Enter Person Name"
                  />
                  {valid.isSubmit && valid?.errors?.contact_person && (
                    <span className="text-sm text-red-700">{valid?.errors?.contact_person}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contact_number">
                    Contact Number
                  </label>
                  <PhoneInput
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    placeholder="Enter phone number"
                    name="contact_number"
                    value={number}
                    onChange={(e) => {
                      if (e) {
                        setNumber(e);
                      } else {
                        setNumber('');
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_type">
                    Select Company Type
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    value={companyData?.company_type}
                    onChange={handleChange}
                    id="company_type"
                    name="company_type"
                  >
                    <option value={''} disabled>
                      Select the companyType
                    </option>
                    {CompanyTypeData.map((e, index) => (
                      <option key={index} value={e.toLowerCase()}>
                        {e}
                      </option>
                    ))}
                  </select>
                  {valid.isSubmit && valid?.company_type && <span>{valid.company_type}</span>}
                </div>

                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="other_admin_emails">
                    Other Admin Emails
                    <span className="ml-2 text-xs">{'(Seperated by ,)'}</span>
                  </label>
                  <input
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    type="text"
                    value={companyData.other_admin_emails}
                    id="other_admin_emails"
                    name="other_admin_emails"
                    onChange={handleChange}
                    placeholder="Enter Emails"
                  />
                  {valid.isSubmit && valid?.errors?.other_admin_emails && (
                    <span className="text-sm text-red-700">
                      {valid?.errors?.other_admin_emails}
                    </span>
                  )}
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full justify-between rounded-lg mt-6">
                <span className="text-lg font-medium">Seats Details</span>
                <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </DisclosureButton>
              <DisclosurePanel className="grid w-full gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="no_of_seat_bought">
                    Number of Seats Bought <span className="text-red-700">*</span>
                  </label>
                  <input
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    min={0}
                    type="number"
                    value={companyData.no_of_seat_bought}
                    id="no_of_seat_bought"
                    name="no_of_seat_bought"
                    onChange={handleChange}
                    placeholder="Enter no of seat bought"
                  />
                  {valid.isSubmit && valid?.errors?.no_of_seat_bought && (
                    <span className="text-sm text-red-700">{valid?.errors?.no_of_seat_bought}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="b2b_plan">
                    B2B Plan <span className="text-red-700">*</span>
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    value={companyData.b2bPlan}
                    onChange={(e) => {
                      setB2BPlan(e.target.value);
                      setCompanyData({
                        ...companyData,
                        b2bPlan: e.target.value
                      });
                    }}
                    id="b2b_plan"
                    name="b2b_plan"
                  >
                    <option value={''} disabled>
                      Select
                    </option>
                    {B2BPLANS.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.name} ( {e.size} )
                      </option>
                    ))}
                  </select>
                  {valid.isSubmit && valid?.errors?.b2bplan && (
                    <span className="text-sm text-red-700">{valid?.errors?.b2bplan}</span>
                  )}
                </div>

                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="plan">
                    Payment Plan <span className="text-red-700">*</span>
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    value={companyData?.plan}
                    onChange={handleChange}
                    id="plan"
                    name="plan"
                  >
                    <option value={''} disabled>
                      Select Plan
                    </option>
                    <option value={'Monthly'}>Monthly Subscription</option>
                    <option value={'Semi Annual'}>Semi Annual Subscription</option>
                    <option value={'Annual'}>Annual Subscription</option>
                    <option value={'One Time'}>One Time Subscription</option>
                  </select>
                  {valid.isSubmit && valid?.errors?.plan && (
                    <span className="text-sm text-red-700">{valid?.errors?.plan}</span>
                  )}
                </div>

                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="seat_price">
                    Per Seat Price <span className="text-red-700">*</span>
                  </label>

                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    value={companyData.product}
                    // onChange={handleChange}
                    onChange={(e) => {
                      setProduct(e.target.value);
                      setCompanyData({
                        ...companyData,
                        seat_price: e.target.selectedIndex + 1,
                        product: e.target.value
                      });
                    }}
                    id="seat_price"
                    name="seat_price"
                  >
                    {planList.map((x) => (
                      <option key={x.value} value={x.value}>
                        {x.name}
                      </option>
                    ))}
                  </select>
                  {valid.isSubmit && valid?.errors?.seat_price && (
                    <span className="text-sm text-red-700">{valid?.errors?.seat_price}</span>
                  )}
                </div>

                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="vat_tax">
                    Vat Tax Apply ( 20 %)
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    value={companyData?.vat_tax}
                    onChange={handleChange}
                    id="vat_tax"
                    name="vat_tax"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                  {valid.isSubmit && valid?.vat_tax && <span>{valid.vat_tax}</span>}
                </div>

                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="discount">
                    Discount
                  </label>
                  <input
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    min={0}
                    type="number"
                    value={companyData?.discount}
                    id="discount"
                    name="discount"
                    onChange={handleChange}
                    placeholder="Enter no of seat bought"
                  />
                  {valid.isSubmit && valid?.discount && (
                    <span className="text-sm text-red-700">{valid?.discount}</span>
                  )}
                </div>

                <div className="flex justify-evenly mt-3">
                  <div className="flex flex-col justify-between mt-3">
                    <label className="text-sm font-normal mb-2" htmlFor="Total Price to Pay">
                      Total Amount
                    </label>
                    <p className="text-lg font-normal mb-2">
                      {secondaryAmount}
                      <span className="text-sm text-[green]  font-normal mb-2">
                        {companyData.discount > 0
                          ? `  (${companyData.discount}% discounted)`
                          : null}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col justify-between mt-3">
                    <label className="text-sm font-normal mb-2" htmlFor="Total Price to Pay">
                      Total Contract Amount
                    </label>
                    <p className="text-lg font-normal mb-2">
                      {amount}

                      <span className="text-sm text-[green]  font-normal mb-2">
                        {companyData.discount > 0
                          ? `  (${companyData.discount}% discounted)`
                          : null}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex  self-end py-2">
                  <p className="text-lg  flex gap-x-3 font-normal">
                    <input
                      type="checkbox"
                      name="check"
                      className="cursor-pointer rounded border-gray-300 accent-shoorah-primary"
                      checked={check}
                      onChange={(e) => setCheck(e.target.checked)}
                    />
                    <label
                      title="By enabling this, subscription details will only update details. so that it will not affect current plan subscription or trial."
                      className="text-sm font-normal "
                      htmlFor="check"
                    >
                      Only Update Subscription Details
                    </label>
                  </p>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full justify-between rounded-lg mt-6">
                <span className="text-lg font-medium">Contract Details</span>
                <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </DisclosureButton>
              <DisclosurePanel className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
                <div className="flex flex-col justify-between mt-3">
                  <div className="flex w-full flex-col justify-between">
                    <label className="text-sm font-normal mb-2" htmlFor="contract_start_date">
                      Contract Start Date <span className="text-red-700">*</span>
                    </label>
                    <div className="relative w-full pr-4 mt-3 bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-md border px-1">
                      <div
                        onClick={() => setShowContractStartCalendar((state) => !state)}
                        className={`px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none rounded-md h-10`}
                      >
                        {contractStartDate ? (
                          contractStartDate
                        ) : (
                          <div className="text-gray-400"> Contract Start Date</div>
                        )}
                      </div>
                      <Transition
                        show={showContractStartCalendar}
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div
                          className="absolute left-0 scale-y-[70%] scale-x-[80%] md:scale-x-[100%] md:scale-y-[90%]  bottom-0 z-50 mx-auto mt-2  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          ref={calendarStartRef}
                        >
                          <Calendar
                            date={
                              contractStartDate
                                ? new Date(contractStartDate)
                                : new Date(contractStartMinDate)
                            }
                            onChange={handleSelectContractStartRange}
                            maxDate={addYears(new Date(), 100)}
                            minDate={addMonths(new Date(), -1)}
                          />
                        </div>
                      </Transition>
                    </div>
                  </div>
                  {valid.isSubmit && valid?.errors?.contract_start_date && (
                    <span className="text-sm text-red-700">
                      {valid?.errors?.contract_start_date}
                    </span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <div className="flex w-full flex-col justify-between">
                    <label className="text-sm font-normal mb-2" htmlFor="contract_start_date">
                      Contract End Date <span className="text-red-700">*</span>
                    </label>
                    <div className="relative w-full pr-4 mt-3 bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-md border px-1">
                      <div
                        onClick={() => setShowContractEndCalendar((state) => !state)}
                        className={`px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none rounded-md h-10`}
                      >
                        {contractEndDate ? (
                          contractEndDate
                        ) : (
                          <div className="text-gray-400"> Contract End Date</div>
                        )}
                      </div>
                      <Transition
                        show={showContractEndCalendar}
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div
                          className="absolute left-0 scale-y-[70%] scale-x-[80%] md:scale-x-[100%] md:scale-y-[90%]  bottom-0 z-50 mx-auto mt-2  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          ref={calendarEndRef}
                        >
                          <Calendar
                            date={contractEndDate ? new Date(contractEndDate) : new Date()}
                            onChange={handleSelectContractEndRange}
                            maxDate={addYears(new Date(), 100)}
                            minDate={new Date()}
                          />
                        </div>
                      </Transition>
                    </div>
                  </div>
                  {valid.isSubmit && valid?.errors?.contract_end_date && (
                    <span className="text-xs text-red-700">{valid?.errors?.contract_end_date}</span>
                  )}
                </div>

                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contract_length">
                    Contract Length
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={companyData?.contract_length}
                    onChange={handleChange}
                    id="contract_length"
                    name="contract_length"
                  >
                    <option key={0} value={-1} disabled>
                      NA
                    </option>
                    {MONTHS.map((e, i) => {
                      return (
                        <option key={i + 1} value={e.value}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                  {valid.isSubmit && valid?.contract_length && <span>{valid.contract_length}</span>}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contract_progress">
                    Contract Progress
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={companyData?.contract_progress}
                    onChange={handleChange}
                    id="contract_progress"
                    name="contract_progress"
                  >
                    <option value={true}>Signed</option>
                    <option value={false}>Under Negotiation</option>
                  </select>
                  {valid.isSubmit && valid?.contract_progress && (
                    <span>{valid.contract_progress}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="b2b_interest_via">
                    B2B Interest Via
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={companyData?.b2b_interest_via}
                    onChange={handleChange}
                    id="b2b_interest_via"
                    name="b2b_interest_via"
                  >
                    <option value={''} disabled>
                      Select
                    </option>
                    <option value={'website'}>Website</option>
                    <option value={'sales team'}>Sales Team</option>
                    <option value={'paid advertisement'}>Paid Advertisement</option>
                    <option value={'google'}>Google</option>
                    <option value={'facebook'}>Facebook</option>
                    <option value={'linkedin'}>Linkedin</option>
                  </select>
                  {valid.isSubmit && valid?.b2b_interest_via && (
                    <span>{valid.b2b_interest_via}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="terms_agreed">
                    Terms Agreed
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={companyData?.terms_agreed}
                    onChange={handleChange}
                    id="terms_agreed"
                    name="terms_agreed"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                  {valid.isSubmit && valid?.terms_agreed && <span>{valid.terms_agreed}</span>}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="salesman">
                    Salesman
                  </label>
                  <input
                    type="text"
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    value={companyData?.salesman}
                    onChange={handleChange}
                    id="salesman"
                    name="salesman"
                    placeholder="Enter the salesman name"
                  />

                  {valid.isSubmit && valid?.salesman && <span>{valid.salesman}</span>}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contract_sent">
                    Contract Sent
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={companyData?.contract_sent}
                    onChange={handleChange}
                    id="contract_sent"
                    name="contract_sent"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                  {valid.isSubmit && valid?.contract_sent && <span>{valid.contract_sent}</span>}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contract_signed">
                    Contract Signed
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={companyData?.contract_signed}
                    onChange={handleChange}
                    id="contract_signed"
                    name="contract_signed"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                  {valid.isSubmit && valid?.contract_signed && <span>{valid.contract_signed}</span>}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="invoice_raised">
                    Invoice Raised
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={companyData?.invoice_raised}
                    onChange={handleChange}
                    id="invoice_raised"
                    name="invoice_raised"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                  {valid.isSubmit && valid?.invoice_raised && <span>{valid.invoice_raised}</span>}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="payment_complete">
                    Payment Complete
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={companyData?.payment_complete}
                    onChange={handleChange}
                    id="payment_complete"
                    name="payment_complete"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                  {valid.isSubmit && valid?.payment_complete && (
                    <span>{valid.payment_complete}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contact_person">
                    Seats Active Live
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={companyData?.seat_active}
                    onChange={handleChange}
                    id="seat_active"
                    name="seat_active"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                  {valid.isSubmit && valid?.contact_person && <span>{valid.contact_person}</span>}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <div className="flex flex-row justify-between items-center">
                    <div>Restrict Company</div>
                    <Switch
                      checked={companyData.restrict_company}
                      onChange={() =>
                        setCompanyData({
                          ...companyData,
                          restrict_company: !companyData.restrict_company
                        })
                      }
                      className={`${
                        companyData.restrict_company ? 'bg-[#3FA349]' : 'bg-shoorah-grayText'
                      }
                                    relative inline-flex h-[30px] w-[58px] shrink-0 
                                    cursor-pointer rounded-full border-2 border-transparent 
                                    transition-colors duration-200 ease-in-out focus:outline-none 
                                    focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          companyData.restrict_company ? 'translate-x-7' : 'translate-x-0'
                        }
                                        pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full 
                                        bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  <div className="text-xs text-[#666666]  dark:text-white dark:border-none">
                    When made inactive will restrict all assigned users red message to speak to
                    company admin for assistance.
                  </div>
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <div className="flex flex-row justify-between items-center">
                    <div>Shuru Usage</div>
                    <Switch
                      checked={companyData.shuru_usage}
                      onChange={() =>
                        setCompanyData({
                          ...companyData,
                          shuru_usage: !companyData.shuru_usage
                        })
                      }
                      className={`${
                        companyData.shuru_usage ? 'bg-[#3FA349]' : 'bg-shoorah-grayText'
                      }
                                    relative inline-flex h-[30px] w-[58px] shrink-0 
                                    cursor-pointer rounded-full border-2 border-transparent 
                                    transition-colors duration-200 ease-in-out focus:outline-none 
                                    focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${companyData.shuru_usage ? 'translate-x-7' : 'translate-x-0'}
                                        pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full 
                                        bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  <div className="text-xs text-[#666666]  dark:text-white dark:border-none">
                    When made inactive will restrict all assigned users of this company unable to
                    use shuru.
                  </div>
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <div className="flex flex-row justify-between items-center">
                    <div>Peap Usage</div>
                    <Switch
                      checked={companyData.peap_usage}
                      onChange={() =>
                        setCompanyData({
                          ...companyData,
                          peap_usage: !companyData.peap_usage
                        })
                      }
                      className={`${companyData.peap_usage ? 'bg-[#3FA349]' : 'bg-shoorah-grayText'}
                                    relative inline-flex h-[30px] w-[58px] shrink-0 
                                    cursor-pointer rounded-full border-2 border-transparent 
                                    transition-colors duration-200 ease-in-out focus:outline-none 
                                    focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${companyData.peap_usage ? 'translate-x-7' : 'translate-x-0'}
                                        pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full 
                                        bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  <div className="text-xs text-[#666666]  dark:text-white dark:border-none">
                    When made inactive will restrict all assigned users of this company unable to
                    use peap.
                  </div>
                </div>

                <div className="flex flex-col justify-between mt-3">
                  <div className="flex flex-row justify-between items-center">
                    <div>
                      Auto Renew<span></span>
                    </div>
                    <Switch
                      checked={companyData.auto_renew}
                      onChange={() =>
                        setCompanyData({
                          ...companyData,
                          auto_renew: !companyData.auto_renew
                        })
                      }
                      className={`${companyData.auto_renew ? 'bg-[#3FA349]' : 'bg-shoorah-grayText'}
                                    relative inline-flex h-[30px] w-[58px] shrink-0 
                                    cursor-pointer rounded-full border-2 border-transparent 
                                    transition-colors duration-200 ease-in-out focus:outline-none 
                                    focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${companyData.auto_renew ? 'translate-x-7' : 'translate-x-0'}
                                        pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full 
                                        bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  <div className="text-xs text-[#666666]  dark:text-white dark:border-none">
                    When made inactive will not send auto update of contract dates and payment.
                  </div>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        {/* Trial Options  */}
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full justify-between rounded-lg mt-6">
                <span className="text-lg font-medium">Trial Options (optional)</span>
                <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </DisclosureButton>
              <DisclosurePanel className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
                <div className="flex flex-col justify-between mt-3">
                  <div className="flex flex-row justify-between items-center">
                    <div>
                      Trial Toggle<span></span>
                    </div>
                    <Switch
                      checked={trial}
                      onChange={() => setTrial(!trial)}
                      className={`${trial ? 'bg-[#3FA349]' : 'bg-shoorah-grayText'}
                                    relative inline-flex h-[30px] w-[58px] shrink-0 
                                    cursor-pointer rounded-full border-2 border-transparent 
                                    transition-colors duration-200 ease-in-out focus:outline-none 
                                    focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${trial ? 'translate-x-7' : 'translate-x-0'}
                                        pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full 
                                        bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  <div className="text-xs text-[#666666]  dark:text-white dark:border-none">
                    When made active add number of days to make them use dashboard for trial days.
                  </div>
                </div>

                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_type">
                    Select number of days
                  </label>
                  <select
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={trialDays}
                    onChange={(e) => {
                      setTrialDays(e.target.value);
                    }}
                    id="trial_days"
                    name="trial_days"
                  >
                    <option value={''} disabled>
                      Select days
                    </option>
                    {TRIAL_DAYS_COUNTS.map((e) => (
                      <option key={e.value} value={e.value}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
        <div className="flex items-center justify-center mt-4">
          <button
            className="bg-[#3A47AB] py-3 px-10 text-white w-[192px] h-[48px] rounded-md"
            onClick={handleClick}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
EditIntroduce.propTypes = {
  location: PropTypes.any
};
export default EditIntroduce;

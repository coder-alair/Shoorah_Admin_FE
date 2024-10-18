import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loader from '../../../../component/common/Loader';
import Breadcrumb from '../../../../component/common/Breadcrumb';
import {
  addMonthOnDate,
  currentDateWithFormat,
  errorToast,
  getFileType,
  getLocalStorageItem,
  monthDiff,
  successToast
} from '../../../../utils/helper';
import NOPhoto from '../../../../assets/images/no-photo.png';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import {
  ArrowUpIcon,
  ArrowUpOnSquareIcon,
  ChevronUpIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import PhoneInput from 'react-phone-number-input';
import { Api } from '../../../../api';
import AddCompanyValidation from '../../../../validation/AddCompanyVali';
import PropTypes from 'prop-types';
import 'react-phone-number-input/style.css';
import axios from 'axios';
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
  CompanyTypeData,
  ENTERPRICE_PLAN_ANNUAL_DROPDOWN,
  ENTERPRICE_PLAN_MONTHLY_DROPDOWN,
  ENTERPRICE_PLAN_ONE_TIME_DROPDOWN,
  ENTERPRICE_PLAN_SIXMONTHS_DROPDOWN,
  MONTHS,
  TEAM_PLAN_ANNUAL_DROPDOWN,
  TEAM_PLAN_MONTHLY_DROPDOWN,
  TEAM_PLAN_ONE_TIME_DROPDOWN,
  TEAM_PLAN_SIXMONTHS_DROPDOWN
} from '../../../../utils/constants';
import { CompanyApi } from '../../../../api/companyApi';

function MyCompany({ location }) {
  const navigate = useNavigate();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  let currentDate = currentDateWithFormat(new Date());
  let contlength = '1';
  const pages = [{ name: 'Edit Company', href: location?.pathname, current: true }];
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState(null);
  const [companyData, setCompanyData] = useState({
    company_logo: null,
    logoUpdated: false,
    company_name: '',
    company_email: '',
    company_address: '',
    contact_person: '',
    contact_number: '',
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
    company_type: '',
    plan: ''
  });
  const [valid, setValid] = useState({});
  const [number, setNumber] = useState('');
  const [subsData, setSubsData] = useState(null);
  const [seats, setSeats] = useState(1);
  const [plan, setPlan] = useState(B2BPLANS[0].value);
  const [selectedPlan, setSelectedPlan] = useState(B2BPLANS[0]);
  const [min, setMin] = useState(B2BPLANS[0].min);
  const [max, setMax] = useState(B2BPLANS[0].max);
  const [contractLength, setContractLength] = useState(1);
  const [payType, setPaytype] = useState('Monthly');
  const [paySeatsType, setPaySeatstype] = useState('One Time');
  const [seatsAdd, setSeatsAdd] = useState(1);
  const [maxIncr, setMaxIncr] = useState(1);
  const [seatMax, setSeatMax] = useState(false);
  const [product, setProduct] = useState(TEAM_PLAN_MONTHLY_DROPDOWN[6].value);
  const [autoRenewSub, setAutoRenewSub] = useState(false);

  const handleImageChange = (event) => {
    if (event?.target?.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.name.match(/\.(jpg|jpeg|png)$/i)) {
        errorToast(
          `The specified file ${file.name} could not be uploaded. Please upload a valid image.`
        );
      } else if (file.size > 1048576) {
        errorToast(`File size should be less than 1MB`);
      } else {
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
      }
    } else if (name === 'no_of_seat_bought') {
      if (companyData.previousSeat <= value) {
        setCompanyData({ ...companyData, [name]: value });
      }
    } else {
      setCompanyData({ ...companyData, [name]: value });
    }
  };

  const handleClick = () => {
    if (userData?.userType === 4) {
      errorToast('Sub Admin cannot edit company details');
      return;
    }
    const validate = AddCompanyValidation(companyData);
    setValid({
      ...valid,
      isSubmit: true,
      errors: validate.errors,
      isValid: validate.isValid
    });
    if (!validate.isValid) {
      errorToast('Please correct the errors before submitting.');
      return;
    }
    if (!isValidPhoneNumber(number)) {
      errorToast('Invalid phone number.');
      return;
    }
    if (!companyData.company_logo) {
      errorToast('Company logo is mandatory !');
      return;
    }

    setLoader(true);
    const data = {
      company_address: companyData.company_address?.trim(),
      contact_person: companyData.contact_person?.trim(),
      contact_number: number,
      payment_complete: companyData.payment_complete
    };
    if (companyData.logoUpdated) {
      data.company_logo = image?.type ? getFileType(image) : '';
    }
    if (companyData.previousSeat < companyData.no_of_seat_bought) {
      data.no_of_seat_bought = companyData.no_of_seat_bought;
    }
    Api.editCompany(data, userData.companyId)
      .then((response) => {
        setLoader(false);
        if (response.status === 200) {
          if (companyData.logoUpdated) {
            if (response.data.meta.uploadURL) {
              axios
                .put(response.data.meta.uploadURL, image, {
                  headers: {
                    'content-type': `${image?.type?.split('/')[0]}/${image?.name?.split('.')[1]}`
                  }
                })
                .then((response) => {
                  successToast('Company is updated successfully !');
                  window?.location.reload();
                })
                .catch((err) => {
                  errorToast('Something went wrong with image upload !');
                });
            }
          } else {
            successToast('Company is updated successfully !');
          }
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const handleBuy = () => {
    console.log('userType', userData?.userType);
    if (userData?.userType === 4) {
      errorToast('Sub Admin cannot edit company details');
      return;
    }
    if (selectedPlan.value === 'com.shoorah.teamplan') {
      if (payType === 'Monthly') {
        setProduct(TEAM_PLAN_MONTHLY_DROPDOWN[6].value);
      } else if (payType === 'Semi Annual') {
        setProduct(TEAM_PLAN_SIXMONTHS_DROPDOWN[6].value);
      } else if (payType === 'Annual') {
        setProduct(TEAM_PLAN_ANNUAL_DROPDOWN[6].value);
      } else if (payType === 'One Time') {
        setProduct(TEAM_PLAN_ONE_TIME_DROPDOWN[6].value);
      }
    } else if (selectedPlan.value === 'com.shoorah.businessplan') {
      if (payType === 'Monthly') {
        setProduct(BUSINESS_PLAN_MONTHLY_DROPDOWN[4].value);
      } else if (payType === 'Semi Annual') {
        setProduct(BUSINESS_PLAN_SIXMONTHS_DROPDOWN[4].value);
      } else if (payType === 'Annual') {
        setProduct(BUSINESS_PLAN_ANNUAL_DROPDOWN[4].value);
      } else if (payType === 'One Time') {
        setProduct(BUSINESS_PLAN_ONE_TIME_DROPDOWN[4].value);
      }
    } else if (selectedPlan.value === 'com.shoorah.corporateplan') {
      if (payType === 'Monthly') {
        setProduct(CORPORATE_PLAN_MONTHLY_DROPDOWN[3].value);
      } else if (payType === 'Semi Annual') {
        setProduct(CORPORATE_PLAN_SIXMONTHS_DROPDOWN[3].value);
      } else if (payType === 'Annual') {
        setProduct(CORPORATE_PLAN_ANNUAL_DROPDOWN[3].value);
      } else if (payType === 'One Time') {
        setProduct(CORPORATE_PLAN_ONE_TIME_DROPDOWN[3].value);
      }
    } else if (selectedPlan.value === 'com.shoorah.enterpriseplan') {
      if (payType === 'Monthly') {
        setProduct(ENTERPRICE_PLAN_MONTHLY_DROPDOWN[2].value);
      } else if (payType === 'Semi Annual') {
        setProduct(ENTERPRICE_PLAN_SIXMONTHS_DROPDOWN[2].value);
      } else if (payType === 'Annual') {
        setProduct(ENTERPRICE_PLAN_ANNUAL_DROPDOWN[2].value);
      } else if (payType === 'One Time') {
        setProduct(ENTERPRICE_PLAN_ONE_TIME_DROPDOWN[2].value);
      }
    }

    let payload = {
      seats,
      contractLength,
      plan: selectedPlan,
      payType,
      productId: product
    };
    CompanyApi.getPaymentIntend(payload)
      .then((res) => {
        if (res?.data?.meta?.code === 1) {
          window.location.href = res?.data?.data?.url;
        }
      })
      .catch((err) => console.log(err));
  };

  const handlePlanChange = (event) => {
    const selectedValue = event.target.value;
    const selectedPlan = B2BPLANS.find((plan) => plan.value === selectedValue);
    setSelectedPlan(selectedPlan);
    if (selectedPlan) {
      if (
        companyData.no_of_seat_bought >= selectedPlan?.min &&
        companyData.no_of_seat_bought < selectedPlan?.max
      ) {
        // setSeats(companyData?.no_of_seat_bought);
      } else if (companyData.no_of_seat_bought > selectedPlan?.max) {
        setSeats(selectedPlan?.max);
      } else {
        setSeats(selectedPlan?.min);
      }
    }
  };

  useEffect(() => {
    setLoader(true);
    Api.getCompanyData(userData?.companyId)
      .then((res) => {
        setLoader(false);
        if (res.data?.meta?.code === 1) {
          const company = res.data?.data;
          setCompanyData({
            company_logo: company.company_logo,
            company_name: company.company_name,
            company_email: company.company_email,
            company_address: company.company_address,
            contact_person: company.contact_person,
            contact_number: company.contact_number,
            no_of_seat_bought: company.no_of_seat_bought,
            seat_price: company.seat_price,
            seat_active: company.seat_active,
            contract_start_date: currentDateWithFormat(new Date(company.contract_start_date)),
            contract_end_date: currentDateWithFormat(new Date(company.contract_end_date)),
            contract_length: monthDiff(
              new Date(company.contract_start_date),
              new Date(company.contract_end_date)
            ),
            contract_progress: company.contract_progress,
            b2b_interest_via: company.b2b_interest_via,
            terms_agreed: company.terms_agreed,
            contract_sent: company.contract_sent,
            contract_signed: company.contract_signed,
            invoice_raised: company.invoice_raised,
            payment_complete: company.payment_complete,
            restrict_company: company.restrict_company,
            previousSeat: company.no_of_seat_bought,
            company_type: company.company_type,
            activeUsersCount: company.activeUsersCount,
            inactiveUsersCount: company.inactiveUsersCount,
            plan: company.plan
          });
          setNumber(company.contact_number);
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  }, []);

  const getCompanyPlanData = () => {
    CompanyApi.getCompanyStatus(userData.companyId)
      .then((res) => {
        if (res?.data?.meta.code === 1) {
          setSubsData(res?.data?.data);
          if (res.data.data.productId) {
            const selectedPlan = B2BPLANS.find((plan) => plan.value === res.data.data.productId);
            setSelectedPlan(selectedPlan);
            setAutoRenewSub(res?.data?.data?.autoRenew);
            setMin(selectedPlan.min);
            setMax(selectedPlan.max);
            if (selectedPlan) {
              if (
                companyData?.no_of_seat_bought >= selectedPlan?.min &&
                companyData?.no_of_seat_bought < selectedPlan?.max
              ) {
                setSeats(companyData?.no_of_seat_bought);
              } else {
                setSeats(selectedPlan?.min);
              }
            }
          } else {
            setSelectedPlan(B2BPLANS[0]);
            if (selectedPlan) {
              if (
                companyData.no_of_seat_bought >= selectedPlan?.min &&
                companyData.no_of_seat_bought < selectedPlan?.max
              ) {
                setSeats(companyData?.no_of_seat_bought);
              } else {
                setSeats(selectedPlan?.min);
              }
            }
          }
        } else {
          return errorToast('Something went wrong');
        }
      })
      .catch((err) => {
        return errorToast(err);
      });
  };

  useEffect(() => {
    getCompanyPlanData();
  }, []);

  useEffect(() => {
    if (seats <= 50) {
      setSelectedPlan(B2BPLANS[0]);
    } else if (seats >= 51 && seats <= 200) {
      setSelectedPlan(B2BPLANS[1]);
    } else if (seats >= 201 && seats <= 1000) {
      setSelectedPlan(B2BPLANS[2]);
    } else if (seats >= 1001) {
      setSelectedPlan(B2BPLANS[3]);
    }
  }, [seats]);

  useEffect(() => {
    let max = Math.ceil((companyData.no_of_seat_bought * 20) / 100);
    if (companyData.no_of_seat_bought) {
      setMaxIncr(max);
    }
    if (subsData?.trialPurchase) {
      // setSeatMax(true);
    }
  }, [companyData, subsData]);

  const handleSeatAdd = () => {
    if (userData?.userType === 4) {
      errorToast('Sub Admin cannot edit company details');
      return;
    }
    let currDate = new Date();
    let endDate = new Date(companyData.contract_end_date);
    let diffInMilliseconds = endDate - currDate;
    let diffInMonths = diffInMilliseconds / (1000 * 60 * 60 * 24 * 30.44);
    let months = 1;
    let roundedDiffInMonths = Math.ceil(diffInMonths);
    let price = TEAM_PLAN_ONE_TIME_DROPDOWN[6].value;
    price = TEAM_PLAN_ONE_TIME_DROPDOWN.filter((price) => {
      return price.name.toLowerCase().includes(companyData.seat_price);
    });

    months = diffInMonths;
    // if (subsData.priceId) {
    //   price = subsData.priceId;
    // }

    let payload = {
      price: price[0]?.value || TEAM_PLAN_ONE_TIME_DROPDOWN[6].value,
      months,
      seats: seatsAdd,
      plan: selectedPlan,
      payType: paySeatsType
      // year: roundedDiffInMonths
    };
    CompanyApi.getPaymentSeatIntend(payload)
      .then((res) => {
        if (res?.data?.meta?.code === 1) {
          window.location.href = res?.data?.data?.url;
        }
      })
      .catch((err) => console.log(err));
  };

  const handlesRenew = () => {
    CompanyApi.resetAutoRenew()
      .then((res) => {
        if (res?.data?.meta?.code === 1) {
          successToast('Auto Renew Off');
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {loader ? <Loader /> : null}
      <Helmet>
        <meta charSet="utf-8" />
        <title>My Company | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-4 mx-3 rounded-3xl p-4 dark:bg-shoorah-darkBgTabColor dark:text-white bg-white">
        <div className="flex flex-row items-center">
          <img
            loading='lazy'
            src={companyData?.company_logo ? companyData?.company_logo : NOPhoto}
            className="h-[158px] w-[158px] object-cover object-center rounded-full"
          />
          <label onClick={handleImageChange} htmlFor="file" className="ml-4">
            <PencilIcon className="text-[#3A47AB] dark:text-white w-[22px] h-[22px] inline cursor-pointer" />
          </label>
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
                    Company Name
                  </label>
                  <input
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    type="text"
                    value={companyData.company_name}
                    id="company_name"
                    name="company_name"
                    placeholder="Enter Name"
                    disabled
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
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
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
                  <label className="text-sm font-normal mb-2" htmlFor="contact_person">
                    Company Person
                  </label>
                  <input
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    type="text"
                    value={companyData.contact_person}
                    id="contact_person"
                    name="contact_person"
                    placeholder="Enter Person Name"
                    disabled
                  />
                  {valid.isSubmit && valid?.errors?.contact_person && (
                    <span className="text-sm text-red-700">{valid?.errors?.contact_person}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_email">
                    Company Email
                  </label>
                  <input
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    type="email"
                    value={companyData.company_email}
                    id="company_email"
                    name="company_email"
                    placeholder="Enter Email"
                    disabled
                  />
                  {valid.isSubmit && valid?.errors?.company_email && (
                    <span className="text-sm text-red-700">{valid?.errors?.company_email}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contact_number">
                    Company Number
                  </label>
                  <PhoneInput
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
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
                  {valid.isSubmit && !isValidPhoneNumber(number) && (
                    <span className="text-sm text-red-700">
                      Please enter a valid contact number
                    </span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_type">
                    Select Company Type
                  </label>
                  <select
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    value={companyData?.company_type}
                    onChange={handleChange}
                    id="company_type"
                    name="company_type"
                  >
                    <option value={''} disabled>
                      Select the companyType
                    </option>
                    {CompanyTypeData.map((e) => (
                      <option key={e.at} value={e.toLowerCase()}>
                        {e}
                      </option>
                    ))}
                  </select>
                  {valid.isSubmit && valid?.company_type && <span>{valid.company_type}</span>}
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
              <DisclosurePanel className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="no_of_seat_bought">
                    Number of Seats Bought
                  </label>
                  <input
                    disabled
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    min={0}
                    type="number"
                    value={companyData.no_of_seat_bought}
                    id="no_of_seat_bought"
                    name="no_of_seat_bought"
                    onChange={handleChange}
                    placeholder="Enter no of seat bought"
                  />
                  {valid.isSubmit && valid?.no_of_seat_bought && (
                    <span className="text-sm text-red-700">{valid?.no_of_seat_bought?.text}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="no_of_seat_bought">
                    Number of Active Seats
                  </label>
                  <input
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    disabled
                    min={0}
                    type="number"
                    value={companyData.activeUsersCount}
                    id="activeUsersCount"
                    name="activeUsersCount"
                    onChange={handleChange}
                    placeholder="Enter no of active users count"
                  />
                  {valid.isSubmit && valid?.activeUsersCount && (
                    <span className="text-sm text-red-700">{valid?.activeUsersCount?.text}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="no_of_seat_bought">
                    Number of In-active Seats
                  </label>
                  <input
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    disabled
                    min={0}
                    type="number"
                    value={companyData?.inactiveUsersCount}
                    id="inactiveUsersCount"
                    name="inactiveUsersCount"
                    onChange={handleChange}
                    placeholder="Enter no of in-active users count"
                  />
                  {valid.isSubmit && valid?.inactiveUsersCount && (
                    <span className="text-sm text-red-700">{valid?.inactiveUsersCount?.text}</span>
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
                <span className="text-lg font-medium">Contract Details</span>
                <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </DisclosureButton>
              <DisclosurePanel className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contract_start_date">
                    Contract Start Date
                  </label>
                  <input
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    min={currentDateWithFormat(new Date())}
                    type="date"
                    value={companyData.contract_start_date}
                    id="contract_start_date"
                    name="contract_start_date"
                    disabled
                    placeholder="Enter no of seat bought"
                  />
                  {valid.isSubmit && valid?.contract_start_date && (
                    <span className="text-sm text-red-700">{valid?.contract_start_date?.text}</span>
                  )}
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contract_end_date">
                    Contract End Date
                  </label>
                  <input
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    min={currentDateWithFormat(new Date())}
                    type="date"
                    value={companyData.contract_end_date}
                    id="contract_end_date"
                    name="contract_end_date"
                    disabled
                    placeholder="Enter Price $"
                  />
                  {valid.isSubmit && valid?.contract_end_date && (
                    <span>{valid.contract_end_date.text}</span>
                  )}
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
        <div className="flex items-center justify-center mt-4">
          <button className="bg-[#3A47AB] py-3 px-10 text-white rounded-md" onClick={handleClick}>
            Save
          </button>
        </div>
      </div>

      <div className="mt-2 mx-3 rounded-3xl p-4 dark:bg-shoorah-darkBgTabColor dark:text-white bg-white">
        <h1 className="font-[500] text-lg w-full">Subscription Info</h1>
        {subsData?.account === 'Trial' ? (
          <p className="text-md font-[400]">
            We hope that Shoorah has supported you during your trial and to continue to use the
            Shoorah suite, please purchase your seats (licenses) below.
          </p>
        ) : subsData?.account === 'Expired' ? (
          <p className="text-md font-[400]">
            Current Plan is Expired. For using shoorah dasboard start buying shoorah subscription.
          </p>
        ) : (
          <>
            {!subsData?.firstPurchase ? (
              <p className="text-md font-[400]">
                You can buy “out of contract and cancel any time” Up to 20% of your original order
                value, IE: Original order 100 seats means you can buy 20 more making the total 120.
              </p>
            ) : (
              <p className="text-sm py-3">
                First Order purchase is added to your account for more purchase contact sales.{' '}
              </p>
            )}
          </>
        )}

        <p className="text-sm font-[400] text-gray-400">
          For price correction or information on your license growth please speak to sales, on:{' '}
          <span className="text-[#3a47ab]">info@shoorah.io</span>
        </p>

        {subsData?.account !== 'Subscribed' && (
          <div>
            <div className="flex flex-col justify-between mt-3">
              <label className="text-sm font-normal mb-2" htmlFor="company_type">
                Select Contract Length
              </label>
              <select
                className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                onChange={(e) => {
                  setContractLength(e.target.value);
                }}
                id="length"
                name="length"
              >
                <option value={''} disabled>
                  Select the Contract Length
                </option>
                <option key={1} value={1}>
                  1 year
                </option>
                <option key={2} value={2}>
                  2 year
                </option>
                <option key={3} value={3}>
                  3 year
                </option>
                <option key={4} value={4}>
                  4 year
                </option>
              </select>
            </div>

            <div className="flex flex-col justify-between mt-3">
              <label className="text-sm font-normal mb-2" htmlFor="company_type">
                Select Plan
              </label>
              <select
                className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                // value={selectedPlan?.value}
                onChange={handlePlanChange}
                id="plan_type"
                name="plan_type"
              >
                <option value={''} disabled>
                  Select the plan
                </option>
                {B2BPLANS.map((e) => (
                  <option value={e.value}>
                    {e.name} {'Plan '} {e.size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-between mt-3">
              <label className="text-sm font-normal mb-2" htmlFor="company_type">
                Select Pay type
              </label>
              <select
                className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                onChange={(e) => {
                  setPaytype(e.target.value);
                }}
                value={payType}
                id="pay_type"
                name="pay_type"
              >
                <option value={''} disabled>
                  Select the payment type
                </option>
                <option value={`Monthly`}>Monthly</option>
                <option value={`Semi Annual`}>Semi Annual</option>
                <option value={`Annually`}>Annually</option>
                <option value={`One Time`}>One Time</option>
              </select>
            </div>

            <div className="mt-[1rem]">
              <label className="">Add More Seats</label>
              <div className="flex justify-center mt-3">
                <div className="self-center">
                  <button
                    type="button"
                    className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                    onClick={() => {
                      if (seats > 1) {
                        setSeats(seats - 1);
                      }
                    }}
                  >
                    {' '}
                    -
                  </button>
                </div>
                <div className="flex justify-center items-center mx-4 dark:bg-shoorah-darkBgColor dark:text-white bg-white rounded-3xl w-[80px] h-[37px] text-shoorah-secondary">
                  <p className="m-0">{seats}</p>
                </div>
                <div className="self-center">
                  <button
                    type="button"
                    className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                    onClick={() => {
                      if (seats >= 1) {
                        setSeats(seats + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mt-4">
              <button onClick={handleBuy} className="bg-[#3A47AB] py-3 px-10 text-white rounded-md">
                Pay for seats
              </button>
            </div>
          </div>
        )}

        {subsData?.account === 'Subscribed' && (
          <div>
            {seatMax ? (
              <div>
                <p>Current plan seat limit exceed go with more better plan for more seats.</p>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_type">
                    Select Contract Length
                  </label>
                  <select
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    onChange={(e) => {
                      setContractLength(e.target.value);
                    }}
                    id="length"
                    name="length"
                  >
                    <option value={''} disabled>
                      Select the Contract Length
                    </option>
                    <option key={1} value={1}>
                      1 year
                    </option>
                    <option key={2} value={2}>
                      2 year
                    </option>
                    <option key={3} nvalue={3}>
                      3 year
                    </option>
                    <option key={4} value={4}>
                      4 year
                    </option>
                  </select>
                </div>

                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_type">
                    Select Plan
                  </label>
                  <select
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    // value={selectedPlan?.value}
                    onChange={handlePlanChange}
                    id="plan_type"
                    name="plan_type"
                  >
                    <option value={''} disabled>
                      Select the plan
                    </option>
                    {B2BPLANS.map((e) => (
                      <option value={e.value}>
                        {e.name} {'Plan '} {e.size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_type">
                    Select Pay type
                  </label>
                  <select
                    className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                    onChange={(e) => {
                      setPaytype(e.target.value);
                    }}
                    value={payType}
                    id="pay_type"
                    name="pay_type"
                  >
                    <option value={''} disabled>
                      Select the payment type
                    </option>
                    <option value={`Monthly`}>Monthly</option>
                    <option value={`Semi Annual`}>Semi Annual</option>
                    <option value={`Annually`}>Annually</option>
                    <option value={`One Time`}>One Time</option>
                  </select>
                </div>

                <div className="mt-[1rem]">
                  <label className="">Add More Seats</label>
                  <div className="flex justify-center mt-3">
                    <div className="self-center">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                        onClick={() => {
                          if (seats > 1) {
                            setSeats(seats - 1);
                          }
                        }}
                      >
                        {' '}
                        -
                      </button>
                    </div>
                    <div className="flex justify-center items-center mx-4 dark:bg-shoorah-darkBgColor dark:text-white bg-white rounded-3xl w-[80px] h-[37px] text-shoorah-secondary">
                      <p className="m-0">{seats}</p>
                    </div>
                    <div className="self-center">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                        onClick={() => {
                          if (seats >= 1) {
                            setSeats(seats + 1);
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center mt-4">
                  <button
                    onClick={handleBuy}
                    className="bg-[#3A47AB] py-3 px-10 text-white rounded-md"
                  >
                    Pay for seats
                  </button>
                </div>

                {autoRenewSub && (
                  <div className="flex items-center justify-center mt-4">
                    <button
                      onClick={handlesRenew}
                      className="bg-[#3A47AB] py-3 px-4 text-white rounded-md"
                    >
                      Cancel auto renew
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {!subsData?.firstPurchase ? (
                  <div>
                    <div className="flex flex-col justify-between mt-3">
                      <label className="text-sm font-normal mb-2" htmlFor="company_type">
                        Select Pay type
                      </label>
                      <select
                        className="border text-[#666666] border-[#F1F2F4] dark:bg-shoorah-darkBgColor dark:border-none dark:text-white rounded-md h-10 px-2"
                        onChange={(e) => {
                          setPaySeatstype(e.target.value);
                        }}
                        value={paySeatsType}
                        id="pays_type"
                        name="pays_type"
                      >
                        <option value={''} disabled>
                          Select the payment type
                        </option>
                        <option value={`One Time`} disabled>
                          One Time
                        </option>
                      </select>
                    </div>

                    <div className="mt-[1rem]">
                      <label className="">Add More Seats</label>
                      <div className="flex justify-center mt-3">
                        <div className="self-center">
                          <button
                            type="button"
                            className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                            onClick={() => {
                              if (seatsAdd > 1) {
                                setSeatsAdd(seatsAdd - 1);
                              }
                            }}
                          >
                            {' '}
                            -
                          </button>
                        </div>
                        <div className="flex justify-center items-center mx-4 dark:bg-shoorah-darkBgColor dark:text-white bg-white rounded-3xl w-[80px] h-[37px] text-shoorah-secondary">
                          <p className="m-0">{seatsAdd}</p>
                        </div>
                        <div className="self-center">
                          <button
                            type="button"
                            className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                            onClick={() => {
                              if (seatsAdd >= 1 && seatsAdd < maxIncr) {
                                setSeatsAdd(seatsAdd + 1);
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center mt-4">
                      <button
                        onClick={handleSeatAdd}
                        className="bg-[#3A47AB] py-3 px-10 text-white rounded-md"
                      >
                        Pay for seats
                      </button>
                    </div>

                    {autoRenewSub && (
                      <div className="flex items-center justify-center mt-4">
                        <button
                          onClick={handlesRenew}
                          className="bg-[#3A47AB] py-3 px-4 text-white rounded-md"
                        >
                          Cancel auto renew
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

MyCompany.propTypes = {
  location: PropTypes.any,
  computedMatch: PropTypes.any
};

export default MyCompany;

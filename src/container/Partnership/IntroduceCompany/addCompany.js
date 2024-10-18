import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import IntroduceCompanyValidation from '../../../validation/IntroduceCompanyValidation';
import Breadcrumb from '../../../component/common/Breadcrumb';
import { ChevronUpIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Disclosure, DisclosureButton, DisclosurePanel, Switch } from '@headlessui/react';
import { CompanyTypeData } from '../../../utils/constants';
import {
  addMonthOnDate,
  currentDateWithFormat,
  errorToast,
  getFileType,
  monthDiff,
  successToast
} from '../../../utils/helper';
import NOPhoto from '../../../assets/images/partner.jpeg';
import Loader from '../../../component/common/Loader';
import { PartnerApi } from '../../../api/partnerApi';

function IntroAddCompany(props) {
  let location = useLocation();
  const propsData = location?.state;
  const pages = [
    { name: 'Introduce Company', href: '/introduce', current: false },
    {
      name: `${propsData?.action === 'edit' ? 'Edit Company' : 'Add Company'}`,
      href: '/introduce/add-company',
      current: true
    }
  ];

  const navigate = useNavigate();
  let currentDate = currentDateWithFormat(new Date());
  let contlength = '1';
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
    email_intro_made: false,
    shuru_usage: true
  });
  const [valid, setValid] = useState({});
  const [number, setNumber] = useState('');

  useEffect(() => {
    if (propsData?._id) {
      setEmail(propsData?.company_email);
      setCompanyData({
        ...companyData,
        company_logo: propsData?.company_logo,
        company_name: propsData.company_name,
        company_email: propsData?.company_email,
        company_address: propsData.company_address,
        contact_person: propsData?.contact_person,
        contact_number: propsData?.contact_number,
        no_of_seat_bought: propsData?.no_of_seat_bought,
        seat_price: propsData?.seat_price,
        seat_active: propsData?.seat_active,
        contract_start_date: currentDateWithFormat(new Date(propsData?.contract_start_date)),
        contract_end_date: currentDateWithFormat(new Date(propsData?.contract_end_date)),
        contract_length: monthDiff(
          new Date(propsData?.contract_start_date),
          new Date(propsData?.contract_end_date)
        ),
        contract_progress: propsData?.contract_progress,
        b2b_interest_via: propsData?.b2b_interest_via,
        terms_agreed: propsData?.terms_agreed,
        contract_sent: propsData?.contract_sent,
        contract_signed: propsData?.contract_signed,
        invoice_raised: propsData?.invoice_raised,
        payment_complete: propsData?.payment_complete,
        restrict_company: propsData?.restrict_company,
        salesman: propsData?.salesman,
        currency: propsData?.currency ? propsData.currency : 'gbp',
        company_type: propsData?.company_type,
        email_intro_made: propsData?.email_intro_made,
        other_admin_emails: propsData?.other_admin_emails?.join(','),
        shuru_usage: propsData?.shuru_usage
      });
      setNumber(propsData?.contact_number ? propsData?.contact_number.toString() : '');
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
    } else if (
      event?.target?.files &&
      event.target.files.length > 0 &&
      event?.target?.files[0]?.size > 1048576
    ) {
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
      }
    } else {
      setCompanyData({ ...companyData, [name]: value });
    }
  };

  const handleClick = () => {
    console.log('I am here bro');
    const validate = IntroduceCompanyValidation(companyData);
    setValid({
      ...valid,
      isSubmit: true,
      errors: validate.errors,
      isValid: validate.isValid
    });

    if (validate.isValid) {
      setLoader(true);

      const data = {
        company_name: companyData.company_name?.trim(),
        company_address: companyData.company_address?.trim(),
        contact_person: companyData.contact_person?.trim(),
        contact_number: number,
        email_intro_made: companyData.email_intro_made,
        company_type: companyData.company_type
      };
      if (companyData.company_email.trim() !== email.trim()) {
        data.company_email = companyData.company_email?.trim();
      }
      if (companyData.logoUpdated) {
        data.company_logo = image?.type ? getFileType(image) : '';
      }
      PartnerApi.addIntroduceCompany(data)
        .then((response) => {
          if (response.data.meta.code === 1) {
            if (response?.data?.meta.uploadURL) {
              axios
                .put(response.data.meta.uploadURL, image, {
                  headers: {
                    'content-type': `${image?.type?.split('/')[0]}/${image?.name?.split('.')[1]}`
                  }
                })
                .then((response) => {
                  successToast('Company is introduced successfully !');
                  setLoader(false);
                  window.location.href = '/introduce';
                })
                .catch((err) => {
                  errorToast('Something went wrong with image upload !');
                  setLoader(false);
                });
            } else {
              successToast('Company is introduced successfully !');
              setLoader(false);
              window.location.href = '/introduce';
            }
          } else {
            errorToast(response?.data?.meta?.message || 'Something went wrong');
            setLoader(false);
          }
        })
        .catch((err) => {
          setLoader(false);
        });

      setLoader(false);
    }
  };

  return (
    <div>
      {loader ? <Loader /> : null}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Introduce Company | Shoorah Partnership</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-4 mx-3 rounded-3xl p-4 bg-white dark:bg-shoorah-darkBgTabColor dark:text-white">
        <div className="flex flex-row items-center relative">
          <div className=" relative">
            <img
              loading='lazy'
              src={companyData?.company_logo ? companyData?.company_logo : NOPhoto}
              className="h-[158px] w-[158px] rounded-full"
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
                <span className="text-xl my-3 font-medium">Introduce Company for Approval</span>
                <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </DisclosureButton>
              <DisclosurePanel className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="company_name">
                    Company Name
                  </label>
                  <input
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
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
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
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
                    Company Email
                  </label>
                  <input
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
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
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
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
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
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
                    className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-md h-10 px-2 capitalize"
                    value={companyData?.company_type}
                    onChange={handleChange}
                    id="company_type"
                    name="company_type"
                  >
                    <option value={''} disabled>
                      Select the companyType
                    </option>
                    {CompanyTypeData.map((e) => (
                      <option key={e} value={e.toLowerCase()}>
                        {e}
                      </option>
                    ))}
                  </select>
                  {valid.isSubmit && valid?.company_type && <span>{valid.company_type}</span>}
                </div>

                <div className="flex flex-col justify-between mt-3 ">
                  <div className="flex flex-col gap-3 space-between">
                    <div>
                      Email Intro Made<span></span>
                    </div>
                    <Switch
                      checked={companyData.email_intro_made}
                      onChange={() =>
                        setCompanyData({
                          ...companyData,
                          email_intro_made: !companyData.email_intro_made
                        })
                      }
                      className={`${
                        companyData.email_intro_made ? 'bg-[#3FA349]' : 'bg-shoorah-grayText'
                      }
                                    relative inline-flex h-[30px] w-[58px] shrink-0 
                                    cursor-pointer rounded-full border-2 border-transparent 
                                    transition-colors duration-200 ease-in-out focus:outline-none 
                                    focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          companyData.email_intro_made ? 'translate-x-7' : 'translate-x-0'
                        }
                                        pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full 
                                        bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                      />
                    </Switch>
                  </div>
                  {/* <div className="text-xs text-[#666666]  dark:text-white dark:border-none">

                  </div> */}
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        <div className="flex items-center justify-center mt-[2rem]">
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
IntroAddCompany.propTypes = {
  location: PropTypes.any
};
export default IntroAddCompany;

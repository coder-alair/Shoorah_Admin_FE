import React, { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import NOPhoto from '../../../../assets/images/no-photo.png';
import {
  currentDateWithFormat,
  errorToast,
  getCurrencyData,
  getCurrencyIcon,
  monthDiff
} from '../../../../utils/helper';
import { Api } from '../../../../api';
import Loader from '../../../../component/common/Loader';
import moment from 'moment';

function CompanyProfile() {
  const location = useLocation();
  const company = location.state;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(null);
  const [isCharity, setIsCharity] = useState(false);

  const [companyData, setCompanyData] = useState({
    company_logo: null,
    company_name: '',
    company_email: '',
    company_address: '',
    contact_person: '',
    contact_number: '',
    no_of_seat_bought: 0,
    seat_price: 0,
    seat_active: false,
    contract_start_date: '',
    contract_end_date: '',
    contract_length: '',
    contract_progress: false,
    b2b_interest_via: '',
    terms_agreed: false,
    contract_sent: false,
    contract_signed: false,
    invoice_raised: false,
    payment_complete: false,
    restrict_company: false,
    activeUsersCount: '',
    inactiveUsersCount: '',
    salesman: '',
    shuru_usage: true,
    partnerName: '',
    partnerEmail: '',
    vat_tax: false,
    plan: 'Monthly',
    discount: 0,
    auto_renew: true,
    b2bPlan: '',
    product: ''
  });

  useEffect(() => {
    if (company?._id||company?.id) {
      setLoader(true);
      Api.getCompanyData(company._id||company?.id)
        .then((res) => {
          let coData = res.data?.data;
          setLoader(false);
          if (res.data?.meta?.code === 1) {
            setCompanyData({
              ...companyData,
              company_logo: coData.company_logo,
              company_name: coData.company_name,
              company_email: coData.company_email,
              company_address: coData.company_address,
              contact_person: coData.contact_person,
              contact_number: coData.contact_number,
              no_of_seat_bought: coData.no_of_seat_bought,
              seat_price: coData.seat_price,
              seat_active: coData.seat_active,
              contract_start_date: currentDateWithFormat(new Date(coData.contract_start_date)),
              contract_end_date: currentDateWithFormat(new Date(coData.contract_end_date)),
              contract_length: monthDiff(
                new Date(coData.contract_start_date),
                new Date(coData.contract_end_date)
              ),
              contract_progress: coData.contract_progress,
              b2b_interest_via: coData.b2b_interest_via,
              terms_agreed: coData.terms_agreed,
              contract_sent: coData.contract_sent,
              contract_signed: coData.contract_signed,
              invoice_raised: coData.invoice_raised,
              payment_complete: coData.payment_complete,
              restrict_company: coData.restrict_company,
              currency: coData.currency ? coData.currency : 'gbp',
              plan: coData.plan,
              discount: coData.discount || 0,
              vat_tax: coData.vat_tax,
              auto_renew: coData.auto_renew,
              company_type: coData.company_type,
              activeUsersCount: coData?.activeUsersCount,
              inactiveUsersCount: coData?.inactiveUsersCount,
              salesman: coData?.salesman,
              shuru_usage: coData?.shuru_usage,
              partnerName: coData?.partnerName,
              partnerEmail: coData?.partnerEmail,
              b2bPlan: coData?.b2bPlan,
              product: coData?.product
            });
            setTrialDaysLeft(coData?.trialDaysLeft);
            setIsCharity(coData?.charity);
          } else {
            errorToast(res.data?.meta?.message);
          }
        })
        .catch((err) => {
          setLoader(false);
        });
    }
  }, []);

  return (
    <div className="mt-4 mx-3 rounded-3xl  m p-4 dark:bg-shoorah-darkBgTabColor dark:text-white bg-white">
      {loader ? <Loader /> : null}
      <div className="flex flex-row items-center justify-between">
        <img
          loading='lazy'
          src={
            companyData?.company_logo && !companyData?.company_logo.includes('null')
              ? companyData?.company_logo
              : NOPhoto
          }
          className="h-[150px] w-[150px] rounded-lg"
        />
        <div className="flex flex-col gap-y-3">
          <button
            className="border dark:border-none w-fit self-end py-1 px-4 rounded-md dark:bg-shoorah-darkBgColor dark:text-white bg-slate-100"
            onClick={() =>
              navigate('/B2B-company-list/addCompany', {
                state: { ...companyData, _id: (company._id||company?.id), action: 'edit' }
              })
            }
          >
            Edit Company
          </button>
          <div class="notifications-container">
            {trialDaysLeft && trialDaysLeft > 0 && (
              <div class="alert">
                <div class="flex">
                  <div class="">
                    <svg
                      aria-hidden="true"
                      fill="orange"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 alert-svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="alert-prompt-wrap">
                    <p class="text-sm text-yellow-700">Trial will end in {trialDaysLeft} days</p>
                  </div>
                </div>
              </div>
            )}
            {isCharity && (
              <div class="alert">
                <div class="flex">
                  <div class="">
                    <svg
                      aria-hidden="true"
                      fill="orange"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 alert-svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="alert-prompt-wrap">
                    <p class="text-sm text-yellow-700">
                      Charity will end in{' '}
                      {moment(new Date(companyData.contract_end_date))?.diff(
                        moment(new Date()),
                        'days'
                      )}{' '}
                      days
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-xl font-semibold">
          Company Info{' '}
          {companyData?.partnerName ? ' ( introduced by ' + companyData.partnerName + ' )' : null}{' '}
        </p>
        <div className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="company_name">Company Name</label>
            <p className="text-[#666666] border overflow-hidden dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center">
              {companyData.company_name}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="company_address">Company Address</label>
            <p className="text-[#666666] border overflow-hidden  dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center">
              {companyData.company_address}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="company_email">Company Email</label>
            <p className="text-[#666666] border overflow-hidden  dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center">
              {companyData.company_email}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="contact_person">Contact Person</label>
            <p className="text-[#666666] border overflow-hidden  dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center">
              {companyData.contact_person}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="contact_number">Contact Number</label>
            <p className="text-[#666666] border overflow-hidden  dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center">
              {companyData.contact_number}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="contact_number">Company Type</label>
            <p className="text-[#666666] overflow-hidden  border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center ">
              {companyData.company_type}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-xl font-semibold">Seats Details</p>
        <div className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="no_of_seat_bought">No of Seats Bought</label>
            <p className="text-[#666666] border overflow-hidden  dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.no_of_seat_bought}
            </p>
          </div>

          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="seat_price">Currency</label>
            <p className="text-[#666666] border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {(companyData.currency + ' ').toUpperCase()}
              {getCurrencyIcon(companyData.currency)}
            </p>
          </div>

          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="seat_price">Per Seat Price</label>
            <p className="text-[#666666] border overflow-hidden  dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {getCurrencyIcon(companyData.currency)} {companyData.seat_price}
            </p>
          </div>

          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="no_of_seat_bought">Seat Activity</label>
            <p className="text-[#666666]  dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.activeUsersCount + ' Active'}{' '}
              {companyData.inactiveUsersCount + ' Inactive'}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-xl font-semibold">Contract Details</p>
        <div className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="contract_start_date ">Contract Start Date</label>
            <p className="text-[#666666] border overflow-hidden  dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.contract_start_date}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="contract_end_date">Contract End Date</label>
            <p className="text-[#666666] border overflow-hidden  dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.contract_end_date}
            </p>
          </div>
          {companyData.contract_length ? (
            <div className="flex flex-col justify-start mt-3">
              <label htmlFor="contract_length">Contract Length</label>
              <p className="text-[#666666] border overflow-hidden dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
                {companyData.contract_length} Month
              </p>
            </div>
          ) : null}
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="contract_progress">Contract Progress</label>
            <p className="text-[#666666] border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.contract_progress ? 'Signed' : 'Under Negotiation'}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="b2b_interest_via">B2B Interest Via</label>
            <p className="text-[#666666] border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.b2b_interest_via}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="terms_agreed">Terms Agreed</label>
            <p className="text-[#666666] border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.terms_agreed ? 'Yes' : 'No'}
            </p>
          </div>
          {companyData.salesman && (
            <div className="flex flex-col justify-start mt-3">
              <label htmlFor="terms_agreed">Salesman</label>
              <p className="text-[#666666] border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
                {companyData.salesman}
              </p>
            </div>
          )}

          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="contract_sent">Contract Sent</label>
            <p className="text-[#666666] border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.contract_sent ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="contract_signed">Contract Signed</label>
            <p className="text-[#666666] border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.contract_signed ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="invoice_raised">Invoice Raised</label>
            <p className="text-[#666666] border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.invoice_raised ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="payment_complete">Payment Complete</label>
            <p className="text-[#666666] border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.payment_complete ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <label htmlFor="contact_person">Seats Active Live</label>
            <p className="text-[#666666] border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white  pl-2 h-[48px] rounded-md flex items-center capitalize">
              {companyData.seat_active ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="flex flex-col justify-start mt-3">
            <div className="flex flex-row justify-between items-center">
              <div>
                Restrict Company<span> *</span>
              </div>
              <Switch
                checked={companyData.restrict_company}
                // onChange={() => setCompanyData({ ...companyData, restrict_company: !companyData.restrict_company })}
                className={`${companyData.restrict_company ? 'bg-[#3FA349]' : 'bg-shoorah-grayText'}
                                    relative inline-flex h-[30px] w-[58px] shrink-0 
                                    cursor-not-allowed rounded-full border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white -2 border dark:border-none dark:bg-shoorah-darkBgColor dark:text-white -transparent 
                                    transition-colors duration-200 ease-in-out focus:outline-none 
                                    focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span
                  aria-hidden="true"
                  className={`${companyData.restrict_company ? 'translate-x-7' : 'translate-x-0'}
                                        pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full 
                                        bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
            <div className="text-xs text-[#666666]">
              When made inactive will restrict all assigned users red message to speak to company
              admin for assistance.
            </div>
          </div>
          <div className="flex flex-col justify-between mt-3">
            <div className="flex flex-row justify-between items-center">
              <div>
                Shuru Usage<span> *</span>
              </div>
              <Switch
                checked={companyData.shuru_usage}
                // onChange={() =>
                //   setCompanyData({
                //     ...companyData,
                //     shuru_usage: !companyData.shuru_usage,
                //   })
                // }
                className={`${companyData.shuru_usage ? 'bg-[#3FA349]' : 'bg-shoorah-grayText'}
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
              When made inactive will restrict all assigned users of this company unable to use
              shuru.
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
                disabled
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
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile;

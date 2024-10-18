import React, { Fragment, useEffect, useRef, useState } from 'react';
import Pagination from '../../../../component/common/Pagination/Pagination';
import Table from '../../../../component/common/Table';
import { useNavigate } from 'react-router-dom';
import { PER_PAGE, badgesCategory, gendersCategory } from '../../../../utils/constants';
import SelectMenu from '../../../../component/common/SelectMenu';
import SearchInput from '../../../../component/common/Input/SearchInput';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../../../component/common/Breadcrumb';
import {
  downloadOWBMHReportToCSV,
  downloadOWBMHReportToPDF,
  downloadSingleRadialReportToCSV,
  downloadSingleRadialReportToPDF,
  errorToast,
  getJWTToken,
  getLocalStorageItem,
  isSuperAdmin,
  successToast,
  useOutsideClick
} from '../../../../utils/helper';
import { CompanyApi } from '../../../../api/companyApi';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import HybridRevenueShowcase from '../../../DashboardContent.js/HybridRevenueShowcase';
import { RadialBar, RadialBarChart } from 'recharts';
import { DateRangePicker } from 'react-date-range';
import { CalendarIcon } from '@heroicons/react/24/outline';
import Loader from '../../../../component/common/Loader';

function CSurveys() {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const navigate = useNavigate();

  const pages = [{ name: 'Surveys', href: `/${userData.slug}/surveys`, current: true }];

  const handleGoBack = () => {
    if (isSuperAdmin()) {
      navigate('/dashboard');
    } else {
      navigate(`/${userData?.slug}/dashboard`);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Helmet>
        <meta charSet="utf-8" />
        <title>B2B | Surveys</title>
      </Helmet>
      <Breadcrumb pageList={pages} />

      <div className="flex mx-3 my-3 rounded-3xl flex-grow flex-col dark:bg-shoorah-darkBgTabColor  bg-white pt-16 pb-12">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <p className="text-base font-semibold text-shoorah-primary">{/* 404 */}</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight dark:text-white text-gray-900 sm:text-5xl">
                Coming Soon...
              </h1>
              <p className="mt-2 text-base dark:text-white text-gray-500">
                We are working on it and will notify about availability soon.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleGoBack}
                  type="button"
                  className="text-base font-medium dark:text-white text-shoorah-primary hover:text-shoorah-primary"
                >
                  Go back home
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CSurveys;

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../../../component/common/Breadcrumb';
import CompanyProfile from './CompanyProfile';
import UserData from './UserData';
import PropTypes from 'prop-types';
import CDashboard from '../../CompanyAdmin/Dashboard/CDashboard';
import NewCDashboard from '../../CompanyAdmin/Dashboard/NewCDashboard';
import B2BAdminList from './B2BAdmin';
import { useLocation } from 'react-router-dom';

function ViewCompany() {
  const location = useLocation();
  const company = location.state;
  console.log('company', company);
  const pages = [
    // { name: 'Company List', href: '/B2B-company-list', current: false },
    {
      name: company?.parantName ? company?.parantName : 'Company List',
      href: company?.parantURL ? company?.parantURL : '/B2B-company-list',
      current: false
    },
    {
      name: 'View Company',
      href: '/B2B-company-list/viewCompany',
      current: true
    }
  ];
  const [tab, setTab] = useState('Company Profile');
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>B2B | Dashboard</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="flex ml-3 flex-row justify-start gap-3 mt-4 mb-4">
        <button
          className={`py-3 px-2 w-44 rounded-3xl border-b-2 overflow-hidden dark:bg-shoorah-darkBgColor dark:text-white bg-white text-xs ${
            tab === 'Company Profile'
              ? 'border-blue-500 text-blue-500 dark:bg-shoorah-darkBgTabColor  bg-blue-500/[.2]'
              : ''
          }`}
          onClick={() => setTab('Company Profile')}
        >
          Company Profile
        </button>
        <button
          className={`py-3 px-2 w-44 rounded-3xl border-b-2 overflow-hidden dark:bg-shoorah-darkBgColor dark:text-white bg-white text-xs ${
            tab === 'User Data'
              ? 'border-blue-500 text-blue-500 dark:bg-shoorah-darkBgTabColor  bg-blue-500/[.2]'
              : ''
          }`}
          onClick={() => setTab('User Data')}
        >
          User Data
        </button>
        <button
          className={`py-3 px-2 w-44 rounded-3xl border-b-2 overflow-hidden dark:bg-shoorah-darkBgColor dark:text-white bg-white text-xs ${
            tab === 'Dashboard'
              ? 'border-blue-500 text-blue-500 dark:bg-shoorah-darkBgTabColor  bg-blue-500/[.2]'
              : ''
          }`}
          onClick={() => setTab('Dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`py-3 px-2 w-44 rounded-3xl border-b-2 overflow-hidden dark:bg-shoorah-darkBgColor dark:text-white bg-white text-xs ${
            tab === 'B2B Admins'
              ? 'border-blue-500 text-blue-500 dark:bg-shoorah-darkBgTabColor  bg-blue-500/[.2]'
              : ''
          }`}
          onClick={() => setTab('B2B Admins')}
        >
          B2B Admins
        </button>
      </div>
      {tab === 'Company Profile' && <CompanyProfile company={company} />}
      {tab === 'User Data' && <UserData company={company} />}
      {tab === 'Dashboard' && <NewCDashboard companyId={company?._id} />}
      {tab === 'B2B Admins' && <B2BAdminList companyId={company?._id} />}
    </div>
  );
}

ViewCompany.propTypes = {
  location: PropTypes.any
};

export default ViewCompany;

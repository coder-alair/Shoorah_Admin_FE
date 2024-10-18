import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../../../component/common/Breadcrumb';
import SelectMenu from '../../../../component/common/SelectMenu';
import { PER_PAGE } from '../../../../utils/constants';
import { ArrowDownTrayIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Pagination from '../../../../component/common/Pagination/Pagination';
import { Api } from '../../../../api';
import {
  convertCodeToPlatform,
  convertCodeToStatus,
  convertCodeToType,
  convertToIndianDate,
  errorToast,
  getLocalStorageItem,
  jsonToCsv,
  successToast
} from '../../../../utils/helper';
import { Transition } from '@headlessui/react';
import Table from '../../../../component/common/Table';
import SearchInput from '../../../../component/common/Input/SearchInput';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../component/common/Loader';
import { CompanyApi } from '../../../../api/companyApi';

function CUser(props) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [usersList, setUsersList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const companyId = userData?.companyId;
  const pages = [
    {
      name: 'Users',
      href: `/${userData.slug}/users`,
      current: true
    }
  ];
  const columns = [
    {
      title: 'Profile',
      key: 'profile',
      sortable: false,
      type: 'profile',
      align: 'left'
    },
    {
      title: 'Email',
      key: 'email',
      sortable: false,
      sortKey: 'account_type',
      type: 'text',
      align: 'left'
    },
    {
      title: 'Email / Mobile Verified',
      nested: false,
      // key1: "user_id",
      // key2: "is_email_verified",
      key: 'is_email_verified',
      type: 'verified',
      align: 'center'
    },
    // {
    //   title: 'Signup Platform',
    //   key: 'login_platform',
    //   type: 'platform',
    //   align: 'center',
    // },
    {
      title: 'Last login',
      key: 'lastLogin',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: 'Registered On',
      key: 'createdAt',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: 'Status',
      key: 'status',
      sortable: false,
      sortKey: 'status',
      type: 'toggle',
      align: 'left'
    },
    {
      title: '',
      key: 'action',
      type: 'action',
      align: 'right',
      isEdit: 'edituser',
      isView: '/users/view',
      isDelete: true
    }
  ];

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    CompanyApi.getCompanyUser(pageNumber, pageSize, searchKey).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setUsersList(response?.data?.data);
        setCurrentPage(pageNumber);
        setTotalCount(response?.data?.meta?.totalRecords);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setUsersList([]);
        setTotalCount(0);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm);
  };

  const refreshTable = () => handlePagination(1, selectedPerPage?.value, '');

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, searchParam);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, 10, '');
    }
  }, [searchTerm]);

  const downloadCsvFile = (data, filename) => {
    if (!data || data.length === 0) {
      console.error('JSON array is empty.');
      return;
    }
    let filteredData = [];
    data.map((i) => {
      let cont = {
        name: i.name,
        contact_number: i.contact_number,
        email: i.email,
        loginPlatform: i.loginPlatform,
        reason: i.reason
      };
      filteredData.push(cont);
    });
    const csvContent = jsonToCsv(filteredData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uploadCsvFile = (e) => {
    e.preventDefault();
    if (!e?.target?.files[0].name.match(/\.(csv)$/i)) {
      errorToast(
        `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload CSV file only.`
      );
    }
    setLoader(true);
    const file = {
      file: e.target.files[0]
    };
    CompanyApi.importMultiUser(file)
      .then((res) => {
        setLoader(false);
        if (res.data?.meta?.code === 1) {
          if (res.data?.data?.results.length > 0) {
            successToast('Users successfully registered !');
          } else {
            errorToast('Please check the downloaded report for the errors and try again!');
          }
          if (res.data?.data?.user_existed.length > 0) {
            downloadCsvFile(res.data?.data?.user_existed, 'rejectUserData.csv');
          }
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const deleteHandler = (id) => {
    setLoader(true);
    setSearchTerm('');
    CompanyApi.deleteUser(id).then((response) => {
      if (response?.data?.meta?.code === 1) {
        refreshTable();
        successToast(response?.data?.meta?.message);
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  return (
    <div>
      {loader ? <Loader /> : null}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Users | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <div className="sm:flex justify-between">
          <div className="flex">
            <div className="hidden sm:flex mr-3 self-center">
              <span className="self-center dark:text-white text-sm mr-2">Per page:</span>
              <div className="w-[80px]">
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className="self-center">
              <SearchInput
                id="searchKey"
                name="searchKey"
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by user name and email or mobile number"
              />
            </div>
          </div>
          <div className="mt-3 sm:mt-0 flex justify-between">
            <span className="mt-2 cursor-pointer">
              <a
                href="https://d12231i07r54en.cloudfront.net/app_configs/B2B_Import_users_sample.csv"
                className="text-shoorah-primary underline underline-offset-4"
                download="B2B_Template_Add_Users.csv"
              >
                Download sample file
                <ArrowDownTrayIcon className="w-[20px] cursor-pointer inline ml-3" />
              </a>
            </span>
            <label
              htmlFor="file"
              className="inline-flex cursor-pointer mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="bi bi-save cursor-pointer text-white w-[18px] h-[20px] inline"
                viewBox="0 0 16 16"
              >
                <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
                <title>Import Users</title>
              </svg>
              <input
                type="file"
                id="file"
                style={{ display: 'none' }}
                name="userImport"
                accept=".csv"
                multiple={false}
                className="cursor-pointer"
                data-original-title="User Import"
                onChange={uploadCsvFile}
              />
            </label>

            <button
              className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
              onClick={() => {
                navigate(`/${userData['slug']}/adduser`, {
                  state: { action: 'Add' }
                });
              }}
            >
              Add New
            </button>
          </div>
        </div>
        <div className="mt-4">
          <Table
            columns={columns}
            data={usersList}
            name={'users_table'}
            setDeleteId={deleteHandler}
            bottomBorder={totalCount > selectedPerPage?.value}
            refreshTable={refreshTable}
            loader={loader}
          />
        </div>
      </div>
      <div>
        {usersList.length > 0 && !loader ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={selectedPerPage?.value}
            onPageChange={(page) => handlePagination(page, selectedPerPage?.value, searchTerm)}
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export default CUser;

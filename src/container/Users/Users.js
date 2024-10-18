/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../component/common/Breadcrumb';
import Table from '../../component/common/Table';
import { Api } from '../../api';
import Pagination from '../../component/common/Pagination/Pagination';
import {
  errorToast,
  useOutsideClick,
  getFilterKey,
  convertToIndianDate,
  jsonToCsv,
  convertCodeToType,
  convertCodeToStatus,
  convertCodeToPlatform,
  successToast,
  getLocalStorageItem,
  currentDateWithFormat
} from '../../utils/helper';
import { Helmet } from 'react-helmet';
import SearchInput from '../../component/common/Input/SearchInput';
import SelectMenu from '../../component/common/SelectMenu';
import {
  ACCOUNT_TYPE,
  ETHINICITY,
  GENDER,
  JOB_ROLES,
  PER_PAGE,
  SIGN_UP_PLATFORM,
  STATUS_FOR_DROPDOWN
} from '../../utils/constants';
import { FunnelIcon } from '@heroicons/react/24/outline';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition
} from '@headlessui/react';

import {
  ArrowDownTrayIcon,
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/20/solid';
import AddUserValidation from '../../validation/AddUserValidation';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import { subYears } from 'date-fns';
import { format } from 'date-fns';

const pages = [{ name: 'Users', href: '/users', current: true }];

const columns = [
  {
    title: 'Profile',
    key: 'profile',
    sortable: false,
    type: 'profile',
    align: 'left'
  },
  {
    title: 'Job Role',
    key: 'jobRole',
    sortable: false,
    sortKey: 'account_type',
    type: 'text',
    align: 'left'
  },
  {
    title: 'Account Type',
    key: 'accountType',
    sortable: false,
    sortKey: 'account_type',
    type: 'accountType',
    align: 'left'
  },
  {
    title: 'Email / Mobile Verified',
    key: 'isEmailVerified',
    type: 'verified',
    extend: true,
    align: 'center'
  },
  {
    title: 'Signup Platform',
    key: 'loginPlatform',
    extend: true,
    type: 'platform',
    align: 'center'
  },
  {
    title: 'Last Login',
    key: 'lastLogin',
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: 'Registered On',
    key: 'registeredOn',
    extend: true,
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: 'Status',
    key: 'accountStatus',
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
    isView: '/users/view',
    isDelete: false
  }
];

const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

const calculateMaxDateForAgeRestriction = () => {
  return subYears(new Date(), 6);
};

const minDate = format(subYears(new Date(), 90), 'yyyy-MM-dd');

function Users() {
  const wrapperRef = useRef(null);
  const [companyList, setCompanyList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [job, setJob] = useState(JOB_ROLES[0].value);
  const [selectedPlatform, setSelectedPlatform] = useState(1);
  const [accountType, setaccountType] = useState(1);
  const [tab, setTab] = useState(1);
  const [gender, setGender] = useState(GENDER[5].value);
  const [showCalendar, setShowCalendar] = useState(false);

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [selectedFilterJob, setSelectedFilterJob] = useState('');
  const [jobs, setJobs] = useState(JOB_ROLES);

  const [filterCriteria, setFilterCriteria] = useState({
    accountType: '',
    accountStatus: '',
    jobRole: '',
    loginPlatform: ''
  });

  const [addUserPopUpOpen, setAddUserPopUpOpen] = useState(false);
  const [dob, setDob] = useState(null);
  const [addUserStates, setAddUserStates] = useState({
    lastName: '',
    firstName: '',
    email: '',
    accountType: accountType,
    company: null,
    platform: selectedPlatform,
    gender: gender,
    dob: dob,
    ethnicity: '',
    jobRole: job
  });

  const calendarRef = useRef();

  useOutsideClick(calendarRef, () => {
    if (showCalendar) setShowCalendar(!showCalendar);
  });

  const [valid, setValid] = useState({});

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  useEffect(() => {
    if (userData.userType === 3 || userData.userType === 4) {
      window.location.href = userData?.slug ? `/${userData?.slug}/users` : '/users';
    }
  }, [userData]);

  const handlePagination = (pageNumber, pageSize, searchKey, query, sortBy, sortOrder) => {
    setLoader(true);
    Api.getUsers(pageNumber, pageSize, searchKey, query, sortBy, sortOrder).then((response) => {
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

  const handleSortBy = (sortByValue) => {
    setSortBy(sortByValue);
    if (sortByValue === sortBy) {
      let tempSortOrder = sortOrder === 1 ? -1 : 1;
      setSortOrder(tempSortOrder);
      handlePagination(
        currentPage,
        selectedPerPage?.value,
        searchTerm,
        filterQuery,
        sortByValue,
        tempSortOrder
      );
    } else {
      setSortOrder(1);
      handlePagination(
        currentPage,
        selectedPerPage?.value,
        searchTerm,
        filterQuery,
        sortByValue,
        1
      );
    }
  };

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, searchParam, filterQuery, sortBy, sortOrder);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, 10, '', '', sortBy, sortOrder);
    }
  }, [searchTerm]);

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm, filterQuery, sortBy, sortOrder);
  };

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

  const filterHandler = (data, key) => {
    setFilterCriteria((prevData) => ({
      ...prevData,
      [key]: data
    }));
    let clone = JSON.parse(JSON.stringify(filterCriteria));
    const newData = { ...clone, [key]: data };
    let tempFilterQuery = [];
    Object.keys(newData).forEach(function (key) {
      if (key === 'jobRole') {
        if (newData[key]?.toString()) {
          tempFilterQuery.push(`&${key}=${newData[key]}`);
          setSelectedFilterJob(newData[key]);
        }
      } else if (newData[key]?.value?.toString()) {
        tempFilterQuery.push(`&${key}=${newData[key]?.value}`);
      }
    });
    let query = tempFilterQuery?.toString()?.replaceAll(',', '');
    setFilterQuery(query);
    handlePagination(1, selectedPerPage.value, searchTerm, query, sortBy, sortOrder);
  };

  const resetHandler = () => {
    setFilterCriteria({
      accountType: '',
      accountStatus: '',
      jobRole: '',
      loginPlatform: ''
    });
    setFilterQuery('');
    setSelectedFilterJob('');
    setSelected('');
    setShowFilterModal(false);
    handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
  };

  const refreshTable = () =>
    handlePagination(1, selectedPerPage?.value, '', filterQuery, sortBy, sortOrder);

  const downloadCsvFile = (data, filename) => {
    if (!data || data.length === 0) {
      console.error('JSON array is empty.');
      return;
    }

    data.map((i) => {
      i.createdAt = convertToIndianDate(i.createdAt);
      i.registeredOn = convertToIndianDate(i.registeredOn);
      i.accountType = convertCodeToType(i.accountType);
      i.accountStatus = convertCodeToStatus(i.accountStatus);
      i.loginPlatform = convertCodeToPlatform(i.loginPlatform);
    });

    const csvContent = jsonToCsv(data);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename || 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // handlers
  const handleAddUserSubmit = () => {
    const validate = AddUserValidation(addUserStates);
    setValid({
      ...valid,
      isSubmit: true,
      errors: validate.errors,
      isValid: validate.isValid
    });

    let payload = {
      lastName: addUserStates.lastName,
      firstName: addUserStates.firstName,
      email: addUserStates.email,
      accountType: addUserStates.accountType || accountType,
      company: addUserStates.company || null,
      gender: addUserStates.gender || 0,
      ethnicity: addUserStates.ethnicity || null,
      dob: dob || null,
      platform: addUserStates.platform || selectedPlatform,
      jobRole: job
    };
    if (validate.isValid) {
      setLoader(true);
      Api.AddUser(payload).then((response) => {
        if (response?.data?.meta?.code === 1) {
          successToast(response?.data?.meta?.message);
          refreshTable();
          setAddUserPopUpOpen(false);
          setAddUserStates({
            firstName: '',
            lastName: '',
            email: ''
          });
          setLoader(false);
        } else if (response?.code === 401) {
          setLoader(false);
          refreshTable();
          errorToast(response?.message);
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      });
    }
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setAddUserStates({ ...addUserStates, [name]: value });
  };

  const getCompanyList = () => {
    Api.getCompanyList('company_name', 1)
      .then((res) => {
        if (res.data?.meta?.code === 1) {
          res?.data?.data?.unshift({ company_name: 'B2C User', _id: '' });
          setCompanyList(res.data?.data);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getCompanyList();
  }, []);

  const uploadCsvFile = (e) => {
    e.preventDefault();
    if (!e?.target?.files[0].name.match(/\.(csv)$/i)) {
      errorToast(
        `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload CSV file only.`
      );
    }

    setFile(e.target.files[0]);
  };

  const handleImport = (e) => {
    let payload = {
      file,
      company: addUserStates.company
    };

    Api.importUsers(payload)
      .then((res) => {
        setLoader(false);
        if (res.data?.meta?.code === 1) {
          if (res.data?.data?.results.length > 0) {
            successToast('Users successfully registered !');
            setAddUserPopUpOpen(false);
            setFile(null);
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

  const handleSelectRange = (e) => {
    setShowCalendar(false);
    // const formattedDate = moment(e).format("YYYY-MM-DD");
    setDob(formatDate(e));
    // setAddUserStates({ ...addUserStates, dob: formatDate(new Date(e)) });
  };

  useEffect(() => {
    const filteredJobs =
      query === ''
        ? JOB_ROLES
        : JOB_ROLES.filter((job) => {
            return job.name.toLowerCase().includes(query.toLowerCase());
          });

    setJobs(filteredJobs);
  }, [query]);

  return (
    <div className="relative">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Users | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />

      {/* Add user Pop up */}
      {addUserPopUpOpen && (
        <div className="fixed inset-0 w-screen z-40 h-screen bg-black/25 flex justify-center items-center">
          <div className="bg-white dark:bg-shoorah-darkBgColor dark:border-none dark:text-white w-[95vw] h-full lg:h-fit lg:w-[50vw]  border pt-0 border-[#F1F2F4] rounded-2xl overflow-scroll hide-scrollbar shadow-md">
            <div className="bg-gradient-to-r from-shoorah-primary to-shoorah-secondary py-2 px-4 text-white flex items-center justify-between">
              <h4 className="font-semibold text-base">Add Users</h4>

              <span
                onClick={() => {
                  setAddUserPopUpOpen(false);
                  setValid({});
                }}
                className="font-semibold text-lg cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </span>
            </div>

            <div className=" mb-4 mt-[1rem] px-8 flex w-full items-center gap-[1rem] justify-center">
              <div
                onClick={() => setTab(1)}
                className={
                  tab === 1
                    ? `text-sm md:text-[18px] w-[50%] px-2 md:px-8 py-4 border-b border-cyan-600  flex  items-center justify-center  P22Mackinac ease cursor-pointer duration-1000`
                    : `text-sm md:text-[18px] w-[50%] P22Mackinac  flex  cursor-pointer  items-center justify-center py-3 `
                }
              >
                Add a user
              </div>
              <div
                onClick={() => setTab(2)}
                className={
                  tab === 2
                    ? ` text-sm md:text-[18px]  w-[50%] px-2 md:px-8 py-4 border-b border-cyan-600 flex  items-center justify-center  P22Mackinac ease cursor-pointer duration-1000`
                    : ` text-sm md:text-[18px]  w-[50%] P22Mackinac flex  cursor-pointer  items-center justify-center py-3  `
                }
              >
                Import users
              </div>
            </div>

            {tab === 1 ? (
              <div className="!text-sm md:text-lg">
                <div className="px-4">
                  <div className="gap-5 flex flex-wrap sm:flex-nowrap justify-center">
                    <div className="flex w-full flex-col justify-between mt-3">
                      <label
                        className="text-md dark:text-white block my-1 font-medium text-gray-700"
                        htmlFor="company_name"
                      >
                        First Name <span className={` text-red-400`}>&#42;</span>
                      </label>
                      <input
                        className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4]  rounded-[3rem] h-10 px-4"
                        type="text"
                        value={addUserStates.firstName}
                        id="first_name"
                        name="firstName"
                        onChange={handleAddUserChange}
                        placeholder="Enter First Name"
                      />
                      {valid.isSubmit && valid?.errors?.firstName && (
                        <span className="text-sm text-red-700">{valid?.errors?.firstName}</span>
                      )}
                    </div>
                    <div className="flex w-full flex-col justify-between  mt-3">
                      <label
                        className="text-md block dark:text-white mb-1 font-medium text-gray-700"
                        htmlFor="company_name"
                      >
                        Last Name <span className={` text-red-400`}>&#42;</span>
                      </label>
                      <input
                        className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4] rounded-[3rem] h-10 px-4"
                        type="text"
                        value={addUserStates.lastName}
                        id="last_name"
                        name="lastName"
                        onChange={handleAddUserChange}
                        placeholder="Enter Last Name"
                      />
                      {valid.isSubmit && valid?.errors?.lastName && (
                        <span className="text-sm text-red-700">{valid?.errors?.lastName}</span>
                      )}
                    </div>
                    <div className="flex flex-col w-full justify-between mt-3">
                      <label
                        className="text-md block dark:text-white mb-1 font-medium text-gray-700"
                        htmlFor="gender"
                      >
                        Gender<span className="text-[#FF0000]"></span>
                      </label>
                      <div className="w-full pr-4 overflow-hidden bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                        <select
                          className="px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none rounded-md h-10"
                          value={addUserStates.gender}
                          onChange={(e) => {
                            setGender(e.target.value);
                            setAddUserStates({
                              ...addUserStates,
                              gender: parseInt(e.target.value)
                            });
                          }}
                          id="gender"
                          name="gender"
                        >
                          <option value={''} disabled>
                            Select Gender
                          </option>
                          {GENDER.map((e) => (
                            <option key={e.name} value={e.value}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between mt-3">
                    <label
                      className="text-md block dark:text-white mb-1 font-medium text-gray-700"
                      htmlFor="company_email"
                    >
                      User Email <span className={` text-red-400`}>&#42;</span>
                    </label>
                    <input
                      className="border w-full outline-none text-base sm:text-md  placeholder-gray-400 P22Mackinac px-3 py-2  text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4] rounded-[3rem] h-10 px-4"
                      type="email"
                      value={addUserStates.email}
                      id="email"
                      name="email"
                      onChange={handleAddUserChange}
                      placeholder="Enter Email"
                    />
                    {valid.isSubmit && valid?.errors?.email && (
                      <span className="text-sm text-red-700">{valid?.errors?.email}</span>
                    )}
                  </div>

                  <label
                    className="text-md block dark:text-white mt-3 my-1 font-medium text-gray-700"
                    htmlFor="user_platform"
                  >
                    User Platform <span className={` text-red-400`}>&#42;</span>
                  </label>
                  <div className="flex flex-col md:flex-row w-full justify-between  gap-3">
                    <div className="flex">
                      <input
                        type="radio"
                        defaultChecked
                        onChange={handleAddUserChange}
                        name="platform"
                        value="1"
                        id="apple"
                        className="P22Mackinac outline-none"
                      />
                      <label
                        htmlFor="apple"
                        className=" w-full outline-none text-base sm:text-md  placeholder-gray-400 P22Mackinac px-3 py-2  text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4] rounded-[3rem] h-10 px-4"
                      >
                        Apple
                      </label>
                    </div>
                    <div className="flex">
                      <input
                        type="radio"
                        onChange={handleAddUserChange}
                        name="platform"
                        value="2"
                        id="google"
                      />
                      <label
                        htmlFor="google"
                        className=" w-full outline-none text-base sm:text-md  placeholder-gray-400 P22Mackinac px-3 py-2  text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4] rounded-[3rem] h-10 px-4"
                      >
                        Google
                      </label>
                    </div>
                    <div className="flex">
                      <input
                        type="radio"
                        onChange={handleAddUserChange}
                        name="platform"
                        value="0"
                        id="others"
                        className="P22Mackinac outline-none"
                      />
                      <label
                        htmlFor="others"
                        className=" w-full outline-none text-base sm:text-md  placeholder-gray-400 P22Mackinac px-3 py-2  text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4] rounded-[3rem] h-10 px-4"
                      >
                        Others
                      </label>
                    </div>
                  </div>

                  <div className="flex md:flex-row flex-col w-full justify-center gap-5">
                    <div className="flex w-full flex-col">
                      <label
                        htmlFor="company"
                        className="text-md mt-2 dark:text-white my-1 block font-medium text-gray-700"
                      >
                        Company <span className={` text-red-400`}>&#42;</span>
                      </label>
                      <div className="w-full pr-4 overflow-hidden bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                        <select
                          className=" px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none rounded-md h-10 "
                          onChange={handleAddUserChange}
                          value={addUserStates?.company}
                          id="company"
                          name="company"
                        >
                          <option value={''} disabled>
                            Company
                          </option>
                          {companyList.map((e) => (
                            <option key={e._id} value={e._id}>
                              {e?.company_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex relative w-full flex-col">
                      <label
                        htmlFor="job_role"
                        className="text-md dark:text-white mt-2 my-1 block font-medium text-gray-700"
                      >
                        Job Role
                      </label>
                      <Combobox
                        value={selected}
                        onChange={(value) => {
                          setSelected(value);
                          setJob(value);
                        }}
                      >
                        <div className="relative w-full pr-4 overflow-hidden outline-none appearance-none bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                          <ComboboxInput
                            className={
                              'w-full capitalize outline-none appearance-none rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 '
                            }
                            placeholder="Select Job Role"
                            displayValue={selected}
                            onChange={(event) => setQuery(event.target.value)}
                          />
                          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                            <ChevronDownIcon className="size-4 " />
                          </ComboboxButton>
                        </div>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                          afterLeave={() => setQuery('')}
                        >
                          <ComboboxOptions
                            anchor="bottom"
                            className="w-[15rem] z-40 bg-white shadow rounded-xl border border-white/5 p-1 empty:hidden"
                          >
                            {jobs.map((job) => (
                              <ComboboxOption
                                key={job?.name}
                                value={job?.value}
                                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none"
                              >
                                <CheckIcon className="invisible size-4 fill-white " />
                                <div className="text-sm/6">{job?.name}</div>
                              </ComboboxOption>
                            ))}
                          </ComboboxOptions>
                        </Transition>
                      </Combobox>
                    </div>
                  </div>

                  <label
                    className="text-md dark:text-white block mt-2 my-1 font-medium text-gray-700"
                    htmlFor="accountType"
                  >
                    Account Type <span className={` text-red-400`}>&#42;</span>
                  </label>
                  <div className="flex">
                    <input
                      type="radio"
                      onChange={handleAddUserChange}
                      name="accountType"
                      value="2"
                      id="free"
                      className="P22Mackinac outline-none"
                    />
                    <label
                      htmlFor="free"
                      className=" w-full dark:text-white outline-none text-base sm:text-md  placeholder-gray-400 P22Mackinac  py-2  text-[#666666] dark:text-white  dark:border-none   border-[#F1F2F4] rounded-[3rem] h-10 px-4"
                    >
                      Free
                    </label>
                    <input
                      type="radio"
                      onChange={handleAddUserChange}
                      defaultChecked
                      name="accountType"
                      value="1"
                      id="paid"
                    />
                    <label
                      htmlFor="paid"
                      className=" text-base dark:text-white sm:text-md  placeholder-gray-400 P22Mackinac  py-2  text-[#666666] dark:text-white dark:border-none  w-full outline-none border-[#F1F2F4] rounded-[3rem] h-10 px-4"
                    >
                      Basic
                    </label>
                  </div>

                  <div className="gap-5  flex flex-wrap sm:flex-nowrap justify-center">
                    <div className="flex w-full flex-col justify-between  mt-3">
                      <label
                        className="text-md block dark:text-white mb-1 font-medium text-gray-700"
                        htmlFor="dob"
                      >
                        DOB
                      </label>
                      <div className="relative w-full pr-4  bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                        <div
                          onClick={() => setShowCalendar((state) => !state)}
                          className={`px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none rounded-md h-10`}
                        >
                          {dob ? (
                            dob
                          ) : (
                            <div className="text-gray-400"> Enter your date of birth</div>
                          )}
                        </div>
                        <Transition
                          show={showCalendar}
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
                            ref={calendarRef}
                          >
                            <Calendar
                              date={new Date(dob)}
                              onChange={handleSelectRange}
                              maxDate={subYears(new Date(), 6)}
                              minDate={subYears(new Date(), 90)}
                            />
                          </div>
                        </Transition>
                      </div>
                    </div>
                    <div className="flex flex-col w-full justify-between mt-3">
                      <label
                        className="text-md block dark:text-white mb-1 font-medium text-gray-700"
                        htmlFor="gender"
                      >
                        Ethnicity
                      </label>
                      <div className="w-full pr-4 overflow-hidden bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                        <select
                          className="px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none rounded-md h-10"
                          onChange={handleAddUserChange}
                          value={addUserStates?.ethnicity}
                          id="ethnicity"
                          name="ethnicity"
                        >
                          <option value={''} disabled>
                            Select Ethnicity
                          </option>
                          {ETHINICITY.map((e) => (
                            <option key={e.name} value={e.value}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  <button
                    onClick={handleAddUserSubmit}
                    className="bg-[#3A47AB] py-3 px-10 mt-4 text-white w-[192px] h-[48px] rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="!text-sm md:text-lg">
                <span className="my-[2rem] px-4 cursor-pointer">
                  <a
                    href="https://d12231i07r54en.cloudfront.net/app_configs/B2B_Import_users_sample.csv"
                    className="text-shoorah-primary underline underline-offset-4"
                    download="Add_Users_Template.csv"
                  >
                    Download sample file
                    <ArrowDownTrayIcon className="w-[20px] cursor-pointer inline ml-3" />
                  </a>
                </span>
                <div className="mt-5 px-4">
                  <label
                    htmlFor="company"
                    className="text-md mt-2 my-1 block font-medium text-gray-700"
                  >
                    Company <span className={` text-red-400`}>&#42;</span>
                  </label>
                  <div className="w-full pr-4 overflow-hidden bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                    <select
                      className=" px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none rounded-md h-10 "
                      onChange={handleAddUserChange}
                      value={addUserStates?.company}
                      id="company"
                      name="company"
                    >
                      <option value={''} disabled>
                        Company
                      </option>
                      {companyList.map((e) => (
                        <option key={e._id} value={e._id}>
                          {e?.company_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="px-4">
                  <label
                    htmlFor="file"
                    className="text-md mt-2 my-1 block font-medium text-gray-700"
                  >
                    File <span className={`text-red-400`}>&#42;</span>
                  </label>
                  <div className="w-full pr-4 overflow-hidden bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none">
                    <input
                      className="appearance-none cursor-pointer"
                      type="file"
                      accept=".csv"
                      multiple={false}
                      data-original-title="User Import"
                      onChange={uploadCsvFile}
                    />
                  </div>
                </div>
                <div className="flex justify-center my-4">
                  <button
                    onClick={handleImport}
                    className="bg-[#3A47AB] py-3 px-10 mt-4 text-white w-[192px] h-[48px] rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 px-3">
        <div className="sm:flex justify-between">
          <div className="flex">
            <div className="hidden lg:flex mr-3 self-center">
              <span className="self-center text-sm mr-2 dark:text-white">Per page:</span>
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
            <div className=" flex lg:hidden self-center">
              <div className="w-[80px]">
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className="flex">
              <div className="ml-3 self-center inline-flex items-center justify-center">
                <button
                  className="inline-flex mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => setAddUserPopUpOpen(true)}
                >
                  Add +
                </button>

                <button
                  className="inline-flex mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => downloadCsvFile(usersList, 'users.csv')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-save text-white w-[18px] h-[20px] inline rotate-180"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
                    <title>Export Users</title>
                  </svg>
                </button>

                <button
                  className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => setShowFilterModal((state) => !state)}
                >
                  <FunnelIcon className="text-white w-[18px] h-[20px] inline" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <Transition
          show={showFilterModal}
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            ref={wrapperRef}
            className="absolute p-5 right-5 z-[2] mt-2 w-[100%] sm:w-[600px] lg:w-[700px] dark:bg-shoorah-darkBgTabColor dark:text-white mx-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  "
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">Filters</p>
              <div className="flex space-x-3">
                <button
                  onClick={resetHandler}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-shoorah-darkBgColor dark:text-white dark:hover:bg-shoorah-darkBgColor text-sm font-medium rounded-md"
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-shoorah-darkBgColor dark:text-white dark:hover:bg-shoorah-darkBgColor text-sm font-medium rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <SelectMenu
                  menuList={ACCOUNT_TYPE}
                  defaultSelected={filterCriteria.accountType}
                  label="Subscription Status"
                  isRequired={false}
                  setSelectedMenu={(data) => filterHandler(data, 'accountType')}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={STATUS_FOR_DROPDOWN}
                  label="Account status"
                  isRequired={false}
                  defaultSelected={filterCriteria.accountStatus}
                  setSelectedMenu={(data) => filterHandler(data, 'accountStatus')}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={SIGN_UP_PLATFORM}
                  label="Signup Platform"
                  isRequired={false}
                  defaultSelected={filterCriteria.loginPlatform}
                  setSelectedMenu={(data) => filterHandler(data, 'loginPlatform')}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={[
                    { name: 'All', value: null },
                    { name: 'Super Admin', value: 'admin' },
                    { name: 'Ripple', value: 'ripple' }
                  ]}
                  label="Added by"
                  isRequired={false}
                  defaultSelected={filterCriteria.addedBy}
                  setSelectedMenu={(data) => filterHandler(data, 'addedBy')}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={[
                    { name: 'All', value: null },
                    { name: 'B2C', value: false },
                    { name: 'B2B', value: true }
                  ]}
                  label="Role"
                  isRequired={false}
                  defaultSelected={filterCriteria.role}
                  setSelectedMenu={(data) => filterHandler(data, 'role')}
                />
              </div>

              <div className="flex relative w-full flex-col">
                <label
                  htmlFor="jobRole"
                  className="text-sm dark:text-white block font-medium text-gray-700"
                >
                  Job Role
                </label>
                <Combobox
                  value={selectedFilterJob}
                  onChange={(data) => {
                    filterHandler(data, 'jobRole');
                  }}
                >
                  <div className="relative w-full pr-4 overflow-hidden outline-none appearance-none bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                    <ComboboxInput
                      className={
                        'w-full capitalize outline-none appearance-none rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 '
                      }
                      placeholder="Select Job Role"
                      displayValue={selected}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                      <ChevronDownIcon className="size-4 " />
                    </ComboboxButton>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                  >
                    <ComboboxOptions
                      anchor="bottom"
                      className="w-[15rem] z-40 bg-white shadow rounded-xl border border-white/5 p-1 empty:hidden"
                    >
                      {jobs.map((job) => (
                        <ComboboxOption
                          key={job?.name}
                          value={job?.value}
                          className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none"
                        >
                          <CheckIcon className="invisible size-4 fill-white " />
                          <div className="text-sm/6">{job?.name}</div>
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  </Transition>
                </Combobox>
              </div>
            </div>
          </div>
        </Transition>
        {!Object.values(filterCriteria).every((x) => x === '') && (
          <div className="border py-1 px-2 mt-3">
            <div className="flex justify-between">
              <div className="self-center overflow-auto filter-container mr-2">
                <div className="flex">
                  {Object.keys(filterCriteria).map((keyName, i) => (
                    <>
                      {filterCriteria?.[keyName]?.value?.toString() ||
                      filterCriteria?.[keyName]?.toString() ? (
                        <div className="flex bg-gray-200 px-2 py-1 mr-2 whitespace-nowrap" key={i}>
                          <p className="text-[14px] object-contain m-0 whitespace-nowrap">
                            {getFilterKey(
                              keyName === 'accountType' ? 'subscriptionStatus' : keyName
                            )}
                          </p>
                          <p className="text-[14px] m-0 whitespace-nowrap">&nbsp;: &nbsp;</p>
                          <p className="text-[14px] m-0 whitespace-nowrap ">
                            {filterCriteria?.[keyName].name || filterCriteria?.[keyName]}
                          </p>
                          <p
                            className="border cursor-pointer m-0 ml-2 self-center whitespace-nowrap"
                            onClick={() => filterHandler('', keyName)}
                          >
                            <XMarkIcon className="w-[16px] border border-shoorah-primary text-white bg-shoorah-secondary" />
                          </p>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  ))}
                </div>
              </div>
              <div className="flex self-center justify-end w-[50px]">
                <button className="px-2 py-1 bg-shoorah-secondary" onClick={resetHandler}>
                  <XMarkIcon className="w-[18px] border-shoorah-primary text-white bg-shoorah-secondary" />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4">
          <Table
            columns={columns}
            data={usersList}
            name={'users_table'}
            bottomBorder={totalCount > selectedPerPage?.value}
            setSortBy={(sort) => handleSortBy(sort)}
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
            onPageChange={(page) =>
              handlePagination(
                page,
                selectedPerPage?.value,
                searchTerm,
                filterQuery,
                sortBy,
                sortOrder
              )
            }
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export default Users;

import { Fragment, useEffect, useRef, useState } from 'react';

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
  XMarkIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/20/solid';
import {
  errorToast,
  getFilterKey,
  getLocalStorageItem,
  successToast,
  useOutsideClick
} from '../../../utils/helper';
import {
  ACCOUNT_TYPE,
  APPROVAL_STATUS,
  JOB_ROLES,
  PEAP_CONTENT,
  PER_PAGE,
  SIGN_UP_PLATFORM,
  SPECIALIST_ROLES,
  STATUS_FOR_DROPDOWN
} from '../../../utils/constants';
import { Helmet } from 'react-helmet';
import SelectMenu from '../../../component/common/SelectMenu';
import SearchInput from '../../../component/common/Input/SearchInput';
import Table from '../../../component/common/Table';
import Pagination from '../../../component/common/Pagination/Pagination';
import Complainant from '../Complaint/Complaint';
import Peapapproval from '../Approvals/Approvals';
import AddUserValidation from '../../../validation/AddUserValidation';
import { Api } from '../../../api';
import Loader from '../../../component/common/Loader';
import Insights from '../Insight/insights';
import newSearch from '../../../assets/images/newSearch.svg';

import { SPECIALISATIONSADD, SPECIALIST_ROLE } from '../../../utils/constants';
import Messaging from '../Messaging/Messaging';

const columns = [
  {
    title: 'Name',
    key: 'name',
    type: 'text2',
    longText: true,
    align: 'left'
  },
  {
    title: 'Email',
    key: 'email',
    type: 'text',
    align: 'left'
  },
  {
    title: 'Sessions',
    key: 'sessions',
    type: 'text',
    align: 'right'
  },
  {
    title: 'Date Joined',
    key: 'dateJoined',
    type: 'date',
    align: 'left'
  },
  {
    title: 'Status',
    key: 'status',
    type: 'text',
    align: 'center'
  },
  {
    title: 'Clients',
    key: 'clients',
    type: 'text',
    align: 'right'
  },
  {
    title: 'Complaints',
    key: 'complaints',
    type: 'text',
    align: 'center'
  },
  {
    title: 'Rating',
    key: 'rating',
    type: 'text',
    align: 'right'
  },
  {
    title: 'Price',
    key: 'price',
    type: 'text',
    align: 'right'
  },
  {
    title: 'Identity',
    key: 'identity',
    type: 'text',
    align: 'center'
  },
  {
    title: 'DBS',
    key: 'dbs',
    type: 'text',
    align: 'center'
  },
  {
    title: 'Unread Messages',
    key: 'unreadMessages',
    type: 'text',
    align: 'center'
  },
  {
    title: 'Pause/Deactivate',
    key: 'actions',
    type: 'button',
    align: 'center'
  }
];

function Specialist() {
  const wrapperRef = useRef(null);
  const [companyList, setCompanyList] = useState([]);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState(SPECIALIST_ROLE);
  const [loader, setLoader] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [job, setJob] = useState(JOB_ROLES[0].name);
  const [selectedPlatform, setSelectedPlatform] = useState(1);
  const [accountType, setaccountType] = useState(1);
  const [tab, setTab] = useState(1);
  const [selectedContentType, setSelectedContentType] = useState(1);
  const [filterCriteria, setFilterCriteria] = useState({
    accountType: '',
    accountStatus: '',
    loginPlatform: ''
  });

  const [addUserPopUpOpen, setAddUserPopUpOpen] = useState(false);
  const [addUserStates, setAddUserStates] = useState({
    lastName: '',
    firstName: '',
    email: '',
    accountType: accountType,
    category: '',
    platform: selectedPlatform,
    specialsationCategory: '',
    phone: '',
    Address: '',
    year_of_practise: null,
    aggred_hour_rate: null,
    public_hour_rate: null,
    address: ''
  });
  //////////
  const [category, setCategory] = useState('');
  const [specialisationCategory, setSpecialisationCategory] = useState('');

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSpecialisationCategory('');
    const { name, value } = e.target;
    setAddUserStates((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSpecialisationCategory = (e) => {
    if (e) {
      setSpecialisationCategory(e);
      const { name } = e;
      setAddUserStates((prevState) => ({ ...prevState, [name]: e }));
    }
  };
  /////////////
  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setAddUserStates({ ...addUserStates, [name]: value });
  };
  const handleAddUserSubmit = () => {
    const validate = AddUserValidation(addUserStates);
    setValid({
      ...valid,
      isSubmit: true,
      errors: validate.errors,
      isValid: validate.isValid
    });
    if (validate.isValid) {
      setLoader(true);
      const data = {
        userId: '',
        name: `${addUserStates?.firstName} ${addUserStates?.lastName}`,
        firstName: addUserStates?.firstName,
        lastName: addUserStates?.lastName,
        email: addUserStates?.email,
        userType: 6,
        address: addUserStates?.address,
        shoorahRate: addUserStates?.aggred_hour_rate,
        price: addUserStates?.public_hour_rate,
        yearOfPractice: addUserStates?.year_of_practise,
        expertFocusIds: [],
        accountStatus: 1,
        category: addUserStates?.category,
        specialsationCategory: addUserStates?.specialsationCategory
      };
      Api.postSpecialistData(data)
        .then((res) => {
          setLoader(false);
          if (res.status === 200) {
            successToast('Specialist created successfully');
            setAddUserPopUpOpen(false);
            handlePagination(currentPage, selectedPerPage?.value, '');
          }
        })
        .catch((err) => {
          setLoader(false);
          errorToast(err.message);
        });
    }
    setLoader(false);
  };
  const [valid, setValid] = useState({});
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  // useEffect(() => {
  //   if (userData.userType) {
  //     window.location.href = userData?.slug ? `/${userData?.slug}/users` : '/users';
  //   }
  // }, []);

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const filteredJobs =
      query && query === ''
        ? SPECIALIST_ROLE
        : SPECIALIST_ROLE?.filter((job) => {
            return job.name.toLowerCase().includes(query.toLowerCase());
          });

    setJobs(filteredJobs);
  }, [query]);

  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date());
    }, 100000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, selectedPerPage.value, '');
  }, []);
  const fetchUsers = (pageNumber, pageSize, userId) => {
    setLoader(true);
    Api.getSpecialistData(pageNumber, pageSize, userId)
      .then((response) => {
        setLoader(false);
        if (response?.data?.meta?.code === 1) {
          setUsersList(response?.data?.data);
          setCurrentPage(pageNumber);
          setTotalCount(response?.data?.meta?.totalRecords);
        } else {
          setUsersList([]);
          setTotalCount(0);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.error('API call error: ', error);
      });
  };

  const handlePagination = (pageNumber, pageSize, userId) => {
    fetchUsers(pageNumber, pageSize, userId);
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

  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handlePause = (user) => {
    console.log(`Pause clicked for ${user.name}`);
  };
  const handleDeactivate = (user) => {
    console.log(`Deactivate clicked for ${user.name}`);
  };
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  return (
    <div className="relative">
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Specialist Shoorah Admin</title>
      </Helmet>
      {/* <Breadcrumb pageList={pages} /> */}
      {/* Add user Pop up */}
      <div className="block pl-6 pt-12 text-xl font-medium text-gray-800 dark:text-white md:text-3xl">
        PEAP Management
      </div>
      <div className="pl-6 pt-8 text-gray-400">{formattedDate}</div>

      <div className="relative">
        {/* Add user Pop up */}
        {addUserPopUpOpen && (
          <div className="fixed inset-0 z-40 flex h-screen w-screen items-center justify-center bg-black/25">
            <div className="w-[95vw] overflow-hidden rounded-2xl border border-[#F1F2F4] bg-white pt-0 shadow-md dark:border-none dark:bg-shoorah-darkBgColor dark:text-white lg:w-[50vw]">
              <div className="flex items-center justify-between bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-white">
                <h4 className="text-base font-semibold">Add Specialist</h4>

                <span
                  onClick={() => {
                    setAddUserPopUpOpen(false);
                    setValid({});
                  }}
                  className="cursor-pointer text-lg font-semibold"
                >
                  X
                </span>
              </div>

              {tab === 1 ? (
                <div>
                  <div className="px-4">
                    <div className="flex justify-center gap-5 pt-2">
                      <div className="mt-3 flex w-full flex-col justify-between">
                        <label
                          className="text-md my-1 block font-medium text-gray-700 dark:text-white"
                          htmlFor="firstName"
                        >
                          First Name <span className={`text-red-400`}>&#42;</span>
                        </label>
                        <input
                          className="h-10 w-full rounded-[3rem] border border-[#F1F2F4] px-4 capitalize text-[#666666] outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
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
                      <div className="mt-3 flex w-full flex-col justify-between">
                        <label
                          className="text-md mb-1 block font-medium text-gray-700 dark:text-white"
                          htmlFor="lastName"
                        >
                          Last Name <span className={`text-red-400`}>&#42;</span>
                        </label>
                        <input
                          className="h-10 w-full rounded-[3rem] border border-[#F1F2F4] px-4 capitalize text-[#666666] outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
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
                    </div>
                    <div className="flex justify-center gap-5 pt-2">
                      <div className="mt-3 flex w-full flex-col justify-between">
                        <label
                          className="text-md my-1 block font-medium text-gray-700 dark:text-white"
                          htmlFor="userEmail"
                        >
                          Email <span className={`text-red-400`}>&#42;</span>
                        </label>
                        <input
                          className="sm:text-md P22Mackinac h-10 w-full rounded-[3rem] border border-[#F1F2F4] px-3 px-4 py-2 text-base capitalize text-[#666666] placeholder-gray-400 outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
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
                      <div className="mt-3 flex w-full flex-col justify-between">
                        <label
                          className="text-md mb-1 block font-medium text-gray-700 dark:text-white"
                          htmlFor="phone"
                        >
                          Phone
                        </label>
                        <input
                          className="h-10 w-full rounded-[3rem] border border-[#F1F2F4] px-4 capitalize text-[#666666] outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
                          type="text"
                          value={addUserStates.phone}
                          id="phone"
                          name="phone"
                          onChange={handleAddUserChange}
                          placeholder="Enter Phone Number"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center gap-5 pt-5">
                      <div className="w-full overflow-hidden bg-transparent px-1 pr-4 text-[#666666] dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white">
                        <label
                          htmlFor="category"
                          className="text-md my-1 mt-2 block font-medium text-gray-700 dark:text-white"
                        >
                          Specialisation category <span className="text-red-400">&#42;</span>
                        </label>
                        <div className="w-full overflow-hidden rounded-[3rem] border bg-transparent px-1 pr-4 text-gray-400 dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white">
                          <select
                            className="P22Mackinac sm:text-md h-10 w-full rounded-md bg-transparent px-3 py-2 text-base capitalize placeholder-gray-400 outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
                            onChange={handleCategory}
                            value={category}
                            id="category"
                            name="category"
                          >
                            <option value="" disabled>
                              Choose Category
                            </option>
                            {SPECIALISATIONSADD.map((specialisation) => (
                              <option key={specialisation.id} value={specialisation.id}>
                                {specialisation.value}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="specialsationCategory"
                          className="text-md my-1 mt-2 block font-medium text-gray-700 dark:text-white"
                        >
                          Specialisation <span className="text-red-400">&#42;</span>
                        </label>
                        <Combobox
                          value={specialisationCategory}
                          onChange={handleSpecialisationCategory}
                          disabled={!category}
                        >
                          <div className="relative w-full pr-4 overflow-hidden outline-none appearance-none bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                            <ComboboxInput
                              className={
                                'w-full capitalize outline-none appearance-none rounded-lg border-none bg-white/5 py-2 pr-8 pl-3 text-sm/6 '
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
                              className="z-40 bg-white shadow rounded-xl border border-white/5 p-1 empty:hidden"
                            >
                              {jobs.map((job) => (
                                <ComboboxOption
                                  key={job?.name}
                                  value={job?.value}
                                  className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none"
                                >
                                  <CheckIcon className="invisible size-4 fill-white " />
                                  <div className="text-sm/6">{job?.value}</div>
                                </ComboboxOption>
                              ))}
                            </ComboboxOptions>
                          </Transition>
                        </Combobox>
                      </div>
                    </div>
                    {specialisationCategory === 'Other' && (
                      <div className="flex justify-center gap-5 pt-2">
                        <div className="mt-3 flex w-full flex-col justify-between"></div>
                        <div className="mt-3 flex w-full flex-col justify-between">
                          <label
                            className="text-md mb-1 block font-medium text-gray-700 dark:text-white"
                            htmlFor="aggred_hour_rate"
                          >
                            Other Specialisation<span className={`text-red-400`}>&#42;</span>
                          </label>
                          <input
                            className="h-10 w-full rounded-[3rem] border border-[#F1F2F4] px-4 capitalize text-[#666666] outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
                            type="text"
                            value={addUserStates.aggred_hour_rate}
                            id="aggred_hour_rate"
                            name="aggred_hour_rate"
                            // onChange={handleAddUserChange}
                            placeholder="Enter"
                          />
                          {valid.isSubmit && valid?.errors?.agreedHourRate && (
                            <span className="text-sm text-red-700">
                              {valid?.errors?.agreedHourRate}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-center gap-5 pt-2">
                      <div className="mt-3 flex w-full flex-col justify-between">
                        <label
                          className="text-md my-1 block font-medium text-gray-700 dark:text-white"
                          htmlFor="yearOfPractise"
                        >
                          Address <span className={`text-red-400`}>&#42;</span>
                        </label>
                        <input
                          className="sm:text-md P22Mackinac h-10 w-full rounded-[3rem] border border-[#F1F2F4] px-3 px-4 py-2 text-base capitalize text-[#666666] placeholder-gray-400 outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
                          type="address"
                          value={addUserStates.address}
                          id="address"
                          name="address"
                          onChange={handleAddUserChange}
                          placeholder="Enter Address"
                        />
                        {valid.isSubmit && valid?.errors?.address && (
                          <span className="text-sm text-red-700">{valid?.errors?.address}</span>
                        )}
                      </div>
                      <div className="mt-3 flex w-full flex-col justify-between">
                        <label
                          className="text-md mb-1 block font-medium text-gray-700 dark:text-white"
                          htmlFor="aggred_hour_rate"
                        >
                          Agreed hour rate <span className={`text-red-400`}>&#42;</span>
                        </label>
                        <input
                          className="h-10 w-full rounded-[3rem] border border-[#F1F2F4] px-4 capitalize text-[#666666] outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
                          type="text"
                          value={addUserStates.aggred_hour_rate}
                          id="aggred_hour_rate"
                          name="aggred_hour_rate"
                          onChange={handleAddUserChange}
                          placeholder="Enter"
                        />
                        {valid.isSubmit && valid?.errors?.agreedHourRate && (
                          <span className="text-sm text-red-700">
                            {valid?.errors?.agreedHourRate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center gap-5 pt-2">
                      <div className="mt-3 flex w-full flex-col justify-between">
                        <label
                          className="text-md my-1 block font-medium text-gray-700 dark:text-white"
                          htmlFor="year_of_practise"
                        >
                          Year of Practise <span className={`text-red-400`}>&#42;</span>
                        </label>
                        <input
                          className="sm:text-md P22Mackinac h-10 w-full rounded-[3rem] border border-[#F1F2F4] px-3 px-4 py-2 text-base capitalize text-[#666666] placeholder-gray-400 outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
                          type="year_of_practise"
                          value={addUserStates.year_of_practise}
                          id="year_of_practise"
                          name="year_of_practise"
                          onChange={handleAddUserChange}
                          placeholder="Enter year of practise"
                        />
                        {valid.isSubmit && valid?.errors?.year_of_practise && (
                          <span className="text-sm text-red-700">
                            {valid?.errors?.year_of_practise}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex w-full flex-col justify-between">
                        <label
                          className="text-md mb-1 block font-medium text-gray-700 dark:text-white"
                          htmlFor="public_hour_rate"
                        >
                          Public hour rate <span className={`text-red-400`}>&#42;</span>
                        </label>
                        <input
                          className="h-10 w-full rounded-[3rem] border border-[#F1F2F4] px-4 capitalize text-[#666666] outline-none dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"
                          type="text"
                          value={addUserStates.public_hour_rate}
                          id="public_hour_rate"
                          name="public_hour_rate"
                          onChange={handleAddUserChange}
                          placeholder="Enter"
                        />
                        {valid.isSubmit && valid?.errors?.public_hour_rate && (
                          <span className="text-sm text-red-700">
                            {valid?.errors?.public_hour_rate}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* <label
                    className="text-md dark:text-white block mt-2 my-1 font-medium text-gray-700"
                    htmlFor="accountType"
                  >
                    Account Type <span className={` text-red-400`}>&#42;</span>
                  </label> */}
                    {/* <div className="flex">
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
                      className=" w-full dark:text-white outline-none text-base sm:text-md  placeholder-gray-400 P22Mackinac  py-2  text-[#666666] dark:text-white  dark:border-none   border-[#F1F2F4] rounded-[3rem] h-10 px-4 capitalize"
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
                      className=" text-base dark:text-white sm:text-md  placeholder-gray-400 P22Mackinac  py-2  text-[#666666] dark:text-white dark:border-none  w-full outline-none border-[#F1F2F4] rounded-[3rem] h-10 px-4 capitalize"
                    >
                      Basic
                    </label>
                  </div> */}
                  </div>
                  <div className="mb-4 flex justify-center pb-5 pt-8">
                    <button
                      onClick={handleAddUserSubmit}
                      className="mt-4 h-[48px] w-[192px] rounded-md bg-[#3A47AB] px-10 py-3 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <></>
                //   <div>
                //     <span className="my-[2rem] px-4 cursor-pointer">
                //       <a
                //         href="https://d12231i07r54en.cloudfront.net/app_configs/B2B_Import_users_sample.csv"
                //         className="text-shoorah-primary underline underline-offset-4"
                //         download="Add_Users_Template.csv"
                //       >
                //         Download sample file
                //         <ArrowDownTrayIcon className="w-[20px] cursor-pointer inline ml-3" />
                //       </a>
                //     </span>
                //     <div className="mt-5 px-4">
                //       <label
                //         htmlFor="company"
                //         className="text-md mt-2 my-1 block font-medium text-gray-700"
                //       >
                //         Company <span className={` text-red-400`}>&#42;</span>
                //       </label>
                //       <div className="w-full pr-4 overflow-hidden bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                //         <select
                //           className=" px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none rounded-md h-10  capitalize"
                //           onChange={handleAddUserChange}
                //           value={addUserStates?.company}
                //           id="company"
                //           name="company"
                //         >
                //           <option value={''} disabled>
                //             Company
                //           </option>
                //           {companyList.map((e) => (
                //             <option key={e._id} value={e._id}>
                //               {e?.company_name}
                //             </option>
                //           ))}
                //         </select>
                //       </div>
                //     </div>
                //     <div className="px-4">
                //       <label
                //         htmlFor="file"
                //         className="text-md mt-2 my-1 block font-medium text-gray-700"
                //       >
                //         File <span className={`text-red-400`}>&#42;</span>
                //       </label>
                //       <div className="w-full pr-4 overflow-hidden bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none">
                //         <input
                //           className="appearance-none cursor-pointer"
                //           type="file"
                //           accept=".csv"
                //           multiple={false}
                //           data-original-title="User Import"
                //           onChange={uploadCsvFile}
                //         />
                //       </div>
                //     </div>
                //     <div className="flex justify-center my-4">
                //       <button
                //         onClick={handleImport}
                //         className="bg-[#3A47AB] py-3 px-10 mt-4 text-white w-[192px] h-[48px] rounded-md"
                //       >
                //         Save
                //       </button>
                //     </div>
                //   </div>
              )}
            </div>
          </div>
        )}

        <div className="px-3">
          <div className="justify-between sm:flex">
            <div className="flex">
              <div className="mr-3 hidden self-center lg:flex"></div>
            </div>
            <div className="mt-1 flex justify-between sm:mt-0">
              <div className="flex">
                <div className="ml-3 inline-flex items-center justify-center self-center">
                  <button
                    className="hover:shoorah-primary mx-3 inline-flex items-center justify-center rounded-2xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-9 py-2 text-sm font-normal text-white shadow-sm focus:outline-none sm:w-auto"
                    onClick={() => setAddUserPopUpOpen(true)}
                  >
                    + Add Specialist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-b-[10px] bg-shoorah-ggg pl-0 lg:pl-4 dark:bg-shoorah-darkBgColor dark:text-white">
        <div className="overflow-auto custom-scrollbar">
          <div className="w-full dark:border-shoorah-darkBgColor">
            <div className="w-full border-b-2 border-gray-200">
              <nav className="-mb-px flex space-x-8 pl-3 overflow-x-auto" aria-label="Tabs">
                {PEAP_CONTENT.map((tab) => (
                  <div
                    key={tab.name}
                    onClick={() => {
                      setSelectedContentType(tab.value);
                    }}
                    className={classNames(
                      selectedContentType === tab.value
                        ? 'text-gray border-shoorah-secondary dark:text-white'
                        : 'border-transparent text-gray-500 opacity-50 hover:cursor-pointer hover:border-gray-100 hover:text-gray-700',
                      'whitespace-nowrap border-b-2 px-2 py-2 text-sm font-medium dark:border-shoorah-darkBgColor'
                    )}
                  >
                    {tab.name}
                  </div>
                ))}
              </nav>
            </div>
            {selectedContentType === 1 && (
              <div>
                <div className="px-3">
                  <div className="flex justify-center"></div>
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
                      className="absolute left-9 z-[2] mx-auto mt-[80px] w-[100%] origin-top-right rounded-md bg-white p-5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-shoorah-darkBgTabColor dark:text-white sm:w-[600px] lg:w-[700px]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Filters</p>
                        <div className="flex space-x-3">
                          <button
                            //   onClick={resetHandler}
                            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-shoorah-darkBgColor dark:text-white dark:hover:bg-shoorah-darkBgColor"
                          >
                            Reset Filter
                          </button>
                          <button
                            //   onClick={() => setShowFilterModal(false)}
                            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-shoorah-darkBgColor dark:text-white dark:hover:bg-shoorah-darkBgColor"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <SelectMenu
                            menuList={APPROVAL_STATUS}
                            defaultSelected={filterCriteria.accountType}
                            label="DBS Status"
                            isRequired={false}
                            //   setSelectedMenu={(data) => filterHandler(data, 'accountType')}
                          />
                        </div>
                        <div>
                          <SelectMenu
                            menuList={STATUS_FOR_DROPDOWN}
                            label="Account status"
                            isRequired={false}
                            defaultSelected={filterCriteria.accountStatus}
                            //   setSelectedMenu={(data) => filterHandler(data, 'accountStatus')}
                          />
                        </div>
                        <div>
                          <SelectMenu
                            menuList={SIGN_UP_PLATFORM}
                            label="Signup Platform"
                            isRequired={false}
                            defaultSelected={filterCriteria.loginPlatform}
                            //   setSelectedMenu={(data) => filterHandler(data, 'loginPlatform')}
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
                            //   setSelectedMenu={(data) => filterHandler(data, 'addedBy')}
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
                            //   setSelectedMenu={(data) => filterHandler(data, 'role')}
                          />
                        </div>
                      </div>
                    </div>
                  </Transition>
                  {!Object.values(filterCriteria).every((x) => x === '') && (
                    <div className="mt-3 border px-2 py-1">
                      <div className="flex justify-between">
                        <div className="filter-container mr-2 self-center overflow-auto">
                          <div className="flex">
                            {Object.keys(filterCriteria).map((keyName, i) => (
                              <>
                                {filterCriteria?.[keyName]?.value?.toString() ? (
                                  <div
                                    className="mr-2 flex whitespace-nowrap bg-gray-200 px-2 py-1"
                                    key={i}
                                  >
                                    <p className="m-0 whitespace-nowrap object-contain text-[14px]">
                                      {getFilterKey(
                                        keyName === 'accountType' ? 'subscriptionStatus' : keyName
                                      )}
                                    </p>
                                    <p className="m-0 whitespace-nowrap text-[14px]">
                                      &nbsp;: &nbsp;
                                    </p>
                                    <p className="m-0 whitespace-nowrap text-[14px]">
                                      {filterCriteria?.[keyName].name}
                                    </p>
                                    <p
                                      className="m-0 ml-2 cursor-pointer self-center whitespace-nowrap border"
                                      // onClick={() => filterHandler('', keyName)}
                                    >
                                      <XMarkIcon className="w-[16px] border border-shoorah-primary bg-shoorah-secondary text-white" />
                                    </p>
                                  </div>
                                ) : (
                                  ''
                                )}
                              </>
                            ))}
                          </div>
                        </div>
                        <div className="flex w-[50px] justify-end self-center">
                          <button className="bg-shoorah-secondary px-2 py-1">
                            {/* onClick={resetHandler}> */}
                            <XMarkIcon className="w-[18px] border-shoorah-primary bg-shoorah-secondary text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-2">
                    <div className="mt-6">
                      <div className="flex pb-4 pt-3">
                        <div className="relative flex w-full justify-between">
                          <button
                            className="hover:shoorah-primary inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white from-shoorah-primary to-shoorah-secondary px-4 py-1 text-sm font-medium text-white shadow-sm focus:outline-none dark:border-none dark:bg-shoorah-darkBgTabColor sm:w-auto"
                            onClick={() => setShowFilterModal((state) => !state)}
                          >
                            <FunnelIcon className="inline h-[22px] w-[20px] text-gray-400" />
                            <div className="relative left-[2px] pl-[10px] pr-[10px] text-gray-400">
                              Filter
                            </div>
                          </button>
                          <div className="relative flex justify-end h-11 items-center  bg-white rounded-2xl border-2 border-gray-300">
                            <img
                              loading='lazy'
                              className=" col-span-2 w-[24px] h-[24px]"
                              src={newSearch}
                              alt="seachicon"
                            />
                            <input
                              type="text"
                              placeholder="Search"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="  font-normal text-base w-[80%] h-full rounded-2xl  mt-5  mb-5 pl-4 focus:outline-none "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-3">
                      <Table
                        columns={columns}
                        data={usersList}
                        name={'users_table'}
                        bottomBorder={totalCount > selectedPerPage?.value}
                        refreshTable={() =>
                          handlePagination(currentPage, selectedPerPage?.value, '')
                        }
                        loader={loader}
                      />
                    </div>
                    <div></div>
                  </div>
                </div>
                <div>
                  {usersList?.length >= 10 ? (
                    <Pagination
                      currentPage={currentPage}
                      totalCount={totalCount}
                      pageSize={selectedPerPage?.value}
                      onPageChange={(page) => handlePagination(page, selectedPerPage?.value, '')}
                    />
                  ) : (
                    <span />
                  )}
                </div>
              </div>
            )}
            {selectedContentType === 3 && <Complainant />}
            {selectedContentType === 2 && <Insights />}
            {selectedContentType === 4 && <Messaging />}
            {selectedContentType === 5 && <Peapapproval />}
          </div>
        </div>

        <div>
          {/* <PerformanceData
                          contentType={selectedContentType}
                          userId={location?.state?.id || location?.state._id}
                        /> */}
        </div>
      </div>
    </div>
  );
}

export default Specialist;

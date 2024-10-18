import { Fragment, useEffect, useRef, useState } from 'react';

import { getFilterKey, useOutsideClick } from '../../../utils/helper';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import {
  APPROVAL_STATUS,
  JOB_ROLES,
  PER_PAGE,
  SIGN_UP_PLATFORM,
  STATUS_FOR_DROPDOWN
} from '../../../utils/constants';
import SelectMenu from '../../../component/common/SelectMenu';
import Table from '../../../component/common/Table';
import Pagination from '../../../component/common/Pagination/Pagination';
import { Api } from '../../../api';
import newSearch from '../../../assets/images/newSearch.svg';
import { FunnelIcon } from '@heroicons/react/24/outline';

import { SPECIALIST_ROLE } from '../../../utils/constants';

function ActiveSpecialist(params) {
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

  /////////////

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
    // Reset to first page when search term changes
    if (searchTerm !== '') {
      setCurrentPage(1);
    }
    fetchUsers(1, selectedPerPage.value, '', searchTerm);
  }, [searchTerm, selectedPerPage]);

  useEffect(() => {
    fetchUsers(currentPage, selectedPerPage.value, '', searchTerm);
  }, [searchTerm, currentPage, selectedPerPage]);
  const fetchUsers = (pageNumber, pageSize, userId, searchKey = '') => {
    setLoader(true);
    Api.getSpecialistData(pageNumber, pageSize, userId, searchKey)

      .then((response) => {
        setLoader(false);
        if (response?.data?.meta?.code === 1) {
          setUsersList(response?.data?.data);
          setCurrentPage(pageNumber);
          setTotalCount(response?.data?.meta?.totalRecords);
          const totalPages = Math.ceil(response?.data?.meta?.totalRecords / pageSize);
          if (pageNumber > totalPages) {
            setCurrentPage(totalPages);
            fetchUsers(totalPages, pageSize, '', searchKey);
          }
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

  // const fetchUsers = (pageNumber, pageSize, userId, searchKey = '') => {
  //   setLoader(true);
  //   Api.getSpecialistData(pageNumber, pageSize, userId, searchKey)
  //     .then((response) => {
  //       setLoader(false);
  //       if (response?.data?.meta?.code === 1) {
  //         setUsersList(
  //           response?.data?.data.map((user) => ({
  //             ...user,
  //             name: (
  //               <span
  //                 onClick={() => handleNameClick(user.expert._id)} // Set expert ID on click
  //                 className="cursor-pointer text-blue-600 hover:underline"
  //               >
  //                 {user.name}
  //               </span>
  //             )
  //           }))
  //         );
  //         setCurrentPage(pageNumber);
  //         setTotalCount(response?.data?.meta?.totalRecords);
  //         const totalPages = Math.ceil(response?.data?.meta?.totalRecords / pageSize);
  //         if (pageNumber > totalPages) {
  //           setCurrentPage(totalPages);
  //           fetchUsers(totalPages, pageSize, '', searchKey);
  //         }
  //       } else {
  //         setUsersList([]);
  //         setTotalCount(0);
  //       }
  //       console.log('🚀 ~ .then ~ response?.data?.data:', response?.data?.data);
  //     })
  //     .catch((error) => {
  //       setLoader(false);
  //       console.error('API call error: ', error);
  //     });
  // };

  // const fetchUsers = (pageNumber, pageSize, userId, searchKey = '') => {
  //   setLoader(true);

  //   Api.getSpecialistData(pageNumber, pageSize, userId, searchKey)
  //     .then((response) => {
  //       setLoader(false);

  //       if (response?.data?.meta?.code === 1) {
  //         const totalRecords = response?.data?.meta?.totalRecords;
  //         const totalPages = Math.ceil(totalRecords / pageSize);

  //         // Adjust current page if it exceeds total pages
  //         if (pageNumber > totalPages) {
  //           setCurrentPage(totalPages);
  //           // Fetch the data for the last valid page
  //           fetchUsers(totalPages, pageSize, userId, searchKey);
  //           return; // Early return to avoid further processing
  //         }

  //         setUsersList(response?.data?.data);
  //         setCurrentPage(pageNumber);
  //         setTotalCount(totalRecords);
  //       } else {
  //         setUsersList([]);
  //         setTotalCount(0);
  //       }
  //     })
  //     .catch((error) => {
  //       setLoader(false);
  //       console.error('API call error: ', error);
  //     });
  // };

  const handlePagination = (pageNumber, pageSize, userId) => {
    fetchUsers(pageNumber, pageSize, userId, searchTerm);
  };

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

  return (
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
                <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-shoorah-darkBgColor dark:text-white dark:hover:bg-shoorah-darkBgColor">
                  Reset Filter
                </button>
                <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-shoorah-darkBgColor dark:text-white dark:hover:bg-shoorah-darkBgColor">
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
                />
              </div>
              <div>
                <SelectMenu
                  menuList={STATUS_FOR_DROPDOWN}
                  label="Account status"
                  isRequired={false}
                  defaultSelected={filterCriteria.accountStatus}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={SIGN_UP_PLATFORM}
                  label="Signup Platform"
                  isRequired={false}
                  defaultSelected={filterCriteria.loginPlatform}
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
                        <div className="mr-2 flex whitespace-nowrap bg-gray-200 px-2 py-1" key={i}>
                          <p className="m-0 whitespace-nowrap object-contain text-[14px]">
                            {getFilterKey(
                              keyName === 'accountType' ? 'subscriptionStatus' : keyName
                            )}
                          </p>
                          <p className="m-0 whitespace-nowrap text-[14px]">&nbsp;: &nbsp;</p>
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
                  <img className=" col-span-2 w-[24px] h-[24px]" loading='lazy' src={newSearch} alt="seachicon" />
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
              refreshTable={() => handlePagination(currentPage, selectedPerPage?.value, '')}
              loader={loader}
            />
          </div>
          <div></div>
        </div>
      </div>
      <div>
        {totalCount > selectedPerPage?.value ? (
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
  );
}

export default ActiveSpecialist;

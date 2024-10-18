/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useRef, useState } from 'react';

import { FunnelIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { getFilterKey, getLocalStorageItem, useOutsideClick } from '../../../utils/helper';
import {
  ACCOUNT_TYPE,
  JOB_ROLES,
  PEAP_CONTENT,
  PERFORMANCE_CONTENT_TYPE,
  PER_PAGE,
  SIGN_UP_PLATFORM,
  STATUS_FOR_DROPDOWN
} from '../../../utils/constants';
import { Helmet } from 'react-helmet';
import SelectMenu from '../../../component/common/SelectMenu';
import SearchInput from '../../../component/common/Input/SearchInput';
import Table from '../../../component/common/Table';
import Pagination from '../../../component/common/Pagination/Pagination';

const columns = [
  {
    title: 'Specialist Name',
    key: 'name',
    type: 'text',
    align: 'left'
  },
  {
    title: 'Request Type',
    key: 'request',
    type: 'text',
    align: 'left'
  },
  {
    title: 'Client Name',
    key: 'clientname',
    type: 'text',
    align: 'left'
  },
  {
    title: 'Date',
    key: 'date',
    type: 'date',
    align: 'left'
  },
  {
    title: 'Approve/Decline',
    key: 'status',
    type: 'checkBox',
    align: 'left'
  }
];

const toApprove = [
  {
    name: 'Dr. Esther Cooper',
    request: 'Request to send document to client',
    clientname: 'Ruben Hale',
    date: '24 April, 2024',
    id: 1,
    align: 'center'
  },
  {
    name: 'Dr. Esther Cooper',
    request: 'Request to send document to client',
    clientname: 'Ruben Hale',
    date: '24 April, 2024',
    id: 2,
    align: 'center'
  },
  {
    name: 'Dr. Esther Cooper',
    request: 'Request to send document to client',
    clientname: 'Ruben Hale',
    date: '24 April, 2024',
    id: 3,
    align: 'center'
  },
  {
    name: 'Dr. Esther Cooper',
    request: 'Request to send document to client',
    clientname: 'Ruben Hale',
    date: '24 April, 2024',
    id: 4,
    align: 'center'
  },

  {
    name: 'Dr. Esther Cooper',
    request: 'Request to send document to client',
    clientname: 'Ruben Hale',
    date: '24 April, 2024',
    id: 5,
    align: 'center'
  },
  {
    name: 'Dr. Esther Cooper',
    request: 'Request to send document to client',
    clientname: 'Ruben Hale',
    date: '24 April, 2024',
    id: 6,
    align: 'center'
  }
];

function Peapapproval() {
  const wrapperRef = useRef(null);
  const [companyList, setCompanyList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [usersList, setUsersList] = useState(toApprove);

  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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
    company: null,
    platform: selectedPlatform,
    jobRole: job
  });

  const [valid, setValid] = useState({});

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  // useEffect(() => {
  //   if (userData.userType) {
  //     window.location.href = userData?.slug ? `/${userData?.slug}/users` : '/users';
  //   }
  // }, [userData]);

  const [from, setFrom] = useState([]);
  const [file, setFile] = useState(null);

  const [to, setTo] = useState([]);

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Specialist Shoorah Admin</title>
      </Helmet>

      <div className=" px-3">
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
            className="absolute p-5 left-5 z-[2] mt-[40px] w-[100%] sm:w-[600px] lg:w-[700px] dark:bg-shoorah-darkBgTabColor dark:text-white mx-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  "
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">Filters</p>
              <div className="flex space-x-3">
                <button
                  //   onClick={resetHandler}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-shoorah-darkBgColor dark:text-white dark:hover:bg-shoorah-darkBgColor text-sm font-medium rounded-md"
                >
                  Reset Filter
                </button>
                <button
                  // onClick={() => setShowFilterModal(false)}
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
          <div className="border py-1 px-2 mt-3">
            <div className="flex justify-between">
              <div className="self-center overflow-auto filter-container mr-2">
                <div className="flex">
                  {Object.keys(filterCriteria).map((keyName, i) => (
                    <>
                      {filterCriteria?.[keyName]?.value?.toString() ? (
                        <div className="flex bg-gray-200 px-2 py-1 mr-2 whitespace-nowrap" key={i}>
                          <p className="text-[14px] object-contain m-0 whitespace-nowrap">
                            {getFilterKey(
                              keyName === 'accountType' ? 'subscriptionStatus' : keyName
                            )}
                          </p>
                          <p className="text-[14px] m-0 whitespace-nowrap">&nbsp;: &nbsp;</p>
                          <p className="text-[14px] m-0 whitespace-nowrap ">
                            {filterCriteria?.[keyName].name}
                          </p>
                          <p
                            className="border cursor-pointer m-0 ml-2 self-center whitespace-nowrap"
                            // onClick={() => filterHandler('', keyName)}
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
                <button className="px-2 py-1 bg-shoorah-secondary">
                  {/* onClick={resetHandler}> */}
                  <XMarkIcon className="w-[18px] border-shoorah-primary text-white bg-shoorah-secondary" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className=" pt-3 pb-4 mt-6">
          <div className=" flex justify-between">
            <button
              className=" inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white from-shoorah-primary to-shoorah-secondary px-4 py-1 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
              onClick={() => setShowFilterModal((state) => !state)}
            >
              <FunnelIcon className=" text-gray-400 w-[20px] h-[22px] inline" />
              <div className="text-gray-400 relative left-[2px] pl-[10px] pr-[10px]">Filter</div>
            </button>
            <div className="flex">
              <SearchInput
                className="inline-flex items-centerjustify-center px-5 py-6 
                           border border-transparent rounded-2xl"
                id="searchKey"
                name="searchKey"
                type="text"
                // onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search "
                inputClassName="rounded-xl"
              />
            </div>
          </div>
        </div>
        <div className="  pt-3 ">
          <Table
            columns={columns}
            data={usersList}
            name={'users_table'}
            bottomBorder={totalCount > selectedPerPage?.value}
            // setSortBy={(sort) => handleSortBy(sort)}
            // refreshTable={refreshTable}
            // loader={loader}
          />

          <div></div>
        </div>
      </div>
      <div>
        {usersList?.length >= 10 ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={selectedPerPage?.value}
            // onPageChange={(page) =>
            //   handlePagination(
            //     page,
            //     selectedPerPage?.value,
            //     searchTerm,
            //     filterQuery,
            //     sortBy,
            //     sortOrder
            //   )
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export default Peapapproval;

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import SelectMenu from '../../../../component/common/SelectMenu';
import SearchInput from '../../../../component/common/Input/SearchInput';
import { ACCOUNT_TYPE, PER_PAGE } from '../../../../utils/constants';
import { Api } from '../../../../api';
import { errorToast, getFilterKey, useOutsideClick } from '../../../../utils/helper';
import Table from '../../../../component/common/Table';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../../component/common/Pagination/Pagination';
import Breadcrumb from '../../../../component/common/Breadcrumb';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Transition } from '@headlessui/react';
import Loader from '../../../../component/common/Loader';

function Companylist() {
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filterCriteria, setFilterCriteria] = useState({
    companySubscription: ''
  });

  const pages = [{ name: 'Company List', href: '/B2B-company-list', current: true }];

  const columns = [
    {
      title: 'Company Name',
      key1: 'company_logo',
      sortable: false,
      type: 'companyName',
      align: 'left'
    },
    {
      title: 'Email',
      key: 'company_email',
      sortable: false,
      sortKey: 'company_email',
      type: 'text',
      align: 'left'
    },
    // {
    //   title: "Mood",
    //   key: "company_mood",
    //   sortable: false,
    //   sortKey: "company_mood",
    //   type: "text",
    //   align: "center",
    // },
    {
      title: 'Contract End Date',
      key: 'contract_end_date',
      type: 'date',
      sortable: true,
      align: 'center'
    },
    {
      title: 'Cost Per Seat',
      key: 'seat_price',
      type: 'text',
      align: 'center'
    },
    {
      title: 'Subscription',
      key: 'company_subscription',
      sortable: false,
      sortKey: 'company_subscription',
      type: 'accountType',
      align: 'left'
    },
    {
      title: 'Contract Signed',
      key: 'contract_signed',
      sortable: false,
      type: 'boolean',
      align: 'center'
    },
    {
      title: 'Action',
      key: 'action',
      type: 'action',
      align: 'right',
      isView: '/B2B-company-list/viewCompany',
      isDelete: false
    }
  ];

  const handlePagination = (pageNumber, pageSize, searchKey, sortBy, sortOrder) => {
    setLoader(true);
    Api.getAllCompanies(pageNumber, pageSize, searchKey, sortBy, sortOrder).then((response) => {
      setLoader(false);
      if (response?.data) {
        if (response?.data?.data) {
          setUsersList(response?.data?.data);
          setCurrentPage(pageNumber);
          setTotalCount(response?.data?.meta?.totalRecords);
          setLoader(false);
        } else {
          setLoader(false);
          errorToast('Something went wrong, please try again later !');
        }
      } else if (response?.code === 401) {
        errorToast(response?.message);
        setLoader(false);
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        setCurrentPage(1);
        setUsersList([]);
        setTotalCount(0);
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
      handlePagination(currentPage, selectedPerPage?.value, searchTerm, sortByValue, tempSortOrder);
    } else {
      setSortOrder(1);
      handlePagination(currentPage, selectedPerPage?.value, searchTerm, sortByValue, 1);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, searchParam, sortBy, sortOrder);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, 10, '', sortBy, sortOrder);
    }
  }, [searchTerm]);

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm, sortBy, sortOrder);
  };

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

  const refreshTable = () => handlePagination(1, selectedPerPage?.value, '', sortBy, sortOrder);

  const filterHandler = (data, key) => {
    setFilterCriteria((prevData) => ({
      ...prevData,
      [key]: data
    }));
    let clone = JSON.parse(JSON.stringify(filterCriteria));
    const newData = { ...clone, [key]: data };
    let tempFilterQuery = [];
    Object.keys(newData).forEach(function (key) {
      if (newData[key]?.value?.toString()) {
        tempFilterQuery.push(`&${key}=${newData[key]?.value}`);
      }
    });
    let query = tempFilterQuery?.toString()?.replaceAll(',', '');
    setFilterQuery(query);
    handlePagination(1, selectedPerPage.value, searchTerm, query, sortBy, sortOrder);
  };

  const resetHandler = () => {
    setFilterCriteria({
      companySubscription: ''
    });
    setFilterQuery('');
    setShowFilterModal(false);
    handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>B2B | Dashboard</title>
      </Helmet>
      {loader ? <Loader /> : null}
      <Breadcrumb pageList={pages} />
      <div className="mt-5">
        <div className="sm:flex justify-between">
          <div className="flex">
            <div className="hidden sm:flex mr-3 self-center">
              <span className="self-center ml-3 text-sm mr-2 dark:text-white">Per page:</span>
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
                placeholder="Search by company name and what companies are listed under salesman's"
              />
            </div>
          </div>
          <div className="mt-3 sm:mt-0 flex justify-between">
            <div className="sm:hidden flex self-center">
              <span className="self-center text-sm mr-2 dark:text-white ">Per page:</span>
              <div className="w-[80px]">
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className="flex ">
              <div className="ml-3 self-center inline-flex items-center justify-center">
                <button
                  className="inline-flex mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => {
                    navigate('/B2B-company-list/addCompany', {
                      state: { action: 'Add' }
                    });
                  }}
                >
                  Add New
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
                  defaultSelected={filterCriteria.companySubscription}
                  label="Subscription Status"
                  isRequired={false}
                  setSelectedMenu={(data) => filterHandler(data, 'companySubscription')}
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
                              keyName === 'companySubscription' ? 'subscriptionStatus' : keyName
                            )}
                          </p>
                          <p className="text-[14px] m-0 whitespace-nowrap">&nbsp;: &nbsp;</p>
                          <p className="text-[14px] m-0 whitespace-nowrap ">
                            {filterCriteria?.[keyName].name}
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

        <div className="mt-4 px-3">
          <Table
            columns={columns}
            data={usersList}
            name={'company_table'}
            bottomBorder={totalCount > selectedPerPage?.value}
            setSortBy={(sort) => handleSortBy(sort)}
            refreshTable={refreshTable}
            loader={loader}
            r
          />
        </div>
        <div>
          {usersList.length > 0 && !loader ? (
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={selectedPerPage?.value}
              onPageChange={(page) =>
                handlePagination(page, selectedPerPage?.value, searchTerm, sortBy, sortOrder)
              }
            />
          ) : (
            <span />
          )}
        </div>
      </div>
    </>
  );
}

export default Companylist;

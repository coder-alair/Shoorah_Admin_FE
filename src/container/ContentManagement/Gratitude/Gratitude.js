import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../../api';
import {
  errorToast,
  successToast,
  useOutsideClick,
  getFilterKey,
  isSuperAdmin
} from '../../../utils/helper';
import Loader from '../../../component/common/Loader';
import Breadcrumb from '../../../component/common/Breadcrumb';
import Table from '../../../component/common/Table';
import Pagination from '../../../component/common/Pagination/Pagination';
import { Helmet } from 'react-helmet';
import SearchInput from '../../../component/common/Input/SearchInput';
import SelectMenu from '../../../component/common/SelectMenu';
import { PER_PAGE, STATUS_FOR_DROPDOWN } from '../../../utils/constants';
import { useRef } from 'react';
import { Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

const pages = [{ name: 'Gratitude', href: '/content-management/gratitude' }];

const columns = [
  // {
  //   title: '',
  //   key: '',
  //   sortable: false,
  //   type: 'checkBox',
  //   align: 'left'
  // },
  {
    title: 'Gratitude Name',
    key: 'gratitudeTitle',
    sortable: true,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Focus',
    key: 'focus',
    sortable: false,
    type: 'array',
    align: 'left'
  },
  {
    title: 'Approval Status',
    key: 'approvalStatus',
    sortable: false,
    type: 'contentStatus',
    align: 'left'
  },
  {
    title: 'Created By',
    key1: 'createdBy',
    key2: 'name',
    sortable: false,
    type: 'text',
    align: 'left',
    nested: true
  },
  {
    title: 'Approved By',
    key1: 'approvedBy',
    key2: 'name',
    sortable: false,
    type: 'text',
    align: 'left',
    nested: true
  },
  {
    title: 'Created On',
    key: 'createdOn',
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: 'Approved On',
    key: 'approvedOn',
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: 'Status',
    key: 'gratitudeStatus',
    sortable: false,
    type: 'badge',
    align: 'left'
  },
  {
    title: '',
    key: 'action',
    type: 'action',
    align: 'right',
    isEdit: '/content-management/gratitude/add-edit',
    isView: '',
    isDelete: true
  }
];

const PAGE_SIZE = 10;
const Gratitude = () => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [gratitudesList, setGratitudesList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [adminNameList, setAdminNameList] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    accountType: '',
    gratitudeStatus: ''
  });
  const handlePagination = (pageNumber, pageSize, searchKey, sortBy, sortOrder) => {
    handleFilterAdminList();
    setLoader(true);
    Api.getGratitudeList(pageNumber, pageSize, searchKey, sortBy, sortOrder).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setGratitudesList(response?.data?.data);
        setTotalCount(response?.data?.meta?.totalRecords);
        setLoader(false);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setGratitudesList([]);
        setTotalCount(0);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };
  const refreshTable = () => handlePagination(1, PAGE_SIZE, '', sortBy, sortOrder);

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, PAGE_SIZE, searchParam, sortBy, sortOrder);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, PAGE_SIZE, '', sortBy, sortOrder);
    }
  }, [searchTerm]);

  const deleteHandler = (id) => {
    setLoader(true);
    setSearchTerm('');
    Api.deleteGratitude(id).then((response) => {
      if (response?.data?.meta?.code === 1) {
        handlePagination(1, PAGE_SIZE, '', sortBy, sortOrder);
        successToast(response?.data?.meta?.message);
      } else if (response?.data?.meta?.code === 0) {
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
      handlePagination(currentPage, PAGE_SIZE, searchTerm, sortByValue, tempSortOrder);
    } else {
      setSortOrder(1);
      handlePagination(currentPage, PAGE_SIZE, searchTerm, sortByValue, 1);
    }
  };

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
      accountType: '',
      gratitudeStatus: ''
    });
    setFilterQuery('');
    setShowFilterModal(false);
    handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
  };

  const handleFilterAdminList = () => {
    Api.adminList().then((response) => {
      let adminList = response.data.data.map((admin) => {
        return {
          value: admin.id,
          name: admin.name
        };
      });
      adminList = [{ name: 'Select Admin', value: '' }, ...adminList];
      setAdminNameList(adminList);
    });
  };

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Gratitude | Shoorah Admin</title>
      </Helmet>
      {loader ? <Loader /> : null}

      <Breadcrumb pageList={pages} />
      <div className="mt-6">
        <div className="sm:flex justify-between">
          <div className="flex">
            <div className="hidden sm:flex mr-3 self-center">
              <span className="self-center text-sm mr-2">Per page:</span>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by user name and email"
              />
            </div>
          </div>
          <div className="mt-3 sm:mt-0 sm:flex sm:justify-between">
            <div className="sm:hidden flex self-center">
              <span className="self-center text-sm mr-2">Per page:</span>
              <div className="w-[80px]">
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className="flex sm:mt-0 mt-4">
              {isSuperAdmin() ? (
                <div className="sm:ml-3 self-center">
                  <button
                    onClick={() => filterHandler({ name: 'Drafts', value: 0 }, 'approvalStatus')}
                    type="button"
                    className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2 sm:w-auto"
                  >
                    Drafts
                  </button>
                </div>
              ) : null}

              <div className="ml-3 self-center">
                <button
                  onClick={() => navigate('/content-management/gratitude/add-edit')}
                  type="button"
                  className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2 sm:w-auto"
                >
                  Add New
                </button>
              </div>
              <div className="ml-3 self-center">
                <button
                  className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => setShowFilterModal((state) => !state)}
                >
                  <FunnelIcon className="text-white w-[18px] h-[20px] inline" />
                </button>
              </div>
              {/* <div className='ml-3 self-center'>
                <button
                  className='inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto'
                  // onClick={() => setShowFilterModal((state) => !state)}
                >
                  <ArrowDownTrayIcon className='text-white w-[18px] h-[20px] inline' />
                </button>
              </div> */}
            </div>
          </div>
        </div>
        {showFilterModal && (
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
              className="absolute p-5 right-0 z-[2] mt-2 w-[100%] sm:w-[600px] lg:w-[700px] mx-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  "
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">Filters</p>
                <div className="flex space-x-3">
                  <button
                    onClick={resetHandler}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
                  >
                    Reset Filter
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <SelectMenu
                    menuList={STATUS_FOR_DROPDOWN}
                    defaultSelected={filterCriteria.focusStatus}
                    label="Status"
                    isRequired={false}
                    setSelectedMenu={(data) => filterHandler(data, 'gratitudeStatus')}
                  />
                </div>
                <div>
                  <SelectMenu
                    menuList={adminNameList}
                    defaultSelected={filterCriteria.createdBy}
                    label="Created by"
                    isRequired={false}
                    setSelectedMenu={(data) => filterHandler(data, 'createdBy')}
                  />
                </div>
                <div>
                  <SelectMenu
                    menuList={adminNameList}
                    defaultSelected={filterCriteria.approvalBy}
                    label="Approved By"
                    isRequired={false}
                    setSelectedMenu={(data) => filterHandler(data, 'approvedBy')}
                  />
                </div>
              </div>
            </div>
          </Transition>
        )}

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
                            {getFilterKey(keyName)}
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

        <div className="mt-4">
          <Table
            columns={columns}
            data={gratitudesList}
            name={'gratitude_table'}
            setDeleteId={deleteHandler}
            bottomBorder={totalCount > PAGE_SIZE}
            contentType={6}
            setSortBy={(sort) => handleSortBy(sort)}
            refreshTable={refreshTable}
            addNewURL="/content-management/gratitude/add-edit"
            setSearchTerm={(data) => setSearchTerm(data)}
          />
        </div>
      </div>
      <div>
        {totalCount > selectedPerPage?.value ? (
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
    </>
  );
};

export default Gratitude;

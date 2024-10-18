import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../../api';
import {
  errorToast,
  successToast,
  useOutsideClick,
  getFilterKey,
  isSuperAdmin
} from '../../../utils/helper';
import Breadcrumb from '../../../component/common/Breadcrumb';
import Table from '../../../component/common/Table';
import Pagination from '../../../component/common/Pagination/Pagination';
import { Helmet } from 'react-helmet';
import SearchInput from '../../../component/common/Input/SearchInput';
import { APPROVAL_STATUS_DROPDOWN, PER_PAGE, STATUS_FOR_DROPDOWN } from '../../../utils/constants';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import SelectMenu from '../../../component/common/SelectMenu';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';
import Loader from '../../../component/common/Loader';

const pages = [{ name: 'Vision Ideas', href: '/content-management/vision-ideas' }];

const PAGE_SIZE = 10;

const draft_check = {
  name: 'Draft',
  value: 0
};

const Rituals = (props) => {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [loader, setLoader] = useState(true);
  const [ritualsList, setRitualsList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [adminNameList, setAdminNameList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    ideaStatus: '',
    approvalStatus: ''
  });
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const handlePagination = (pageNumber, pageSize, searchKey, sortBy, sortOrder) => {
    handleFilterAdminList();
    setLoader(true);

    if (isDraftsOpen) {
      Api.getDraftVisionIdeasList(pageNumber, pageSize, searchKey, sortBy, sortOrder).then(
        (response) => {
          if (response?.data?.meta?.code === 1) {
            setCurrentPage(pageNumber);
            setRitualsList(response?.data?.data);
            setTotalCount(response?.data?.meta?.totalRecords);
            setLoader(false);
          } else if (response?.data?.meta?.code === 0) {
            setCurrentPage(1);
            setRitualsList([]);
            setTotalCount(0);
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        }
      );

      return;
    }
    Api.getVisionIdeasList(pageNumber, pageSize, searchKey, sortBy, sortOrder).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setRitualsList(response?.data?.data);
        setTotalCount(response?.data?.meta?.totalRecords);
        setLoader(false);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setRitualsList([]);
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
      if (props?.location?.state?.flag === 0) {
        filterHandler(draft_check, 'approvalStatus');
      } else {
        handlePagination(1, PAGE_SIZE, '', sortBy, sortOrder);
      }
    }
  }, [searchTerm, isDraftsOpen]);

  const deleteHandler = (id) => {
    setLoader(true);
    setSearchTerm('');
    Api.deleteVisionIdea(id).then((response) => {
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
      ideaStatus: ''
    });
    setFilterQuery('');
    setShowFilterModal(false);
    handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
  };

  const handleFilterAdminList = () => {
    Api.adminList().then((response) => {
      let adminList = response.data.data
        .map((admin) => {
          return {
            value: admin.id,
            name: admin.name
          };
        })
        .filter(({ name, value }) => name && value);
      adminList = [{ name: 'Select Admin', value: '' }, ...adminList];
      setAdminNameList(adminList);
    });
  };

  const columns = [
    // {
    //   title: '',
    //   key: '',
    //   sortable: false,
    //   type: 'checkBox',
    //   align: 'left'
    // },
    {
      title: 'Idea Name',
      key: 'ideaName',
      sortable: true,
      sortKey: 'display_name',
      type: 'text',
      align: 'left',
      longText: true
    },
    // {
    //   title: 'Duration',
    //   key: 'duration',
    //   sortable: false,
    //   type: 'text',
    //   align: 'left',
    // },
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
      key: 'ideaStatus',
      sortable: false,
      type: 'badge',
      align: 'left'
    },
    {
      title: '',
      key: 'action',
      type: isDraftsOpen ? 'draftAction' : 'action',
      align: 'right',
      isEdit: '/content-management/vision-ideas/add-edit',
      isView: '/content-management/vision-ideas/view',
      isDelete: true
    }
  ];

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Vision Ideas | Shoorah Admin</title>
      </Helmet>
      {loader ? <Loader /> : null}

      <Breadcrumb pageList={pages} />
      <div className="mt-4 px-3">
        <div className="sm:flex justify-between">
          <div className="flex">
            <div className="hidden sm:flex mr-3 self-center">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by vision ideas name"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div className="sm:hidden flex self-center">
              <span className="self-center hidden text-sm mr-2 dark:text-white">Per page:</span>
              <div className="w-16">
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-y-2">
              {isSuperAdmin() ? (
                <div className="sm:ml-3 self-center">
                  <button
                    // onClick={() => filterHandler({ name: 'Drafts', value: 0 }, 'approvalStatus')}
                    onClick={() => {
                      setIsDraftsOpen(!isDraftsOpen);
                    }}
                    type="button"
                    className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2 sm:w-auto"
                  >
                    {isDraftsOpen ? 'List' : 'Drafts'}
                  </button>
                </div>
              ) : null}

              <div className="ml-3 self-center">
                <button
                  onClick={() => navigate('/content-management/vision-ideas/add-edit')}
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
              className="absolute p-5 right-0 z-[2] mt-2 w-[100%] dark:bg-shoorah-darkBgColor  dark:text-white sm:w-[600px] lg:w-[700px] mx-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  "
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">Filters</p>
                <div className="flex space-x-3">
                  <button
                    onClick={resetHandler}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-shoorah-darkBgTabColor dark:hover:bg-inherit dark:text-white text-gray-800 text-sm font-medium rounded-md"
                  >
                    Reset Filter
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-shoorah-darkBgTabColor dark:hover:bg-inherit dark:text-white text-gray-800 text-sm font-medium rounded-md"
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
                    setSelectedMenu={(data) => filterHandler(data, 'ideaStatus')}
                  />
                </div>
                <div>
                  <SelectMenu
                    menuList={APPROVAL_STATUS_DROPDOWN}
                    defaultSelected={filterCriteria?.approvalStatus}
                    label="Approval status"
                    isRequired={false}
                    setSelectedMenu={(data) => filterHandler(data, 'approvalStatus')}
                  />
                </div>
                {!isSuperAdmin() && (
                  <div>
                    <SelectMenu
                      menuList={adminNameList}
                      defaultSelected={filterCriteria.createdBy}
                      label="Created by"
                      isRequired={false}
                      setSelectedMenu={(data) => filterHandler(data, 'createdBy')}
                    />
                  </div>
                )}
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
            contentType={9}
            loader={loader}
            columns={columns}
            data={ritualsList}
            setDeleteId={deleteHandler}
            refreshTable={refreshTable}
            bottomBorder={totalCount > PAGE_SIZE}
            setSortBy={(sort) => handleSortBy(sort)}
            setSearchTerm={(data) => setSearchTerm(data)}
            addNewURL="/content-management/vision-ideas/add-edit"
          />
        </div>
      </div>
      <div>
        {ritualsList.length > 0 && !loader ? (
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

Rituals.propTypes = {
  location: PropTypes.any
};

export default Rituals;

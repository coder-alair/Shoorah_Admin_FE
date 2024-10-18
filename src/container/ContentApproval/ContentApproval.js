import { Fragment, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../component/common/Breadcrumb';
import Table from '../../component/common/Table';
import { Api } from '../../api';
import Pagination from '../../component/common/Pagination/Pagination';
import { errorToast, useOutsideClick, getFilterKey, isSuperAdmin,isCopanySuperAdmin } from '../../utils/helper';
import SearchInput from '../../component/common/Input/SearchInput';
import { Helmet } from 'react-helmet';
import SelectMenu from '../../component/common/SelectMenu';
import { APPROVAL_STATUS_DROPDOWN, CONTENT_TYPE, PER_PAGE } from '../../utils/constants';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { CompanyApi } from '../../api/companyApi';

const pages = [{ name: 'Content Approval', href: '/content-approval', current: true }];

const columns = [
  {
    title: 'Name',
    key: 'displayName',
    sortable: true,
    sortKey: 'display_name',
    type: 'text',
    longText: true,
    align: 'left'
  },
  {
    title: 'Type',
    key: 'contentType',
    sortable: false,
    sortKey: 'content_type',
    type: 'contentType',
    align: 'left'
  },
  {
    title: 'Expert Name',
    key: 'expertName',
    extend: true,
    sortable: false,
    sortKey: 'expert_name',
    type: 'text',
    longText: false,
    align: 'left'
  },
  {
    title: 'Approval Status',
    key: 'contentStatus',
    extend: true,
    sortable: false,
    type: 'contentStatus',
    align: 'left'
  },
  {
    title: 'Created By',
    key1: 'createdBy',
    extend: true,
    key2: 'name',
    sortable: false,
    type: 'text',
    align: 'left',
    nested: true
  },
  {
    title: 'Updated By',
    key1: 'updatedBy',
    extend: true,
    key2: 'name',
    sortable: false,
    type: 'text',
    align: 'left',
    nested: true
  },
  {
    title: 'Created On',
    key: 'createdOn',
    extend: true,
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: 'Updated On',
    extend: true,
    key: 'updatedOn',
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: '',
    key: 'action',
    type: 'action',
    align: 'right',
    // isView: '/content-approval/view',
    isTwoOption: '/content-approval/view',
    isResend: false,
    isDelete: false
  }
];

function ContentApproval() {
  const wrapperRef = useRef(null);
  const [loader, setLoader] = useState(true);
  const [contentList, setContentListList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('&contentStatus=0');
  const [adminNameList, setAdminNameList] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    contentType: '',
    contentStatus: { name: 'Draft', value: 0 },
    updatedBy: '',
    createdBy: ''
  });

  const handlePagination = (pageNumber, pageSize, searchKey, query, sortBy, sortOrder) => {
    handleFilterAdminList();
    setLoader(true);
    const fetchContentApproval = isSuperAdmin()
      ? Api.getContentApprovalList(pageNumber, pageSize, searchKey, query, sortBy, sortOrder)
      :isCopanySuperAdmin()? CompanyApi.getContentApprovalListB2b(
          pageNumber,
          pageSize,
          searchKey,
          query,
          sortBy,
          sortOrder
        ):null;
    fetchContentApproval.then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setContentListList(response?.data?.data);
        setTotalCount(response?.data?.meta?.totalRecords);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setContentListList([]);
        setTotalCount(0);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const handleFilterAdminList = () => {
    const promise = isSuperAdmin() ? Api.adminList() :isCopanySuperAdmin()? CompanyApi.getB2BAdminList().then((response) => {
      let adminList = response.data.data.map((admin) => {
        return {
          value: admin.id,
          name: admin.name
        };
      });
      adminList = [{ name: 'Select Admin', value: '' }, ...adminList];
      setAdminNameList(adminList);
    }):null;
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

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, searchParam, filterQuery, sortBy, sortOrder);
      }, 800);
      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, 10, '', filterQuery, sortBy, sortOrder);
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
      accountStatus: ''
    });
    setFilterQuery('');
    setShowFilterModal(false);
    handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
  };

  return (
    <div className="relative">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Content Approval | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
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
                ACCOUNT_TYPE
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name"
              />
            </div>
          </div>
          <div className="mt-3 sm:mt-0 flex justify-between">
            <div className="sm:hidden flex self-center">
              <span className="self-center text-sm mr-2 dark:text-white">Per page:</span>
              <div className="w-[80px]">
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  accountType
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className="flex">
              <div className="ml-3 self-center">
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
            className="absolute p-5 right-0 z-[2] mt-2 w-[100%] sm:w-[600px] lg:w-[700px] mx-auto origin-top-right rounded-md dark:bg-shoorah-darkBgTabColor dark:text-white bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  "
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
                  menuList={CONTENT_TYPE}
                  defaultSelected={filterCriteria.contentType}
                  label="Content type"
                  isRequired={false}
                  setSelectedMenu={(data) => filterHandler(data, 'contentType')}
                  disabled={filterCriteria.contentType === ''}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={APPROVAL_STATUS_DROPDOWN}
                  label="Approval status"
                  isRequired={false}
                  defaultSelected={filterCriteria.contentStatus}
                  setSelectedMenu={(data) => filterHandler(data, 'contentStatus')}
                  disabled={filterCriteria.contentStatus === ''}
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
                  defaultSelected={filterCriteria.updatedBy}
                  label="Updated By"
                  isRequired={false}
                  setSelectedMenu={(data) => filterHandler(data, 'updatedBy')}
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
                    <span key={i}>
                      {filterCriteria?.[keyName]?.value?.toString() ? (
                        <div className="flex dark:bg-shoorah-darkBgTabColor dark:text-white bg-gray-200 px-2 py-1 mr-2 whitespace-nowrap">
                          <p className="text-[14px] object-contain m-0 whitespace-nowrap">
                            {getFilterKey(keyName === 'contentStatus' ? 'approvalStatus' : keyName)}
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
                    </span>
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
            data={contentList}
            name={'content_approval'}
            bottomBorder={totalCount > selectedPerPage?.value}
            setSortBy={(sort) => handleSortBy(sort)}
            loader={loader}
          />
        </div>
      </div>
      <div>
        {contentList.length > 0 && !loader ? (
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

export default ContentApproval;

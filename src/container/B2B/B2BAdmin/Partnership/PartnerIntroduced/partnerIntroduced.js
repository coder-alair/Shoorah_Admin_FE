import { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  errorToast,
  getFilterKey,
  getLocalStorageItem,
  successToast,
  useOutsideClick
} from '../../../../../utils/helper';
import { Api } from '../../../../../api';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../../../../component/common/Breadcrumb';
import SelectMenu from '../../../../../component/common/SelectMenu';
import SearchInput from '../../../../../component/common/Input/SearchInput';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import {
  PER_PAGE,
  STATUS_FOR_DROPDOWN,
  USER_TYPE,
  USER_TYPE_B2B
} from '../../../../../utils/constants';
import Table from '../../../../../component/common/Table';
import Pagination from '../../../../../component/common/Pagination/Pagination';
import Loader from '../../../../../component/common/Loader';

function PartnerList() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const pages = [
    {
      name: 'Partners introduced',
      href: '/partner-introduced',
      current: true
    }
  ];
const partnerUrl='/partners/add-partner'
  const redirectUrl = userData?.slug
    ? `/partners-introduce/edit-introduce`
    : '/partners-introduce/edit-introduce';
// const viewcompony = '/B2B-company-list/viewCompany'
  const columns = [
    // {
    //   title: '',
    //   key: '',
    //   sortable: false,
    //   type: 'checkBox',
    //   align: 'left',
    // },
    {
      title: 'Profile',
      key: 'profile',
      sortable: false,
      type: 'profile',
      // isView :viewcompony,
      align: 'left'
    },
    {
      title: 'Compony Name',
      key: 'profile',
      sortable: false,
      type: 'componyName',
      // isView :viewcompony,
      isView :redirectUrl,
      align: 'left',
       parant:'Partners introduced',
      parantURL:'/partner-introduced'
    },
    {
      title: 'Email',
      key: 'email',
      sortable: false,
      type: 'text',
      align: 'left'
    },
    {
      title: 'Mobile',
      key: 'mobile',
      sortable: false,
      type: 'text',
      align: 'left'
    },
    {
      title: 'Contact Person',
      key: 'contactPerson',
      sortable: false,
      type: 'text',
      align: 'left'
    },
    {
      title: 'Partner',
      key: 'partnerName',
      sortable: false,
      type: 'Partner',
      isEdit: partnerUrl,
      align: 'left',
      parant:'Partners introduced',
      parantURL:'/partner-introduced'
    },
    {
      title: 'Partner Commission ( % ) ',
      key: 'partnerCommission',
      sortable: false,
      type: 'text',
      align: 'center'
    },
    {
      title: 'Introduced Date',
      key: 'createdAt',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: '',
      key: 'action',
      type: 'action',
      align: 'right',
      isEdit: false,
      isDelete: false
    }
  ];

  const [loader, setLoader] = useState(true);
  const [adminList, setAdminList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    userType: '',
    accountStatus: ''
  });

  const handlePagination = (pageNumber, pageSize, searchKey, query, sortBy, sortOrder) => {
    setLoader(true);
    Api.getIntroduceCompanies(pageNumber, pageSize, searchKey, query, sortBy, sortOrder).then(
      (response) => {
        if (response?.data?.meta?.code === 1) {
          setCurrentPage(pageNumber);
          setAdminList(response?.data?.data);
          setTotalCount(response?.data?.meta?.totalRecords);
          setLoader(false);
        } else if (response?.code === 401) {
          setLoader(false);
          errorToast(response?.message);
        } else if (response?.data?.meta?.code === 0) {
          setCurrentPage(1);
          setAdminList([]);
          setTotalCount(0);
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      }
    );
  };

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, searchParam, filterQuery, sortBy, sortOrder);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, selectedPerPage?.value, '', '', sortBy, sortOrder);
    }
  }, [searchTerm]);

  const deleteHandler = (id) => {
    setLoader(true);
    setSearchTerm('');

    Api.deleteAdmin(id).then((response) => {
      if (response?.data?.meta?.code === 1) {
        handlePagination(1, selectedPerPage?.value, '', filterQuery, sortBy, sortOrder);
        successToast(response?.data?.meta?.message);
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
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
      accountStatus: ''
    });
    setFilterQuery('');
    setShowFilterModal(false);
    handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
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

  return (
    <div className="relative">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Partnership | Shoorah Admin</title>
      </Helmet>
      {loader ? <Loader /> : null}

      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <div className="sm:flex justify-between">
          <div className="flex">
            <div className="hidden sm:flex mr-3 self-center">
              <p className="self-center text-sm mr-2 whitespace-nowrap dark:text-white m-0">
                Per page:
              </p>
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
          <div className="mt-3 sm:mt-0 flex justify-between">
            <div className="sm:hidden flex self-center">
              <span className="self-center text-sm mr-2 dark:text-white  whitespace-nowrap m-0">
                Per page:
              </span>
              <div className="w-[80px]">
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
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
              className="absolute p-5 right-0 z-[2] mt-2 w-[100%] sm:w-[600px] lg:w-[700px] mx-auto origin-top-right rounded-md dark:bg-shoorah-darkBgTabColor dark:text-white bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  "
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">Filters</p>
                <div className="flex space-x-3">
                  <button
                    onClick={resetHandler}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-shoorah-darkBgColor dark:text-white text-gray-800 text-sm font-medium rounded-md"
                  >
                    Reset Filter
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-shoorah-darkBgColor dark:text-white text-gray-800 text-sm font-medium rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <SelectMenu
                    menuList={STATUS_FOR_DROPDOWN}
                    label="Account status"
                    isRequired={false}
                    defaultSelected={filterCriteria.accountStatus}
                    setSelectedMenu={(data) => filterHandler(data, 'accountStatus')}
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
            data={adminList}
            setDeleteId={deleteHandler}
            name={'admin_table'}
            // addNewURL="/sub-admins/add-edit"
            bottomBorder={totalCount > selectedPerPage?.value}
            setSortBy={(sort) => handleSortBy(sort)}
            loader={loader}
            setSearchTerm={(data) => setSearchTerm(data)}
            isname={true}
          />
        </div>
      </div>
      <div>
        {adminList.length > 0 && !loader ? (
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

export default PartnerList;

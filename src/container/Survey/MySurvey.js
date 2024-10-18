import { Fragment, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { XMarkIcon } from '@heroicons/react/20/solid';
import Table1 from '../../component/common/Table1';
import Loader from '../../component/common/Loader';
import SearchInput from '../../component/common/Input/SearchInput';
import SelectMenu from '../../component/common/SelectMenu';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Api } from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import { errorToast, getFilterKey, successToast, useOutsideClick } from '../../utils/helper';
import { APPROVAL_STATUS_DROPDOWN, PER_PAGE, STATUS_FOR_DROPDOWN } from '../../utils/constants';
import Pagination from '../../component/common/Pagination/Pagination';
import { Transition } from '@headlessui/react';
import { getPathForSurvey, getUserType } from '../../utils/helper';
import { CompanyApi } from '../../api/companyApi';
import { SURVEY_CONSTANT } from '../../core/web.constants';

const columns = [
  // {
  //   title: '',
  //   key: '',
  //   sortable: false,
  //   type: 'checkBox',
  //   align: 'left',
  // },
  {
    title: SURVEY_CONSTANT.MY_SURVEY_LIST_TABLE_NAME_HEADER,
    parent: 'element',
    key: 'survey_title',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Approval Status',
    key: 'approved_status',
    parent: 'element',
    extend: true,
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Created By',
    parent: 'element',
    key: 'created_by',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Approved By',
    parent: 'element',
    key: 'approved_by',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Created On',
    parent: 'element',
    key: 'createdAt',
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: 'Approved On',
    parent: 'element',
    key: 'approved_on',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Status',
    parent: 'element',
    key: 'status',
    sortable: false,
    type: 'badge',
    align: 'left'
  },
  {
    title: 'Insight',
    parent: 'count',
    key: 'insights',
    sortable: false,
    type: 'multi-badge',
    align: 'left',
    download: true,
    onClickDownload: () => Api.getReport('Insights')
  },
  {
    title: '',
    key: 'action',
    type: 'action',
    align: 'right',
    isEdit: true,
    isView: true,
    isResend: false,
    isDelete: true
  }
];

const PAGE_SIZE = 10;
function MySurvey(props) {
  const listType = new URLSearchParams(window.location.search).get('listType');
  const isDraftsOpen = listType === 'draft';
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const [loader, setLoader] = useState(true);
  const [surveyList, setSurveyList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminNameList, setAdminNameList] = useState([]);
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({});

  const userData = JSON.parse(localStorage.getItem('userData'));
  const userType = getUserType(userData?.userType);
  const isUserSuperOrSubAdmin = ['Super Admin', 'Sub Admin'].includes(userType);

  const handlePagination = (pageNumber, pageSize, searchKey, sortBy, sortOrder) => {
    setLoader(true);
    Api.getAllSurvey(pageNumber, pageSize, searchKey, isDraftsOpen ? 1 : 0, sortBy, '').then(
      (response) => {
        if (response?.data?.meta?.code === 1) {
          setCurrentPage(pageNumber);
          setSurveyList(response?.data?.data);
          setTotalCount(response?.data?.meta?.totalRecords);
          setLoader(false);
        } else if (response?.data?.meta?.code === 0) {
          setCurrentPage(1);
          setSurveyList([]);
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
        handlePagination(1, PAGE_SIZE, searchParam, sortBy, sortOrder);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      if (props?.location?.state?.flag === 0) {
        filterHandler(isDraftsOpen ? 1 : 0, 'approvalStatus');
      } else {
        handlePagination(1, PAGE_SIZE, '', sortBy, sortOrder);
      }
    }
  }, [searchTerm, isDraftsOpen]);

  const deleteHandler = (id) => {
    setLoader(true);
    setSearchTerm('');
    Api.deleteSurvey(id).then((response) => {
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
  const refreshTable = () => handlePagination(1, PAGE_SIZE, '', sortBy, sortOrder);
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
      affirmationStatus: ''
    });
    setFilterQuery('');
    setShowFilterModal(false);
    handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
  };

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm, filterQuery, sortBy, sortOrder);
  };

  const getFilterAdminList = () => {
    const promise = isUserSuperOrSubAdmin ? Api.adminList() : CompanyApi.getB2BAdminList();
    promise.then((response) => {
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

  useEffect(() => {
    getFilterAdminList();
  }, []);

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {isDraftsOpen ? 'Drafts' : SURVEY_CONSTANT.MY_SURVEY_LIST_HEADER} | Shoorah Admin
        </title>
      </Helmet>

      <div className="mt-16 px-3">
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title"
              />
            </div>
          </div>
          <div className="mt-3 sm:mt-0 sm:flex sm:justify-between">
            <div className="sm:hidden flex self-center dark:text-white">
              <span className="self-center text-sm mr-2 ">Per page:</span>
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
              <div className="sm:ml-3 self-center">
                <button
                  onClick={() =>
                    navigate(
                      window.location.pathname + `?listType=${isDraftsOpen ? 'list' : 'draft'}`
                    )
                  }
                  type="button"
                  className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2 sm:w-auto"
                >
                  {isDraftsOpen ? 'List' : 'Drafts'}
                </button>
              </div>

              <div className="ml-3 self-center">
                <Link to={getPathForSurvey('/surveys/add-edit')}>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2 sm:w-auto"
                  >
                    Create
                  </button>
                </Link>
              </div>
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
            style={{ zIndex: 1000 }}
            className="absolute p-5 right-4 z-[2] mt-2 w-[100%] dark:bg-shoorah-darkBgColor  dark:text-white sm:w-[600px] md:w-[700px] mx-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  "
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
                  setSelectedMenu={(data) => filterHandler(data, 'approved_by')}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={APPROVAL_STATUS_DROPDOWN}
                  defaultSelected={filterCriteria.approvalStatus}
                  label="Approval status"
                  isRequired={false}
                  setSelectedMenu={(data) => filterHandler(data, 'approvalStatus')}
                />
              </div>
              {!isUserSuperOrSubAdmin && (
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
        <div className="mb-2 mt-6">
          <h2 className="text-md md:text-lg font-semibold dark:text-white">
            {isDraftsOpen ? 'Drafts' : "My Pulse Survey's"}
          </h2>
        </div>
        <div className="mt-4">
          <Table1
            columns={columns}
            data={surveyList}
            name={'survey_table_data'}
            setSelectedRow={(e) => console.log(e)}
            addNewURL={getPathForSurvey('/surveys/add-edit')}
            bottomBorder={totalCount > PAGE_SIZE}
            loader={loader}
            setDeleteId={deleteHandler}
            setSortBy={(sort) => handleSortBy(sort)}
            contentType={3}
            refreshTable={refreshTable}
            setSearchTerm={(data) => setSearchTerm(data)}
          />
        </div>
      </div>

      <div>
        {surveyList?.length > 0 && !loader ? (
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
    </>
  );
}

export default MySurvey;

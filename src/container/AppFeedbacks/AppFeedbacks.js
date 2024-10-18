import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../api';
import {
  errorToast,
  successToast,
  useOutsideClick,
  getFilterKey,
  capitalizeFirstLetter
} from '../../utils/helper';
import Breadcrumb from '../../component/common/Breadcrumb';
import Table from '../../component/common/Table';
import Pagination from '../../component/common/Pagination/Pagination';
import { Helmet } from 'react-helmet';
import SearchInput from '../../component/common/Input/SearchInput';
import { CONTENT_TYPE_FOR_FEEDBACKS, PER_PAGE } from '../../utils/constants';
import { Fragment } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import SelectMenu from '../../component/common/SelectMenu';
import PropTypes from 'prop-types';
import Loader from '../../component/common/Loader';

const pages = [{ name: 'App Feedbacks', href: '/app-feedbacks' }];

const PAGE_SIZE = 10;
const INITIAL_FILTER = {
  contentType: structuredClone(CONTENT_TYPE_FOR_FEEDBACKS[0])
};
const INITIAL_QUERY = `&contentType=${INITIAL_FILTER.contentType.value}`;

const AppFeedbacks = (props) => {
  const wrapperRef = useRef(null);
  const [loader, setLoader] = useState(true);
  const [feedbacksList, setFeedbacksList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [columns, setColumns] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState(INITIAL_FILTER);
  const [filterQuery, setFilterQuery] = useState(INITIAL_QUERY);

  const prepareColumnsFromFeedbacksData = (data) => {
    const columns = Object.keys(data?.[0]?.feedback || {}).map((feedback) => {
      const title = capitalizeFirstLetter(feedback);
      return {
        title,
        key: feedback,
        sortable: true,
        type: 'feedback',
        align: 'left',
        width: 100,
        sortKey: feedback
      };
    });
    columns.unshift({
      title: 'Content Name',
      sortable: true,
      longText: true,
      key: 'contentName',
      sortKey: 'display_name',
      width: 300,
      type: 'text',
      align: 'left'
    });
    setColumns(columns);
  };

  const handlePagination = (pageNumber, pageSize, searchKey, sortBy, sortOrder) => {
    setLoader(true);
    console.log({ pageNumber, pageSize, searchKey, sortBy, sortOrder }, 'paginallll;');

    Api.getFeedbacksList(pageNumber, pageSize, searchKey, filterQuery, sortBy, sortOrder).then(
      (response) => {
        if (response?.data?.meta?.code === 1) {
          setCurrentPage(pageNumber);
          prepareColumnsFromFeedbacksData(response?.data?.data || []);
          setFeedbacksList(response?.data?.data);
          setTotalCount(response?.data?.meta?.totalRecords);
          setLoader(false);
        } else if (response?.data?.meta?.code === 0) {
          setCurrentPage(1);
          setFeedbacksList([]);
          setTotalCount(0);
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setFeedbacksList([]);
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
      handlePagination(1, PAGE_SIZE, '', sortBy, sortOrder);
    }
  }, [searchTerm]);

  const deleteHandler = (id) => {
    setLoader(true);
    setSearchTerm('');
    Api.deleteMeditation(id).then((response) => {
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
  };

  useEffect(() => {
    if (filterQuery) {
      handlePagination(1, selectedPerPage.value, searchTerm, sortBy, sortOrder);
    }
  }, [filterQuery]);

  const resetHandler = () => {
    setFilterCriteria(INITIAL_FILTER);
    setFilterQuery(INITIAL_QUERY);
    setShowFilterModal(false);
    handlePagination(1, selectedPerPage.value, searchTerm, sortBy, sortOrder);
  };

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm, sortBy, sortOrder);
  };

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>App Feedbacks | Shoorah Admin</title>
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
                placeholder="Search by content name"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-around items-center">
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
            className="absolute p-5 right-5 z-[2] mt-2 w-[100%] dark:bg-shoorah-darkBgColor  dark:text-white sm:w-[300px] lg:w-[350px] mx-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  "
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
            <div className="grid sm:grid-cols-1 gap-4 mt-4">
              <div>
                <SelectMenu
                  menuList={structuredClone(CONTENT_TYPE_FOR_FEEDBACKS)}
                  defaultSelected={filterCriteria.contentType}
                  label="Content Type"
                  isRequired={false}
                  setSelectedMenu={(data) => filterHandler(data, 'contentType')}
                />
              </div>
            </div>
          </div>
        </Transition>

        {
          <div className="border dark:border-shoorah-darkBgTabColor py-1 px-2 mt-3">
            <div className="flex justify-between">
              <div className="self-center overflow-auto filter-container mr-2">
                <div className="flex">
                  {Object.keys(filterCriteria).map((keyName, i) => (
                    <>
                      {filterCriteria?.[keyName]?.value?.toString() ? (
                        <div
                          className="flex bg-gray-200 dark:bg-shoorah-darkBgTabColor px-2 py-1 mr-2 whitespace-nowrap"
                          key={i}
                        >
                          <p className="text-[14px] object-contain m-0 whitespace-nowrap">
                            {getFilterKey(keyName)}
                          </p>
                          <p className="text-[14px] m-0 whitespace-nowrap">&nbsp;: &nbsp;</p>
                          <p className="text-[14px] m-0 whitespace-nowrap ">
                            {filterCriteria?.[keyName].name}
                          </p>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
        <div className="mt-4">
          <Table
            columns={columns}
            data={feedbacksList}
            name={'feedbacks_table'}
            setDeleteId={deleteHandler}
            bottomBorder={totalCount > PAGE_SIZE}
            setSortBy={(sort) => handleSortBy(sort)}
            sortBy={sortBy}
            sortOrder={sortOrder}
            contentType={3}
            refreshTable={refreshTable}
            loader={loader}
            setSearchTerm={(data) => setSearchTerm(data)}
          />
        </div>
      </div>
      <div>
        {feedbacksList.length > 0 && !loader ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={selectedPerPage?.value}
            onPageChange={(page) =>
              handlePagination(
                page,
                selectedPerPage?.value,
                searchTerm,
                // filterQuery,
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
};

AppFeedbacks.propTypes = {
  location: PropTypes.any
};

export default AppFeedbacks;

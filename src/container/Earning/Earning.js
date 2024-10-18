import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import SearchInput from '../../component/common/Input/SearchInput';
import Pagination from '../../component/common/Pagination/Pagination';
import Table from '../../component/common/Table';
import Breadcrumb from '../../component/common/Breadcrumb';
import {
  convertCodeToPurchasedDevice,
  convertCodeToType,
  convertToIndianDate,
  errorToast,
  jsonToCsv,
  successToast
} from '../../utils/helper';
import { Api } from '../../api';
import { PER_PAGE } from '../../utils/constants';
import SelectMenu from '../../component/common/SelectMenu';

const pages = [{ name: 'Earnings', href: '/earning', current: true }];

const columns = [
  {
    title: '',
    key: '',
    sortable: false,
    // type: 'checkBox',
    align: 'left'
  },
  {
    title: 'Transaction ID',
    key: 'transactionId',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Purchase Platform',
    key: 'purchasedFromDevice',
    type: 'purchase_platform',
    align: 'center'
  },
  {
    title: 'Email / Mobile',
    key: 'email',
    sortable: false,
    type: 'text',
    align: 'left',
    transform: 'lowercase'
  },
  {
    title: 'Start Date',
    key: 'startDate',
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: 'End Date',
    key: 'endDate',
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: 'Plan',
    key: 'plan',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Subscription Status',
    key: 'accountType',
    sortable: false,
    type: 'accountType',
    align: 'left'
  }
];

const PAGE_SIZE = 10;
const Earning = () => {
  const [loader, setLoader] = useState(true);
  const [earningsList, setEarningsList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    Api.getEarnings(pageNumber, pageSize, searchKey, sortBy, sortOrder).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setEarningsList(response?.data?.data);
        setTotalCount(response?.data?.meta?.totalRecords);
        setLoader(false);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setEarningsList([]);
        setTotalCount(0);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, searchParam, sortBy, sortOrder);
      }, 800);
      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, selectedPerPage?.value, '', '', sortBy, sortOrder);
    }
  }, [searchTerm]);

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm, sortBy, sortOrder);
  };

  const deleteHandler = (id) => {
    setLoader(true);
    Api.deleteTopPick(id).then((response) => {
      if (response?.data?.meta?.code === 1) {
        handlePagination(1, PAGE_SIZE, '');
        successToast(response?.data?.meta?.message);
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const refreshTable = () => handlePagination(1, selectedPerPage?.value, '', sortBy, sortOrder);

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

  const downloadCsvFile = (data, filename) => {
    if (!data || data.length === 0) {
      console.error('JSON array is empty.');
      return;
    }

    data.map((i) => {
      i.createdAt = convertToIndianDate(i.createdAt);
      i.startDate = convertToIndianDate(i.startDate);
      i.endDate = convertToIndianDate(i.endDate);
      i.accountType = convertCodeToType(i.accountType);
      i.purchasedFromDevice = convertCodeToPurchasedDevice(i.purchasedFromDevice);
    });

    const csvContent = jsonToCsv(data);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename || 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Earnings | Shoorah Admin</title>
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
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by email or mobile"
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
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className="flex">
              <div className="ml-3 self-center">
                <button
                  className="inline-flex mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => downloadCsvFile(earningsList, 'earning.csv')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-save text-white w-[18px] h-[20px] inline rotate-180"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
                    <title>Export Earnings</title>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Table
            columns={columns}
            data={earningsList}
            name={'focus_table'}
            setDeleteId={deleteHandler}
            bottomBorder={totalCount > selectedPerPage?.value}
            contentType={2}
            addNewURL="/content-management/affirmation/add-edit"
            refreshTable={refreshTable}
            setSortBy={(sort) => handleSortBy(sort)}
            loader={loader}
          />
        </div>
      </div>
      <div>
        {totalCount > PAGE_SIZE && earningsList.length > 0 && !loader ? (
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

export default Earning;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../../api';
import { errorToast, successToast } from '../../../utils/helper';
import Loader from '../../../component/common/Loader';
import Breadcrumb from '../../../component/common/Breadcrumb';
import Table from '../../../component/common/Table';
import Pagination from '../../../component/common/Pagination/Pagination';

const pages = [{ name: 'Bed Time Stories', href: '/content-management/bedtime-stories' }];

const columns = [
  {
    title: 'Name',
    key: 'storyTitle',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Profile',
    key: 'storyUrl',
    sortable: false,
    type: 'image',
    align: 'left'
  },
  {
    title: 'Author',
    key: 'expertName',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Status',
    key: 'storyStatus',
    sortable: false,
    type: 'badge',
    align: 'left'
  },
  {
    title: 'Action',
    key: 'action',
    type: 'action',
    align: 'right',
    isEdit: '#',
    isView: '',
    isDelete: true
  }
];

const PAGE_SIZE = 10;
const BedTimeStories = () => {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [bedTimeStoriesList, setBedTimeStoriesList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    Api.getBedTimeStoriesList(pageNumber, pageSize, searchKey).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setBedTimeStoriesList(response?.data?.data?.storiesData);
        setTotalCount(response?.data?.data?.totalStories);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setBedTimeStoriesList([]);
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
        handlePagination(1, PAGE_SIZE, searchParam);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, PAGE_SIZE, '');
    }
  }, [searchTerm]);

  const deleteHandler = (id) => {
    setLoader(true);
    Api.deleteBedTimeStory(id).then((response) => {
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

  return (
    <>
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      <div className="mt-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            {/* <p className='text-sm text-gray-700'>Total Records: {totalCount}</p> */}
          </div>
          <div className="relative mt-4 sm:mt-0">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="searchKey"
              name="searchKey"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by guide name"
              className="block p-2 rounded-3xl pl-10 w-80 sm:w-[250px] lg:w-80 appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 placeholder:text-sm focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-sm"
            />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-8 sm:flex-none">
            <button
              onClick={() => navigate('#')}
              type="button"
              className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2 sm:w-auto"
            >
              Add New
            </button>
          </div>
        </div>
        <div className="mt-4">
          <Table
            columns={columns}
            data={bedTimeStoriesList}
            name={'bed-time-stories'}
            setDeleteId={deleteHandler}
            bottomBorder={totalCount > PAGE_SIZE}
          />
        </div>
      </div>
      <div>
        {totalCount > PAGE_SIZE ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => handlePagination(page, PAGE_SIZE, searchTerm)}
          />
        ) : (
          <span />
        )}
      </div>
    </>
  );
};

export default BedTimeStories;

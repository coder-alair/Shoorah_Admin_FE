import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../../api';
import { errorToast, successToast } from '../../../utils/helper';
import Loader from '../../../component/common/Loader';
import Breadcrumb from '../../../component/common/Breadcrumb';
import Table from '../../../component/common/Table';
import Pagination from '../../../component/common/Pagination/Pagination';
import { Helmet } from 'react-helmet';
import SearchInput from '../../../component/common/Input/SearchInput';

const pages = [{ name: 'Top Picks', href: '/content-management/top-picks' }];

const columns = [
  // {
  //   title: '',
  //   key: '',
  //   sortable: false,
  //   type: 'checkBox',
  //   align: 'left'
  // },
  {
    title: 'Profile',
    key: 'storyUrl',
    sortable: false,
    type: 'image',
    align: 'left'
  },
  {
    title: 'Name',
    key1: 'content_type_id',
    key2: 'display_name',
    sortable: false,
    type: 'text',
    align: 'left',
    nested: true
  },
  {
    title: 'Description',
    key1: 'content_type_id',
    key2: 'description',
    sortable: false,
    type: 'text',
    align: 'left',
    nested: true
  },
  {
    title: 'Content type',
    key: 'content_type',
    sortable: false,
    type: 'contentType',
    align: 'left'
  },
  {
    title: 'Position',
    key: 'position',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  // {
  //   title: 'Created by',
  //   key1: 'created_by',
  //   key2: 'name',
  //   sortable: false,
  //   type: 'text',
  //   align: 'left',
  //   nested: true,
  // },
  // {
  //   title: 'Approved by',
  //   key1: 'approved_by',
  //   key2: 'name',
  //   sortable: false,
  //   type: 'text',
  //   align: 'left',
  //   nested: true,
  // },
  // {
  //   title: 'Created on',
  //   key: 'createdAt',
  //   sortable: false,
  //   type: 'date',
  //   align: 'left',
  // },
  {
    title: '',
    key: 'action',
    type: 'action',
    align: 'right',
    isEdit: '/content-management/top-picks/add-edit',
    isView: '',
    isDelete: true
  }
];

const PAGE_SIZE = 10;
const TopPicks = () => {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [topPicksList, setTopPicksList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    Api.getTopPicksList(pageNumber, pageSize, searchKey).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setTopPicksList(response?.data?.data);
        setTotalCount(response?.data?.meta?.totalRecords);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setTopPicksList([]);
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
    setSearchTerm('');
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

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Top Picks | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            {/*<p className='text-sm text-gray-700'>Total Records: {totalCount}</p>*/}
          </div>
          <SearchInput
            id="searchKey"
            name="searchKey"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by guide name"
          />
          <div className="mt-4 sm:mt-0 sm:ml-8 sm:flex-none">
            <button
              onClick={() => navigate('/content-management/top-picks/add-edit')}
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
            data={topPicksList}
            name={'top-picks'}
            setDeleteId={deleteHandler}
            addNewURL="/content-management/top-picks/add-edit"
            bottomBorder={totalCount > PAGE_SIZE}
            setSearchTerm={(data) => setSearchTerm(data)}
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

export default TopPicks;

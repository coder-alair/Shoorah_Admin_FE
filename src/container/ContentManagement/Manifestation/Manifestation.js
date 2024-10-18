import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../../api';
import { errorToast, successToast } from '../../../utils/helper';
import Loader from '../../../component/common/Loader';
import Breadcrumb from '../../../component/common/Breadcrumb';
import Table from '../../../component/common/Table';
import Pagination from '../../../component/common/Pagination/Pagination';

const pages = [{ name: 'Manifestation', href: '/content-management/manifestation' }];

const columns = [
  // {
  //   title: '',
  //   key: '',
  //   sortable: false,
  //   type: 'checkBox',
  //   align: 'left'
  // },
  {
    title: 'Manifestation',
    key: 'displayName',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Focus',
    key: 'focus_ids',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: 'Created by',
    key1: 'created_by',
    key2: 'name',
    sortable: false,
    type: 'text',
    align: 'left',
    nested: true
  },
  {
    title: 'Approved By',
    key1: 'approved_by',
    key2: 'name',
    sortable: false,
    type: 'text',
    align: 'left',
    nested: true
  },
  {
    title: 'Approved on',
    key: 'approvedOn',
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: 'Action',
    key: 'action',
    type: 'action',
    align: 'right',
    isEdit: '/content-management/manifestation/add-edit',
    // isView: false,
    isDelete: true
  }
];

const PAGE_SIZE = 10;
const Manifestation = () => {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [manifestationList, setManifestationList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    Api.getManifestationList(pageNumber, pageSize, searchKey).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setManifestationList(response?.data?.data?.manifestationData);
        setTotalCount(response?.data?.data?.totalManifestations);
        setLoader(false);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setManifestationList([]);
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
    Api.deleteManifestation(id).then((response) => {
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
              placeholder="Search by gratitude name, focus"
              className="block p-2 rounded-3xl pl-10 w-80 sm:w-[250px] lg:w-80 appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 placeholder:text-sm focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-sm"
            />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-8 sm:flex-none">
            <button
              onClick={() => navigate('/content-management/manifestation/add-edit')}
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
            data={manifestationList}
            name={'manifestation_table'}
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

export default Manifestation;

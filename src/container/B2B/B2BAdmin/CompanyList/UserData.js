import React, { useEffect, useState } from 'react';
import SelectMenu from '../../../../component/common/SelectMenu';
import { PER_PAGE } from '../../../../utils/constants';
import SearchInput from '../../../../component/common/Input/SearchInput';
import Table from '../../../../component/common/Table';
import Pagination from '../../../../component/common/Pagination/Pagination';
import { Api } from '../../../../api';
import { useNavigate } from 'react-router-dom';
import { errorToast } from '../../../../utils/helper';

function UserData({ company }) {
  const companyId = company._id;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [filterQuery, setFilterQuery] = useState('');

  const columns = [
    {
      title: 'Name',
      key: 'profile',
      sortable: false,
      type: 'profile',
      align: 'left'
    },
    {
      title: 'Email',
      key: 'email',
      sortable: false,
      type: 'text',
      align: 'left'
    },
    {
      title: 'Email / Mobile Verified',
      key: 'isEmailVerified',
      type: 'verified',
      align: 'center'
    },
    {
      title: 'Last login',
      key: 'lastLogin',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: 'Signup Platform',
      key: 'loginPlatform',
      type: 'platform',
      align: 'center'
    },

    {
      title: 'Registered On',
      key: 'registeredOn',
      sortable: false,
      type: 'date',
      align: 'left'
    }
  ];

  const handlePagination = (pageNumber, pageSize, searchKey, query, sortBy, sortOrder, company) => {
    if (!company) {
      errorToast('Company id is missing !');
      return;
    }
    setLoader(true);
    Api.getUsers(pageNumber, pageSize, searchKey, query, sortBy, sortOrder, company).then(
      (response) => {
        if (response?.data?.meta?.code === 1) {
          setUsersList(response?.data?.data);
          setCurrentPage(pageNumber);
          setTotalCount(response?.data?.meta?.totalRecords);
          setLoader(false);
        } else if (response?.code === 401) {
          setLoader(false);
          errorToast(response?.message);
        } else if (response?.data?.meta?.code === 0) {
          setCurrentPage(1);
          setUsersList([]);
          setTotalCount(0);
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      }
    );
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
        tempSortOrder,
        companyId
      );
    } else {
      setSortOrder(1);
      handlePagination(
        currentPage,
        selectedPerPage?.value,
        searchTerm,
        filterQuery,
        sortByValue,
        1,
        companyId
      );
    }
  };

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(
          1,
          selectedPerPage?.value,
          searchParam,
          filterQuery,
          sortBy,
          sortOrder,
          companyId
        );
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, 10, '', '', sortBy, sortOrder, companyId);
    }
  }, [searchTerm]);

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm, filterQuery, sortBy, sortOrder, companyId);
  };

  const refreshTable = () =>
    handlePagination(1, selectedPerPage?.value, '', filterQuery, sortBy, sortOrder, companyId);

  return (
    <div>
      <div className="mt-6 ">
        <div className="sm:flex justify-between">
          <div className="flex">
            <div className="hidden sm:flex mr-3 self-center">
              <span className="self-center ml-3 text-sm mr-2 dark:text-white">Per page:</span>
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
                placeholder="Search by user name and email or mobile number"
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
          </div>
        </div>
        <div className="mt-4 px-3">
          <Table
            columns={columns}
            data={usersList}
            name={'users_table'}
            bottomBorder={totalCount > selectedPerPage?.value}
            setSortBy={(sort) => handleSortBy(sort)}
            refreshTable={refreshTable}
            loader={loader}
          />
        </div>
        <div>
          {usersList.length > 0 && !loader ? (
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
                  sortOrder,
                  companyId
                )
              }
            />
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserData;

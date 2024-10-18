import React, { Fragment, useEffect, useRef, useState } from 'react';
import Pagination from '../../../../component/common/Pagination/Pagination';
import Table from '../../../../component/common/Table';
import { useNavigate } from 'react-router-dom';
import { PER_PAGE } from '../../../../utils/constants';
import SelectMenu from '../../../../component/common/SelectMenu';
import SearchInput from '../../../../component/common/Input/SearchInput';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../../../component/common/Breadcrumb';
import {
  downloadOWBMHReportToCSV,
  downloadOWBMHReportToPDF,
  downloadSingleRadialReportToCSV,
  downloadSingleRadialReportToPDF,
  errorToast,
  getJWTToken,
  getLocalStorageItem,
  useOutsideClick
} from '../../../../utils/helper';
import { CompanyApi } from '../../../../api/companyApi';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../core/env.configs';

function CReports() {
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const pages = [{ name: 'Reports', href: `/${userData.slug}/report`, current: true }];

  const columns = [
    {
      title: 'Reports',
      key: 'graphName',
      type: 'text',
      align: 'left'
    },
    {
      title: 'Date',
      key: 'createdAt',
      type: 'date',
      align: 'center'
    },
    {
      title: 'Action',
      key: 'action',
      type: 'action',
      isDownload: (data, type) => downloadFunction(data, type),
      isDelete: false
    }
  ];

  const downloadFunction = async (data, type) => {
    setLoader(true);

    const url = `${API_BASE_URL}company/v1/get-report?id=${data?.id}`;
    await axios
      .get(url, {
        headers: {
          deviceType: 3,
          Authorization: getJWTToken()
        },
        responseType: 'blob'
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Report-${data?.id}.pdf`; // Specify the filename
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {});

    setLoader(false);
  };

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    CompanyApi.getAllReports(pageNumber, pageSize, searchKey).then((response) => {
      setLoader(false);

      if (response?.data?.data) {
        setReportList(response?.data?.data);
        setCurrentPage(pageNumber);
        setTotalCount(response.data?.meta?.totalCount);
      } else if (response?.code === 401) {
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setReportList([]);
        setTotalCount(0);
        // errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, searchParam);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, 10, '', '');
    }
  }, [searchTerm]);

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm);
  };

  const refreshTable = () => handlePagination(1, selectedPerPage?.value, '');

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>B2B | Reports</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 ">
        <div className="sm:flex justify-between">
          <div className="flex">
            <div className="hidden sm:flex mr-3 self-center">
              <span className="self-center px-3 dark:text-white text-sm mr-2">Per page:</span>
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
                placeholder="Search by graph name"
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
            data={reportList}
            name={'company_table'}
            bottomBorder={totalCount > selectedPerPage?.value}
            refreshTable={refreshTable}
            loader={loader}
            showIndex={true}
          />
        </div>
        <div>
          {reportList.length > 0 && !loader ? (
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={selectedPerPage?.value}
              onPageChange={(page) => handlePagination(page, selectedPerPage?.value, searchTerm)}
            />
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}

export default CReports;

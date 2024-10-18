import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import SelectMenu from '../../../../component/common/SelectMenu';
import { ACCOUNT_TYPE, PER_PAGE } from '../../../../utils/constants';
import SearchInput from '../../../../component/common/Input/SearchInput';
import Table from '../../../../component/common/Table';
import Pagination from '../../../../component/common/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { errorToast } from '../../../../utils/helper';
import { Api } from '../../../../api';
import CompanyCount from '../CompanyCount';
import HybridRevenueShowcase from '../../../DashboardContent.js/HybridRevenueShowcase';
import moment from 'moment';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ContractLengthComponent = ({ row }) => {
  const [isIconOpen, setIsIconOpen] = useState(false);
  return (
    <div className={'flex justify-center items-center'} onClick={() => setIsIconOpen(!isIconOpen)}>
      {isIconOpen && (
        <div>
          {Math.ceil(
            moment(new Date(row.contractEndDate)).diff(
              new Date(row.contractStartDate),
              'months',
              true
            )
          )}
        </div>
      )}
      {!isIconOpen ? (
        <EyeIcon className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer" />
      ) : null}
    </div>
  );
};

function BTBEarning() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [earningList, setEarningList] = useState([]);

  const [companyList, setCompanyList] = useState([]);

  // revenue states
  const [revenueDetailsData, setRevenueDetailsData] = useState([
    { name: 'Users', status: '12K' },
    { name: 'Revenue', status: '$85k' },
    {
      name: 'Conversation Rate',
      status: '3.33%'
    },
    { name: 'Sessions', status: '15K' }
  ]);
  const [revenueFilter, setRevenueFilter] = useState('All');

  const columns = [
    {
      title: 'Transaction ID',
      key: 'transactionId',
      sortable: false,
      type: 'text',
      align: 'left',
      width: 130
    },
    {
      title: 'Company Name',
      key: 'companyName',
      type: 'text',
      align: 'left'
    },
    {
      title: 'Email',
      key: 'companyEmail',
      type: 'text',
      align: 'left'
    },
    {
      title: 'Start Date',
      key: 'contractStartDate',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: 'End Date',
      key: 'contractEndDate',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: 'Subscription Type',
      key: 'companySubscription',
      sortable: false,
      type: 'customTemplate',
      customTemplateRender: (row) => (
        <div>
          {row?.isCharity
            ? 'Charity'
            : row?.companySubscription
            ? ACCOUNT_TYPE?.find((type) => type.value === row?.companySubscription)?.name
            : '-'}
        </div>
      ),
      align: 'left',
      width: 148
    },
    {
      title: 'Contract Length (Months)',
      key: 'contractLength',
      sortable: false,
      type: 'customTemplate',
      customTemplateRender: (row) => <ContractLengthComponent row={row} />,
      align: 'center'
    },
    // {
    //   title: "Plan",
    //   key: "plan",
    //   sortable: false,
    //   type: "text",
    //   align: "left",
    // },
    {
      title: 'Subscription Status',
      key: 'restrictCompany',
      sortable: false,
      type: 'company-toggle',
      align: 'center',
      width: 148
    }
  ];

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    Api.getTransactionData(pageNumber, pageSize, searchKey).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setEarningList(response?.data?.data);
        setCurrentPage(pageNumber);
        setTotalCount(response?.data?.meta?.totalRecords);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setEarningList([]);
        setTotalCount(0);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm);
  };

  const refreshTable = () => handlePagination(1, selectedPerPage?.value, '');

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, searchParam);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, 10, '');
    }
  }, [searchTerm]);

  useEffect(() => {
    const apiCall = async () => {
      getCompanyList();
    };

    apiCall();
  }, []);

  useEffect(() => {
    const apiCall = async () => {
      setLoader(true);
      getB2bRevenueDetails();
      setLoader(false);
    };

    apiCall();
  }, [revenueFilter]);

  // handlers

  const getCompanyList = () => {
    Api.getCompanyList('company_name', 1)
      .then((res) => {
        if (res.data?.meta?.code === 1) {
          setCompanyList(res.data?.data);
          setRevenueFilter(res.data?.data?.[0]?._id);
        }
      })
      .catch((err) => {});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRevenueFilter(value);
    return;
  };

  const getB2bRevenueDetails = () => {
    let payload = '';
    if (revenueFilter) {
      payload = revenueFilter;
    } else if (revenueFilter === 'All') {
      payload = 'All';
    } else {
      payload = 'All';
    }

    Api.getB2BEarningsGraphData(payload)
      .then((res) => {
        if (res.data?.meta?.code === 1) {
          const data = res?.data?.data;
          setRevenueDetailsData([
            { name: 'Users', status: data?.totalCompanyUsers || 0 },
            {
              name: 'Annual Revenue',
              status: '£ ' + data?.totalCompanyAnnualEarning?.toFixed(2) || 0
            },
            {
              name: 'Six Month Revenue',
              status: '£ ' + data?.totalCompanySixMonthEarning?.toFixed(2) || 0
            },
            {
              name: 'Monthly Revenue',
              status: '£ ' + data?.totalCompanyMonthlyEarning?.toFixed(2) || 0
            }
          ]);
        }
      })
      .catch((err) => {});
  };

  return (
    <div className="px-3">
      {/* Top Chart for bulk data */}
      <CompanyCount show={false} heading={`Earnings`} />

      {/* Revenue */}
      <div className="border border-gray-300 rounded-3xl p-4 mt-6 dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white bg-white">
        <div className="text-black dark:text-white text-xl font-medium p-2 mb-4 w-full flex gap-4  lg:flex-row flex-col items-center justify-between">
          <h4>Revenue Details</h4>
          <div>
            <select
              className="border text-[#666666] dark:bg-shoorah-darkBgColor w-full dark:border-none dark:text-white rounded-md h-8 px-1"
              // value={graphParam.companyName}
              id="companyName"
              name="companyName"
              onChange={handleChange}
              value={revenueFilter}
            >
              <option value={'All'}>All Company</option>
              {companyList.map((e) => (
                <option key={e._id} value={e._id}>
                  {e?.company_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <HybridRevenueShowcase
          title={'Revenue Details'}
          data={revenueDetailsData}
          revenueFilter={revenueFilter}
          setRevenueFilter={setRevenueFilter}
        />
      </div>

      {/* Earning Table */}
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
                placeholder="Search by user name and email or mobile number"
              />
            </div>
          </div>
          <div className="mt-3 sm:mt-0 flex justify-between"></div>
        </div>
        <div className="mt-4">
          <Table
            columns={columns}
            data={earningList}
            name={'users_table'}
            bottomBorder={totalCount > selectedPerPage?.value}
            refreshTable={refreshTable}
            loader={loader}
          />
        </div>
      </div>
      <div>
        {earningList.length > 0 && !loader ? (
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
  );
}

export default BTBEarning;

import { useEffect, useState, Fragment } from 'react';
import Breadcrumb from '../../component/common/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../api';
import Loader from '../../component/common/Loader';
import Pagination from '../../component/common/Pagination/Pagination';
import { errorToast, getJWTToken } from '../../utils/helper';
import { Helmet } from 'react-helmet';
import SelectMenu from '../../component/common/SelectMenu';
import { PER_PAGE } from '../../utils/constants';
import { ReactComponent as NoDataFoundImg } from '../../assets/images/no-data-found.svg';
import moment from 'moment';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { API_BASE_URL } from '../../core/env.configs';

const pages = [{ name: 'App Issues', href: '/app-issues', current: true }];

const columns = [
  {
    title: 'S.no',
    key: 'title',
    sortable: false,
    type: 'text',
    align: 'left',
    longText: true
  },
  {
    title: 'Issue Name',
    key: 'title',
    sortable: false,
    type: 'text',
    align: 'left',
    longText: true
  },
  {
    title: 'Content Name',
    key: 'contentName',
    sortable: false,
    type: 'text',
    align: 'left',
    longText: true
  },
  {
    title: 'Sent To Dev',
    key: 'sentToUserType',
    sortable: false,
    type: 'checkBox',
    align: 'left'
  },
  {
    title: 'Fixed',
    key: 'createdAt',
    sortable: false,
    type: 'checkBox',
    align: 'left'
  },
  {
    title: 'Implemented',
    key: 'createdAt',
    sortable: false,
    type: 'checkBox',
    align: 'left'
  },
  {
    title: 'Report',
    key: 'id',
    sortable: false,
    type: 'button',
    align: 'left'
  },
  {
    title: 'Issued on',
    key: 'createdAt',
    sortable: false,
    type: 'checkBox',
    align: 'left'
  }
];

const ISSUES = [
  'Some captions are wrong',
  'Most of the captions are wrong',
  'Captions not synced well'
];

const PAGE_SIZE = 10;
function AppIssues() {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [appIssues, setappIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    Api.getAppIssues(pageNumber, pageSize, searchKey).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setappIssues(response?.data?.data);
        setTotalCount(response?.data?.meta?.totalRecords);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setappIssues([]);
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

  const updateSentToDev = (issue, e) => {
    let reqBody = {
      id: issue.id,
      sentToDev: e.target.checked
    };
    Api.updateAppIssues(reqBody)
      .then((res) => {})
      .catch((err) => {});
  };

  const updateIssueResolved = (issue, e) => {
    let reqBody = {
      id: issue.id,
      issueResolved: e.target.checked
    };
    Api.updateAppIssues(reqBody)
      .then((res) => {})
      .catch((err) => {});
  };

  const updateImplemented = (issue, e) => {
    let reqBody = {
      id: issue.id,
      implemented: e.target.checked
    };
    Api.updateAppIssues(reqBody)
      .then((res) => {})
      .catch((err) => {});
  };

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm);
  };

  const handleDownload = (id) => {
    const url = `${API_BASE_URL}admin/v1/app-issue/${id}`;
    axios
      .get(url, {
        headers: {
          deviceType: 3,
          Authorization: getJWTToken()
        },
        responseType: 'blob'
      })
      .then((res) => {
        if (res.status === 200) {
          const blob = new Blob([res.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `app-issue-${id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>App Issues | Shoorah Admin</title>
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
          </div>
          <div className="mt-3 sm:mt-0 sm:flex sm:justify-between">
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
        <div className="mt-4 w-full overflow-x-auto sidebar-container">
          <table className="min-w-full divide-y dark:divide-shoorah-darkBgColor divide-[#EAEAEA] rounded-t-[1rem]">
            <thead className=" bg-gradient-to-r from-shoorah-primary to-shoorah-secondary">
              <tr>
                {columns?.map((column, index) => {
                  return (
                    <Fragment key={index}>
                      <th
                        key={index}
                        scope="col"
                        className={`p-3 ${
                          index === 0
                            ? `rounded-tl-[1rem]`
                            : index === columns.length - 1
                            ? `rounded-tr-[1rem]`
                            : ''
                        }  text-white text-left text-sm font-semibold  `}
                      >
                        {column.title}
                      </th>
                    </Fragment>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-shoorah-darkBgColor divide-[#EAEAEA] dark:bg-shoorah-darkBgTabColor bg-white">
              {loader ? (
                <tr>
                  <td>
                    <Loader />
                  </td>
                </tr>
              ) : (
                <>
                  {appIssues?.length > 0 ? (
                    appIssues?.map((data, index) => {
                      return (
                        <tr key={data.id} className="">
                          <td className="p-3 text-md text-[#606060] dark:text-white whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="p-3 text-md text-[#606060] dark:text-white whitespace-nowrap">
                            {ISSUES[data.issue - 1]}
                          </td>
                          <td className="p-3 text-md text-[#606060] dark:text-white whitespace-nowrap">
                            {data.contentName ? data.contentName : '━━'}
                          </td>
                          <td className="text-center">
                            <input
                              className=""
                              type="checkbox"
                              onChange={(e) => updateSentToDev(data, e)}
                              name="sent to dev"
                              defaultChecked={data.sentToDev}
                            />
                          </td>
                          <td className="text-center">
                            <input
                              className=""
                              type="checkbox"
                              onChange={(e) => updateIssueResolved(data, e)}
                              name="fixed"
                              defaultChecked={data.issueResolved}
                            />
                          </td>
                          <td className="text-center">
                            <input
                              className=""
                              type="checkbox"
                              onChange={(e) => updateImplemented(data, e)}
                              name="implemented"
                              defaultChecked={data.implemented}
                            />
                          </td>
                          <td className="p-3 text-md text-[#606060] dark:text-white whitespace-nowrap">
                            <ArrowDownTrayIcon
                              onClick={() => handleDownload(data.id)}
                              className="w-[20px] dark:text-white text-shoorah-primary cursor-pointer inline ml-3"
                            />
                          </td>
                          <td className="p-3 text-md text-[#606060] dark:text-white whitespace-nowrap">
                            {data.createdAt ? moment(data.createdAt).format('MMM D, YYYY') : '━━'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={columns.length}>
                        <div className="py-[20px] bg-white border-t border-[#EAEAEA] w-full">
                          <NoDataFoundImg
                            className={`m-auto text-indigo-50 border border-shoorah-blue rounded-lg`}
                          />
                          <p className="text-center text-shoorah-gray4 text-sm mt-3">No results</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        {appIssues.length > 0 && !loader ? (
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
}

export default AppIssues;

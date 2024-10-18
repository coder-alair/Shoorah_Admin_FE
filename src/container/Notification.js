import { useEffect, useState } from 'react';
import Breadcrumb from '../component/common/Breadcrumb';
import Table from '../component/common/Table';
import { useNavigate } from 'react-router-dom';
import { Api } from '../api';
import Loader from '../component/common/Loader';
import Pagination from '../component/common/Pagination/Pagination';
import { errorToast, successToast, getLocalStorageItem } from '../utils/helper';
import { Helmet } from 'react-helmet';
import SearchInput from '../component/common/Input/SearchInput';
import SelectMenu from '../component/common/SelectMenu';
import { PER_PAGE } from '../utils/constants';
import { CompanyApi } from '../api/companyApi';

const pages = [{ name: 'Notifications', href: '#', current: true }];
const columns = [
  {
    title: 'Title',
    key: 'title',
    sortable: false,
    type: 'text',
    align: 'left',
    longText: true
  },
  {
    title: 'Listen Audio',
    key: 'audioUrl',
    type: 'notificationAudio',
    align: 'left'
  },
  {
    title: 'Sent By',
    key: 'fromUser',
    sortable: false,
    type: 'sendBy',
    align: 'center',
    longText: false
  },
  {
    title: 'Message',
    key: 'message',
    sortable: false,
    type: 'text',
    align: 'left',
    longText: true
  },
  {
    title: 'Sent to users',
    key: 'sentToUserType',
    sortable: false,
    type: 'sentToUser',
    align: 'left'
  },
  {
    title: 'Published On',
    key: 'createdAt',
    sortable: false,
    type: 'date',
    align: 'left'
  },
  {
    title: 'Views',
    key: 'readCounts',
    sortable: false,
    type: 'views',
    align: 'center',
    longText: false
  },
  {
    title: '',
    key: 'action',
    type: 'action',
    align: 'right',
    isEdit: '',
    isResend: true,
    isDelete: false
  }
];

const PAGE_SIZE = 10;

function Notification() {
  const navigate = useNavigate();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const redirectUrl = userData?.slug
    ? `/${userData?.slug}/notification/add`
    : `/push-notification/add`;
  const [loader, setLoader] = useState(true);
  const [notificationList, setNotificationList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    CompanyApi.getAllNotifications(1, pageNumber, pageSize, searchKey).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setNotificationList(response?.data?.data);
        setTotalCount(response?.data?.meta?.totalNotifications);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setNotificationList([]);
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

  const handleResend = (data) => {
    setLoader(true);
    let payload = {
      title: data.title,
      message: data.message,
      sentToUser: parseInt(data.sentToUserType)
    };
    if (data.sentToUserType === 4) payload.toUserIds = data.toUserIds;
    Api.addPushNotification(payload).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setLoader(false);
        successToast(response?.data?.meta?.message);
        handlePagination(1, PAGE_SIZE, '');
      } else if (response?.data?.meta?.code === 0) {
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

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Push Notifications | Shoorah Admin</title>
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
                placeholder="Search by title"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
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
            <div className="flex ">
              <div className="ml-3 self-center">
                <button
                  onClick={() => navigate(redirectUrl)}
                  type="button"
                  className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2 sm:w-auto"
                >
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Table
            columns={columns}
            data={notificationList}
            name={'push_notification_table'}
            setSelectedRow={handleResend}
            // addNewURL="/push-notification/add"
            addNewURL={redirectUrl}
            bottomBorder={totalCount > PAGE_SIZE}
            loader={loader}
          />
        </div>
      </div>
      <div>
        {notificationList.length > 0 && !loader ? (
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

export default Notification;

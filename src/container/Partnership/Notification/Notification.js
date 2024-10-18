import React, { useEffect, useState } from 'react';
import Loader from '../../../component/common/Loader';
import Breadcrumb from '../../../component/common/Breadcrumb';
import LazyLoadImageProp from '../../../component/common/LazyLoadImage';
import { TrashIcon } from '@heroicons/react/20/solid';
import { PartnerApi } from '../../../api/partnerApi';
import { errorToast, successToast } from '../../../utils/helper';
import DeletePopup from '../../../component/common/modals/DeletePopup';
import Pagination from '../../../component/common/Pagination/Pagination';
import { ReactComponent as NoDataFoundImg } from '../../../assets/images/no-data-found.svg';
import moment from 'moment';
import TextBox from '../../../component/common/modals/TextBox';

const pages = [{ name: 'Partner Notification', href: '#', current: true }];
const PAGE_SIZE = 15;

function ViewPartnerNotification() {
  const [loader, setLoader] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [openDeletePopup, setDeletePopup] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [idToDelete, setIdToDelete] = useState('');
  const [deleteType, setDeleteType] = useState();
  const [show, setShow] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    PartnerApi.getAllNotifications(2, pageNumber, pageSize, searchKey).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setNotificationList(response?.data?.data);
        setTotalCount(response?.data?.meta?.totalNotifications);
        setLoader(false);
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

  const deleteHandler = (id, type) => {
    setIdToDelete(id);
    setDeleteType(type);
    setDeletePopup(true);
  };

  const handleDeletePopup = () => {
    setLoader(true);
    PartnerApi.deleteNotification(idToDelete, deleteType)
      .then((response) => {
        if (response?.data?.meta?.code === 1) {
          successToast(response?.data?.meta?.message);
          handlePagination(1, PAGE_SIZE, '');
        } else {
          errorToast(response?.data?.meta?.message || 'Something went wrong');
        }
      })
      .finally(() => {
        setLoader(false);
        setDeletePopup(false);
      });
    setIdToDelete('');
    setDeleteType('');
  };

  useEffect(() => {
    handlePagination(1, PAGE_SIZE, '');
  }, []);

  return (
    <>
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      {notificationList?.length > 0 ? (
        <div className="mt-3 px-3">
          <div className="text-right">
            <button
              onClick={() => deleteHandler('', 2)}
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-3xl border border-gray-300  bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white px-6 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Clear All Notifications
            </button>
          </div>
          <div className="mt-3 overflow-hidden border border-gray-200 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white rounded-t-md">
            <ul role="list" className="">
              {notificationList?.map((item, index) => (
                <li
                  key={index}
                  className={`group px-4 py-4 lg:py-2 hover:bg-gray-50 cursor-pointer ${
                    item?.isRead
                      ? 'border-gray-200 border-b'
                      : 'shadow-sm bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white border-b-2 border-gray-300'
                  }`}
                >
                  <div className="w-full lg:flex justify-between">
                    <div
                      className="lg:flex lg:w-[calc(100%-150px)]"
                      onClick={() => {
                        setShow(!show);
                        setSelectedNotification(item);
                      }}
                    >
                      <div className="flex justify-between lg:w-[220px] lg:pr-3">
                        <div className="flex">
                          <div className="h-8 w-8 flex-shrink-0">
                            {/* {item?.fromUser?.userProfile ? ( */}
                            {false ? (
                              <LazyLoadImageProp
                                imageSrc={item?.fromUser?.userProfile}
                                className="h-8 w-8 rounded-full"
                              />
                            ) : (
                              <div className="bg-black text-sm flex justify-center items-center h-8 w-8 rounded-full">
                                <span className="text-white capitalize">
                                  {item?.fromUser?.name?.split(' ')[0]?.charAt(0)}
                                </span>
                                <span className="text-white capitalize">
                                  {item?.fromUser?.name?.split(' ')[1]?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-2 self-center">
                            <div
                              className={`text-sm ${
                                item?.isRead
                                  ? 'text-gray-500'
                                  : 'text-gray-500 dark:text-white font-bold'
                              }`}
                            >
                              {item?.fromUser?.name}
                            </div>
                          </div>
                        </div>
                        <div className="lg:hidden block">
                          <p className="text-right group-hover:hidden block text-gray-400 self-center text-[12px]">
                            {moment(item.publishedOn).format('lll')}
                          </p>
                          <p className="group-hover:block hidden ml-auto text-gray-400 text-[12px]">
                            <TrashIcon
                              onClick={() => deleteHandler(item?.id, 1)}
                              className="text-right ml-auto w-[20px] text-red-500"
                            />
                          </p>
                        </div>
                      </div>
                      <p className="flex lg:mt-0 mt-2 lg:w-[calc(100%-220px)]">
                        <p
                          className={`lg:ml-5 inline-block whitespace-nowrap overflow-hidden overflow-ellipsis text-sm self-center ${
                            item?.isRead ? 'text-gray-500' : 'text-gray-500 font-bold'
                          }`}
                        >
                          {item.title}{' '}
                          <span className="text-gray-400 font-normal">- {item.message}</span>
                        </p>
                      </p>
                    </div>
                    <div className="lg:block hidden self-center">
                      <p className="lg:w-[150px] group-hover:hidden block text-right text-gray-400 text-[12px]">
                        {moment(item.createdAt).format('lll')}
                      </p>
                      <p className="lg:w-[150px] group-hover:block hidden ml-auto text-gray-400 text-[12px]">
                        <TrashIcon
                          onClick={() => deleteHandler(item?.id, 1)}
                          className="text-right ml-auto w-[20px] text-red-500"
                        />
                      </p>
                    </div>
                  </div>
                  {/*<EyeIcon className='w-[24px]' />*/}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-center">
          <div className="py-[20px] bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white border-t border-[#EAEAEA] w-full">
            <NoDataFoundImg
              className={`m-auto text-indigo-50 border border-shoorah-blue rounded-lg`}
            />
            <p className="text-center text-shoorah-gray4 text-sm mt-3">No notifications</p>
          </div>
        </p>
      )}
      <div>
        {totalCount > PAGE_SIZE ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => handlePagination(page, PAGE_SIZE, '')}
          />
        ) : (
          <span />
        )}
      </div>
      {openDeletePopup && (
        <DeletePopup
          open={openDeletePopup}
          title={deleteType === 1 ? 'Delete notification' : 'Delete all notifications'}
          message={`Are you sure you want to delete ${
            deleteType === 1 ? 'this notification' : 'all notifications'
          }? This action cannot be undone.`}
          setOpen={setDeletePopup}
          setDelete={handleDeletePopup}
        />
      )}
      {show && (
        <TextBox
          open={show}
          message={selectedNotification?.message}
          setOpen={setShow}
          type={selectedNotification?.type}
          audioUrl={selectedNotification?.audioUrl}
          title={selectedNotification?.title}
          id={selectedNotification?._id || selectedNotification.id}
        />
      )}
    </>
  );
}

export default ViewPartnerNotification;

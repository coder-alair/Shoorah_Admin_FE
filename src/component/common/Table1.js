import React, { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { ReactComponent as NoDataFoundImg } from '../../assets/images/no-data-found.svg';
import PropTypes from 'prop-types';
import {
  errorToast,
  getAccountType,
  getContentType,
  getFocusType,
  getMeditationType,
  getSentToUser,
  getUserType,
  successToast
} from '../../utils/helper';
import ProfilePic from '../../assets/images/dummy_profile.png';
import Thumbnail from '../../assets/images/thumbnail.png';
import { useNavigate } from 'react-router-dom';
import DeletePopup from './modals/DeletePopup';
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpDownIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import moment from 'moment';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import VideoPlayer from './modals/VideoPlayer';
import BulkOperationPopup from './modals/BulkOperationPopup';
import { Api } from '../../api';
import ConfirmPopup from './modals/ConfirmPopup';
import ActiveInactiveToggle from './ActiveInactiveToggle';
import googleIcon from '../../assets/images/google.png';
import fbIcon from '../../assets/images/fb.png';
import appleIcon from '../../assets/images/apple.png';
import mailIcon from '../../assets/images/email.png';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { CONTENT_APPROVAL_TYPE } from '../../utils/constants';
import { Listbox, Popover, Transition } from '@headlessui/react';
import Loader from './Loader';
import LazyLoadImageProp from './LazyLoadImage';
import FocusPopup from './modals/FocusPopup';
import ActiveInactiveCompanyToggle from './ActiveInactiveCompanyToggle';
import { getPathForSurvey } from '../../utils/helper';

const Table = ({
  columns,
  data = [],
  setDeleteId,
  setSelectedRow,
  name,
  addNewURL,
  setSortBy,
  refreshTable,
  contentType,
  loader,
  setSearchTerm,
  showIndex
}) => {
  const checkbox = useRef({ indeterminate: false });
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedRowOfTable, setSelectedRowOfTable] = useState(null);

  useLayoutEffect(() => {
    if (data?.length > 0) {
      const isIndeterminate = selectedData.length > 0 && selectedData.length < data.length;
      setChecked(selectedData.length === data.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedData, data.length]);

  function toggleAll() {
    setSelectedData(checked || indeterminate ? [] : data?.map((temp) => temp.id));
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const [openDeletePopup, setDeletePopup] = useState(false);
  const [bulkOperationPopup, setBulkOperationPopup] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [openVideoPlayer, setVideoPlayer] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [activePlaying, setActivePlaying] = useState(null);
  const [actionType, setActionType] = useState('');
  const [open, setOpen] = React.useState(false);
  const [openFocusPopup, setOpenFocusPopup] = useState(false);
  const [focusData, setFocusData] = useState([]);
  const navigate = useNavigate();
  const deleteHandler = (id) => {
    setIdToDelete(id);
    setDeletePopup(true);
  };

  const bulkOperationHandler = (actionType) => {
    setActionType(actionType);
    setBulkOperationPopup(true);
  };

  const activePlayerHandler = (id) => {
    setActivePlaying(id);
  };

  const pauseHandler = () => {
    setActivePlaying(null);
  };

  const focusPopUpHandler = (data) => {
    setFocusData([]);
    setOpenFocusPopup(true);
    setFocusData(data);
  };

  const formattedData = (rowData, data, type, column, index) => {
    const handleOldNew = (data) => {
      navigate(column.isTwoOption, {
        state: { ...rowData, action: 'view', option: data?.value === 1 ? 1 : 2 }
      });
    };
    if (type === 'multi-badge') {
      return (
        <div className="flex flex-wrap gap-1">
          <div className="flex-1">
            <div className="m-0 p-3 text-center px-3 py-[3px] text-md leading-5 font-semibold tracking-normal rounded-full text-blue-700 bg-blue-100 inline-block">
              Completed: {rowData?.count?.complete}
            </div>
          </div>

          <div className="flex-1 m-0 text-center p-3 px-3 py-[3px] text-md leading-5 font-semibold tracking-normal rounded-full text-red-700 bg-red-100 inline-block">
            Incomplete: {rowData?.count?.incomplete}
          </div>

          <div className="flex-0">
            <div className="m-0 p-3 text-center px-3 py-[3px] text-md leading-5 font-semibold tracking-normal rounded-full text-green-700 bg-green-100">
              Open: {rowData?.count?.open}
            </div>
          </div>
        </div>
      );
    } else if (type === 'badge') {
      return (
        <p
          className={`inline-flex m-0 rounded-full ${
            data === 1 ? 'bg-green-100' : 'bg-red-100'
          } px-3 py-[3px] text-md leading-5 capitalize font-semibold tracking-normal ${
            data === 1 ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {data === 1 ? 'active' : 'inactive'}
        </p>
      );
    } else if (type === 'companyName') {
      return data;
    } else if (type === 'userType') {
      return getUserType(data);
    } else if (type === 'contentType') {
      return getContentType(data);
    } else if (type === 'contentStatus') {
      return <div>{data === 0 ? 'Draft' : data === 1 ? 'Approved' : 'Rejected'}</div>;
    } else if (type === 'focusType') {
      return getFocusType(data);
    } else if (type === 'accountType') {
      return getAccountType(data);
    } else if (type === 'meditationType') {
      return getMeditationType(data);
    } else if (type === 'sentToUser') {
      return getSentToUser(data);
    } else if (type === 'profile') {
      let name = rowData.name?.split(' ');
      return (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div>
              {data ? (
                <LazyLoadImageProp imageSrc={data ? data : ProfilePic} />
              ) : (
                <div className="bg-black dark:bg-shoorah-darkBgColor flex justify-center items-center h-10 w-10 rounded-full">
                  <span className="text-white">{name[0]?.charAt(0)}</span>
                  <span className="text-white">{name[1]?.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium dark:text-white text-gray-900">{rowData.name}</div>
            <div className="text-gray-500 lowercase">{rowData?.email}</div>
          </div>
        </div>
      );
    } else if (type === 'action') {
      return (
        <div className="flex items-center justify-end">
          {column.isEdit && (
            <PencilSquareIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
              onClick={() =>
                navigate(getPathForSurvey('/surveys/add-edit?id=' + rowData?.element?._id))
              }
            />
          )}
          {column?.isView && (
            // Todo:
            <EyeIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
              onClick={() => navigate(getPathForSurvey(`/surveys/summary/${rowData.element?._id}`))}
            />
          )}
          {column?.isTwoOption &&
            (rowData.parentId !== null ? (
              <div>
                <EyeIcon
                  className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
                  onClick={() => setOpen(!open)}
                />
                {open ? (
                  <Listbox onChange={(data) => handleOldNew(data)}>
                    {() => (
                      <>
                        <div className="relative">
                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="w-auto right-0 absolute shadow-lg text-left cursor-pointer z-10 mt-1 shadow-lg max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {CONTENT_APPROVAL_TYPE.map((menu, index) => (
                                <Listbox.Option
                                  key={index}
                                  className="text-gray-900 relative cursor-default  py-2 pl-3 pr-9 hover:text-white hover:bg-shoorah-primary"
                                  disabled={menu?.value === ''}
                                  value={menu}
                                >
                                  <span className="font-normal cursor-pointer">{menu?.name}</span>
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                ) : null}
              </div>
            ) : (
              <EyeIcon
                className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
                onClick={() =>
                  navigate(column.isTwoOption, {
                    state: { ...rowData, action: 'view' }
                  })
                }
              />
            ))}
          {column.isDelete && (
            <TrashIcon
              className="w-[20px] ml-2 text-red-500 cursor-pointer"
              onClick={() => deleteHandler(rowData?.element?._id)}
            />
          )}
          {column.isResend && (
            <div
              className="text-shoorah-secondary dark:text-white cursor-pointer"
              onClick={() => {
                setSelectedRowOfTable(rowData);
                setOpenConfirmPopup(true);
              }}
            >
              Resend
            </div>
          )}
          {column?.isDownload && (
            <ArrowDownTrayIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
              onClick={() => column?.isDownload(rowData)}
            />
          )}
          {column?.isReport && (
            <Popover className="">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`
                ${
                  open ? '' : 'text-opacity-90'
                } px-2 py-1 text-xs font-medium text-shoorah-secondary dark:text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto`}
                  >
                    <ArrowDownTrayIcon className="w-[20px] cursor-pointer" />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="bg-white rounded-md border absolute right-0 z-40 mt-1 max-w-[15rem] -translate-y-6 -translate-x-14 transform">
                      <p
                        className="px-4 py-2 hover:bg-gray-300 rounded-md cursor-pointer"
                        onClick={() => column?.isReport(rowData, 'CSV')}
                      >
                        Download CSV
                      </p>
                      <p
                        className="px-4 py-2 hover:bg-gray-300 rounded-md cursor-pointer"
                        onClick={() => column?.isReport(rowData, 'PDF')}
                      >
                        Download PDF
                      </p>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          )}
        </div>
      );
    } else if (type === 'draftAction') {
      return (
        <div className="flex items-center justify-end">
          {column.isEdit && (
            <PencilSquareIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
              onClick={() =>
                navigate(column.isEdit, {
                  state: { ...rowData, action: 'edit' }
                })
              }
            />
          )}

          {column.isDelete && (
            <TrashIcon
              className="w-[20px] ml-2 text-red-500 cursor-pointer"
              onClick={() => deleteHandler(rowData?.id)}
            />
          )}
          {column.isResend && (
            <div
              className="text-shoorah-secondary dark:text-white cursor-pointer"
              onClick={() => {
                setSelectedRowOfTable(rowData);
                setOpenConfirmPopup(true);
              }}
            >
              Resend
            </div>
          )}
          {column?.isDownload && (
            <ArrowDownTrayIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
              onClick={() => column?.isDownload(rowData)}
            />
          )}
          {column?.isReport && (
            <Popover className="">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`
                ${
                  open ? '' : 'text-opacity-90'
                } px-2 py-1 text-xs font-medium text-shoorah-secondary dark:text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto`}
                  >
                    <ArrowDownTrayIcon className="w-[20px] cursor-pointer" />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="bg-white rounded-md border absolute right-0 z-40 mt-1 max-w-[15rem] -translate-y-6 -translate-x-14 transform">
                      <p
                        className="px-4 py-2 hover:bg-gray-300 rounded-md cursor-pointer"
                        onClick={() => column?.isReport(rowData, 'CSV')}
                      >
                        Download CSV
                      </p>
                      <p
                        className="px-4 py-2 hover:bg-gray-300 rounded-md cursor-pointer"
                        onClick={() => column?.isReport(rowData, 'PDF')}
                      >
                        Download PDF
                      </p>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          )}
        </div>
      );
    } else if (type === 'boolean') {
      return (
        <>
          <p
            className="w-[3rem] min-w-[2rem] inline-block overflow-hidden overflow-ellipsis text-center"
            id={column.key + rowData.id}
          >
            {data ? 'Yes' : 'No'}
          </p>
        </>
      );
      // eslint-disable-next-line no-dupe-else-if
    } else if (type === 'companyName') {
      return data ? (
        <>
          {column.longText ? (
            <div>
              <p
                className="w-[20rem] min-w-[8rem] inline-block overflow-hidden overflow-ellipsis"
                id={column.key + rowData.id}
              >
                {data}
                {data.length >= 45 && (
                  <ReactTooltip
                    anchorId={column.key + rowData.id}
                    place="right"
                    style={{
                      width: '350px',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      textAlign: 'center',
                      maxHeight: '250px',
                      overflowY: 'hidden'
                    }}
                    content={data}
                  />
                )}
              </p>
            </div>
          ) : (
            data
          )}
        </>
      ) : (
        '━━'
      );
    } else if (type === 'text') {
      return data ? (
        <>
          {column.longText ? (
            <p
              className="w-[20rem] min-w-[8rem] inline-block overflow-hidden overflow-ellipsis"
              id={column.key + rowData.id}
            >
              {data}
              {data.length >= 45 && (
                <ReactTooltip
                  anchorId={column.key + rowData.id}
                  place="right"
                  style={{
                    width: '350px',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    textAlign: 'center',
                    maxHeight: '250px',
                    overflowY: 'hidden'
                  }}
                  content={data}
                />
              )}
            </p>
          ) : (
            data
          )}
        </>
      ) : (
        '━━'
      );
    } else if (type === 'date') {
      return data ? moment(data).format('MMM D, YYYY') : '━━';
    } else if (type === 'image') {
      return (
        <LazyLoadImageProp
          imageSrc={data ? data : Thumbnail}
          className="w-full max-w-[70px] h-auto rounded-md"
        />
      );
    } else if (type === 'array') {
      const array = data.slice(0, 2);
      return (
        <div>
          {array?.map((value, key) => (
            <div key={key}>
              {key === array.length - 1 ? value?.display_name : value?.display_name + ','}
            </div>
          ))}
          {data?.length > 2 ? (
            <div
              className="text-blue-800 font-medium cursor-pointer"
              onClick={() => focusPopUpHandler(data)}
            >
              +{data.length - array.length} more
            </div>
          ) : null}
        </div>
      );
    } else if (type === 'play') {
      return (
        <>
          <div className="flex items-start justify-center ">
            <AudioPlayer
              onPlay={() => activePlayerHandler(rowData.id)}
              pauseHandler={pauseHandler}
              playing={activePlaying === rowData.id}
              audioPath={rowData[column.key]}
            />
          </div>
        </>
      );
    } else if (type === 'toggle') {
      return (
        <>
          <ActiveInactiveToggle
            accountStatus={rowData[column.key]}
            userId={rowData.id ? rowData.id : rowData._id}
          />
        </>
      );
    } else if (type === 'company-toggle') {
      return (
        <>
          <ActiveInactiveCompanyToggle
            accountStatus={rowData[column.key]}
            userId={rowData.id ? rowData.id : rowData._id}
          />
        </>
      );
    } else if (type === 'verified') {
      return (
        <p
          className={`inline-flex m-0 rounded-full ${
            data === false || data === null ? 'bg-red-100' : 'bg-green-100'
          } px-3 py-[3px] text-md leading-5 capitalize font-semibold tracking-normal ${
            data === false || data === null ? 'text-red-700' : 'text-green-700'
          }`}
        >
          {data === false || data === null ? 'Pending' : 'Verified'}
        </p>
      );
    } else if (type === 'platform' || type === 'purchase_platform') {
      return (
        <div className="w-full flex justify-center relative">
          {
            <img
              loading='lazy'
              src={
                data === 0
                  ? mailIcon
                  : data === 1 && type === 'purchase_platform'
                  ? googleIcon
                  : data === 1 && type === 'platform'
                  ? appleIcon
                  : data === 2 && type === 'purchase_platform'
                  ? appleIcon
                  : data === 2 && type === 'platform'
                  ? googleIcon
                  : fbIcon
              }
              alt=""
              className="h-6 w-6 cursor-pointer"
              id={type === 'purchase_platform' ? rowData.transactionId : rowData.id}
            />
          }
          <ReactTooltip
            anchorId={type === 'purchase_platform' ? rowData.transactionId : rowData.id}
            place="left"
            content={
              data === 0
                ? 'Shoorah'
                : data === 1 && type === 'purchase_platform'
                ? 'Google'
                : data === 1 && type === 'platform'
                ? 'Apple'
                : data === 2 && type === 'purchase_platform'
                ? 'Apple'
                : data === 2 && type === 'platform'
                ? 'Google'
                : 'Facebook'
            }
            className="bg-shoorah-secondary"
          />
        </div>
      );
    }
  };

  const handleDeletePopup = () => {
    setDeletePopup(false);
    setDeleteId(idToDelete);
    setIdToDelete('');
  };

  const handleBulkOperation = () => {
    setBulkOperationPopup(false);
    setSearchTerm('');
    if (name === 'users_table') {
      const payload = {
        userIds: selectedData,
        userStatus: actionType
      };
      Api.postUserBulkAction(payload).then((response) => {
        if (response.data.meta.code === 1) {
          successToast(response.data.meta.message);
          setSelectedData([]);
          setChecked(false);
          setIndeterminate(false);
          refreshTable();
        } else if (response.data.meta.code === 0) {
          errorToast(response.data.meta.message);
        }
      });
    } else {
      const payload = {
        contentIds: selectedData,
        contentType: contentType,
        contentStatus: actionType
      };
      //api call to delete
      Api.postBulkAction(payload).then((response) => {
        if (response.data.meta.code === 1) {
          successToast(response.data.meta.message);
          setSelectedData([]);
          setChecked(false);
          setIndeterminate(false);
          refreshTable();
        } else if (response.data.meta.code === 0) {
          errorToast(response.data.meta.message);
        }
      });
    }
  };

  const handleResendNotification = (e, row) => {
    e.preventDefault();
    setSelectedRow(row);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="inline-block min-w-full pt-2 align-middle ">
            <div
              className={
                `overflow-hidden dark:border-none border-gray-200 shadow rounded-t-[15px] ` +
                (data?.length > 0 ? 'border' : '')
              }
            >
              {data?.length > 0 ? (
                <table className="min-w-full divide-y dark:divide-none divide-[#EAEAEA]">
                  <thead className="bg-gradient-to-r from-shoorah-primary to-shoorah-secondary">
                    <tr>
                      {showIndex && (
                        <th className="text-sm text-left p-3 font-semibold text-white">
                          Serial No.
                        </th>
                      )}
                      {columns?.map((column, index) => {
                        return (
                          <Fragment key={index}>
                            {column.type === 'checkBox' ? (
                              <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                                <input
                                  type="checkbox"
                                  className={`${
                                    data.length !== 0 && 'cursor-pointer'
                                  } absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 accent-shoorah-primary sm:left-6`}
                                  ref={checkbox}
                                  checked={checked}
                                  onChange={toggleAll}
                                  disabled={data.length === 0}
                                />
                                {selectedData.length > 0 && (
                                  <div
                                    className="absolute top-0 left-12 flex items-center space-x-3 dark:bg-shoorah-darkBgTabColor px-2 bg-shoorah-tableHeader sm:left-16"
                                    style={{ height: '-webkit-fill-available' }}
                                  >
                                    {name !== 'users_table' ? (
                                      <button
                                        onClick={() => bulkOperationHandler(2)}
                                        type="button"
                                        className="inline-flex items-center rounded border border-gray-300 bg-white dark:bg-shoorah-darkBgColor hover:dark:bg-shoorah-darkBgColor dark:text-white dark:border-none px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                                      >
                                        Delete
                                      </button>
                                    ) : null}
                                    <button
                                      onClick={() => bulkOperationHandler(1)}
                                      type="button"
                                      className="inline-flex items-center rounded border border-gray-300 bg-white dark:bg-shoorah-darkBgColor hover:dark:bg-shoorah-darkBgColor dark:text-white dark:border-none px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                      Active
                                    </button>
                                    <button
                                      onClick={() => bulkOperationHandler(0)}
                                      type="button"
                                      className="inline-flex items-center rounded border border-gray-300 bg-white dark:bg-shoorah-darkBgColor hover:dark:bg-shoorah-darkBgColor dark:text-white dark:border-none px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                      Inactive
                                    </button>
                                  </div>
                                )}
                              </th>
                            ) : (
                              <th
                                key={index}
                                scope="col"
                                className={`p-3 ${column.sortable ? 'cursor-pointer' : ''} ${
                                  columns[0]?.type === 'checkBox' &&
                                  index === 1 &&
                                  column.type !== 'play'
                                    ? 'min-w-[14rem]'
                                    : ''
                                } ${
                                  column.align === 'left'
                                    ? 'text-left'
                                    : column.align === 'center'
                                    ? 'text-center'
                                    : 'text-right'
                                } ${
                                  column.extend ? 'min-w-[12rem] ' : ''
                                } text-sm font-semibold text-white`}
                              >
                                {column.sortable ? (
                                  <div
                                    className="flex"
                                    onClick={() =>
                                      setSortBy(column?.sortKey ? column?.sortKey : column.key)
                                    }
                                  >
                                    <span className="self-center">{column.title} </span>
                                    <span className="self-center">
                                      {column.sortable ? (
                                        <ChevronUpDownIcon className="w-[20px]" />
                                      ) : (
                                        ''
                                      )}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="flex gap-1 items-center ">
                                    {column.title}{' '}
                                    {column.download && (
                                      <svg
                                        onClick={() => column?.onClickDownload()}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 mt-[-3px] cursor-pointer"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
                                        />
                                      </svg>
                                    )}
                                  </span>
                                )}
                              </th>
                            )}
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
                        {data?.length > 0 ? (
                          data?.map((data, index) => {
                            return (
                              <tr key={index}>
                                {showIndex && (
                                  <td className="p-3 text-sm dark:text-white text-[#606060]">
                                    {index + 1}.
                                  </td>
                                )}
                                {columns?.map((column, index1) => {
                                  return (
                                    <Fragment key={index1}>
                                      {column.type === 'checkBox' ? (
                                        <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                                          {selectedData.includes(data.id) && (
                                            <div className="absolute inset-y-0 left-0 w-0.5 bg-shoorah-primary" />
                                          )}
                                          <input
                                            type="checkbox"
                                            className="cursor-pointer absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 accent-shoorah-primary sm:left-6"
                                            value={data.id}
                                            checked={selectedData.includes(data.id)}
                                            onChange={(e) =>
                                              setSelectedData(
                                                e.target.checked
                                                  ? [...selectedData, data.id]
                                                  : selectedData.filter((p) => p !== data.id)
                                              )
                                            }
                                          />
                                        </td>
                                      ) : column.type === 'companyName' ? (
                                        <td
                                          className={`whitespace-nowrap ${
                                            column.align === 'left'
                                              ? 'text-left'
                                              : column.align === 'center'
                                              ? 'text-center'
                                              : 'text-right'
                                          } p-3 text-sm dark:text-white text-[#606060] ${
                                            column.transform ? column.transform : 'capitalize'
                                          }`}
                                        >
                                          <div className="flex flex-row items-center gap-2">
                                            <img
                                              loading='lazy'
                                              src={formattedData(
                                                data,
                                                data[column.key2],
                                                column.type,
                                                column,
                                                index1
                                              )}
                                              alt=""
                                              className="border-[#E5EAF9] w-[34px] h-[34px] rounded-full"
                                            />
                                            <p className="whitespace-nowrap">
                                              {formattedData(
                                                data,
                                                data[column.key1],
                                                column.type,
                                                column,
                                                index1
                                              )}
                                            </p>
                                          </div>
                                        </td>
                                      ) : (
                                        <td
                                          key={index}
                                          className={`whitespace-nowrap ${
                                            column.align === 'left'
                                              ? 'text-left'
                                              : column.align === 'center'
                                              ? 'text-center'
                                              : 'text-right'
                                          } p-3 text-sm dark:text-white text-[#606060] ${
                                            column.transform ? column.transform : 'capitalize'
                                          }`}
                                        >
                                          {column?.nested
                                            ? formattedData(
                                                data,
                                                data.parent[column.key1]?.[column.key2],
                                                column.type,
                                                column,
                                                index1
                                              )
                                            : column?.parent === 'element'
                                            ? formattedData(
                                                data,
                                                data.element[column.key],
                                                column.type,
                                                column,
                                                index1
                                              )
                                            : formattedData(
                                                data,
                                                data.count[column.key],
                                                column.type,
                                                column,
                                                index1
                                              )}
                                        </td>
                                      )}
                                    </Fragment>
                                  );
                                })}
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
                                <p className="text-center text-shoorah-gray4 text-sm mt-3">
                                  No results
                                </p>
                                {addNewURL && (
                                  <div className="text-center mt-3">
                                    <button
                                      type="button"
                                      onClick={() => navigate(addNewURL)}
                                      className="items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2 sm:w-auto whitespace-nowrap"
                                    >
                                      Add New
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="h-full py-8 dark:bg-shoorah-darkBgTabColor bg-white rounded-2xl border-[#EAEAEA] w-full">
                  <NoDataFoundImg
                    className={`m-auto text-indigo-50 border dark:border-none border-shoorah-blue rounded-lg`}
                  />
                  <p className="text-center text-shoorah-gray4 text-sm mt-3">No results</p>
                  {addNewURL && (
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        onClick={() => navigate(addNewURL)}
                        className="items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2 sm:w-auto whitespace-nowrap"
                      >
                        Add New
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {openConfirmPopup && (
        <ConfirmPopup
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          message={'Are you sure you want to resend notification?'}
          setAccepted={(e) => handleResendNotification(e, selectedRowOfTable)}
        />
      )}
      {openDeletePopup && (
        <DeletePopup
          open={openDeletePopup}
          setOpen={setDeletePopup}
          setDelete={handleDeletePopup}
        />
      )}
      {bulkOperationPopup && (
        <BulkOperationPopup
          open={bulkOperationPopup}
          setOpen={setBulkOperationPopup}
          setDelete={handleBulkOperation}
          actionType={actionType}
        />
      )}
      <FocusPopup open={openFocusPopup} setOpen={setOpenFocusPopup} data={focusData} />
      {openVideoPlayer && <VideoPlayer open={openVideoPlayer} setOpen={setVideoPlayer} />}
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  contentType: PropTypes.any,
  setDeleteId: PropTypes.func,
  setSelectedRow: PropTypes.func,
  setSortBy: PropTypes.func,
  refreshTable: PropTypes.func,
  name: PropTypes.string,
  addNewURL: PropTypes.string,
  bottomBorder: PropTypes.bool,
  loader: PropTypes.bool,
  setSearchTerm: PropTypes.func,
  showIndex: PropTypes.bool
};

export default Table;

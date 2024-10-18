import React, { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { ReactComponent as NoDataFoundImg } from '../../assets/images/no-data-found.svg';
import PropTypes from 'prop-types';
import {
  errorToast,
  getAccountType,
  getContentType,
  getFocusType,
  getMeditationType,
  getMultiBadge,
  getPathForSurvey,
  getSentToUser,
  getUserType,
  successToast
} from '../../utils/helper';
import ProfilePic from '../../assets/images/dummy_profile.png';
import Thumbnail from '../../assets/images/thumbnail.png';
import { useNavigate } from 'react-router-dom';
import DeletePopup from './modals/DeletePopup';
import TypeDropdown from './table/tableComponents/dropdown';
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpDownIcon,
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon
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
import PeapProfileDialog from '../../../src/container/Peap/adminPeapTabs/peapProfileDialog';

const Table = ({
  columns,
  data = [],
  setDeleteId,
  setSelectedRow,
  name,
  addNewURL,
  sortBy,
  setSortBy,
  sortOrder,
  refreshTable,
  contentType,
  loader,
  setSearchTerm,
  showIndex,
  onNameClick,
  isEdit = false,
  isdetail = true,
  isname = false,
  handleDropdownChange,
  options
}) => {
  const checkbox = useRef({ indeterminate: false });
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedRowOfTable, setSelectedRowOfTable] = useState(null);
  const handleDownload = async (imageUrl) => {
    try {
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch the image');
      }

      const blob = await response.blob();

      // Create a temporary URL for the blob
      const urlBlob = window.URL.createObjectURL(blob);

      // Create a link element to download the image
      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = 'payment_receipt.png'; // Set the file name
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  };
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
  const [actionType] = useState('');
  const [open, setOpen] = React.useState(false);
  const [openFocusPopup, setOpenFocusPopup] = useState(false);
  const [focusData, setFocusData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExpertId, setSelectedExpertId] = useState(null);
  

  const navigate = useNavigate();

  const deleteHandler = (id) => {
    setIdToDelete(id);
    setDeletePopup(true);
  };

  const activePlayerHandler = (id) => {
    setActivePlaying(id);
  };

  const pauseHandler = () => {
    setActivePlaying(null);
  };

  const focusPopUpHandler = (state) => {
    setFocusData([]);
    setOpenFocusPopup(true);
    setFocusData(state);
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Pending review':
        return 'bg-[#f6e6cf]';
      case 'approved':
        return 'bg-red-500';
      case 'Declined':
        return 'bg-[#ffc6e4]';
      case 'Invited to interview':
        return 'bg-[#acecd0]';
      default:
        return 'bg-gray-500'; // Default color
    }
  };

  const formattedData = (rowData, data, type, column, index) => {
    console.log('🚀 ~ formattedData ~ rowData:', rowData);
    console.log('🚀 ~ formattedData ~ column', data);

    const handleOldNew = (state) => {
      navigate(column.isTwoOption, {
        state: { ...rowData, action: 'view', option: state?.value === 1 ? 1 : 2 }
      });
    };

    const handleCloseDialog = () => {
      setIsDialogOpen(false);
      setSelectedExpertId(null);
    };
  

    const buildUrlWithId = (url, isDraft) => {
      return isEdit ? `${url}?id=${rowData?.id}${isDraft ? '&type=draft' : ''}` : url;
    };
    if (type === 'badge') {
      return (
        <p
          className={`inline-flex m-0 rounded-full ${
            data === 1 ? 'bg-green-100' : 'bg-red-100'
          } px-3 text-md leading-5 capitalize font-semibold tracking-normal ${
            data === 1 ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {data === 1 ? 'active' : 'inactive'}
        </p>
      );
    } else if (type === 'intro_badge') {
      return (
        <p
          className={`inline-flex m-0 rounded-full ${
            data === true ? 'bg-green-200' : 'bg-red-200'
          } px-3 py-[3px] text-md leading-5 capitalize font-semibold tracking-normal ${
            data === true ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {data === true ? 'introduced' : 'Not introduced'}
        </p>
      );
    } else if (type === 'companyName') {
      let companyName = rowData.company_name?.split(' ');

      return (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div>
              {rowData?.company_logo && !rowData?.company_logo.includes('null') ? (
                <LazyLoadImageProp imageSrc={rowData?.company_logo && rowData?.company_logo} />
              ) : (
                <div className="bg-black dark:bg-shoorah-darkBgColor flex justify-center items-center h-10 w-10 rounded-full">
                  <span className="text-white">{companyName[0]?.charAt(0)}</span>
                  <span className="text-white">{companyName[1]?.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="ml-4">
            {/* <div className="font-medium dark:text-white text-gray-900">{rowData.company_name}</div> */}
          </div>
        </div>
      );
    } else if (type === 'userType') {
      return getUserType(data);
    } else if (type === 'contentType') {
      return getContentType(data);
    } else if (type === 'multi-badge') {
      console.log('🚀 ~ formattedData ~ data:', data);

      const handleClick = () => {
        if (data.completed === 0) {
          navigate('/survey');
        }
      };

      return <div onClick={handleClick}>{getMultiBadge(data || {})}</div>;
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
      let username = rowData.name?.split(' ');
      return (
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div>
              {data && <LazyLoadImageProp imageSrc={data ? data : ProfilePic} />}
              {!data && (
                <div className="bg-black dark:bg-shoorah-darkBgColor flex justify-center items-center h-10 w-10 rounded-full">
                  <span className="text-white">{username[0]?.charAt(0)}</span>
                  <span className="text-white">{username[1]?.charAt(0)}</span>
                </div>
              )}
            </div>
          </div>
          {isdetail && !isname && (
            <div className="ml-4">
              <div className="font-medium dark:text-white text-gray-900">{rowData.name}</div>
              <div className="text-gray-500 lowercase">{rowData?.email}</div>
            </div>
          )}
          {/* {isname && column?.isView && (
            <div className="ml-4">
              <div
                className=" hover:text-blue-700 underline"
                onClick={() => navigate(column?.isView, { state: { ...rowData, action: 'edit' } })}
              >
                {rowData.name}
              </div>
            </div>
          )} */}
        </div>
      );
    } else if (type === 'componyName') {
      return (
        <>
          {isname && column?.isView && (
            <div className="ml-4">
              <div
                //  style={{color:'blue'}}
                className=" hover:text-blue-700 underline"
                onClick={() =>
                  navigate(column?.isView, {
                    state: {
                      ...rowData,
                      action: 'edit'
                      // parantName:parant,parantURL:parantURL
                    }
                  })
                }
              >
                {rowData.name}
              </div>
              {/* <div className="text-gray-500 lowercase">{rowData?.email}</div> */}
            </div>
          )}
        </>
      );
    } else if (type === 'action') {
      return (
        <div className="flex items-center justify-end">
          {column.isEdit && (
            <PencilSquareIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
              onClick={() => {
                if (column.handleEdit) {
                  console.log('🚀 ~ formattedData ~ rowData:', rowData);
                  column.handleEdit(rowData);
                } else {
                  navigate(buildUrlWithId(column.isEdit, column.isDraft), {
                    state: { ...rowData, action: 'edit' }
                  });
                }
              }}
            />
          )}
          {column.isClone && (
            <DocumentDuplicateIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
              // onClick={() => {
              //   if (column.handleEdit) {
              //     column.handleEdit(rowData);
              //   } else {
              //     navigate(buildUrlWithId(column.isEdit,column.isDraft), {
              //       state: { ...rowData, action: 'edit' }
              //     });
              //   }
              // }}
            />
          )}
          {column?.isView && (
            <EyeIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
              onClick={() => {
                if (column.handleEdit) {
                  column.handleEdit(rowData);
                } else {
                  navigate(buildUrlWithId(column.isView), {
                    state: { ...rowData, action: 'edit' }
                  });
                }
              }}
            />
          )}
          {/* For Survey we don't want enter in this condition */}
          {column?.isTwoOption &&
            (rowData.parentId ? (
              <div>
                <EyeIcon
                  className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
                  onClick={() => setOpen(!open)}
                />
                {open && (
                  <Listbox onChange={(state) => handleOldNew(state)}>
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
                            <Listbox.Options className="right-0 absolute shadow-lg text-center cursor-pointer z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                )}
              </div>
            ) : (
              <EyeIcon
                className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
                onClick={() => {
                  let uri = column.isTwoOption;
                  if (rowData?.contentType === 8 || name === 'survey_table_data') {
                    uri = getPathForSurvey(
                      `/view-survey/${
                        rowData?.contentType === 8 ? rowData?.content_type_id : rowData?.id
                      }?type=${name === 'content_approval' ? 'approval' : 'preview'}`
                    );
                  }
                  navigate(uri, {
                    state: { ...rowData, action: 'view' }
                  });
                }}
              />
            ))}
          {column.isDelete && (
            <TrashIcon
              className="w-[20px] ml-2 text-red-500 cursor-pointer"
              onClick={() => deleteHandler(rowData?.id || rowData?._id)}
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

          {column?.isDownload && rowData?.download ? (
            <ArrowDownTrayIcon
              className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
              onClick={() => {
                handleDownload(rowData?.download);
              }}
            />
          ) : column?.isDownload && !rowData?.download ? (
            'N/A'
          ) : (
            ''
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
    } else if (type === 'button') {
      return (
        <>
          <button class="hover:bg-blue-800 text-white font-light mr-1  px-8 rounded-3xl bg-shoorah-primary">
            Pause
          </button>

          <button class="bg-red-600 hover:bg-red-800 text-white font-light  px-3 rounded-3xl">
            Deactivate
          </button>
        </>
      );
    } else if (type === 'text') {
      return data ? (
        <>
          {column.longText ? (
            <p
              className="w-[20rem] min-w-[8rem] inline-block overflow-hidden overflow-ellipsis"
              id={column.key + rowData.id}
              data-tooltip-id={column.key + rowData.id}
              data-tooltip-content={data?.name}
            >
              {data}
              {data.length >= 35 && <ReactTooltip id={column.key + rowData.id} />}
            </p>
          ) : (
            data
          )}
        </>
      ) : (
        'N/A'
      );
    } else if (type === 'Partner') {
      const rowDatas = {
        ...rowData,
        id: rowData?.partnerId
      };
      return data ? (
        <button
          className="hover:text-blue-900 underline"
          onClick={() =>
            navigate(column?.isEdit, {
              state: {
                ...rowDatas,
                action: 'edit'
              }
            })
          }
        >
          {data}
        </button>
      ) : (
        'N/A'
      );
    }
    // else if (type === 'text2') {
    //   return data ? (
    //     <>
    //       {column.longText ? (

    //         <p
    //         onClick={() => navigate(`/peap-management/profile?userId=${rowData?.id}`)}
    //           className={`w-[8rem] !underline min-w-[8rem] inline-block overflow-hidden overflow-ellipsis ${
    //             column.align === 'left'
    //               ? 'text-left'
    //               : column.align === 'right'
    //               ? 'text-right'
    //               : 'text-center'
    //           }`}
    //           id={column.key + rowData.id}
    //           data-tooltip-id={column.key + rowData.id}
    //           data-tooltip-content={data?.name}
    //         >
    //           {data}
    //           {data.length >= 35 && <ReactTooltip id={column.key + rowData.id} />}
    //         </p>
    //       ) : (
    //         data
    //       )}
    //     </>
    //   ) : (
    //     '━━'
    //   );
    // }
    else if (type === 'text2') {
      console.log(">>>>>>>>>>>>>>>>",rowData)
      return data ? (
        <>
          {column.longText ? (
            <>
              <p
                onClick={() => {
                  setIsDialogOpen(true);
                  setSelectedExpertId(rowData?.expert?._id);
                }}
              >
                {/* {rowData?.name || '━━'} */}
                <p className="cursor-pointer text-blue-600 underline">
                  {rowData?.name || '━━'}
                </p>
              </p>
              {isDialogOpen && selectedExpertId && rowData?.expert?._id == selectedExpertId && (
                <PeapProfileDialog onClose={handleCloseDialog} expertId={selectedExpertId} />
              )}
            </>
          ) : (
            '━━'
          )}
        </>
      ) : null;
    } 
    else if (type === 'text3') {
      return data ? (
        <>
          {column.longText ? (
            <p
              onClick={onNameClick}
              className={`w-[10rem] !underline min-w-[8rem] inline-block overflow-hidden overflow-ellipsis ${
                column.align === 'left'
                  ? 'text-left'
                  : column.align === 'right'
                  ? 'text-right'
                  : 'text-center'
              }`}
              id={column.key + rowData.id}
              data-tooltip-id={column.key + rowData.id}
              data-tooltip-content={data?.name}
            >
              {data}
              {data.length >= 35 && <ReactTooltip id={column.key + rowData.id} />}
            </p>
          ) : (
            data
          )}
        </>
      ) : (
        'N/A'
      );
    } else if (type === 'views') {
      return data ? (
        <p
          className=" min-w-[3rem] flex flex-col rounded-xl justify-center items-center inline-block text-white py-1 overflow-hidden bg-shoorah-primary overflow-ellipsis"
          id={column.key + rowData.id}
          onMouseEnter={(e) =>
            (e.currentTarget.querySelector('span').style.display = 'inline-block')
          }
          onMouseLeave={(e) => (e.currentTarget.querySelector('span').style.display = 'none')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <span className="hidden cursor-default"> {data}</span>
        </p>
      ) : (
        0
      );
    } else if (type === 'sendBy') {
      return data ? (
        <>
          {column.longText ? (
            <p
              className="w-[20rem] min-w-[8rem] inline-block overflow-hidden overflow-ellipsis"
              id={column.key + rowData.id}
              data-tooltip-id={column.key + rowData.id}
              data-tooltip-content={data?.name}
            >
              {data?.name}
              {data?.name.length >= 35 && <ReactTooltip id={column.key + rowData.id} />}
            </p>
          ) : (
            data?.name
          )}
        </>
      ) : (
        'N/A'
      );
    } else if (type === 'date') {
      return data ? moment(data).format('MMM D, YYYY') : 'N/A';
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
    } else if (type === 'status') {
      return data ? (
        <button
          className={` rounded-full w-[216px] py-1 px-4  ${column.style?.opacity} ${
            column.style?.align
          } ${column.style?.textColor} ${getStatusBgColor(
            data
          )} text-sm font-normal font-['Work Sans']`}
        >
          {data}
        </button>
      ) : (
        'N/A'
      );
    }
    if (type === 'notificationAudio') {
      return (
        <>
          {rowData.audioUrl ? (
            <div className="flex items-start justify-center ">
              <AudioPlayer
                onPlay={() => activePlayerHandler(rowData.id)}
                pauseHandler={pauseHandler}
                playing={activePlaying === rowData.id}
                audioPath={rowData[column.key]}
              />
            </div>
          ) : (
            <p className="text-center">N/A</p>
          )}
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
              className="h-6 w-6 cursor-pointer"
              id={type === 'purchase_platform' ? rowData.transactionId : rowData.id}
              alt="platform"
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
    } else if (type === 'rating') {
      return (
        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                disabled
                className={index <= rowData.rating ? 'text-shoorah-primary' : 'text-white'}
              >
                <span className="star">&#9733;</span>
              </button>
            );
          })}
        </div>
      );
    } else if (type === 'profile1') {
      return (
        <div className="flex items-center">
          <div className="flex-shrink-0"></div>
          <div className="">
            <div className="font-medium dark:text-white text-black no-underline decoration-none">
              {rowData.name}
            </div>

            <div className="text-[10px] pt-[5px] no-underline font-medium dark:text-white text-black lowercase">
              {rowData?.email}
            </div>
          </div>
        </div>
      );
    } else if (type === 'Notebutton') {
      return (
        <>
          <button class="bg-[#e5eaf9] hover:bg-red-700 text-[14px] text-gray-900 font-semibold  py-2 px-5 rounded-lg ">
            NotesDone
          </button>
        </>
      );
    } else if (type === 'Notepush') {
      return (
        <>
          <button class=" text-[14px] text-black font-semibold   border-none focus:outline-none">
            Send push to book session
          </button>
        </>
      );
    } else if (type === 'viewneditpush') {
      return (
        <div class="flex">
          {/* <img src={Notebook} alt="NotebookImage" className=" w-[25px] h-auto " /> */}
          <button class=" pl-[12px] text-[12px] text-black font-semibold   border-none focus:outline-none">
            View & edit notes
          </button>
        </div>
      );
    } else if (type === 'feedback') {
      return rowData.feedback?.[column.key];
    } else if (type === 'customTemplate') {
      return column.customTemplateRender(rowData);
    } else if (type === 'dropdown') {
      return (
        <TypeDropdown
          data={rowData}
          column={column}
          handleDropdownChange={handleDropdownChange}
          options={options}
        />
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
              className={`overflow-hidden border dark:border-none border-gray-200 shadow rounded-t-[15px]`}
            >
              {data?.length > 0 ? (
                <table className="min-w-full divide-y dark:divide-none divide-[#EAEAEA]">
                  <thead className="">
                    <tr>
                      {showIndex && (
                        <th className="text-sm text-centre p-3 text-left font-semibold text-white">
                          Serial No.
                        </th>
                      )}
                      {columns?.map((column, index) => {
                        const isColumnHighlighted =
                          column.sortable && sortBy && sortBy === column?.sortKey;
                        const widthClasses = column.width
                          ? `max-w-[${column.width}px] min-w-[20px] text-ellipsis overflow-hidden whitespace-nowrap`
                          : '';
                        const minusWidthClasses = column.width
                          ? `max-w-[${Math.max(
                              column.width - 20,
                              20
                            )}px] text-ellipsis overflow-hidden whitespace-nowrap`
                          : '';
                        return (
                          <Fragment key={index}>
                            {column.type === 'checkBox1' ? (
                              <th
                                scope="col"
                                className={`bg-gray-300 relative w-12 px-6 sm:w-16 sm:px-8 ${widthClasses}`}
                              >
                                <input
                                  type="checkbox1"
                                  className={`${
                                    data.length !== 0 && 'cursor-pointer'
                                  } absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border border-[blue] accent-shoorah-primary sm:left-6`}
                                  ref={checkbox}
                                  checked={checked}
                                  onChange={toggleAll}
                                  disabled={data.length === 0}
                                />
                              </th>
                            ) : (
                              <th
                                key={index}
                                scope="col"
                                className={`p-3 bg-black bg-opacity-10  dark:bg-white dark:bg-opacity-10 ${
                                  column.sortable ? 'cursor-pointer' : ''
                                } ${
                                  columns[0]?.type === 'checkBox' &&
                                  index === 1 &&
                                  column.type !== 'play'
                                    ? 'min-w-[14rem]'
                                    : ''
                                } ${
                                  column.style?.align ||
                                  (column.align === 'left'
                                    ? 'text-left'
                                    : column.align === 'center'
                                    ? 'text-center'
                                    : 'text-right')
                                } ${column.extend ? 'min-w-[13rem] ' : ''} text-sm font-normal ${
                                  isColumnHighlighted
                                    ? 'text-shoorah-darkPurple dark:text-white'
                                    : 'text-black opacity-50 dark:text-white dark:opacity-50'
                                } ${widthClasses}`}
                              >
                                {column.sortable ? (
                                  <Fragment>
                                    <ReactTooltip id={`table-col-${index}-tip`} />
                                    <div
                                      data-tooltip-id={`table-col-${index}-tip`}
                                      data-tooltip-content={column.title}
                                      className="flex "
                                      onClick={() =>
                                        setSortBy(column?.sortKey ? column?.sortKey : column.key)
                                      }
                                    >
                                      <span className={`self-center ${minusWidthClasses}`}>
                                        {column.title}{' '}
                                      </span>
                                      <span className="self-center">
                                        {column.sortable ? (
                                          sortBy && sortOrder && sortBy === column?.sortKey ? (
                                            sortOrder === 1 ? (
                                              <ChevronDoubleUpIcon className="ml-2 w-4" />
                                            ) : (
                                              <ChevronDoubleDownIcon className="ml-2 w-4" />
                                            )
                                          ) : (
                                            <ChevronUpDownIcon className="w-[20px]" />
                                          )
                                        ) : (
                                          ''
                                        )}
                                      </span>
                                    </div>
                                  </Fragment>
                                ) : (
                                  column.title
                                )}
                              </th>
                            )}
                          </Fragment>
                        );
                      })}
                    </tr>
                  </thead>
                  {/* divide-y */}
                  <tbody className=" dark:divide-shoorah-darkBgColor divide-[#EAEAEA] dark:bg-shoorah-darkBgTabColor bg-white">
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
                            console.log('🚀 ~ data?.map ~ data:', data);
                            return (
                              <tr
                                key={index}
                                className="hover:bg-gray-100 md:cursor-pointer dark:hover:bg-shoorah-darkBgColor"
                              >
                                {showIndex && (
                                  <td className="p-3 text-sm dark:text-white text-[#606060] whitespace-nowrap">
                                    {index + 1}.
                                  </td>
                                )}
                                {columns?.map((column, index1) => {
                                  console.log('lskjdflk', column);
                                  const hasAnyDarkTextColumn = columns.some(
                                    (column) => column.darkText
                                  );
                                  const widthClasses = column.width
                                    ? `max-w-[${column.width}px] min-w-[20px] text-ellipsis overflow-hidden whitespace-nowrap`
                                    : '';
                                  return (
                                    <Fragment key={index1}>
                                      {column.type === 'checkBox' ? (
                                        <td
                                          className={`relative w-12 px-6 sm:w-16 sm:px-8 ${widthClasses}`}
                                        >
                                          <input
                                            type="checkbox"
                                            className="cursor-pointer absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 accent-blue-200 sm:left-6"
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
                                          className={`test1 whitespace-nowrap ${
                                            column.style?.align ||
                                            (column.align === 'left'
                                              ? 'text-left'
                                              : column.align === 'center'
                                              ? 'text-center'
                                              : 'text-right')
                                          } p-3 text-sm dark:text-white text-[#606060] ${
                                            column.transform ? column.transform : ''
                                          } ${widthClasses}`}
                                        >
                                          <div className="flex flex-row items-center gap-2">
                                            <p className="whitespace-nowrap">
                                              {formattedData(
                                                data,
                                                data[column.key1],
                                                column.type,
                                                column,
                                                index1,
                                                column?.parant,
                                                column?.parantURL
                                              )}
                                            </p>
                                          </div>
                                        </td>
                                      ) : (
                                        <td
                                          key={index}
                                          className={`${
                                            column.style?.align ||
                                            (column.align === 'left'
                                              ? 'text-left'
                                              : column.align === 'center'
                                              ? 'text-center'
                                              : 'text-right')
                                          }
                                          p-3 text-sm dark:text-white text-[#606060] 
                                          ${column.transform || ''} 
                                          ${
                                            column.darkText ||
                                            (!hasAnyDarkTextColumn && index1 === 0)
                                              ? ''
                                              : column.style?.opacity || 'opacity-50'
                                          } 
                                          ${widthClasses}`}
                                        >
                                          {column?.nested
                                            ? formattedData(
                                                data,
                                                data[column.key1]?.[column.key2],
                                                column.type,
                                                column,
                                                index1
                                              )
                                            : formattedData(
                                                data,
                                                data[column.key],
                                                column.type,
                                                column,
                                                index1,
                                                column?.parant,
                                                column?.parantURL
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
  showIndex: PropTypes.bool,
  handleDropdownChange: PropTypes.func,
  options: PropTypes.array
};

export default Table;

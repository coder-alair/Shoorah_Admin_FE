/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../component/common/Breadcrumb';
import Table from '../../component/common/Table';
import { Api } from '../../api';
import Pagination from '../../component/common/Pagination/Pagination';
import {
  errorToast,
  useOutsideClick,
  getFilterKey,
  convertToIndianDate,
  jsonToCsv,
  convertCodeToType,
  convertCodeToStatus,
  convertCodeToPlatform,
  successToast,
  getFileType,
  getLocalStorageItem,
  currentDateWithFormat
} from '../../utils/helper';
import { Helmet } from 'react-helmet';
import SearchInput from '../../component/common/Input/SearchInput';
import SelectMenu from '../../component/common/SelectMenu';
import {
  ACCOUNT_TYPE,
  ETHINICITY,
  GENDER,
  JOB_ROLES,
  PER_PAGE,
  SIGN_UP_PLATFORM,
  STATUS_FOR_DROPDOWN
} from '../../utils/constants';
import { FunnelIcon } from '@heroicons/react/24/outline';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition
} from '@headlessui/react';

import {
  ArrowDownTrayIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/20/solid';
import { PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline';
import AddPodExpertsValidation from '../../validation/AddPodExpertsValidation';
import { Calendar } from 'react-date-range';
import moment from 'moment';
import { subYears } from 'date-fns';
import { format } from 'date-fns';
import SecondaryButton from '../../component/common/Buttons/SecondaryButton';
import PrimaryButton from '../../component/common/Buttons/PrimaryButton';
import CommonInput from '../../component/common/Input/CommonInput';
import LazyLoadImageProp from '../../component/common/LazyLoadImage';
import ProfilePic from '../../assets/images/dummy-avatar.png';
import CommonTextarea from '../../component/common/CommonTextarea';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
const pages = [{ name: 'Pod Experts', href: '/podExperts', current: true }];

const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

const calculateMaxDateForAgeRestriction = () => {
  return subYears(new Date(), 6);
};

const minDate = format(subYears(new Date(), 90), 'yyyy-MM-dd');

function PodExpertLists() {
  const [image, setImage] = useState(null);

  const wrapperRef = useRef(null);
  const [companyList, setCompanyList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [podList, setPodList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [job, setJob] = useState(JOB_ROLES[0].value);
  const [selectedPlatform, setSelectedPlatform] = useState(1);
  const [accountType, setaccountType] = useState(1);
  const [tab, setTab] = useState(1);
  const [gender, setGender] = useState(GENDER[5].value);
  const [showCalendar, setShowCalendar] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [selectedFilterJob, setSelectedFilterJob] = useState('');
  const [jobs, setJobs] = useState(JOB_ROLES);
  const [selectedFile, setSelectedFile] = useState();
  const [filterCriteria, setFilterCriteria] = useState({
    accountType: '',
    accountStatus: '',
    jobRole: '',
    loginPlatform: ''
  });
  const [addPodExpertsPopUpOpen, setAddPodExpertsPopUpOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [isAdd, setIsAdd] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [preview, setPreview] = useState('');
  const [dob, setDob] = useState(null);
  const navigate = useNavigate();
  const [addPodExpertsStates, setAddPodExpertsStates] = useState({
    fullName: '',
    description: '',
    image: null
  });
  const columns = [
    {
      title: 'Profile',
      key: 'image',
      sortable: false,
      type: 'profile',
      align: 'left'
    },
    {
      title: 'Full Name',
      key: 'name',
      sortable: false,
      sortKey: 'account_type',
      type: 'text',
      align: 'left'
    },
    {
      title: 'Total Pods',
      // key: 'name',
      sortable: false,
      sortKey: 'account_type',
      type: 'text',
      align: 'left'
    },
    // {
    //   title: 'Total Ratings',
    //   // key: 'name',
    //   sortable: false,
    //   sortKey: 'account_type',
    //   type: 'text',
    //   align: 'left'
    // },
    {
      title: 'Description',
      key: 'description',
      sortable: false,
      sortKey: 'description',
      type: 'text',
      align: 'left'
    },
    {
      title: 'Created By',
      key: 'createdBy',
      sortable: false,
      sortKey: 'createdBy',
      type: 'text',
      align: 'left'
    },
    {
      title: 'Created At',
      key: 'createdAt',
      sortable: false,
      sortKey: 'createdAt',
      type: 'text',
      align: 'left'
    },
    {
      title: 'Status',
      key: 'isActive',
      sortable: false,
      type: 'badge',
      align: 'left'
    },
    {
      title: 'Action',
      key: 'action',
      type: 'action',
      align: 'right',
      isEdit: false,
      isView: true,
      handleEdit: (rowData) => {
        navigate(`/podExperts/editPodExperts/${rowData?.id}`);

        setAddPodExpertsStates({
          fullName: rowData?.name,
          description: rowData?.description,
          image: rowData?.image
        });
        setPreview(rowData?.image);
        setSelectedId(rowData?.id);
      },
      isDelete: false
    }
  ];
  const imageRef = useRef(null);

  const calendarRef = useRef();

  useOutsideClick(calendarRef, () => {
    if (showCalendar) setShowCalendar(!showCalendar);
  });

  const [valid, setValid] = useState({});

  // const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  // useEffect(() => {
  //   if (userData.userType) {
  //     window.location.href = userData?.slug ? `/${userData?.slug}/users` : '/users';
  //   }
  // }, [userData]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      // setFilterCriteria({...filterCriteria,image:undefined})
      return;
    }
    if (e?.target?.files[0]) {
      if (!e?.target?.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        errorToast(
          `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid image.`
        );
      } else {
        setSelectedFile(e.target.files[0]);
        // setFilterCriteria({...filterCriteria,image:e.target.files[0]})
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setPreview(objectUrl);
        const file = e.target.files[0];
        if (file) {
          setImage(file);
          setAddPodExpertsStates({
            ...addPodExpertsStates,
            image: file ? getFileType(file) : null,
            logoUpdated: true
          });
        }
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreview(undefined);
    }
  };

  const handlePagination = (pageNumber, pageSize, searchKey, query, sortBy, sortOrder) => {
    setLoader(true);
    const body = {
      page: pageNumber,
      limit: pageSize,
      search: searchKey ? searchKey : ''
    };
    Api.getPodExperts(body).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setPodList(response?.data?.data);
        setCurrentPage(pageNumber);
        setTotalCount(response?.data?.meta?.total);
        setLoader(false);
      } else if (response?.code === 401) {
        setLoader(false);
        errorToast(response?.message);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setPodList([]);
        setTotalCount(0);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
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
        tempSortOrder
      );
    } else {
      setSortOrder(1);
      handlePagination(
        currentPage,
        selectedPerPage?.value,
        searchTerm,
        filterQuery,
        sortByValue,
        1
      );
    }
  };

  const [file, setFile] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handlePagination(1, selectedPerPage?.value, searchParam, filterQuery, sortBy, sortOrder);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      handlePagination(1, selectedPerPage?.value, '', '', sortBy, sortOrder);
    }
  }, [searchTerm]);

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm, filterQuery, sortBy, sortOrder);
  };

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

  const filterHandler = (data, key) => {
    setFilterCriteria((prevData) => ({
      ...prevData,
      [key]: data
    }));
    let clone = JSON.parse(JSON.stringify(filterCriteria));
    const newData = { ...clone, [key]: data };
    let tempFilterQuery = [];
    Object.keys(newData).forEach(function (key) {
      if (key === 'jobRole') {
        if (newData[key]?.toString()) {
          tempFilterQuery.push(`&${key}=${newData[key]}`);
          setSelectedFilterJob(newData[key]);
        }
      } else if (newData[key]?.value?.toString()) {
        tempFilterQuery.push(`&${key}=${newData[key]?.value}`);
      }
    });
    let query = tempFilterQuery?.toString()?.replaceAll(',', '');
    setFilterQuery(query);
    handlePagination(1, selectedPerPage.value, searchTerm, query, sortBy, sortOrder);
  };
  const resetHandler = () => {
    setFilterCriteria({
      accountType: '',
      accountStatus: '',
      jobRole: '',
      loginPlatform: ''
    });
    setFilterQuery('');
    setSelectedFilterJob('');
    setSelected('');
    setShowFilterModal(false);
    handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
  };

  const refreshTable = () =>
    handlePagination(1, selectedPerPage?.value, '', filterQuery, sortBy, sortOrder);

  const downloadCsvFile = (data, filename) => {
    if (!data || data.length === 0) {
      console.error('JSON array is empty.');
      return;
    }

    data.map((i) => {
      i.createdAt = convertToIndianDate(i.createdAt);
      i.registeredOn = convertToIndianDate(i.registeredOn);
      i.accountType = convertCodeToType(i.accountType);
      i.accountStatus = convertCodeToStatus(i.accountStatus);
      i.loginPlatform = convertCodeToPlatform(i.loginPlatform);
    });

    const csvContent = jsonToCsv(data);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename || 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // handlers

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setAddPodExpertsStates({ ...addPodExpertsStates, [name]: value });
  };
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    const validate = AddPodExpertsValidation(addPodExpertsStates);
    setValid({
      ...valid,
      isSubmit: true,
      errors: validate.errors,
      isValid: validate.isValid
    });

    if (validate.isValid) {
      setLoader(true);
      const formData = new FormData();
      formData.append('name', addPodExpertsStates?.fullName);
      formData.append('description', addPodExpertsStates?.description);
      formData.append('imageType', selectedFile ? selectedFile : null);
      if (selectedId) {
        formData.append('id', selectedId);
      }
      const payload = {
        name: addPodExpertsStates?.fullName,
        description: addPodExpertsStates?.description,
        // imageType: selectedFile?.type ? getFileType(selectedFile) : null,
        imageType: selectedFile ? selectedFile : null
        // imageType:selectedId ? addPodExpertsStates?.image: addPodExpertsStates?.image?.type ? getFileType(addPodExpertsStates?.image) : null,
      };
      if (selectedId) {
        Api.updatePodExperts(formData)
          .then((response) => {
            setLoader(false);
            if (response.status === 200) {
              successToast('Pod Experts updated successfully');
              // refreshTable();
              setSelectedId('');
              setPreview('');
              setSelectedFile(null);
              handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
              setAddPodExpertsPopUpOpen(false);
              setAddPodExpertsStates({
                fullName: '',
                description: '',
                image: null
              });
              // setPreview(undefined)
            }
          })
          .catch((err) => {
            setLoader(false);
            errorToast(err.message);
          });
      } else {
        Api.addPodExperts(formData)
          .then((response) => {
            setLoader(false);
            if (response.status === 200) {
              successToast('Pod Experts created successfully');
              setPreview('');
              setSelectedId('');
              handlePagination(1, selectedPerPage.value, searchTerm, '', sortBy, sortOrder);
              setAddPodExpertsPopUpOpen(false);
              setSelectedFile(null);
              setAddPodExpertsStates({
                fullName: '',
                description: '',
                image: null
              });
            }
          })
          .catch((err) => {
            setLoader(false);
            errorToast(err.message);
          });
      }
    }
    setLoader(false);
  };
  const getCompanyList = () => {
    Api.getCompanyList('company_name', 1)
      .then((res) => {
        if (res.data?.meta?.code === 1) {
          res?.data?.data?.unshift({ company_name: 'B2C User', _id: '' });
          setCompanyList(res.data?.data);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getCompanyList();
  }, []);

  const uploadCsvFile = (e) => {
    e.preventDefault();
    if (!e?.target?.files[0].name.match(/\.(csv)$/i)) {
      errorToast(
        `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload CSV file only.`
      );
    }

    setFile(e.target.files[0]);
  };

  const handleImport = (e) => {
    let payload = {
      file,
      company: addPodExpertsStates.company
    };

    Api.importUsers(payload)
      .then((res) => {
        setLoader(false);
        if (res.data?.meta?.code === 1) {
          if (res.data?.data?.results.length > 0) {
            successToast('Users successfully registered !');
            setAddPodExpertsPopUpOpen(false);
            setFile(null);
          } else {
            errorToast('Please check the downloaded report for the errors and try again!');
          }
          if (res.data?.data?.user_existed.length > 0) {
            downloadCsvFile(res.data?.data?.user_existed, 'rejectUserData.csv');
          }
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const handleSelectRange = (e) => {
    setShowCalendar(false);
    // const formattedDate = moment(e).format("YYYY-MM-DD");
    setDob(formatDate(e));
    // setAddPodExpertsStates({ ...addPodExpertsStates, dob: formatDate(new Date(e)) });
  };

  useEffect(() => {
    const filteredJobs =
      query === ''
        ? JOB_ROLES
        : JOB_ROLES.filter((job) => {
            return job.name.toLowerCase().includes(query.toLowerCase());
          });

    setJobs(filteredJobs);
  }, [query]);

  return (
    <div className="relative">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Pod Experts | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />

      {/* Add user Pop up */}
      {addPodExpertsPopUpOpen && (
        <div className="fixed inset-0 w-screen z-40 h-screen bg-black/25 flex justify-center items-center">
          <div className="bg-white dark:bg-shoorah-darkBgColor dark:border-none dark:text-white w-[95vw] h-full lg:h-fit lg:w-[50vw]  border pt-0 border-[#F1F2F4] rounded-2xl overflow-scroll hide-scrollbar shadow-md">
            <div className="bg-gradient-to-r from-shoorah-primary to-shoorah-secondary py-2 px-4 text-white flex items-center justify-between">
              <h4 className="font-semibold text-base">
                {selectedId ? 'Edit Pod Experts' : 'Add Pod Experts'}
              </h4>

              <span
                onClick={() => {
                  setAddPodExpertsPopUpOpen(false);
                  setValid({});
                  setIsUpdate(false);
                  setSelectedId('');
                  setIsAdd(isAdd ? false : isUpdate ? false : isAdd);
                  setAddPodExpertsStates({ fullName: '', description: '', image: null });
                }}
                className="font-semibold text-lg cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </span>
            </div>

            <div className="!text-sm md:text-lg">
              <div className="mt-6 px-3">
                <form>
                  <div className="text-right flex justify-end gap-x-2 mt-12">
                    {!isUpdate && selectedId ? (
                      <PencilSquareIcon
                        className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsUpdate(true);
                        }}
                      />
                    ) : isUpdate && selectedId ? (
                      <EyeIcon
                        className="w-[20px] ml-2 text-shoorah-secondary dark:text-white cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsUpdate(false);
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-start lg:flex px-4 py-10 rounded-[10px] bg-white dark:bg-shoorah-darkBgTabColor  dark:text-white gap-4">
                    <div className="lg:w-1/3 xl:w-1/4 md:w-1/2 w-full lg:mr-10 mb-4">
                      <div>
                        <input
                          onChange={onSelectFile}
                          className="hidden"
                          ref={imageRef}
                          type="file"
                          accept=".jpg, .jpeg, .png"
                          disabled={!isUpdate && selectedId}
                        />
                        <div className="">
                          {!loader ? (
                            <div
                              className="relative m-auto w-[200px] rounded-[50%] cursor-pointer"
                              onClick={() => {
                                imageRef?.current?.click();
                              }}
                            >
                              <LazyLoadImageProp
                                imageSrc={preview ? preview : ProfilePic}
                                className={
                                  'border border-gray-300 w-[200px] h-[200px] rounded-[50%] m-auto'
                                }
                              />

                              <div className="absolute bottom-0 right-[25px] bg-gray-200 p-2 rounded-[50%]">
                                <CameraIcon className="w-[20px]" />
                              </div>
                            </div>
                          ) : (
                            <div className="relative m-auto w-[200px] rounded-[50%]"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-2/3 xl:w-3/4 md:w-1/2 space-y-6 m-auto lg:m-0 w-full lg:overflow-y-auto h-[400px]">
                      {selectedId && (
                        <>
                          {/* <div className="px-4">
                          <label
                            className="text-md dark:text-white block my-1 font-medium text-gray-700"
                            htmlFor="company_name"
                          >
                            Rating
                          </label>
                          <div class="flex items-center">
                            <svg
                              class="w-10 h-10 text-yellow-300 ms-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              class="w-10 h-10 text-yellow-300 ms-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              class="w-10 h-10 text-yellow-300 ms-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              class="w-10 h-10 text-yellow-300 ms-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <svg
                              class="w-10 h-10 ms-1 text-gray-300 dark:text-gray-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          </div>
                        </div> */}
                          <div className="px-4">
                            <div className="gap-5 flex flex-wrap sm:flex-nowrap justify-center">
                              <div className="flex w-full flex-col justify-between mt-3">
                                <label
                                  className="text-md dark:text-white block my-1 font-medium text-gray-700"
                                  htmlFor="company_name"
                                >
                                  Total Listeners : <span>10</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="px-4">
                        <div className="gap-5 flex flex-wrap sm:flex-nowrap justify-center">
                          <div className="flex w-full flex-col justify-between mt-3">
                            <label
                              className="text-md dark:text-white block my-1 font-medium text-gray-700"
                              htmlFor="company_name"
                            >
                              Full Name <span className={` text-red-400`}>&#42;</span>
                            </label>
                            <input
                              className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4]  rounded-[3rem] h-10 px-4"
                              type="text"
                              value={addPodExpertsStates.fullName}
                              id="first_name"
                              disabled={!isUpdate && selectedId}
                              name="fullName"
                              onChange={handleAddUserChange}
                              placeholder="Enter First Name"
                            />
                            {valid.isSubmit && valid?.errors?.fullName && (
                              <span className="text-sm text-red-700">
                                {valid?.errors?.fullName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="px-4">
                        <div className="gap-5 flex flex-wrap sm:flex-nowrap justify-center">
                          <div className="flex w-full flex-col justify-between mt-3">
                            <CommonTextarea
                              disabled={!isUpdate && selectedId}
                              rows={4}
                              name="description"
                              id="description"
                              value={addPodExpertsStates.description}
                              onChange={handleAddUserChange}
                              label="Description"
                              // error={valid?.errors?.description}
                              isRequired
                            />
                            {valid.isSubmit && valid?.errors?.description && (
                              <span className="text-sm text-red-700">
                                {valid?.errors?.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isUpdate && selectedId && (
                        <div className="text-right flex justify-end gap-x-2 mt-12">
                          {/* <SecondaryButton btnText="Cancel" btnType="button" /> */}
                          <PrimaryButton
                            btnText={selectedId ? 'Update' : 'Submit'}
                            btnType="submit"
                            onClick={handleAddUserSubmit}
                          />
                        </div>
                      )}
                      {!isUpdate && !selectedId && (
                        <div className="text-right flex justify-end gap-x-2 mt-12">
                          {/* <SecondaryButton btnText="Cancel" btnType="button" /> */}
                          <PrimaryButton
                            btnText={selectedId ? 'Update' : 'Submit'}
                            btnType="submit"
                            onClick={handleAddUserSubmit}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 px-3">
        <div className="sm:flex justify-between">
          <div className="flex">
            <div className="hidden lg:flex mr-3 self-center">
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
                placeholder="Search by user name"
              />
            </div>
          </div>
          <div className="mt-3 sm:mt-0 flex justify-between">
            <div className=" flex lg:hidden self-center">
              <div className="w-[80px]">
                <SelectMenu
                  menuList={PER_PAGE}
                  showLabel={false}
                  defaultSelected={selectedPerPage}
                  setSelectedMenu={handlePerPage}
                />
              </div>
            </div>
            <div className="flex">
              <div className="ml-3 self-center inline-flex items-center justify-center">
                <button
                  className="inline-flex mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => {
                    navigate('/podExperts/addPodExperts');

                    setIsAdd(true);
                  }}
                >
                  Add +
                </button>

                {/* <button
                  className="inline-flex mx-3 items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => downloadCsvFile(podList, 'users.csv')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-save text-white w-[18px] h-[20px] inline rotate-180"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
                    <title>Export Users</title>
                  </svg>
                </button> */}

                {/* <button
                  className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-5 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => setShowFilterModal((state) => !state)}
                >
                  <FunnelIcon className="text-white w-[18px] h-[20px] inline" />
                </button> */}
              </div>
            </div>
          </div>
        </div>

        <Transition
          show={showFilterModal}
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            ref={wrapperRef}
            className="absolute p-5 right-5 z-[2] mt-2 w-[100%] sm:w-[600px] lg:w-[700px] dark:bg-shoorah-darkBgTabColor dark:text-white mx-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  "
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">Filters</p>
              <div className="flex space-x-3">
                <button
                  onClick={resetHandler}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-shoorah-darkBgColor dark:text-white dark:hover:bg-shoorah-darkBgColor text-sm font-medium rounded-md"
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-shoorah-darkBgColor dark:text-white dark:hover:bg-shoorah-darkBgColor text-sm font-medium rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <SelectMenu
                  menuList={ACCOUNT_TYPE}
                  defaultSelected={filterCriteria.accountType}
                  label="Subscription Status"
                  isRequired={false}
                  setSelectedMenu={(data) => filterHandler(data, 'accountType')}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={STATUS_FOR_DROPDOWN}
                  label="Account status"
                  isRequired={false}
                  defaultSelected={filterCriteria.accountStatus}
                  setSelectedMenu={(data) => filterHandler(data, 'accountStatus')}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={SIGN_UP_PLATFORM}
                  label="Signup Platform"
                  isRequired={false}
                  defaultSelected={filterCriteria.loginPlatform}
                  setSelectedMenu={(data) => filterHandler(data, 'loginPlatform')}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={[
                    { name: 'All', value: null },
                    { name: 'Super Admin', value: 'admin' },
                    { name: 'Ripple', value: 'ripple' }
                  ]}
                  label="Added by"
                  isRequired={false}
                  defaultSelected={filterCriteria.addedBy}
                  setSelectedMenu={(data) => filterHandler(data, 'addedBy')}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={[
                    { name: 'All', value: null },
                    { name: 'B2C', value: false },
                    { name: 'B2B', value: true }
                  ]}
                  label="Role"
                  isRequired={false}
                  defaultSelected={filterCriteria.role}
                  setSelectedMenu={(data) => filterHandler(data, 'role')}
                />
              </div>

              <div className="flex relative w-full flex-col">
                <label
                  htmlFor="jobRole"
                  className="text-sm dark:text-white block font-medium text-gray-700"
                >
                  Job Role
                </label>
                <Combobox
                  value={selectedFilterJob}
                  onChange={(data) => {
                    filterHandler(data, 'jobRole');
                  }}
                >
                  <div className="relative w-full pr-4 overflow-hidden outline-none appearance-none bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                    <ComboboxInput
                      className={
                        'w-full capitalize outline-none appearance-none rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 '
                      }
                      placeholder="Select Job Role"
                      displayValue={selected}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                      <ChevronDownIcon className="size-4 " />
                    </ComboboxButton>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                  >
                    <ComboboxOptions
                      anchor="bottom"
                      className="w-[15rem] z-40 bg-white shadow rounded-xl border border-white/5 p-1 empty:hidden"
                    >
                      {jobs.map((job) => (
                        <ComboboxOption
                          key={job?.name}
                          value={job?.value}
                          className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none"
                        >
                          <CheckIcon className="invisible size-4 fill-white " />
                          <div className="text-sm/6">{job?.name}</div>
                        </ComboboxOption>
                      ))}
                    </ComboboxOptions>
                  </Transition>
                </Combobox>
              </div>
            </div>
          </div>
        </Transition>
        {!Object.values(filterCriteria).every((x) => x === '') && (
          <div className="border py-1 px-2 mt-3">
            <div className="flex justify-between">
              <div className="self-center overflow-auto filter-container mr-2">
                <div className="flex">
                  {Object.keys(filterCriteria).map((keyName, i) => (
                    <>
                      {filterCriteria?.[keyName]?.value?.toString() ||
                      filterCriteria?.[keyName]?.toString() ? (
                        <div className="flex bg-gray-200 px-2 py-1 mr-2 whitespace-nowrap" key={i}>
                          <p className="text-[14px] object-contain m-0 whitespace-nowrap">
                            {getFilterKey(
                              keyName === 'accountType' ? 'subscriptionStatus' : keyName
                            )}
                          </p>
                          <p className="text-[14px] m-0 whitespace-nowrap">&nbsp;: &nbsp;</p>
                          <p className="text-[14px] m-0 whitespace-nowrap ">
                            {filterCriteria?.[keyName].name || filterCriteria?.[keyName]}
                          </p>
                          <p
                            className="border cursor-pointer m-0 ml-2 self-center whitespace-nowrap"
                            onClick={() => filterHandler('', keyName)}
                          >
                            <XMarkIcon className="w-[16px] border border-shoorah-primary text-white bg-shoorah-secondary" />
                          </p>
                        </div>
                      ) : (
                        ''
                      )}
                    </>
                  ))}
                </div>
              </div>
              <div className="flex self-center justify-end w-[50px]">
                <button className="px-2 py-1 bg-shoorah-secondary" onClick={resetHandler}>
                  <XMarkIcon className="w-[18px] border-shoorah-primary text-white bg-shoorah-secondary" />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4">
          <Table
            columns={columns}
            data={podList}
            name={'pod_expert_table'}
            bottomBorder={totalCount > selectedPerPage?.value}
            setSortBy={(sort) => handleSortBy(sort)}
            refreshTable={refreshTable}
            loader={loader}
            isdetail={false}
          />
        </div>
      </div>
      <div>
        {podList.length > 0 && !loader ? (
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
                sortOrder
              )
            }
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

export default PodExpertLists;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CameraIcon } from '@heroicons/react/24/outline';
import { capitalize, errorToast, getFileType, successToast } from '../../../../../utils/helper';
import Loader from '../../../../../component/common/Loader';
import PropTypes from 'prop-types';
import 'react-phone-number-input/style.css';

import { Helmet } from 'react-helmet';
import Breadcrumb from '../../../../../component/common/Breadcrumb';

import { isValidPhoneNumber } from 'react-phone-number-input';
import { JOB_ROLES, PER_PAGE } from '../../../../../utils/constants';
import NOPhoto from '../../../../../assets/images/partner.jpeg';
import PhoneInput from 'react-phone-number-input';
import SecondaryButton from '../../../../../component/common/Buttons/SecondaryButton';
import PrimaryButton from '../../../../../component/common/Buttons/PrimaryButton';
import SelectMenu from '../../../../../component/common/SelectMenu';
import CommonInput from '../../../../../component/common/Input/CommonInput';
import LazyLoadImageProp from '../../../../../component/common/LazyLoadImage';
import ConfirmPopup from '../../../../../component/common/modals/ConfirmPopup';
import { Api } from '../../../../../api';
import axios from 'axios';
import PartnerAddEditValidation from '../../../../../validation/addPartnerValidation';
import ToggleSwitch from '../../../../../component/common/ToggleSwitch';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Table from '../../../../../component/common/Table';
import CommonTextarea from '../../../../../component/common/CommonTextarea';
import { CustomDragDrop } from './customFileContainer';
function AddPartner(props) {
  const location = useLocation();
  const propsData = location.state;
  // const imageInputRef = useRef(null);
  const [pages, setPages] = useState([
    {
      name: propsData?.parantName ? propsData?.parantName : 'Partners',
      href: propsData?.parantURL ? propsData?.parantURL : '/partners',
      current: false
    },
    {
      name: `${propsData?.action === 'edit' ? 'Edit Partner' : 'Add Partner'}`,
      href: '/partners/add-partner',
      current: true
    }
  ]);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState(null);
  const imageRef = useRef(null);
  const [number, setNumber] = useState('');

  const [form, setform] = useState({
    id: '',
    image: null,
    logoUpdated: false,
    name: '',
    email: '',
    mobile: '',
    jobRole: '',
    commission: '',
    accountStatus: 1,
    introducedCompanies: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [error, setError] = useState({});
  const [selectedMenu, setSelectedMenu] = useState({});
  const [toggleValue, setToggleValue] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState('');
  const [valid, setValid] = useState({});
  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [totalCount, setTotalCount] = useState(0);
  console.log('selectedPerPage', selectedPerPage);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
  };

  const initialValues = {
    paymentComment: '',
    introducedCompanyId: '',
    uploadReceipt: null,
    ammount: ''
  };

  const validationSchema = Yup.object().shape({
    paymentComment: Yup.string().required('Required!'),
    introducedCompanyId: Yup.string().required('Required!'),
    ammount: Yup.string()
      .required('Required!')
      .matches(/^[0-9]/, 'Enter Only Numbers')
      .min(1, 'Minimum 1 Number Required')
    // uploadReceipt: Yup.string()
    //   .required("Required!")
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnBlur: false,
    onSubmit: async (values) => {
      await handlePartnerSubmit(values);
    }
  });

  const handleReceiptUpload = (file) => {
    formik.setValues({
      ...formik.values,
      // console.log('formik.values', formik.values),
      uploadReceipt: file
    });
    successToast('Uploaded Successfully');
  };
  console.log('formik.values', formik.values);

  const handlePerPage = (perPage) => {
    console.log('perPage', perPage);
    setSelectedPerPage(perPage);
    getpartner(1, perPage?.value, searchTerm);
    // handlePagination(1, perPage.value, searchTerm, filterQuery, sortBy, sortOrder);
  };
  const handlePagination = (pageNumber, pageSize, searchKey, query, sortBy, sortOrder) => {};
  const handlePartnerSubmit = async (values) => {
    if (!values.uploadReceipt) {
      errorToast('Please select image');
      return;
    }
    try {
      const formdata = new FormData();
      formdata.append('introducedCompanyId', values.introducedCompanyId);
      formdata.append('paymentComment', values.paymentComment);
      formdata.append('paymentReceipt', values.uploadReceipt);
      formdata.append('paymentAmount', parseInt(values?.ammount, 10));
      await Api.addPartnerPayment(formdata)
        .then((response) => {
          if (response?.data?.meta?.code === 1) {
            setOpen(false);
            successToast(response?.data?.meta?.message);
            getpartner(1, selectedPerPage?.value, searchTerm);
            formik.resetForm();
          } else {
            setOpen(false);
            errorToast(response?.data?.meta?.message);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoader(false);
        });
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    if (e?.target?.files[0]) {
      if (!e?.target?.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        errorToast(
          `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid image.`
        );
      } else {
        setSelectedFile(e.target.files[0]);
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setPreview(objectUrl);
        const file = e.target.files[0];
        if (file) {
          setImage(file);
          setform({
            ...form,
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

  const handleSubmit = (e, fromPopup = false) => {
    e.preventDefault();
    const { errors, isValid } = PartnerAddEditValidation(form);
    if (isValid) {
      if (props?.location?.state && !fromPopup) {
        setOpenConfirmPopup(true);
      } else {
        setLoader(true);
        const payload = {
          userId: form.id,
          name: capitalize(form.name),
          email: form.email,
          profile: selectedFile?.type ? getFileType(selectedFile) : null,
          mobile: number,
          jobRole: form.jobRole === '' ? null : form.jobRole,
          commission: form?.commission,
          accountStatus: toggleValue === true ? 1 : 0
        };
        Api.addEditPartner(payload).then((response) => {
          if (response?.data?.meta?.code === 1) {
            if (response?.data?.meta?.uploadURL) {
              axios
                .put(response?.data?.meta?.uploadURL, selectedFile, {
                  headers: {
                    'content-type': `${selectedFile?.type?.split('/')[0]}/${
                      selectedFile?.name?.split('.')[1]
                    }`
                  }
                })
                .then((resp) => {
                  if (resp?.status === 200) {
                    setLoader(false);
                    successToast(response?.data?.meta?.message);
                    navigate('/partners');
                  }
                })
                .catch(() => {
                  errorToast('Something went wrong');
                });
            } else {
              setLoader(false);
              successToast(response?.data?.meta?.message);
              navigate('/partners');
            }
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        });
      }
    } else {
      setError(errors);
    }
  };

  const getpartner = useCallback(
    async (page, selectedPerPage, search) => {
      try {
        const response = await Api.getPartners(
          page,
          selectedPerPage,
          search,
          '',
          '',
          '',
          propsData?.id
        );
        const adminData = response?.data?.data[0];

        if (response?.data?.meta?.code === 1 && adminData) {
          setform({
            id: adminData.id,
            email: adminData.email,
            name: capitalize(adminData.name),
            status: adminData.accountStatus,
            jobRole: adminData.jobRole,
            commission: adminData.commission,
            mobile: adminData.mobile,
            introducedCompanies: adminData.introducedCompanies
          });
          setToggleValue(adminData.status === 1);
          setNumber(adminData.mobile);
          setPreview(adminData.profile);
        } else if (response?.code === 401) {
          errorToast(response?.message);
        } else if (response?.data?.meta?.code === 0) {
          errorToast(response?.data?.meta?.message);
        }
      } catch (e) {
        console.error('Error fetching partner data:', e);
      } finally {
        setLoader(false);
      }
    },
    [propsData?.id]
  );
  useEffect(() => {
    if (propsData) {
      setLoader(true);
      setPages([
        {
          name: propsData?.parantName ? propsData?.parantName : 'Partners',
          href: propsData?.parantURL ? propsData?.parantURL : '/partners',
          current: false
        },
        {
          name: `${propsData?.action === 'edit' ? 'Edit Partner' : 'Add Partner'}`,
          href: '/partners/add-partner',
          current: true
        }
      ]);
      getpartner(1, selectedPerPage?.value, searchTerm);
    }
  }, [propsData, selectedPerPage, searchTerm, getpartner]);

  const deletePartner = () => {
    let userId = form.id;
    setLoader(true);
    Api.deletePartner(userId)
      .then((res) => {
        if (res?.data?.meta?.code === 1) {
          setLoader(false);
          successToast(res.data?.meta?.message);
          navigate('/partners');
        }
      })
      .catch((error) => {
        console.error(error);
        setLoader(false);
      });
  };

  const handlePaymentModal = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const [ownerLicense, setOwnerLicense] = useState([]);

  function uploadFiles(f) {
    setOwnerLicense([...ownerLicense, ...f]);
  }

  function deleteFile(indexImg) {
    const updatedList = ownerLicense.filter((ele, index) => index !== indexImg);
    setOwnerLicense(updatedList);
  }

  const columns = [
    {
      title: 'Compony Name',
      key: 'name',
      sortable: false,
      type: 'text',
      // isView :viewcompony,
      align: 'left'
      //  parant:'Partners introduced',
      // parantURL:'/partner-introduced'
    },
    {
      title: 'Introduced Date',
      key: 'createdAt',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: 'Payment Date',
      key: 'paymentDate',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: 'Payment Status',
      key: 'paymentStatus',
      sortable: false,
      type: 'text',
      align: 'left'
    },
    {
      title: 'Payment Amount',
      key: 'paymentAmount',
      sortable: false,
      type: 'text',
      align: 'left'
    },
    {
      title: 'Receipt',
      key: 'action',
      type: 'action',
      align: 'right',
      isDownload: true,
      isEdit: false,
      isDelete: false
    }
  ];

  return (
    <div>
      {loader ? <Loader /> : null}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Partnership | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <form onSubmit={handleSubmit}>
          <div className="flex-wrap lg:flex px-4 py-10 rounded-[10px] bg-white dark:bg-shoorah-darkBgTabColor  dark:text-white gap-4">
            <div className="lg:mr-10 mb-4">
              <div>
                <input
                  onChange={onSelectFile}
                  className="hidden"
                  ref={imageRef}
                  type="file"
                  accept=".jpg, .jpeg, .png"
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
                        imageSrc={preview ? preview : NOPhoto}
                        className={
                          'border border-gray-300 w-[200px] h-[200px] rounded-[50%] m-auto'
                        }
                      />

                      <div className="absolute bottom-0 right-[25px] bg-gray-200 p-2 rounded-[50%]">
                        <CameraIcon className="w-[25px]" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative m-auto w-[200px] rounded-[50%]"></div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6 m-auto lg:m-0 w-full lg:w-[600px]">
              <CommonInput
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                label="Name"
                error={error.name}
                isRequired
              />
              <CommonInput
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                label="Email address"
                error={error.email}
                isRequired
              />
              <CommonInput
                id="commission"
                name="commission"
                value={form.commission}
                onChange={handleChange}
                type="number"
                label="Commission"
                error={error.commission}
                isRequired
              />
              <div className="flex flex-col justify-between mt-3">
                <label
                  className="text-sm dark:text-white block font-medium text-gray-700"
                  htmlFor="mobile"
                >
                  Contact Number
                </label>
                <PhoneInput
                  className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none border-[#F1F2F4] rounded-[3rem] h-10 px-2 capitalize"
                  placeholder="Enter phone number"
                  name="mobile"
                  value={number}
                  onChange={(e) => {
                    if (e) {
                      setNumber(e);
                    } else {
                      setNumber('');
                    }
                  }}
                />
                {valid.isSubmit && !isValidPhoneNumber(number) && (
                  <span className="text-sm text-red-700">Please enter a valid number</span>
                )}
              </div>

              <label
                htmlFor="job_role"
                className="text-sm  dark:text-white block font-medium text-gray-700"
              >
                Job Role <span className={` text-red-400`}></span>
              </label>
              <div className="w-full pr-4 overflow-hidden bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                <select
                  className=" px-3 py-2 bg-transparent P22Mackinac placeholder-gray-400 text-base sm:text-md dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none rounded-md h-10  capitalize"
                  onChange={handleChange}
                  value={form?.jobRole}
                  id="job_role"
                  name="jobRole"
                >
                  <option value={''} disabled>
                    B2C
                  </option>
                  {JOB_ROLES.map((e, index) => (
                    <option key={index} value={e.name.toLowerCase()}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="!text-sm md:text-lg">
                <div className="mt-6 px-3">
                  <div className="inline-grid">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">
                      Account Status
                    </label>
                    <div className="mt-3">
                      <ToggleSwitch toggleValue={toggleValue} setToggleValue={setToggleValue} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right flex justify-end gap-x-2 mt-12">
                <SecondaryButton btnText="Cancel" btnType="button" />
                {form.id && (
                  <button
                    type="delete"
                    className="rounded-3xl border  
                 border-shoorah-primary bg-gradient-to-r py-2 sm:py-3 px-10 text-sm font-medium shadow-sm focus:outline-none  text-shoorah-primary "
                    onClick={() => deletePartner()}
                  >
                    Delete
                  </button>
                )}
                <PrimaryButton btnText="Submit" btnType="submit" />
              </div>
              {open && (
                <>
                  <div className="fixed inset-0 z-40 h-screen bg-black/25 flex justify-center items-center overflow-y-auto">
                    <div className="bg-white overflow-hidden dark:bg-shoorah-darkBgColor dark:border-none dark:text-white max-h-[90vh] lg:h-fit lg:w-[40vw] w-[70vw] border pt-0 border-[#F1F2F4] rounded-2xl shadow-md">
                      <div className="bg-gradient-to-r from-shoorah-primary to-shoorah-secondary py-2 px-4 text-white flex items-center justify-between">
                        <h4 className="font-semibold text-base">Pay to Partner</h4>

                        <span
                          onClick={() => {
                            setOpen(false);
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
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </span>
                      </div>

                      <div className="!text-sm md:text-lg overflow-y-auto max-h-[80vh]">
                        <form>
                          <div className="flex flex-wrap lg:flex-nowrap justify-center py-3 rounded-[10px] bg-white dark:bg-shoorah-darkBgTabColor dark:text-white">
                            <div className="lg:w-2/3 sm:w-3/4 w-2/3 space-y-6 m-auto lg:m-0 lg:overflow-y-auto h-[600px]">
                              <div className="gap-5 flex flex-wrap sm:flex-nowrap justify-center">
                                <div className="flex w-full flex-col justify-between mt-2">
                                  <label
                                    className="text-md dark:text-white block font-medium text-gray-700"
                                    htmlFor="company_name"
                                  >
                                    Company Name <span className={` text-red-400`}>&#42;</span>
                                  </label>
                                  <select
                                    id="countries"
                                    name="introducedCompanyId"
                                    value={formik.values.introducedCompanyId}
                                    onChange={formik.handleChange}
                                    className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  >
                                    <option value={''}>{'select Company'}</option>
                                    {form?.introducedCompanies?.length
                                      ? form?.introducedCompanies
                                          .filter((ele) => ele?.paymentStatus !== 1)
                                          .map((ele) => {
                                            return <option value={ele?.id}>{ele?.name}</option>;
                                          })
                                      : null}
                                  </select>
                                  {formik.touched.introducedCompanyId &&
                                    formik.errors.introducedCompanyId && (
                                      <p className="text-red-600 text-sm">
                                        {formik.errors.introducedCompanyId}
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="gap-5 flex flex-wrap sm:flex-nowrap justify-center">
                                <div className="flex w-full flex-col justify-between">
                                  <CommonTextarea
                                    rows={4}
                                    name="paymentComment"
                                    id="description"
                                    value={formik.values.paymentComment}
                                    onChange={formik.handleChange}
                                    label="Description"
                                    isRequired
                                  />
                                  {formik.touched.paymentComment &&
                                    formik.errors.paymentComment && (
                                      <p className="text-red-600 text-sm">
                                        {formik.errors.paymentComment}
                                      </p>
                                    )}
                                </div>
                              </div>
                              <div className="gap-5 flex flex-wrap sm:flex-nowrap justify-center">
                                <div className="flex w-full flex-col justify-between">
                                  <label
                                    className="text-md dark:text-white block font-medium text-gray-700"
                                    htmlFor="company_name"
                                  >
                                    Amount<span className={` text-red-400`}>&#42;</span>
                                  </label>
                                  <input
                                    name="ammount"
                                    className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={formik.values.ammount}
                                    onChange={formik.handleChange}
                                  />
                                  {formik.touched.ammount && formik.errors.ammount && (
                                    <p className="text-red-600 text-sm">{formik.errors.ammount}</p>
                                  )}
                                </div>
                              </div>
                              <div className="bg-white dark:bg-shoorah-darkBgTabColor w-full pt-1">
                                <CustomDragDrop
                                  ownerLicense={ownerLicense}
                                  onUpload={handleReceiptUpload}
                                  onDelete={deleteFile}
                                  count={1}
                                  formats={['jpg', 'jpeg', 'png']}
                                />
                                <div className="relative">
                                  {formik?.values?.uploadReceipt?.name && (
                                    <>
                                      <span className="inline-block">
                                        <p className="inline-block">
                                          {formik?.values?.uploadReceipt?.name}
                                        </p>
                                        <span
                                          onClick={() => {
                                            formik.setValues({
                                              ...formik.values,
                                              uploadReceipt: ''
                                            });
                                          }}
                                          className="font-semibold text-[5px] cursor-pointer"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="size-4 inline-block ms-2 mt-[-7px]"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M6 18 18 6M6 6l12 12"
                                            />
                                          </svg>
                                        </span>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center justify-end gap-x-2">
                                <PrimaryButton
                                  btnText="Submit"
                                  onClick={formik.handleSubmit}
                                  btnType="button"
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="sm:flex justify-between mt-4">
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
              {/* <div className="text-right inline-flex justify-end float-right mt-5">
                   
                  </div> */}
              {/* <div className="self-center">
                    <SearchInput
                      id="searchKey"
                      name="searchKey"
                      type="text"
                      onChange={(e) => {setSearchTerm(e.target.value);getpartner(1,selectedPerPage?.value,e.target.value)}}
                      placeholder="Search by Company name"
                    />
                  </div> */}
            </div>
            <div className="flex sm:justify-end gap-4 mt-4">
              <div>
                <button
                  onClick={(e) => handlePaymentModal(e)}
                  className="rounded-3xl border dark:text-white border-shoorah-primary bg-gradient-to-r py-2 sm:py-3 px-7 text-sm font-medium shadow-sm focus:outline-none  text-shoorah-primary "
                >
                  Add Payment
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Table
              columns={columns}
              data={
                form?.introducedCompanies?.length
                  ? form?.introducedCompanies.map((ele) => {
                      return {
                        ...ele,
                        paymentStatus: ele?.paymentStatus === 1 ? 'Success' : 'Pending',
                        download: ele?.paymentReceipt ? ele?.paymentReceipt : ''
                      };
                    })
                  : []
              }
              name={'admin_table'}
              // addNewURL="/sub-admins/add-edit"
              // bottomBorder={totalCount > selectedPerPage?.value}
              loader={loader}
            />
          </div>
        </form>
      </div>

      {openConfirmPopup && (
        <ConfirmPopup
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          message={'Are you sure you want to update partner details?'}
          setAccepted={(e) => handleSubmit(e, true)}
        />
      )}
    </div>
  );
}
AddPartner.propTypes = {
  location: PropTypes.any
};
export default AddPartner;

import { Helmet } from 'react-helmet';
import Loader from '../../../component/common/Loader';
import Breadcrumb from '../../../component/common/Breadcrumb';
import CommonInput from '../../../component/common/Input/CommonInput';
import PhoneInput from 'react-phone-number-input';
import { JOB_ROLES } from '../../../utils/constants';
import ToggleSwitch from '../../../component/common/ToggleSwitch';
import SecondaryButton from '../../../component/common/Buttons/SecondaryButton';
import PrimaryButton from '../../../component/common/Buttons/PrimaryButton';
import ConfirmPopup from '../../../component/common/modals/ConfirmPopup';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-phone-number-input/style.css';

import {
  capitalize,
  errorToast,
  getFileType,
  getLocalStorageItem,
  successToast
} from '../../../utils/helper';
import PropTypes from 'prop-types';
import NOPhoto from '../../../assets/images/partner.jpeg';
import { useRef } from 'react';
import { Api } from '../../../api';
import axios from 'axios';
import { isValidPhoneNumber } from 'react-phone-number-input';
import LazyLoadImageProp from '../../../component/common/LazyLoadImage';
import { CameraIcon } from '@heroicons/react/24/outline';
import { PartnerApi } from '../../../api/partnerApi';
import PartnerAddEditValidation from '../../../validation/addPartnerValidation';

function MyAccount() {
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const imageRef = useRef(null);
  const [pages, setPages] = useState([
    { name: 'My Account', href: '/partner-account', current: true }
  ]);
  const [number, setNumber] = useState('');
  const [edit, setEdit] = useState(false);

  const [form, setform] = useState({
    id: '',
    image: null,
    logoUpdated: false,
    name: '',
    email: '',
    mobile: '',
    jobRole: '',
    commission: '',
    accountStatus: 1
  });

  const [error, setError] = useState({});
  const [selectedMenu, setSelectedMenu] = useState({});
  const [toggleValue, setToggleValue] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState('');
  const [valid, setValid] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setform({ ...form, [name]: value });
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
      setLoader(true);
      const payload = {
        userId: form.id,
        name: capitalize(form.name),
        email: form.email,
        profile: selectedFile?.type ? getFileType(selectedFile) : null,
        mobile: number,
        jobRole: form.jobRole === '' ? null : form.jobRole
      };

      PartnerApi.updateProfile(payload).then((response) => {
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
                  window.location.reload();
                }
              })
              .catch(() => {
                errorToast('Something went wrong');
              });
          } else {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            window.location.reload();
          }
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      });
    } else {
      setError(errors);
    }
  };

  const getProfile = () => {
    setLoader(true);
    PartnerApi.getProfile().then((res) => {
      if (res?.data?.meta?.code === 1) {
        setform({
          ...form,
          id: res.data.data.id,
          jobRole: res.data.data.jobRole,
          email: res.data.data.email,
          mobile: res.data.data.mobile,
          name: res.data.data.name,
          commission: res.data.data.commission
        });
        setPreview(res.data.data.profile);
        setNumber(res.data.data.mobile);
        setLoader(false);
      } else {
        setLoader(false);
        errorToast(res?.data?.meta?.message);
      }
    });
  };

  useEffect(() => {
    getProfile();
  }, [edit]);

  return (
    <div>
      {loader ? <Loader /> : null}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Partner | Shoorah Partner</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <form>
          <div className="flex-wrap lg:flex px-4 py-10 rounded-[10px] bg-white dark:bg-shoorah-darkBgTabColor  dark:text-white gap-4">
            <div className="lg:mr-10 mb-4">
              <div>
                <input
                  onChange={onSelectFile}
                  className="hidden"
                  ref={imageRef}
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  disabled={!edit}
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
            <div className="space-y-6 m-auto lg:m-0 w-full lg:w-[430px]">
              <CommonInput
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                label="Name"
                error={error.name}
                classNames={!edit ? `text-gray-400 h-10 pl-3` : `text-gray-800 pl-3 h-10`}
                isRequired
                disabled={!edit}
              />
              <CommonInput
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                classNames={!edit ? `text-gray-400 h-10 pl-3` : `text-gray-800 pl-3 h-10`}
                label="Email address"
                error={error.email}
                isRequired
                disabled={!edit}
              />
              <CommonInput
                id="commission"
                name="commission"
                value={form.commission}
                onChange={handleChange}
                type="number"
                label="Commission ( % )"
                error={error.commission}
                classNames={!edit ? `text-gray-400 h-10 pl-3` : `text-gray-800 pl-3 h-10`}
                isRequired
                disabled
              />
              <div className="flex flex-col justify-between mt-3">
                <label
                  className="text-sm block font-medium text-gray-700 dark:text-white"
                  htmlFor="mobile"
                >
                  Contact Number
                </label>
                <PhoneInput
                  className={` ${
                    !edit ? `text-gray-400 h-10 pl-3` : `text-gray-800 pl-3 h-10`
                  } border border-gray-300 outline-none appearance-none dark:bg-shoorah-darkBgColor dark:text-white dark:border-none rounded-[3rem] h-10 px-2 capitalize`}
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
                  disabled={!edit}
                />
                {valid.isSubmit && !isValidPhoneNumber(number) && (
                  <span className="text-sm text-red-700">Please enter a valid number</span>
                )}
              </div>

              <label
                htmlFor="job_role"
                className="text-sm block font-medium text-gray-700 dark:text-white"
              >
                Job Role <span className={` text-red-400`}></span>
              </label>
              <div
                className={`w-full ${
                  !edit ? `text-gray-400 h-10 pl-1` : `text-gray-800 pl-1 h-10`
                } pr-4 overflow-hidden border border-gray-300 dark:bg-shoorah-darkBgColor dark:text-white dark:border-none rounded-[3rem] border`}
              >
                <select
                  className={`bg-transparent ${
                    !edit ? `text-gray-400 h-10 pl-1` : `text-gray-800 pl-2 h-10`
                  } dark:border-none dark:border-shoorah-darkBgColor outline-none border-gray-300 dark:bg-shoorah-darkBgColor dark:text-white dark:border-none rounded-[3rem] h-10 px-3`}
                  onChange={handleChange}
                  value={form?.jobRole}
                  id="job_role"
                  name="jobRole"
                  disabled={!edit}
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

              {edit ? (
                <div className="text-right flex justify-end gap-x-2 mt-12">
                  <button
                    className="rounded-3xl border border-shoorah-primary bg-gradient-to-r py-2 sm:py-3 px-10 text-sm font-medium shadow-sm focus:outline-none  text-shoorah-primary "
                    onClick={() => {
                      setEdit(!edit);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-3xl border bg-shoorah-primary bg-gradient-to-r py-2 sm:py-3 px-10 text-sm font-medium shadow-sm focus:outline-none  text-white "
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  {/* <PrimaryButton btnText="Submit" btnType="submit" /> */}
                </div>
              ) : (
                <button
                  onClick={() => setEdit(!edit)}
                  className={`${
                    false
                      ? 'bg-gray-300'
                      : 'border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary'
                  } rounded-3xl py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2`}
                >
                  Edit Details
                </button>
              )}
            </div>
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
MyAccount.propTypes = {
  location: PropTypes.any
};
export default MyAccount;

import React, { Fragment, useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../component/common/Breadcrumb';
import { BtbSentToUser } from '../../utils/constants';
import Loader from '../../component/common/Loader';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  MaxCharlimit,
  MaxCharlimitLongText,
  errorToast,
  getFileType,
  getLocalStorageItem,
  successToast,
  useOutsideClick
} from '../../utils/helper';
import AddPushNotificationVali from '../../validation/AddPushNotificationVali';
import { Helmet } from 'react-helmet';
import CommonInput from '../../component/common/Input/CommonInput';
import CommonTextarea from '../../component/common/CommonTextarea';
import SecondaryButton from '../../component/common/Buttons/SecondaryButton';
import PrimaryButton from '../../component/common/Buttons/PrimaryButton';
import SearchableSelect from '../../component/common/SearchableSelect';
import SelectMenu from '../../component/common/SelectMenu';
import { ArrowUpTrayIcon, CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { Calendar } from 'react-date-range';
import moment from 'moment/moment';
import { CompanyApi } from '../../api/companyApi';
import { CameraIcon } from '@heroicons/react/20/solid';
import LazyLoadImageProp from '../../component/common/LazyLoadImage';
import ProfilePic from '../../assets/images/dummy-avatar.png';
import axios from 'axios';
import FormAudioPlayer from '../../component/AudioPlayer/FormAudioPlayer';

function BTBAddNotification() {
  const navigate = useNavigate();

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const pages = [
    {
      name: 'Notification',
      href: `/${userData?.slug}/notification`,
      current: false
    },
    {
      name: 'Add Notification',
      href: `#`,
      current: true
    }
  ];

  const [form, setForm] = useState({
    title: '',
    message: '',
    sentToUser: null,
    sentToDepartment: null,
    email_ids: '',
    reminder: 1
  });
  const [error, setError] = useState({});
  const [selectedEmailList, setSelectedList] = useState({});
  const [loader, setLoader] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateRange, setDateRange] = useState(new Date());
  const [notifyImage, setNotifyImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deptList, setDeptList] = useState([
    {
      name: 'Select',
      value: null
    }
  ]);
  const isView = false;
  const [audio, setAudio] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [sec, setSec] = useState(0);
  const [selectedFile, setSelectedFile] = useState('');
  const inputFile = useRef(null);

  const getFilterData = () => {
    CompanyApi.getFilterData(userData.companyId)
      .then((res) => {
        const department = res.data.departments;

        const formattedDept = department?.map((data) => {
          return {
            name: data,
            value: data
          };
        });

        setDeptList([...deptList, ...formattedDept]);
      })
      .catch(() => {
        // setLoader(false);
      });
  };

  useEffect(() => {
    getFilterData();

    return () => {};
  }, []);

  const wrapperRef = useRef(null);
  const imageRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    const updatedError = { ...error, [name]: '' };
    setError(updatedError);
    if (
      !(name === 'title' && value.length > MaxCharlimit) &&
      !(name === 'message' && value.length > MaxCharlimitLongText)
    ) {
      setForm(updatedForm);
    }
  };

  const selectHandler = (data) => {
    setForm((prevData) => ({
      ...prevData,
      sentToUser: parseInt(data.value)
    }));
  };

  const selectDeptHandler = (data) => {
    setForm((prevData) => ({
      ...prevData,
      sentToDepartment: data.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid } = AddPushNotificationVali(form, selectedEmailList);
    if (isValid) {
      setLoader(true);
      let payload = {
        title: form.title,
        message: form.message,
        sentToUser: parseInt(form.sentToUser),
        sentToDepartment: form.sentToDepartment,
        sentOnDate: dateRange,
        cronSent: false,
        reminder: parseInt(form.reminder),
        audioUrl: selectedFile?.type ? getFileType(selectedFile) : null
      };
      if (parseInt(form.sentToUser) === 4) {
        payload = {
          ...payload,
          toUserIds: selectedEmailList?.map((item) => item?.id)
        };
      }

      if (notifyImage) {
        payload = {
          ...payload,
          image: notifyImage?.type ? getFileType(notifyImage) : null
        };
      }

      CompanyApi.addPushNotification(payload).then(async (response) => {
        if (response?.data?.meta?.code === 1) {
          if (response?.data?.meta?.audioUrl?.uploadURL) {
            await axios.put(response?.data?.meta?.audioUrl?.uploadURL, selectedFile, {
              headers: {
                'content-type': `${selectedFile?.type?.split('/')[0]}/${
                  selectedFile?.name?.split('.')[1]
                }`
              }
            });
          }
          if (response?.data?.meta?.notifyImageUrl?.uploadURL) {
            await axios.put(response?.data?.meta?.notifyImageUrl?.uploadURL, notifyImage, {
              headers: {
                'content-type': `${notifyImage?.type?.split('/')[0]}/${
                  notifyImage?.name?.split('.')[1]
                }`
              }
            });
          }

          setLoader(false);
          successToast(response?.data?.meta?.message);
          navigate(`/${userData?.slug}/notification`);
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      });
    }
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setNotifyImage(undefined);
      return;
    }
    if (e?.target?.files[0]?.size > 1048576) {
      errorToast(`File size should be less than 1MB`);
    } else {
      if (e?.target?.files[0]) {
        if (!e?.target?.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
          errorToast(
            `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid image.`
          );
        } else {
          setNotifyImage(e.target.files[0]);
          const objectUrl = URL.createObjectURL(e.target.files[0]);
          setPreview(objectUrl);
          return () => URL.revokeObjectURL(objectUrl);
        }
      } else {
        setPreview(undefined);
      }
    }
  };

  const handleAudio = (e) => {
    if (e?.target?.files[0]) {
      if (!e?.target?.files[0].name.match(/\.(mp3|wav)$/i)) {
        errorToast(
          `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid audio file.`
        );
      } else {
        setSelectedFile(e.target.files[0]);
        setAudio(URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  const removeFile = () => {
    setSelectedFile('');
    setAudio('');
    setSec(0);
    setMinutes(0);
  };

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Add Notifications | Shoorah B2B</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <form onSubmit={handleSubmit}>
          <div className="flex-wrap lg:flex px-7 py-10 rounded-[10px] dark:bg-shoorah-darkBgTabColor dark:text-white bg-white gap-4">
            <div>
              <div className="space-y-7 m-auto lg:m-0 w-full lg:w-[550px]">
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
                  {isView && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white">
                        Notification Audio
                      </label>
                      <div className="relative">
                        <FormAudioPlayer
                          audio={audio}
                          setMin={setMinutes}
                          minutes={minutes}
                          sec={sec}
                          setSec={setSec}
                        />
                      </div>
                    </div>
                  )}
                  {!isView && (
                    <div>
                      <label className="block w-full text-sm font-medium text-gray-700 dark:text-white">
                        Upload Audio <span className="text-red-400">&#42;</span>
                      </label>
                      {audio ? (
                        <>
                          <div className="relative w-full">
                            <div
                              onClick={() => inputFile.current.click()}
                              className="mt-1 w-full cursor-pointer flex justify-between border px-3 py-2 rounded-3xl"
                            >
                              <p>
                                {selectedFile?.name
                                  ? selectedFile?.name
                                  : audio?.split('/')[audio?.split('/')?.length - 1]}
                              </p>
                            </div>
                            <input
                              type="file"
                              className="bg-black hidden"
                              ref={inputFile}
                              onChange={(e) => handleAudio(e)}
                              onClick={(event) => {
                                event.target.value = null;
                              }}
                              accept=".mp3,audio/*"
                            />

                            <XMarkIcon
                              className="absolute top-1/2 transform -translate-y-1/2 right-[10px] w-[20px] text-red-500 cursor-pointer"
                              onClick={removeFile}
                            />
                          </div>
                          <FormAudioPlayer
                            audio={audio}
                            minutes={minutes}
                            setMin={setMinutes}
                            sec={sec}
                            setSec={setSec}
                          />
                        </>
                      ) : (
                        <>
                          <div className="mt-1">
                            <button
                              type="button"
                              onClick={() => inputFile.current.click()}
                              className="block w-full rounded-3xl appearance-none border border-gray-300
                      px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none
                      focus:ring-shoorah-primary sm:text-base"
                            >
                              <ArrowUpTrayIcon className="w-[20px] inline mr-3" />
                              Upload
                            </button>
                            <input
                              type="file"
                              className="bg-black hidden"
                              ref={inputFile}
                              onChange={(e) => handleAudio(e)}
                              accept=".mp3,audio/*"
                              onClick={(event) => {
                                event.target.value = null;
                              }}
                            />
                          </div>
                          <span className="error text-xs text-red-400">{error.meditationFile}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <CommonInput
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  label="Push Title"
                  error={error.title}
                  isRequired
                  isLengthValidate
                />
                <CommonTextarea
                  rows={4}
                  name="message"
                  id="message"
                  value={form.message}
                  onChange={handleChange}
                  label="Push Message"
                  error={error.message}
                  isRequired
                  isLengthValidate
                />
                <div>
                  <fieldset className="mt-4">
                    <SelectMenu
                      menuList={BtbSentToUser}
                      defaultSelected={form.sentToUser}
                      label="Send to Users"
                      isRequired={true}
                      setSelectedMenu={(data) => selectHandler(data)}
                    />
                  </fieldset>
                </div>
                {form.sentToUser === 4 ? (
                  <div>
                    <SearchableSelect
                      label="Search email / mobile"
                      setSelectedList={setSelectedList}
                      error={error?.email_ids}
                    />
                  </div>
                ) : null}

                <div>
                  <fieldset className="mt-4">
                    <SelectMenu
                      menuList={deptList}
                      defaultSelected={form.sentToDepartment}
                      label="Send to Department"
                      isRequired={true}
                      setSelectedMenu={(data) => selectDeptHandler(data)}
                    />
                    {error.sent_to_user && (
                      <span className="text-xs text-red-400">{error.sent_to_user}</span>
                    )}
                  </fieldset>
                </div>

                <CommonInput
                  id="reminder"
                  name="reminder"
                  type="Number"
                  value={form.reminder}
                  onChange={handleChange}
                  label="Push reminder"
                  error={error.reminder}
                />

                <div>
                  <label
                    // htmlFor={id}
                    className="block text-sm font-medium dark:text-white text-gray-700"
                  >
                    Push Date<span className="text-red-400"> &#42;</span>
                  </label>
                  <div className="relative">
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
                      <div className="absolute  z-[2] mt-2 lg:right-16 dark:bg-shoorah-darkBgColor top-0 -translate-y-full  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div ref={wrapperRef}>
                          <Calendar
                            date={dateRange}
                            onChange={(item) => setDateRange(item)}
                            minDate={new Date()}
                          />
                          {/* <DateRangePicker
                            ranges={[
                              {
                                startDate: dateRange?.startDate
                                  ? dateRange?.startDate
                                  : new Date(),
                                endDate: dateRange?.endDate
                                  ? dateRange?.endDate
                                  : new Date(),
                                key: "selection",
                              },
                            ]}
                            onChange={handleSelectRange}
                            minDate={new Date()}
                          /> */}
                        </div>
                      </div>
                    </Transition>

                    <div className="mt-1">
                      <div
                        onClick={() => setShowFilterModal(!showFilterModal)}
                        className={` w-full rounded-3xl cursor-pointer flex items-center justify-between appearance-none border dark:border-none dark:bg-shoorah-darkBgColor border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-sm`}
                      >
                        <p>{moment(dateRange).format('DD-MM-YY')}</p>
                        <div className="inline-flex items-center relative justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto">
                          <CalendarIcon className="text-white w-4 h-4 inline" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right flex justify-end gap-x-4 mt-[45px]">
                <>
                  <SecondaryButton btnText="Cancel" btnType="button" />
                  <PrimaryButton btnText="Save" btnType="submit" />
                </>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

BTBAddNotification.propTypes = {
  location: PropTypes.any
};

export default BTBAddNotification;

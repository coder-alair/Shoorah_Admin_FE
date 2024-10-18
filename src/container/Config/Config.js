import { useRef, useState } from 'react';
import Breadcrumb from '../../component/common/Breadcrumb';
import ToggleSwitch from '../../component/common/ToggleSwitch';
import appleLogo from '../../assets/images/AppleLogo.png';
import androidLogo from '../../assets/images/AndroidLogo.png';
import { Helmet } from 'react-helmet';
import CommonInput from '../../component/common/Input/CommonInput';
import CommonTextarea from '../../component/common/CommonTextarea';
import { useEffect } from 'react';
import { Api } from '../../api';
import { errorToast, getFileType, successToast } from '../../utils/helper';
import Loader from '../../component/common/Loader';
import ConfigValidations from '../../validation/ConfigValidations';
import PrimaryButton from '../../component/common/Buttons/PrimaryButton';
import ConfirmPopup from '../../component/common/modals/ConfirmPopup';
import PropTypes from 'prop-types';
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import Duration from '../../component/common/Duration';
import LogoUpload from '../../assets/images/logo-upload-icon.png';
import VideoIcon from '../../assets/images/dummy-video-icon.png';
import axios from 'axios';
import LazyLoadImageProp from '../../component/common/LazyLoadImage';

const pages = [{ name: 'Config', href: '/config', current: true }];

const TUTORIAL_VIDEO_TABS = [
  { name: 'About Shoorah', value: 0 },
  { name: 'Cleanse', value: 1 },
  { name: 'Gratitude', value: 2 },
  { name: 'Goals', value: 3 },
  { name: 'Rituals', value: 4 },
  { name: 'Notes', value: 5 },
  { name: 'Restore', value: 6 },
  { name: 'Journal', value: 7 },
  { name: 'Affirmation', value: 8 },
  { name: 'Pods', value: 9 },
  { name: 'Shuru', value: 10 },
  { name: 'Breathwork', value: 11 },
  { name: 'Visions', value: 12 }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const LoadVideo = ({ previewVideo, setMin, setSec }) => {
  const videoEl = useRef(null);

  const handleLoadedMetadata = () => {
    const video = videoEl.current;
    if (!video) return;
    let minutes = Math.floor(video.duration / 60);
    let extraSeconds = video.duration % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let sec = parseInt(extraSeconds);
    sec = sec < 10 ? '0' + sec : sec;
    setMin(minutes);
    setSec(sec);
  };

  function changeSource(url) {
    const video = document.getElementById('video');
    video.src = url;
  }

  useEffect(() => {
    changeSource(previewVideo);
  }, [previewVideo]);

  return (
    <video
      id="video"
      ref={videoEl}
      onLoadedMetadata={handleLoadedMetadata}
      className="m-auto h-[248px] object-center"
      controls
    >
      <source className="w-full h-[250px]" src={previewVideo} />
    </video>
  );
};

LoadVideo.propTypes = {
  previewVideo: PropTypes.any,
  setSec: PropTypes.any,
  setMin: PropTypes.any
};

const TutorialVideoForm = ({ selectedTab }) => {
  const thumbnailRef = useRef(null);
  const videoRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [selectedVideo, setSelectedVideo] = useState();
  const [loader, setLoader] = useState(false);
  const [preview, setPreview] = useState('');
  const [previewVideo, setPreviewVideo] = useState('');
  const [heading, setHeading] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [isVideoDeleted, setIsVideoDeleted] = useState(false);

  const [minutes, setMinutes] = useState('00');
  const [sec, setSec] = useState('00');

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
      } else if (e?.target?.files[0]?.size > 1048576) {
        errorToast(`File size should be less than 1MB`);
      } else {
        setSelectedFile(e.target.files[0]);
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setPreview(objectUrl);
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreview(undefined);
    }
  };

  const onSelectVideo = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedVideo(undefined);
      return;
    }

    if (e.target.files[0]) {
      if (!e?.target?.files[0].name.match(/\.(avi|mp4|m4v|webm)$/i)) {
        errorToast(
          `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid video.`
        );
      } else if (e?.target?.files[0]?.size > 524288000) {
        errorToast(`File size should be less than 500MB`);
      } else {
        setSelectedVideo(e.target.files[0]);
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setPreviewVideo(objectUrl);
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreviewVideo(undefined);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    const payload = {
      videoUrl: selectedVideo?.type ? getFileType(selectedVideo) : '',
      thumbnail: selectedFile?.type ? getFileType(selectedFile) : '',
      duration: `${minutes}:${sec}`,
      contentType: selectedTab,
      heading: heading,
      subHeading: subHeading,
      isImageDeleted: isImageDeleted,
      isVideoDeleted: isVideoDeleted
    };
    Api.createTutorial(payload).then(async (res) => {
      setSelectedVideo(undefined);
      setSelectedFile(undefined);
      if (res?.data?.meta?.thumbnail?.uploadURL || res?.data?.meta?.videoUrl?.uploadURL) {
        if (res?.data?.meta?.thumbnail?.uploadURL) {
          await axios
            .put(res?.data?.meta?.thumbnail?.uploadURL, selectedFile, {
              headers: { 'content-type': selectedFile.type }
            })
            .then(async (resp) => {
              if (resp?.status === 200) {
                if (res?.data?.meta?.videoUrl?.uploadURL) {
                  await axios
                    .put(res?.data?.meta?.videoUrl?.uploadURL, selectedVideo, {
                      headers: { 'content-type': selectedVideo.type }
                    })
                    .then((resp) => {
                      if (resp?.status === 200) {
                        successToast('Tutorial video uploaded successfully.');
                        previewDataAPI(selectedTab);
                        setHeading('');
                        setSubHeading('');
                        setLoader(false);
                      }
                    })
                    .catch(() => {
                      errorToast('Something went wrong');
                      setLoader(false);
                    });
                } else {
                  successToast('Tutorial video uploaded successfully.');
                  previewDataAPI(selectedTab);
                  setLoader(false);
                }
              }
            })
            .catch(() => {
              errorToast('Something went wrong');
              setLoader(false);
            });
        } else if (res?.data?.meta?.videoUrl?.uploadURL) {
          await axios
            .put(res?.data?.meta?.videoUrl?.uploadURL, selectedVideo, {
              headers: { 'content-type': selectedVideo.type }
            })
            .then((resp) => {
              if (resp?.status === 200) {
                successToast('Tutorial video uploaded successfully.');
                previewDataAPI(selectedTab);
                setLoader(false);
              }
            })
            .catch(() => {
              errorToast('Something went wrong');
              setLoader(false);
            });
        }
      } else {
        if (res?.data?.meta?.code === 1) {
          successToast(res?.data?.meta?.message);
          setLoader(false);
          previewDataAPI(selectedTab);
        } else {
          errorToast(res?.data?.meta?.message);
          setLoader(false);
        }
      }
    });
  };

  const handleDeleteVideo = (e) => {
    setSelectedVideo(null);
    setPreviewVideo(null);
    setIsVideoDeleted(true);
    setMinutes('00');
    setSec('00');
  };

  const handleDeleteThumbnail = (e) => {
    setSelectedFile(null);
    setPreview(null);
    setIsImageDeleted(true);
  };

  useEffect(() => {
    setSelectedVideo(undefined);
    setSelectedFile(undefined);
    previewDataAPI(selectedTab);
  }, [selectedTab]);

  const handleHeading = (e) => {
    const { name, value } = e.target;
    setHeading(value);
  };

  const handleSubHeading = (e) => {
    const { name, value } = e.target;
    setSubHeading(value);
  };

  const previewDataAPI = (selectedTab) => {
    setLoader(true);
    Api.getTutorialByType(selectedTab)
      .then((resp) => {
        if (resp?.data?.meta?.code === 1) {
          setPreview(resp?.data?.data?.thumbnail);
          setPreviewVideo(resp?.data?.data?.videoUrl);
          setHeading(resp?.data?.data?.heading);
          setSubHeading(resp?.data?.data?.subHeading);
          setIsImageDeleted(false);
          setIsVideoDeleted(false);
        } else {
          errorToast(resp?.data?.meta?.message);
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      {loader && <Loader />}
      <div className="mt-3 p-4 lg:p-5 border border-gray-200 dark:border-none rounded-md w-full">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-4 xl:grid-cols-3 gap-10">
            <div className="mt-1 lg:col-span-2 xl:col-span-1">
              <button
                type="button"
                onClick={() => {
                  videoRef?.current?.click();
                }}
                className="block w-full rounded-3xl appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-base"
              >
                <ArrowUpTrayIcon className="w-[20px] inline mr-3" />
                Upload video
              </button>
              <button
                type="button"
                onClick={handleDeleteVideo}
                className="block bg-[red] text-white w-full my-2 rounded-3xl appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-base"
              >
                Delete video
              </button>
              <input
                className="hidden"
                ref={videoRef}
                onInput={(event) => {
                  onSelectVideo(event);
                  event.target.value = null;
                }}
                type="file"
                accept="video/mp4,video/x-m4v,video/*"
              />
              {selectedVideo || previewVideo ? (
                <>
                  {previewVideo && (
                    <div className="relative">
                      <div className="bg-gray-100 mt-4 cursor-pointer h-[250px] border rounded-xl overflow-hidden">
                        <LoadVideo
                          previewVideo={previewVideo}
                          setMin={setMinutes}
                          setSec={setSec}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  onClick={() => {
                    videoRef?.current?.click();
                  }}
                  className="bg-gray-100 mt-4 cursor-pointer h-[250px] flex justify-center items-center p-3 border rounded-lg mx-auto text-center"
                >
                  <div>
                    <img
                      src={VideoIcon}
                      loading='lazy'
                      className="self-start mx-auto h-[70px] w-[80px]"
                      alt="ArrowUpRight"
                    />
                    <p className="text-base mt-3 font-medium">Browse</p>
                    <p className="text-sm mt-1 text-passio-grayText ">
                      File size is upto 500 MB max.
                      <br />
                      (mp4)
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-1 lg:col-span-2 xl:col-span-1">
              <input
                onInput={(event) => {
                  onSelectFile(event);
                  event.target.value = null;
                }}
                className="hidden"
                ref={thumbnailRef}
                type="file"
                accept=".jpg, .jpeg, .png"
              />
              <button
                type="button"
                onClick={() => {
                  thumbnailRef?.current?.click();
                }}
                className="block w-full rounded-3xl appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-base"
              >
                <ArrowUpTrayIcon className="w-[20px] inline mr-3" />
                Upload thumbnail
              </button>
              <button
                type="button"
                onClick={handleDeleteThumbnail}
                className="block bg-[red] text-white w-full my-2 rounded-3xl appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-base"
              >
                Delete thumbnail
              </button>
              {selectedFile || preview ? (
                <div className="relative">
                  <div
                    className="bg-gray-100 overflow-hidden rounded-xl mt-4 cursor-pointer"
                    onClick={() => {
                      thumbnailRef?.current?.click();
                    }}
                  >
                    <div className="border rounded-xl overflow-hidden h-[250px] text-center">
                      <LazyLoadImageProp
                        imageSrc={preview}
                        className="mx-auto w-full h-[250px] rounded-xl  object-contain"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    thumbnailRef?.current?.click();
                  }}
                  className="bg-gray-100 mt-4 cursor-pointer h-[250px] flex justify-center items-center p-3 border border-red rounded-lg mx-auto text-center"
                >
                  <div>
                    <img
                      src={LogoUpload}
                      loading='lazy'
                      className="object-cover self-start mx-auto"
                      alt="ArrowUpRight"
                    />
                    <p className="text-base mt-3 font-medium">Browse</p>
                    <p className="text-sm mt-1 text-passio-grayText ">
                      File size is upto 1 MB max.
                      <br />
                      (png, jpg, jpeg)
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-1 lg:col-span-4 xl:col-span-1">
              <div>
                <label
                  htmlFor="meditationName"
                  className="block text-sm font-medium dark:text-white text-gray-700"
                >
                  Duration
                </label>
                <Duration
                  min={minutes}
                  sec={sec}
                  setSec={setSec}
                  setMin={setMinutes}
                  disabled={true}
                />
                <CommonInput
                  id="heading"
                  name="heading"
                  classNames="px-3 mb-1 py-2"
                  type="text"
                  value={heading}
                  onChange={handleHeading}
                  label="Heading"
                />
                <CommonInput
                  id="subheading"
                  name="subheading"
                  type="text"
                  value={subHeading}
                  onChange={handleSubHeading}
                  label="Sub Heading"
                />
              </div>
            </div>
          </div>
          <div className="text-right mb-1 mt-5">
            <PrimaryButton btnText={'Save'} btnType="submit" />
          </div>
        </form>
      </div>
    </>
  );
};

TutorialVideoForm.propTypes = {
  selectedTab: PropTypes.any
};

function Config() {
  const [maintenanceIOS, setMaintenanceIOS] = useState(false);
  const [maintenanceAndroid, setMaintenanceAndroid] = useState(false);
  const [maintenanceWebsite, setMaintenanceWebsite] = useState(false);
  const [IOSUpdate, setIOSUpdate] = useState(false);
  const [androidUpdate, setAndroidUpdate] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openIOSConfirmPopup, setIOSConfirmPopup] = useState(false);
  const [openAndroidConfirmPopup, setAndroidConfirmPopup] = useState(false);
  const [openMaintenanceModeConfirmPopup, setMaintenanceModeConfirmPopup] = useState(false);
  const [maintenanceModePayload, setMaintenanceModePayload] = useState({});
  const [maintenanceModeType, setMaintenanceModeType] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [selectedForceUpdateTab, setSelectedForceUpdateTab] = useState(0);
  const [selectedTutorialVideoTab, setSelectedTutorialVideoTab] = useState(0);

  const [forceIOS, setForceIOS] = useState({
    updateMessage: '',
    minIOSVersion: ''
  });
  const [forceAndroid, setForceAndroid] = useState({
    updateMessage: '',
    minAndroidVersion: ''
  });

  const [ErrorsforceIOS, setErrorsForceIOS] = useState({
    updateMessage: '',
    minIOSVersion: ''
  });
  const [ErrorsforceAndroid, setErrorsForceAndroid] = useState({
    updateMessage: '',
    minAndroidVersion: ''
  });

  const handleChangeIOS = (e) => {
    setErrorsForceIOS((prevState) => ({
      ...prevState,
      [e.target.name]: ''
    }));
    setForceIOS({
      ...forceIOS,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeAndroid = (e) => {
    setErrorsForceAndroid((prevState) => ({
      ...prevState,
      [e.target.name]: ''
    }));
    setForceAndroid({
      ...forceAndroid,
      [e.target.name]: e.target.value
    });
  };

  const submitIOS = (e) => {
    e.preventDefault();
    const { isValid, errors } = ConfigValidations(forceIOS, false);
    if (isValid) {
      setIOSConfirmPopup(true);
    } else {
      setErrorsForceIOS(errors);
    }
  };

  const handleIOSSubmit = (e) => {
    e.preventDefault();
    setIOSConfirmPopup(false);
    const payload = {
      configKey: 2,
      configValue: {
        message: forceIOS.updateMessage,
        mandatoryUpdate: IOSUpdate,
        minVersion: forceIOS.minIOSVersion
      }
    };
    Api.updateConfig(payload).then((response) => {
      setLoader(true);
      if (response.data.meta.code === 1) {
        successToast(response?.data?.meta?.message);
        setLoader(false);
      }
      if (response.data.meta.code === 0) return errorToast(response?.data?.meta?.message);
    });
  };

  const submitAndroid = (e) => {
    e.preventDefault();
    const { isValid, errors } = ConfigValidations(forceAndroid, true);
    if (isValid) {
      setAndroidConfirmPopup(true);
    } else {
      setErrorsForceAndroid(errors);
    }
  };

  const handleAndroidSubmit = (e) => {
    e.preventDefault();
    setAndroidConfirmPopup(false);
    const payload = {
      configKey: 3,
      configValue: {
        message: forceAndroid.updateMessage,
        mandatoryUpdate: androidUpdate,
        minVersion: forceAndroid.minAndroidVersion
      }
    };
    Api.updateConfig(payload).then((response) => {
      if (response.data.meta.code === 1) {
        successToast(response?.data?.meta?.message);
      }
      if (response.data.meta.code === 0) return errorToast(response?.data?.meta?.message);
    });
  };

  const getConfigData = () => {
    setLoader(true);
    Api.getConfigList().then((response) => {
      if (response.data.meta.code === 1) {
        setLoader(false);
        setMaintenanceIOS(JSON.parse(response?.data?.data[0]?.configValue).ios);
        setMaintenanceAndroid(JSON.parse(response?.data?.data[0]?.configValue).android);
        setMaintenanceWebsite(JSON.parse(response?.data?.data[0]?.configValue).website);
        setAndroidUpdate(JSON.parse(response?.data?.data[2]?.configValue).mandatoryUpdate);
        setIOSUpdate(JSON.parse(response?.data?.data[1]?.configValue).mandatoryUpdate);
        setForceIOS({
          updateMessage: JSON.parse(response?.data?.data[1].configValue).message,
          minIOSVersion: JSON.parse(response?.data?.data[1].configValue).minVersion
        });
        setForceAndroid({
          updateMessage: JSON.parse(response?.data?.data[2].configValue).message,
          minAndroidVersion: JSON.parse(response?.data?.data[2].configValue).minVersion
        });
      } else if (response.data.meta.code === 0) {
        setLoader(false);
        return errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const onUpdate = (key, value) => {
    setMaintenanceModeConfirmPopup(true);
    let payload = {
      configKey: 1,
      configValue: {
        ios: maintenanceIOS,
        android: maintenanceAndroid,
        website: maintenanceWebsite
      }
    };
    if (key === 'ios') {
      setMaintenanceIOS(!maintenanceIOS);
    }
    if (key === 'android') {
      setMaintenanceAndroid(!maintenanceAndroid);
    }
    if (key === 'website') {
      setMaintenanceWebsite(!maintenanceWebsite);
    }
    payload.configValue[key] = value;
    setMaintenanceModePayload(payload);
    setMaintenanceModeType(key);
  };

  const handleToggleChange = (e) => {
    e.preventDefault();
    Api.updateConfig(maintenanceModePayload).then((response) => {
      setLoader(true);
      if (response.data.meta.code === 1) {
        successToast(response?.data?.meta?.message);
        setLoader(false);
      }
      if (response.data.meta.code === 0) {
        setLoader(false);
        return errorToast(response?.data?.meta?.message);
      }
    });
  };

  useEffect(() => {
    getConfigData();
  }, []);

  const handleNo = (e) => {
    if (e === 'ios') {
      setMaintenanceIOS(!maintenanceIOS);
    }
    if (e === 'android') {
      setMaintenanceAndroid(!maintenanceAndroid);
    }
    if (e === 'website') {
      setMaintenanceWebsite(!maintenanceWebsite);
    }
  };
  return (
    <>
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      <Helmet>
        <meta charSet="utf-8" />
        <title>Config | Shoorah Admin</title>
      </Helmet>
      <div className="mt-6  mx-3 rounded-3xl px-4 lg:px-6 py-4 bg-white dark:bg-shoorah-darkBgTabColor dark:text-white ">
        <div className="w-full sm:w-[40%]">
          <div className="mb-2">
            <h2 className="text-md lg:text-lg font-semibold">Maintenance Mode</h2>
          </div>
          <div className="flex flex-row justify-between  lg:p-5 border border-gray-200 dark:border-none rounded-md w-full lg:w-auto">
            <div className="flex mt-2 gap-2  ">
              <div className="">
                <p className="text-base">iOS</p>
              </div>
              <div>
                <ToggleSwitch
                  toggleValue={maintenanceIOS}
                  setToggleValue={() => {
                    onUpdate('ios', !maintenanceIOS);
                  }}
                />
              </div>
            </div>
            <div className="flex mt-2 gap-2 ">
              <div className="">
                <p className="text-base">Android</p>
              </div>
              <div>
                <ToggleSwitch
                  toggleValue={maintenanceAndroid}
                  setToggleValue={() => {
                    onUpdate('android', !maintenanceAndroid);
                  }}
                />
              </div>
            </div>
            <div className="flex mt-2 gap-2 ">
              <div className="">
                <p className="text-base">Website</p>
              </div>
              <div>
                <ToggleSwitch
                  toggleValue={maintenanceWebsite}
                  setToggleValue={() => {
                    onUpdate('website', !maintenanceWebsite);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 mt-8">
          <div className="col-span-3">
            <div className="mb-2">
              <h2 className="text-md lg:text-lg font-semibold">Force Update</h2>
            </div>
            {selectedForceUpdateTab === 0 && (
              <div className="mt-3 border border-gray-200 dark:border-none rounded-md px-4 sm:px-6 py-3">
                <div>
                  <div className="lg:flex space-y-6 lg:space-y-0 lg:space-x-10 mt-4">
                    <div className="w-full">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold text-[18px]"> iOS</p>
                        </div>
                        <div className="">
                          <img src={appleLogo} loading='lazy' className="dark:invert" alt={'appleLogo'} />
                        </div>
                      </div>
                      <div>
                        <CommonInput
                          id="name"
                          name="minIOSVersion"
                          type="text"
                          value={forceIOS.minIOSVersion}
                          onChange={handleChangeIOS}
                          label="Minimum value for the iOS update"
                          error={ErrorsforceIOS.minIOSVersion}
                          isRequired
                        />
                      </div>
                      <div className="my-2">
                        <CommonTextarea
                          rows={4}
                          name="updateMessage"
                          id="description"
                          value={forceIOS.updateMessage}
                          onChange={handleChangeIOS}
                          label="Update Message"
                          error={ErrorsforceIOS.updateMessage}
                          isRequired
                        />
                      </div>
                      <div className="flex mt-4">
                        <label className="block text-sm font-medium dark:text-white text-gray-700 mr-3">
                          Mandatory force update
                        </label>
                        <div className="self-center">
                          <ToggleSwitch toggleValue={IOSUpdate} setToggleValue={setIOSUpdate} />
                        </div>
                      </div>
                      <div className="text-right my-3" onClick={submitIOS}>
                        <PrimaryButton btnText={'Save'} btnType="submit" />
                      </div>
                    </div>
                    <div className="border-l border-gray-200"></div>
                    <div className="w-full float-left">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold text-[18px]">Android</p>
                        </div>
                        <div className="">
                          <img src={androidLogo} loading='lazy' className="dark:invert" alt={'android'} />
                        </div>
                      </div>
                      <div>
                        <CommonInput
                          id="name"
                          name="minAndroidVersion"
                          type="text"
                          value={forceAndroid.minAndroidVersion}
                          onChange={handleChangeAndroid}
                          label="Minimum value for the android update"
                          error={ErrorsforceAndroid.minAndroidVersion}
                          isRequired
                        />
                      </div>
                      <div className="my-2">
                        <CommonTextarea
                          rows={4}
                          name="updateMessage"
                          id="description"
                          value={forceAndroid.updateMessage}
                          onChange={handleChangeAndroid}
                          label="Update Message"
                          error={ErrorsforceAndroid.updateMessage}
                          isRequired
                        />
                      </div>
                      <div className="flex mt-4">
                        <label className="block text-sm font-medium dark:text-white text-gray-700 mr-3">
                          Mandatory force update
                        </label>
                        <div className="self-center">
                          <ToggleSwitch
                            toggleValue={androidUpdate}
                            setToggleValue={setAndroidUpdate}
                          />
                        </div>
                      </div>
                      <div className="text-right my-3" onClick={submitAndroid}>
                        <PrimaryButton btnText={'Save'} btnType="submit" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 mt-8">
          <div className="col-span-3">
            <div className="mb-2">
              <h2 className="text-md lg:text-lg font-semibold">Tutorial Videos</h2>
            </div>
            <div>
              <div className="overflow-auto sidebar-container">
                <div className="border-b border-gray-200 w-[485px] sm:w-full">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {TUTORIAL_VIDEO_TABS.map((tab) => (
                      <div
                        key={tab.name}
                        onClick={() => setSelectedTutorialVideoTab(tab.value)}
                        className={classNames(
                          selectedTutorialVideoTab === tab.value
                            ? 'border-shoorah-secondary dark:text-white text-shoorah-secondary'
                            : 'border-transparent text-gray-500 hover dark:text-white:text-gray-700 hover:border-gray-300',
                          'whitespace-nowrap cursor-pointer py-2 px-1 border-b-2 font-medium text-sm'
                        )}
                      >
                        {tab.name}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <TutorialVideoForm selectedTab={selectedTutorialVideoTab} />
          </div>
        </div>
      </div>
      {openIOSConfirmPopup && (
        <ConfirmPopup
          open={openIOSConfirmPopup}
          setOpen={setIOSConfirmPopup}
          message={'Are you sure you want to change iOS force update details?'}
          setAccepted={(e) => handleIOSSubmit(e)}
        />
      )}
      {openAndroidConfirmPopup && (
        <ConfirmPopup
          open={openAndroidConfirmPopup}
          setOpen={setAndroidConfirmPopup}
          message={'Are you sure you want to change android force update details?'}
          setAccepted={(e) => handleAndroidSubmit(e)}
        />
      )}
      {openMaintenanceModeConfirmPopup && (
        <ConfirmPopup
          open={openMaintenanceModeConfirmPopup}
          setOpen={setMaintenanceModeConfirmPopup}
          message={`Are you sure you want to change maintenance mode of ${maintenanceModeType}?`}
          setAccepted={(e) => handleToggleChange(e)}
          handleNo={() => handleNo(maintenanceModeType)}
        />
      )}
    </>
  );
}

export default Config;

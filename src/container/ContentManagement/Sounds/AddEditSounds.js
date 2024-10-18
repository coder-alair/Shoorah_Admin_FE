import React, { Fragment, useEffect, useRef } from 'react';
import { useState } from 'react';
import Breadcrumb from '../../../component/common/Breadcrumb';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/20/solid';
import { STATUS, MEDITATION_BY } from '../../../utils/constants';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import CommonInput from '../../../component/common/Input/CommonInput';
import CommonTextarea from '../../../component/common/CommonTextarea';
import SecondaryButton from '../../../component/common/Buttons/SecondaryButton';
import MultipleSelect from '../../../component/common/MultipleSelect';
import { Api } from '../../../api';
import {
  MaxCharlimit,
  MaxCharlimitLongText,
  errorToast,
  getFileType,
  getLocalStorageItem,
  successToast
} from '../../../utils/helper';
import Loader from '../../../component/common/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import AddEditSoundVali from '../../../validation/AddEditSoundVali';
import ConfirmPopup from '../../../component/common/modals/ConfirmPopup';
import axios from 'axios';
import Duration from '../../../component/common/Duration';
import FormAudioPlayer from '../../../component/AudioPlayer/FormAudioPlayer';
import LazyLoadImageProp from '../../../component/common/LazyLoadImage';
import ApprovalHistory from '../../../component/ApprovalHistory/ApprovalHistory';
import CustomSelect from '../../../component/common/CustomSelect';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition
} from '@headlessui/react';

export default function AddEditSounds(props) {
  let location = useLocation();
  let propsData = location?.state;
  const captionFile = useRef(null);
  const inputFile = useRef(null);
  const expertFile = useRef(null);
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const [selectedExpert, setSelectedExpert] = useState('');
  const [previewExpert, setPreviewExpert] = useState('');
  const [loader, setLoader] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState([]);
  const [focusListIDs, setFocusListIDs] = useState([]);
  const [focusList, setFocusList] = useState([]);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [audio, setAudio] = useState('');
  const [minutes, setMinutes] = useState(0);
  const [sec, setSec] = useState(0);
  const [error, setError] = useState({});
  const meditationFile = useRef(null);
  const [selectedSound, setSelectedSound] = useState('');
  const [previewSleepImage, setPreviewSleepImage] = useState('');
  const [isExpertImgDeleted, setisExpertImgDeleted] = useState(false);
  const [isView, setIsView] = useState(false);
  const [openConfirmPopupDraft, setOpenConfirmPopupDraft] = useState(false);
  const [openConfirmPopupSave, setOpenConfirmPopupSave] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [srtName, setSrtName] = useState(null);
  const [srtUrl, setSrtUrl] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [expertsList, setExpertsList] = useState([]);
  const [expertsLists, setExpertsLists] = useState([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();
  const [pages, setPages] = useState([
    { name: 'Sleep', href: '/content-management/sounds' },
    { name: 'Add Sleep', href: '/content-management/sounds/add-edit' }
  ]);
  console.log('error', error);
  const [form, setForm] = useState({
    soundBy: 1,
    status: 1,
    soundId: '',
    soundTitle: '',
    description: '',
    approvalStatus: '',
    expertName: '',
    comments: []
  });

  useEffect(() => {
    Api.getCategoriesById(4).then((res) => {
      setCategoriesList(res?.data?.data);
    });
  }, []);

  useEffect(() => {
    const filteredJobs =
      query === ''
        ? expertsLists
        : expertsLists.filter((job) => {
            return job.name.toLowerCase().includes(query.toLowerCase());
          });
    setExpertsList(filteredJobs);
  }, [query]);

  const handleSubmit = (e, fromPopup = false) => {
    e.preventDefault();
    const { isValid, errors } = AddEditSoundVali(
      form,
      selectedCategory,
      selectedFile,
      selectedSound,
      selected
    );
    if (selectedCategory?.length === 0) {
      return (errors.focus = 'Please select the category.');
    }
    setError(errors);
    // sound api

    console.log('isValid', isValid);

    if (isValid) {
      let tempFocusIdArray = selectedCategory.map((data) => {
        return data?.value;
      });

      tempFocusIdArray = [].concat(...tempFocusIdArray);
      setLoader(true);
      if (propsData && !fromPopup) {
        setOpenConfirmPopup(true);
        setLoader(false);
      } else {
        const focusIds = focusListIDs.map((item) => {
          return item.id;
        });
        const payload = {
          soundId: form.soundId,
          soundTitle: form.soundTitle,
          soundUrl: selectedFile?.type ? getFileType(selectedFile) : null,
          description: form.description,
          duration: `${minutes}:${sec}`,

          expertId: selected?.id,
          soundStatus: form.status,
          soundImage: selectedSound?.type ? getFileType(selectedSound) : null,
          focusIds: tempFocusIdArray,
          isDraft: false,
          approvalStatus: parseInt(form.approvalStatus),
          isExpertImageDeleted: isExpertImgDeleted && selectedExpert === '' ? true : false
        };

        Api.addSound(payload)
          .then(async (response) => {
            if (response?.data.meta.code === 1) {
              if (response?.data?.meta?.audioUrl?.uploadURL) {
                await axios.put(response?.data?.meta?.audioUrl?.uploadURL, selectedFile, {
                  headers: {
                    'content-type': `${selectedFile?.type?.split('/')[0]}/${
                      selectedFile?.name?.split('.')[1]
                    }`
                  }
                });
              }
              if (response?.data?.meta?.soundImageUrl?.uploadURL) {
                await axios.put(response?.data?.meta?.soundImageUrl?.uploadURL, selectedSound, {
                  headers: {
                    'content-type': `${selectedSound?.type?.split('/')[0]}/${
                      selectedSound?.name?.split('.')[1]
                    }`
                  }
                });
              }

              successToast(response.data.meta.message);
              navigate('/content-management/sounds', {
                state: { flag: userData?.userType ? 0 : null }
              });
            } else if (response?.data.meta.code === 0) {
              setLoader(false);
              errorToast(response?.data.meta.message);
            } else {
              setLoader(false);
            }
          })
          .finally(() => {
            setLoader(false);
          });
      }
    } else {
      console.log('errors', errors);
      setError(errors);
    }
  };

  const handleDraft = (e, fromPopup = false) => {
    e.preventDefault();

    let tempFocusIdArray = selectedCategory.map((data) => {
      return data?.value;
    });

    tempFocusIdArray = [].concat(...tempFocusIdArray);

    if (!form.soundTitle) {
      return errorToast('Sleep name is required.');
    }

    setLoader(true);
    if (propsData && !fromPopup) {
      setOpenConfirmPopupDraft(true);
      setLoader(false);
    } else {
      const focusIds = focusListIDs.map((item) => {
        return item.id;
      });
      const payload = {
        soundId: form.soundId,
        soundTitle: form.soundTitle,
        soundUrl: selectedFile?.type ? getFileType(selectedFile) : null,
        description: form.description,
        duration: `${minutes}:${sec}`,

        expertId: selected?.id,
        soundStatus: form.status,
        soundImage: selectedSound?.type ? getFileType(selectedSound) : null,
        focusIds: tempFocusIdArray,
        isDraft: true,
        approvalStatus: 0,
        isExpertImageDeleted: isExpertImgDeleted && selectedExpert === '' ? true : false
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === null) {
          delete payload[key];
        }
      });
      Api.addDraftSound(payload)
        .then(async (response) => {
          if (response?.data.meta.code === 1) {
            if (response?.data?.meta?.audioUrl?.uploadURL) {
              await axios.put(response?.data?.meta?.audioUrl?.uploadURL, selectedFile, {
                headers: {
                  'content-type': `${selectedFile?.type?.split('/')[0]}/${
                    selectedFile?.name?.split('.')[1]
                  }`
                }
              });
            }
            if (response?.data?.meta?.soundImageUrl?.uploadURL) {
              await axios.put(response?.data?.meta?.soundImageUrl?.uploadURL, selectedSound, {
                headers: {
                  'content-type': `${selectedSound?.type?.split('/')[0]}/${
                    selectedSound?.name?.split('.')[1]
                  }`
                }
              });
            }

            successToast(response?.data.meta.message);
            navigate('/content-management/sounds', {
              state: { flag: userData?.userType ? 0 : null }
            });
          } else if (response?.data.meta.code === 0) {
            setLoader(false);
            errorToast(response?.data.meta.message);
          } else {
            setLoader(false);
          }
        })
        .finally(() => {
          setLoader(false);
        });
    }

    return;
  };

  const radioHandler = (e) => {
    let { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: parseInt(value)
    }));
  };
  useEffect(() => {
    Api.getFocusNamesList(1).then((response) => {
      setFocusList(response?.data?.data);
    });
  }, []);

  const handleSelectedFocusList = (list) => {
    setFocusListIDs(list);
    if (list?.length > 0) {
      const { errors } = AddEditSoundVali(form, list, selectedFile);
      setError(errors);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    const updatedError = { ...error, [name]: '' };
    setError(updatedError);
    if (
      !(name === 'soundTitle' && value.length > MaxCharlimit) &&
      !(name === 'description' && value.length > MaxCharlimitLongText)
    ) {
      setForm(updatedForm);
    }
  };

  const handleMeditationImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedSound(undefined);
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
          setSelectedSound(e.target.files[0]);
          setError((prevState) => ({
            ...prevState,
            selectedSound: ''
          }));
          const objectUrl = URL.createObjectURL(e.target.files[0]);
          setPreviewSleepImage(objectUrl);
          return () => URL.revokeObjectURL(objectUrl);
        }
      } else {
        setPreviewSleepImage(undefined);
      }
    }
  };

  useEffect(() => {
    let expertsData = [];
    Api.getPodExpertsName().then((res) => {
      setExpertsList(res.data.data);
      setExpertsLists(res.data.data);
      expertsData = res?.data?.data;
    });
    if (propsData) {
      setLoader(true);
      setPages([
        { name: 'Sleep', href: '/content-management/sounds' },
        {
          name: `${propsData?.action === 'view' ? 'View' : 'Edit'} Sleep`,
          href: `/content-management/sounds/${propsData?.action === 'view' ? 'view' : 'add-edit'}`
        }
      ]);
      setIsView(propsData?.action === 'view');
      let arr = [];
      Api.getSoundById(propsData.id).then((response) => {
        if (response?.data?.meta?.code === 1) {
          setLoader(false);
          const soundData = response.data.data;
          soundData?.focus?.map((item) => {
            arr.push({
              id: item?._id,
              name: item.display_name,
              checked: true
            });
          });
          setSelectedFocus(arr);
          const expertName = soundData?.expertName
            ? soundData.expertName
            : soundData?.expertId
            ? expertsList.find((expert) => expert.id === soundData.expertId)?.name
            : '';
          setForm({
            soundId: soundData?.id,
            soundTitle: soundData?.soundTitle,
            description: soundData?.description,
            status: soundData?.soundStatus,
            approvalStatus: soundData?.approvalStatus,
            expertName: expertName,
            comments: soundData?.comments
          });
          setSelected(expertsData?.find((res) => res?.id === soundData?.expertId));
          setSelectedFile(soundData?.soundUrl);
          setPreviewExpert(soundData?.expertImage);
          setSelectedExpert(soundData?.expertImage);
          setSelectedSound(soundData?.soundImage);
          setPreviewSleepImage(soundData?.soundImage);
          setAudio(soundData?.soundUrl);
          setSrtUrl(soundData?.srtUrl);
          setSrtName(soundData?.soundSrtName);
        } else if (response?.code === 401) {
          setLoader(false);
          errorToast(response?.message);
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      });
    }
  }, [propsData, refresh]);

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

  const handleExpertImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedExpert(undefined);
      return;
    }
    if (e?.target?.files[0]) {
      if (!e?.target?.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        errorToast(
          `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid image.`
        );
      } else {
        setSelectedExpert(e.target.files[0]);
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setPreviewExpert(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreviewExpert(undefined);
    }
  };

  const handleCaption = (e) => {
    if (e?.target?.files[0]) {
      if (!e?.target?.files[0].name.match(/\.(srt)$/i)) {
        errorToast(
          `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid caption srt file.`
        );
      } else {
        // setSelectedCaptionFile(e.target.files[0]);

        let payload = {
          srtUrl: e.target.files[0] ? getFileType(e.target.files[0]) : null,
          contentType: 4,
          contentId: form?.soundId
        };

        Api.updateSrtData(payload)
          .then(async (response) => {
            if (response?.data?.meta?.code === 1) {
              if (response?.data?.data?.uploadURL) {
                await axios.put(response?.data?.data?.uploadURL, e.target.files[0], {
                  headers: {
                    'content-type': `${e.target.files[0]?.type?.split('/')[0]}/${
                      e.target.files[0]?.name?.split('.')[1]
                    }`
                  }
                });
                successToast('Caption file updated successfully.');
                setRefresh(refresh + 1);
              }
            } else {
              errorToast('Caption file not updated.');
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {propsData ? (
          <title>Edit Sleep | Shoorah Admin</title>
        ) : (
          <title>Add Sleep | Shoorah Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <div className="bg-white dark:bg-shoorah-darkBgTabColor  dark:text-white rounded-[10px] px-6 py-10">
          <div className="flex-wrap lg:flex gap-2">
            <div className="grid content-center sm:w-full 2xl:w-2/3 lg:w-full lg:gap-5 2xl:gap-10 lg:grid-cols-2">
              <div className="space-y-6 mr-14 w-full">
                <CommonInput
                  id="title"
                  name="soundTitle"
                  value={form.soundTitle}
                  onChange={handleChange}
                  type="text"
                  label="Sleep Name"
                  error={error.soundTitle}
                  isRequired
                  isLengthValidate
                  disabled={isView}
                />
                {!isView && (
                  <div className="mt-4">
                    <label
                      htmlFor="meditationName"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Sleep Image <span className="text-red-400">&#42;</span> (Upload 512px * 512px
                      image) (Max image size 1MB)
                    </label>
                    <div className="mt-1">
                      {previewSleepImage ? (
                        <>
                          <div className="relative">
                            <div
                              onClick={() => meditationFile.current.click()}
                              className="mt-1 cursor-pointer flex justify-between border border-shoorah-secondary px-3 py-2 rounded-3xl"
                            >
                              <p>
                                {selectedSound?.name
                                  ? selectedSound?.name
                                  : previewSleepImage?.split('/')[
                                      previewSleepImage?.split('/')?.length - 1
                                    ]}
                              </p>
                            </div>
                            <input
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              className="hidden"
                              ref={meditationFile}
                              onChange={(e) => handleMeditationImage(e)}
                            />
                            <XMarkIcon
                              className="absolute top-1/2 transform -translate-y-1/2 right-[10px] w-[20px] text-red-500 cursor-pointer"
                              onClick={() => {
                                setisExpertImgDeleted(true);
                                setSelectedSound('');
                                setPreviewSleepImage('');
                              }}
                            />
                          </div>
                          <div className="mx-auto border rounded-lg mt-2 text-center">
                            <LazyLoadImageProp
                              imageSrc={previewSleepImage}
                              className="mx-auto max-h-[250px]"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            className="block w-full rounded-3xl appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-base"
                            type="button"
                            onClick={() => meditationFile.current.click()}
                          >
                            <ArrowUpTrayIcon className="w-[20px] inline mr-3" />
                            Upload
                          </button>
                          <input
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            className="hidden"
                            ref={meditationFile}
                            onChange={(e) => handleMeditationImage(e)}
                          />
                          <span className="error text-xs text-red-400">
                            {error.meditationImage}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="error text-xs text-red-400">{error.selectedSound}</span>
                  </div>
                )}
                {isView && (
                  <div className="mt-4">
                    <label
                      htmlFor="meditationName"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Sleep Image
                    </label>
                    <div className="mx-auto border rounded-lg mt-2 text-center">
                      <LazyLoadImageProp
                        imageSrc={previewSleepImage}
                        className="mx-auto max-h-[250px]"
                      />
                    </div>
                  </div>
                )}
                <div className="mt-1">
                  <CommonTextarea
                    rows={4}
                    name="description"
                    id="description"
                    label="Description"
                    isRequired
                    isLengthValidate
                    value={form.description}
                    onChange={handleChange}
                    error={error.description}
                    className="block w-full rounded-2xl appearance-none border border-gray-300 px-4 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-sm"
                    disabled={isView}
                  />
                </div>
                <div className={`${isView ? 'cursor-default' : 'cursor-pointer'}`}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Status
                  </label>
                  <fieldset className="mt-4">
                    <div className="flex space-x-4">
                      {STATUS.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            id={item.name}
                            name="status"
                            type="radio"
                            value={item.value}
                            onChange={(e) => radioHandler(e)}
                            disabled={isView}
                            checked={item.value === form.status}
                            className="h-5 w-5 border-gray-300 text-shoorah-primary focus:ring-shoorah-primary cursor-pointer"
                          />
                          <label
                            htmlFor={item.name}
                            className="ml-3 block text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
                          >
                            {item.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="space-y-6 w-full mt-6 lg:mt-0">
                <div>
                  <CustomSelect
                    data={categoriesList}
                    selected={selectedCategory}
                    setSelected={setSelectedCategory}
                    // selectedFocus={selectedFocus}
                    // handleSelectedFocusList={handleSelectedFocusList}
                    label={'Select Categories'}
                    disabled={isView}
                    isMultiple={true}
                  />
                  <span className="error text-xs text-red-400">{error.focus}</span>
                </div>
                {isView && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">
                      Sleep Audio
                    </label>
                    <div className="relative">
                      <FormAudioPlayer audio={audio} setMin={setMinutes} setSec={setSec} />
                    </div>
                  </div>
                )}
                {!isView && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">
                      Upload Audio <span className="text-red-400">&#42;</span>
                    </label>
                    {audio ? (
                      <>
                        <div className="relative">
                          <div
                            onClick={() => inputFile.current.click()}
                            className="mt-1 cursor-pointer flex justify-between border border-shoorah-secondary px-3 py-2 rounded-3xl"
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
                            accept=".mp3,audio/*"
                            onClick={(e) => {
                              e.target.value = null;
                            }}
                          />
                          <XMarkIcon
                            className="absolute top-1/2 transform -translate-y-1/2 right-[10px] w-[20px] text-red-500 cursor-pointer"
                            onClick={removeFile}
                          />
                        </div>
                        <FormAudioPlayer audio={audio} setMin={setMinutes} setSec={setSec} />
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
                            onClick={(e) => {
                              e.target.value = null;
                            }}
                          />
                        </div>
                        <span className="error text-xs text-red-400">{error.soundFile}</span>
                      </>
                    )}
                  </div>
                )}

                {srtName && (
                  <div className="flex gap-3">
                    <button
                      // type="button"
                      // onClick={() => inputFile.current.click()}
                      className="block w-full rounded-3xl appearance-none border border-gray-300
     px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none
     focus:ring-shoorah-primary sm:text-base"
                    >
                      <a href={srtUrl} className="text-shoorah-primary">
                        Download Caption file
                        <ArrowDownTrayIcon className="w-[20px] inline ml-3" />
                      </a>
                    </button>
                    <button
                      type="button"
                      onClick={() => captionFile.current.click()}
                      className="block w-full rounded-3xl appearance-none border border-gray-300
     px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none
     focus:ring-shoorah-primary sm:text-base"
                    >
                      <a className="text-shoorah-primary">
                        Update Caption file
                        <ArrowUpTrayIcon className="w-[20px] inline ml-3" />
                      </a>
                    </button>

                    <input
                      type="file"
                      className="bg-black hidden"
                      ref={captionFile}
                      onChange={(e) => handleCaption(e)}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                      accept=".srt"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="meditationName"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Duration
                  </label>
                  <Duration min={minutes} sec={sec} setSec={setSec} setMin={setMinutes} disabled />
                </div>
                <div className={`${isView ? 'cursor-default' : 'cursor-pointer'}`}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white pb-5">
                    Expert
                  </label>
                  <Combobox
                    value={selected?.name}
                    onChange={(value) => {
                      setSelected(value);
                      // setJob(value);
                    }}
                  >
                    <div className="relative w-full pr-4 overflow-hidden outline-none appearance-none bg-transparent text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none rounded-[3rem] border px-1">
                      <ComboboxInput
                        className={
                          'w-full capitalize outline-none appearance-none rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 '
                        }
                        placeholder="Select Meditation By"
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
                        {expertsList.length &&
                          expertsList.map((job) => (
                            <ComboboxOption
                              key={job?.id}
                              value={job}
                              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none"
                            >
                              <CheckIcon className="invisible size-4 fill-white " />
                              <div className="text-sm/6">{job?.name}</div>
                            </ComboboxOption>
                          ))}
                      </ComboboxOptions>
                    </Transition>
                  </Combobox>
                  <span className="error text-xs text-red-400">{error.expertId}</span>
                </div>
              </div>
            </div>
            {!isView && (
              <div className="grid content-center 2xl:w-2/3 lg:w-full lg:mt-3 lg:gap-10 2xl:gap-20 lg:grid-cols-1">
                <div className="space-y-6 w-full mt-6 lg:mt-0 flex justify-end">
                  <div className="text-right flex gap-x-4">
                    <div className="lg:block hidden">
                      <SecondaryButton btnText="Cancel" btnType="button" />
                    </div>
                    <button
                      onClick={(e) => setOpenConfirmPopupDraft(true)}
                      id="draft"
                      className={`${
                        false
                          ? 'bg-gray-300'
                          : 'border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary'
                      } rounded-3xl py-2 sm:py-3 px-10 whitespace-nowrap text-sm font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2`}
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={(e) => setOpenConfirmPopupSave(true)}
                      className="border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary rounded-3xl py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2"
                    >
                      {userData?.userType ? 'Submit For Approval' : 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {isView && form?.comments?.length > 0 && (
            <ApprovalHistory data={form?.comments} title="View" />
          )}
        </div>
      </div>
      {openConfirmPopupSave && (
        <ConfirmPopup
          open={openConfirmPopupSave}
          setOpen={setOpenConfirmPopupSave}
          message={'Are you sure you want to update sleep details?'}
          setAccepted={(e) => handleSubmit(e, true)}
          handleNo={setOpenConfirmPopupSave}
        />
      )}
      {openConfirmPopupDraft && (
        <ConfirmPopup
          open={openConfirmPopupDraft}
          setOpen={setOpenConfirmPopupDraft}
          message={'Are you sure you want to update sleep details?'}
          setAccepted={(e) => handleDraft(e, true)}
        />
      )}
    </>
  );
}

AddEditSounds.propTypes = {
  location: PropTypes.any
};

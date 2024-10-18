import React, { useEffect, useState, useRef, Fragment } from 'react';
import Breadcrumb from '../../../component/common/Breadcrumb';
import Duration from '../../../component/common/Duration';
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/20/solid';
import { STATUS } from '../../../utils/constants';

import { Api } from '../../../api';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import CommonInput from '../../../component/common/Input/CommonInput';
import CommonTextarea from '../../../component/common/CommonTextarea';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmPopup from '../../../component/common/modals/ConfirmPopup';
import AddEditMeditationVali from '../../../validation/AddEditMeditationVali';
import {
  MaxCharlimit,
  MaxCharlimitLongText,
  errorToast,
  getFileType,
  getLocalStorageItem,
  successToast
} from '../../../utils/helper';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition
} from '@headlessui/react';
import Loader from '../../../component/common/Loader';
import SecondaryButton from '../../../component/common/Buttons/SecondaryButton';
import axios from 'axios';
import FormAudioPlayer from '../../../component/AudioPlayer/FormAudioPlayer';
import LazyLoadImageProp from '../../../component/common/LazyLoadImage';
import ApprovalHistory from '../../../component/ApprovalHistory/ApprovalHistory';
import CustomSelect from '../../../component/common/CustomSelect';

export default function AddEditMeditation(props) {
  let location = useLocation();
  let propsData = location?.state;
  const navigate = useNavigate();
  const inputFile = useRef(null);
  const captionFile = useRef(null);
  // const expertFile = useRef(null);
  const meditationFile = useRef(null);
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  //const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [sec, setSec] = useState(0);
  const [error, setError] = useState({});
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [audio, setAudio] = useState('');
  const [selectedExpert, setSelectedExpert] = useState('');
  const [previewExpert, setPreviewExpert] = useState('');
  const [selectedMeditation, setSelectedMeditation] = useState('');
  const [previewMeditation, setPreviewMeditation] = useState('');
  const [loader, setLoader] = useState(false);
  const [isExpertImgDeleted, setisExpertImgDeleted] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState([]);
  const [focusListIDs, setFocusListIDs] = useState([]);
  const [isView, setIsView] = useState(false);
  const [openConfirmPopupDraft, setOpenConfirmPopupDraft] = useState(false);
  const [openConfirmPopupSave, setOpenConfirmPopupSave] = useState(false);
  const [srtName, setSrtName] = useState(null);
  const [srtUrl, setSrtUrl] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState({});
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [expertsList, setExpertsList] = useState([]);
  const [expertsLists, setExpertsLists] = useState([]);

  const [pages, setPages] = useState([
    { name: 'Add Meditation', href: '/content-management/meditation/add-edit' }
  ]);
  const [form, setForm] = useState({
    meditationId: '',
    meditationTitle: '',
    description: '',
    meditationType: 1,
    meditationBy: 1,
    status: 1,
    approvalStatus: '',
    expertName: '',
    comments: []
  });
  console.log('selected', selected);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    const updatedError = { ...error, [name]: '' };
    setError(updatedError);
    if (
      !(name === 'meditationTitle' && value.length > MaxCharlimit) &&
      !(name === 'description' && value.length > MaxCharlimitLongText)
    ) {
      setForm(updatedForm);
    }
  };

  const handleSubmit = (e, fromPopup = false) => {
    e.preventDefault();

    let tempFocusIdArray = selectedCategory.map((data) => {
      return data?.value;
    });

    tempFocusIdArray = [].concat(...tempFocusIdArray);
    const { isValid, errors } = AddEditMeditationVali(
      form,
      // focusListIDs,
      selectedCategory,
      selectedFile,
      selectedMeditation,
      selected
    );
    if (isValid) {
      if (propsData && !fromPopup) {
        setOpenConfirmPopupSave(true);
      } else {
        setLoader(true);
        const focusIds = focusListIDs.map((item) => {
          return item.id;
        });
        const payload = {
          meditationId: form.meditationId,
          meditationName: form.meditationTitle,
          meditationType: form.meditationType,
          description: form.description,
          isDraft: false,
          meditationUrl: selectedFile?.type ? getFileType(selectedFile) : null,
          focusIds: tempFocusIdArray,
          meditationImage: selectedMeditation?.type ? getFileType(selectedMeditation) : null,

          duration: `${minutes}:${sec}`,
          meditationStatus: form.status,
          expertId: selected.id,
          approvalStatus: parseInt(form.approvalStatus),
          isExpertImageDeleted: isExpertImgDeleted && selectedExpert === '' ? true : false
        };

        Api.addMeditation(payload)
          .then(async (response) => {
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
              if (response?.data?.meta?.meditationImageUrl?.uploadURL) {
                await axios.put(
                  response?.data?.meta?.meditationImageUrl?.uploadURL,
                  selectedMeditation,
                  {
                    headers: {
                      'content-type': `${selectedMeditation?.type?.split('/')[0]}/${
                        selectedMeditation?.name?.split('.')[1]
                      }`
                    }
                  }
                );
              }

              successToast(response.data.meta.message);

              navigate('/content-management/meditation', {
                state: { flag: userData?.userType ? 0 : null }
              });
            } else if (response?.data?.meta?.code === 0) {
              setLoader(false);
              errorToast(response.data.meta.message);
            } else {
              setLoader(false);
            }
          })
          .finally(() => {
            setLoader(false);
          });
      }
    } else {
      setError(errors);
    }
  };

  const handleDraft = (e, fromPopup = false) => {
    e.preventDefault();

    let tempFocusIdArray = selectedCategory.map((data) => {
      return data?.value;
    });

    tempFocusIdArray = [].concat(...tempFocusIdArray);

    if (!form.meditationTitle) {
      return errorToast('Meditation name is required.');
    }

    if (propsData && !fromPopup) {
      setOpenConfirmPopupDraft(true);
    }

    // draft api
    const payload = {
      meditationId: form.meditationId,
      meditationName: form.meditationTitle,
      meditationType: form.meditationType,
      description: form.description,
      meditationUrl: selectedFile?.type ? getFileType(selectedFile) : '',
      focusIds: tempFocusIdArray,
      meditationImage: selectedMeditation?.type ? getFileType(selectedMeditation) : '',

      expertId: selected.id,
      duration: minutes !== 0 && sec !== 0 ? `${minutes}:${sec}` : `${minutes}:${sec}`,
      meditationStatus: form.status,
      approvalStatus: form.approvalStatus ? parseInt(form.approvalStatus) : 0,
      isExpertImageDeleted: isExpertImgDeleted && selectedExpert === '' ? true : false,
      isDraft: true
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === null) {
        delete payload[key];
      }
    });

    Api.addDraftMeditation(payload)
      .then(async (response) => {
        if (response?.data?.meta?.code === 1) {
          if (selectedFile !== '' && response?.data?.meta?.audioUrl?.uploadURL) {
            await axios.put(response?.data?.meta?.audioUrl?.uploadURL, selectedFile, {
              headers: {
                'content-type': `${selectedFile?.type?.split('/')[0]}/${
                  selectedFile?.name?.split('.')[1]
                }`
              }
            });
          }
          if (selectedMeditation !== '' && response?.data?.meta?.meditationImageUrl?.uploadURL) {
            await axios.put(
              response?.data?.meta?.meditationImageUrl?.uploadURL,
              selectedMeditation,
              {
                headers: {
                  'content-type': `${selectedMeditation?.type?.split('/')[0]}/${
                    selectedMeditation?.name?.split('.')[1]
                  }`
                }
              }
            );
          }

          successToast('Meditation Draft Successfully');

          navigate('/content-management/meditation', {
            state: { flag: userData?.userType ? 0 : null }
          });
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response.data.meta.message);
        } else {
          setLoader(false);
        }
      })
      .finally(() => {
        setLoader(false);
      });

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
    Api.getCategoriesById(3).then((res) => {
      setCategoriesList(res?.data?.data);
    });
  }, []);

  useEffect(() => {
    let expertsData = [];
    Api.getPodExpertsName().then((res) => {
      setExpertsList(res.data.data);
      setExpertsLists(res.data.data);
      expertsData = res.data.data;
    });

    if (propsData) {
      setLoader(true);
      setPages([
        { name: 'Meditation', href: '/content-management/meditation' },
        {
          name: `${propsData?.action === 'view' ? 'View' : 'Edit'} Meditation`,
          href: `/content-management/meditation/${
            propsData?.action === 'view' ? 'view' : 'add-edit'
          }`
        }
      ]);
      setIsView(propsData?.action === 'view');
      let arr = [];
      Api.getMeditationById(propsData.id).then((response) => {
        if (response?.data?.meta?.code === 1) {
          setLoader(false);
          const meditationData = response?.data?.data;
          setAudio(meditationData.meditationUrl);
          setSelectedFile(meditationData.meditationUrl);
          setSelectedExpert(meditationData?.expertImage ? meditationData?.expertImage : '');
          setSelectedMeditation(meditationData?.meditationImage);
          setPreviewExpert(meditationData?.expertImage);
          setPreviewMeditation(meditationData?.meditationImage);
          setSelected(expertsData?.find((res) => res?.id === meditationData?.expertId));

          meditationData?.focus?.for((item) => {
            arr.push({
              id: item?._id,
              name: item.display_name,
              checked: true
            });
          });
          setSelectedFocus(arr);
          const expertName = meditationData?.expertName
            ? meditationData.expertName
            : meditationData?.expertId
            ? expertsList.find((expert) => expert.id === meditationData.expertId)?.name
            : '';
          setForm({
            meditationId: meditationData?.id,
            meditationTitle: meditationData?.meditationName,
            description: meditationData?.description,
            meditationType: meditationData?.meditationType,
            status: meditationData?.meditationStatus,
            approvalStatus: meditationData?.approvalStatus,
            expertName: expertName,
            comments: meditationData?.comments
          });
          setMinutes(parseInt(meditationData?.duration?.split(':')[0]));
          setSec(parseInt(meditationData?.duration?.split(':')[1]));
          setSrtUrl(meditationData?.srtUrl);
          setSrtName(meditationData?.meditationSrtName);
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
  }, [propsData, refresh, expertsList]);

  useEffect(() => {
    const filteredJobs =
      query === ''
        ? expertsLists
        : expertsLists.filter((job) => {
            return job.name.toLowerCase().includes(query.toLowerCase());
          });
    console.log('filteredJobs', filteredJobs);
    setExpertsList(filteredJobs);
  }, [query, expertsLists]);

  // const handleSelectedFocusList = (list) => {
  //   setFocusListIDs(list);
  //   if (list?.length > 0) {
  //     const { errors } = AddEditMeditationVali(form, list, selectedFile ? selectedFile : '');
  //     setError(errors);
  //   }
  // };
  // const handleExpertImage = (e) => {
  //   if (!e.target.files || e.target.files.length === 0) {
  //     setSelectedExpert(undefined);
  //     return;
  //   }
  //   if (e?.target?.files[0]) {
  //     if (!e?.target?.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
  //       errorToast(
  //         `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid image.`
  //       );
  //     } else {
  //       setSelectedExpert(e.target.files[0]);
  //       const objectUrl = URL.createObjectURL(e.target.files[0]);
  //       setPreviewExpert(objectUrl);
  //       setError((prevState) => ({
  //         ...prevState,
  //         meditationImage: ''
  //       }));
  //       return () => URL.revokeObjectURL(objectUrl);
  //     }
  //   } else {
  //     setPreviewExpert(undefined);
  //   }
  // };

  const handleMeditationImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedExpert(undefined);
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
          setSelectedMeditation(e.target.files[0]);
          const objectUrl = URL.createObjectURL(e.target.files[0]);
          setPreviewMeditation(objectUrl);
          return () => URL.revokeObjectURL(objectUrl);
        }
      } else {
        setPreviewMeditation(undefined);
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
          contentType: 3,
          contentId: form?.meditationId
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
          <title>Edit Meditation | Shoorah Admin</title>
        ) : (
          <title>Add Meditation | Shoorah Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />

      <div className="mt-6 px-3">
        <div className="bg-white dark:bg-shoorah-darkBgTabColor  dark:text-white rounded-[10px] px-6 py-10">
          <div className="flex-wrap lg:flex gap-2">
            <div className="grid content-center sm:w-full 2xl:w-2/3 lg:w-full lg:gap-5 2xl:gap-10 lg:grid-cols-2">
              <div className="space-y-6 mr-14 w-full">
                <CommonInput
                  id="name"
                  name="meditationTitle"
                  value={form.meditationTitle}
                  onChange={handleChange}
                  type="text"
                  label=" Meditation Name"
                  error={error.meditationTitle}
                  isLengthValidate
                  isRequired
                  disabled={isView}
                />
                {!isView && (
                  <div className="mt-4">
                    <label
                      htmlFor="meditationName"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Meditation Image
                      <span className="text-red-400">&#42;</span> (Upload 512px * 512px image) (Max
                      image size 1MB)
                    </label>
                    <div className="mt-1">
                      {previewMeditation ? (
                        <>
                          <div className="relative">
                            <div
                              onClick={() => meditationFile.current.click()}
                              className="mt-1 cursor-pointer flex justify-between border px-3 py-2 rounded-3xl"
                            >
                              <p>
                                {selectedMeditation?.name
                                  ? selectedMeditation?.name
                                  : previewMeditation?.split('/')[
                                      previewMeditation?.split('/')?.length - 1
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
                                setSelectedMeditation('');
                                setPreviewMeditation('');
                              }}
                            />
                          </div>
                          <div className="mx-auto border rounded-lg mt-2 text-center">
                            <LazyLoadImageProp
                              imageSrc={previewMeditation}
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
                  </div>
                )}
                {isView && (
                  <div className="mt-4">
                    <label
                      htmlFor="meditationName"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Meditation Image
                    </label>
                    <div className="mx-auto border rounded-lg mt-2 text-center">
                      <LazyLoadImageProp
                        imageSrc={previewMeditation}
                        className="mx-auto max-h-[250px]"
                      />
                    </div>
                  </div>
                )}
                <CommonTextarea
                  rows={4}
                  name="description"
                  id="description"
                  label="Description"
                  isRequired
                  value={form.description}
                  onChange={handleChange}
                  error={error.description}
                  className="block w-full rounded-2xl appearance-none border border-gray-300 px-4 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-sm"
                  isLengthValidate
                  disabled={isView}
                />

                <div className={`${isView ? 'cursor-default' : 'cursor-pointer'}`}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Status
                  </label>
                  <fieldset className="mt-4">
                    <div className="flex space-x-4">
                      {STATUS.map((status, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            id={status.name}
                            name="status"
                            type="radio"
                            value={status.value}
                            onChange={(e) => radioHandler(e)}
                            disabled={isView}
                            checked={status.value === form.status}
                            className="h-5 w-5 border-gray-300 text-shoorah-primary focus:ring-shoorah-primary"
                          />
                          <label
                            htmlFor={status.name}
                            className="ml-3 block text-sm font-medium text-gray-700 dark:text-white"
                          >
                            {status.name}
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
                      Meditation Audio
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
                            className="mt-1 cursor-pointer flex justify-between border px-3 py-2 rounded-3xl"
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
                      {/* <a href="#" className="text-shoorah-primary"> */}
                      Update Caption file
                      <ArrowUpTrayIcon className="w-[20px] inline ml-3" />
                      {/* </button> </a> */}
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
                  {console.log('error', error)}
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
                      onClick={handleSubmit}
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
          message={'Are you sure you want to update meditation details?'}
          setAccepted={(e) => handleSubmit(e, true)}
        />
      )}
      {openConfirmPopupDraft && (
        <ConfirmPopup
          open={openConfirmPopupDraft}
          setOpen={setOpenConfirmPopupDraft}
          message={'Are you sure you want to update meditation details?'}
          setAccepted={(e) => handleDraft(e, true)}
        />
      )}
    </>
  );
}

AddEditMeditation.propTypes = {
  location: PropTypes.any
};

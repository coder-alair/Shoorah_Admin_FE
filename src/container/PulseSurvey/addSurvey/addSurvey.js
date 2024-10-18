import { Dialog, Transition } from '@headlessui/react';
import { ArrowUpTrayIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import PlusIcon from '../../../assets/images/PlusIcon.svg';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import React, { Fragment, useEffect, useRef, useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { SurveyContext } from '../../../context/PreviewSurveyContext';
import { SURVEY_CONSTANT } from '../../../core/web.constants';

import {
  errorToast,
  getPathForSurvey,
  isSuperAdmin,
  MaxCharlimit,
  successToast,
  isSuperAndSubAdmin,
  isCopanySuperOrSubAdmin
} from '../../../utils/helper';
import PrimaryButton from '../../../component/common/Buttons/PrimaryButton';
import CommonInput from '../../../component/common/Input/CommonInput';
import ProgressBar from '../../../component/common/Input/ProgressBar';
import CustomInput from '../../../component/common/Input/CustomInput';
import CustomCheckBox from '../../../component/common/CustomCheckBox';
import { Api } from '../../../api';
import LazyLoadImageProp from '../../../component/common/LazyLoadImage';
import { CompanyApi } from '../../../api/companyApi';
import Loader from '../../../component/common/Loader';

const AddEditPulseSurvey = () => {
  const { surveyMeta, setSurveyMeta } = useContext(SurveyContext);
  const navigate = useNavigate();
  const [error, setError] = useState({
    surveyTitle: '',
    surveyTime: ''
  });
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [bulkAnswer, setBulkAnswer] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [surveyType, setSurveyType] = useState('save');
  const [newCategory, setNewCategory] = useState({
    name: 'surveyCategory',
    value: '',
    disabled: true
  });
  const [fileData, setFileData] = useState({
    logo: null,
    image: null
  });
  const [form, setForm] = useState({
    surveyTitle: '',
    surveyTime: '',
    surveyCategory: ''
  });
  const [otherDetails, setOtherDetails] = useState({
    area: [],
    time: '',
    audience: [],
    duration: 0,
    template_category: 3
  });
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  //tempId, surveyFromTemplate, surveyId, preview, null to create new survey
  const tempId = searchParams.get('tempId');
  const type = searchParams.get('type');
  console.log('🚀 ~ AddEditPulseSurvey ~ type:', type);
  const surveyFromTemplate = searchParams.get('surveyFromTemplate');
  const surveyId = searchParams.get('id');
  const isPreview = searchParams.get('preview');
  const isDraft = searchParams.get('isDraft');
  // const templateSurveyId = searchParams.get('template');
  // const isTemplateEdit = searchParams.get('editTemplate');
  // const templateId  = searchParams.get('templateId');
  const logoFile = useRef(null);
  const [selectedLogo, setSelectedLogo] = useState('');
  const [previewLogo, setPreviewLogo] = useState('');
  const imageFile = useRef(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [saveType, setSaveType] = useState('');
  const [isLogoUpdated, setIsLogoUpdated] = useState(false);
  const [isImageUpdated, setIsImageUpdated] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData'));
  //if there is no survey Id or template Id then it is a new survey
  const isEdit = Boolean(surveyId || tempId);
  const [loading, setLoading] = useState(isEdit);

  const [questionsList, setQuestionsList] = useState(
    isEdit
      ? []
      : [
          {
            id: new Date().getTime(),
            quid: '',
            question: '',
            question_error: false,
            question_type: 'mcq',
            options: [
              {
                id: new Date().getTime(),
                value: '',
                error: false,
                options_status: 0
              }
            ],
            isOtherOption: false,
            isNoneOfTheAbove: false,
            skipable: false
          }
        ]
  );

  console.log('🚀 ~ AddEditPulseSurvey ~ questionsList:', questionsList);
  useEffect(() => {
    let getCategories;
    //load template data and add this to form
    if (tempId !== null) {
      setLoading(true);
      const apiResponse = isSuperAndSubAdmin() ? Api.getPulseSurveyById(tempId) : null;
      apiResponse
        .then((res) => res.data)
        .then((response) => onLoadDataToForm(response))
        .finally(() => setLoading(false));
    }
    //load template data and add this to form
    if (surveyId !== null) {
      setLoading(true);
      const apiResponse = isSuperAndSubAdmin()
        ? Api.getPulseSurveyById(surveyId)
        : CompanyApi.getPulseSurveyByIdB2b(surveyId);
      apiResponse
        .then((res) => res.data)
        .then((response) => onLoadDataToForm(response))
        .finally(() => setLoading(false));
    }
    //need to only fetch template data and add this to form without any id
    if (surveyFromTemplate !== null) {
      setLoading(true);
      const apiResponse = isSuperAndSubAdmin()
        ? Api.getPulseSurveyById(surveyFromTemplate)
            .then((res) => res.data)
            .then((response) => onLoadDataToForm(response))
            .finally(() => setLoading(false))
        : null;
    }

    //fetching Surveys categories
    if (userData?.userType === 0 || userData?.userType === 1) {
      getCategories = Api.getPulseSurveyCategories();
    } else if (userData?.userType === 3 || userData?.userType === 4) {
      getCategories = CompanyApi.getPulseSurveyCategoriesB2b();
    }
    getCategories.then((res) => setCategoryList(res?.data?.data));
  }, [surveyFromTemplate, surveyId, tempId, userData?.userType]);

  const handleAddCategory = (e) => {
    setOpenCategory(false);
    const data = { categoryName: newCategory.value };
    const addCategory = isSuperAndSubAdmin()
      ? Api.addEditPulseSurveyCategory(data)
      : CompanyApi.addEditPulseSurveyCategoryB2b(data);
    addCategory.then((res) => {
      if (res?.status === 200) {
        const getCategoriesValue = isSuperAndSubAdmin()
          ? Api.getPulseSurveyCategories(data)
          : CompanyApi.getPulseSurveyCategoriesB2b(data);
        getCategoriesValue.then((res) => setCategoryList(res?.data?.data));
        setNewCategory({
          name: 'surveyCategory',
          value: '',
          error: true
        });
        successToast(res?.data?.meta?.message);
      }
    });

    //
  };

  const handleFileChange = (event, fileType) => {
    const selectedFile = event.target.files[0];
    setFileData((prevFileData) => ({
      ...prevFileData,
      [fileType]: selectedFile
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setError((prevError) => ({
      ...prevError,
      surveyTitle: value?.trim() === '' ? 'Please Enter Pulse Survey Title' : ''
    }));
    if (!(name === 'surveyTitle' && value?.length > MaxCharlimit)) {
      setForm(updatedForm);
    }
  };

  const handleInputChange = (questionId, optionId, e) => {
    setQuestionsList((prevList) => {
      const newList = [...prevList];
      const qId = newList.findIndex((q) => q.id === questionId);

      if (qId !== -1) {
        const optionInd = newList[qId].options.findIndex((o) => o.id === optionId);

        if (optionInd !== -1) {
          newList[qId].options[optionInd].value = e.target.value;

          if (newList[qId].options[optionInd].value?.trim() === '') {
            newList[qId].options[optionInd].error = true;
          } else {
            newList[qId].options[optionInd].error = false;
          }
        }
      }

      return newList;
    });
  };

  const handleAddInput = (Id) => {
    setQuestionsList((prevList) => {
      const newList = [...prevList];
      const question = newList[Id];
      question.options.push({
        id: new Date().getTime(),
        value: '',
        error: false,
        options_status: 0
      });
      return newList;
    });
  };

  const handleRemoveInput = (questionId, optionId) => {
    setQuestionsList((prevList) => {
      const newList = [...prevList];
      const question = newList.find((q) => q.id === questionId);
      if (question) {
        question.options = question.options.filter((option) => option.id !== optionId);
      }
      return newList;
    });
  };

  const handleQuestions = () => {
    setQuestionsList((prevList) => [
      ...prevList,
      {
        id: new Date().getTime(),
        quid: '',
        question: '',
        question_type: 'mcq',
        options: [
          {
            id: new Date().getTime(),
            value: '',
            error: false,
            options_status: 0
          }
        ],
        isOtherOption: false,
        isNoneOfTheAbove: false,
        skipable: false
      }
    ]);
  };
  useEffect(() => {
    if (surveyMeta) {
      surveyMeta._id
        ? onLoadDataToForm({ data: surveyMeta })
        : onLoadDataToFromForPreview(surveyMeta);
    }
  }, [isPreview, surveyMeta]);

  // useEffect(() => {
  //   if (isEdit) {

  //   }
  // }, [isEdit, surveyId]);
  const onLoadDataToFromForPreview = (data) => {
    const { questionsList, type, surveyData, images, other } = data;
    const removeOptions = (questions) => {
      return questions.map((item) => {
        const options = item.options.filter(
          (opt) => opt.value !== 'other' && opt.value !== 'None of the above'
        );
        return { ...item, options };
      });
    };

    // Remove "other" and "none of the above" options from questionsList
    const updatedQuestionsList = removeOptions(questionsList);
    setQuestionsList(updatedQuestionsList);
    setOtherDetails(other);
    setForm(surveyData);
    setPreviewLogo(data?.previewLogo);
    setPreviewImage(data?.previewImage);
    setSurveyType(type);
    setSelectedLogo(data?.logo);
    setSelectedImage(data?.image);
  };

  const onLoadDataToForm = (response) => {
    const { data: element } = response || {};

    setOtherDetails({
      time: element?.notifyTime || '',
      area: element?.surveyArea || [],
      duration: element?.surveyDuration || 0,
      departments: element?.departments || [],
      template_category: element?.templateCategory || 'B2B'
    });

    setForm({
      surveyTitle: element?.surveyTitle || '',
      surveyCategory: element?.surveyCategory || ''
    });

    setPreviewLogo(element?.surveyLogo);
    setPreviewImage(element?.surveyImage);

    const initialQuestionsList = element?.questions?.map((question) => {
      const questionKey = 'question-id-' + new Date().getTime() + '-' + question?._id;
      const optionKey = questionKey + '-';
      let isOtherOption, isNoneOfTheAbove;
      const options = question?.options
        ?.map((option) => {
          return {
            error: false,
            value: option,
            options_status: '',
            id: optionKey + '-' + new Date().getTime() + '-' + option?._id
          };
        })
        .filter(Boolean);
      return {
        id: questionKey,
        quid: question?._id,
        question: question?.title,
        question_type: question?.question_type,
        options,
        isOtherOption,
        isNoneOfTheAbove,
        skipable: question?.skipable
      };
    });

    setQuestionsList(initialQuestionsList);
  };

  const handleQuestionsChange = (e, id) => {
    setQuestionsList((prevList) =>
      prevList.map((item) =>
        item.id === id
          ? {
              ...item,
              [e.target.name]: e.target.value,
              question_error: e.target.value?.trim() === '' ? true : false
            }
          : item
      )
    );
  };

  const handleBoolQuestionsChange = (id, name, val) => {
    setQuestionsList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, [name]: !val } : item))
    );
  };

  const handleValidation = (type = 'save') => {
    setSaveType(type);
    const isSurveyTitleValid = form?.surveyTitle?.trim() !== '';
    if (!isSurveyTitleValid) {
      setError((prevError) => ({ ...prevError, surveyTitle: 'Please Enter Pulse Survey Title' }));
    } else {
      setError((prevError) => ({ ...prevError, surveyTitle: '' }));
    }

    const updatedQuestionsList = questionsList.map((item) => {
      const options = [...item.options];
      if (item?.isOtherOption) {
        options.push({
          error: false,
          value: 'Other',
          options_status: '',
          id: item.id + '-other'
        });
      }
      if (item?.isNoneOfTheAbove) {
        options.push({
          error: false,
          value: 'None of the above',
          options_status: '',
          id: item.id + '-other'
        });
      }
      return {
        ...item,
        options,
        isOtherOption: false,
        isNoneOfTheAbove: false,
        skipable: false
      };
    });

    const questionsValidation = questionsList.map((item) => {
      item.question_error = item.question?.trim() === '';
      if (item.question_error) {
        return false;
      }
      item.options.forEach((opt) => {
        if (opt.value?.trim() === '') opt.error = true;
      });
      const optionsValid = item.options.every((opt) => opt.value?.trim() !== '');
      return optionsValid;
    });

    const isAllQuestionsValid = questionsValidation.every((res) => res === true);
    // Final validation check
    const isAllFieldOk = isSurveyTitleValid && isAllQuestionsValid;

    if (!isAllFieldOk) {
      errorToast('Please enter required details!');
      return;
    }

    if (isAllFieldOk) {
      const surveyData = {
        surveyId: tempId || surveyId || '',
        other: otherDetails,
        logo: selectedLogo,
        previewLogo: previewLogo,
        image: selectedImage,
        previewImage: previewImage,
        surveyData: form,
        type: type,
        saveType: saveType,
        isSurveyImageDeleted: isImageUpdated,
        isSurveyLogoDeleted: isLogoUpdated,
        status: determineStatus(type),
        questionsList: updatedQuestionsList
      };
      setSurveyMeta(surveyData);
      navigate(getPathForSurvey('/preview/pulse-surveys'));
    }
  };
  const determineStatus = (type) => {
    if (type === 'template') {
      return isSuperAdmin() ? 1 : 0;
    } else if (type === 'draft') {
      return 0;
    } else {
      return userData?.userType === 0 || userData?.userType === 3 ? 1 : 0;
    }
  };

  const saveAsDraft = () => {
    handleValidation('draft');
  };

  const handleSaveAsTemplate = () => {
    handleValidation('template');
  };

  const createSurveyButton = () => {
    handleValidation('save');
  };

  const handleCancelQuestions = (Id) => {
    if (questionsList?.length > 1) {
      setQuestionsList((prevList) => prevList.filter((_, index) => index !== Id));
    }
  };
  const handleBulkAnswer = () => {
    setOpen(false);

    if (bulkAnswer) {
      const lines = bulkAnswer
        ?.trim()
        .split('\n')
        .filter((line) => line.trim() !== '');

      // setBulkAnswer(lines);

      setQuestionsList((prevList) =>
        prevList?.map((question) =>
          question.id === currentQuestion.id
            ? {
                ...question,
                options: [
                  ...question.options,
                  ...lines.map((line, i) => ({
                    id: new Date().getTime() + i,
                    value: line?.trim(),
                    options_status: 0
                  }))
                ]
              }
            : question
        )
      );
    }
  };

  const onChangePositive = (toggle, itemId, id) => {
    const array = questionsList.map((item) => {
      if (item.id === itemId) {
        item.options = item.options.map((item) => {
          if (item.id === id) {
            item.positive = toggle;
          }
          return item;
        });
      }
      return item;
    });
    setQuestionsList(array);
  };
  const handleBulkModal = (e) => {
    setCurrentQuestion(e);
    setOpen(true);
  };
  const handleRemoveImg = (type) => {
    setFileData((prev) => ({
      ...prev,
      [type]: null
    }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;

    setNewCategory({
      ...newCategory,
      value: value,
      disabled: value?.trim() === ''
    });
  };

  const handleLogoImage = (e) => {
    if (e?.target?.files[0]?.size > 1048576) {
      errorToast(`File size should be less than 1MB`);
    } else {
      if (e?.target?.files[0]) {
        if (!e?.target?.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
          errorToast(
            `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid image.`
          );
        } else {
          setSelectedLogo(e.target.files[0]);
          const objectUrl = URL.createObjectURL(e.target.files[0]);
          setPreviewLogo(objectUrl);
          if (surveyId) {
            setIsLogoUpdated(false);
          }

          return () => URL.revokeObjectURL(objectUrl);
        }
      } else {
        setPreviewLogo(undefined);
      }
    }
  };

  const handleImageImage = (e) => {
    if (e?.target?.files[0]?.size > 1048576) {
      errorToast(`File size should be less than 1MB`);
    } else {
      if (e?.target?.files[0]) {
        if (!e?.target?.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
          errorToast(
            `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid image.`
          );
        } else {
          setSelectedImage(e.target.files[0]);
          const objectUrl = URL.createObjectURL(e.target.files[0]);
          setPreviewImage(objectUrl);
          if (surveyId) {
            setIsImageUpdated(false);
          }

          return () => URL.revokeObjectURL(objectUrl);
        }
      } else {
        setPreviewImage(undefined);
      }
    }
  };

  return (
    <>
      {loading && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {' '}
          {SURVEY_CONSTANT.NEW_SURVEY_CREATE_HEADER_1} |{' '}
          {SURVEY_CONSTANT.NEW_SURVEY_CREATE_HEADER_2}{' '}
        </title>
      </Helmet>
      <div className="mt-10" />
      <div className="xl:m-10 xl:mt-1 sm:m-2 md:m-3">
        <div className="flex p-5 text-xl font-bold max-[460px]:justify-between justify-between dark:text-white">
          {SURVEY_CONSTANT.NEW_SURVEY_CREATE_HEADING}
          <PrimaryButton btnText={'Preview Pulse Survey'} onClick={createSurveyButton} />
        </div>
        <div className="bg-white rounded-3xl sm:px-2 sm:py-2 md:px-2 md:py-2  lg:px-5 lg:py-5 xl:px-6 xl:py-10 max-[640px]:p-5 shadow-xl dark:bg-shoorah-darkBgTabColor">
          <div className=" ">
            <div className="grid grid-cols-1 ">
              <div className="xl:space-y-2 md:px-5 ">
                <CommonInput
                  id="surveyTitle"
                  name="surveyTitle"
                  value={form?.surveyTitle}
                  onChange={handleChange}
                  type="text"
                  label={SURVEY_CONSTANT.SURVEY_INPUT_TITLE}
                  placeholder={SURVEY_CONSTANT.SURVEY_INPUT_TITLE}
                  classNames={
                    'mt-2 block w-full rounded-3xl appearance-none border border-gray-300 focus:border-none px-3 py-2 shadow-md font-sans '
                  }
                  isLengthValidate
                  isRequired
                  autoComplete={'off'}
                  error={error.surveyTitle}
                />
              </div>
              <div className=" xl:w-auto sm:w-auto">
                <div className="xl:w-full md:w-auto md:p-4 max-[460px]:py-3 ">
                  <div>
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {SURVEY_CONSTANT.SURVEY_INPUT_CATEGORY} (optional)
                    </label>
                    <div className="w-full  inline-flex m-2 pl-2 py-2 pr-8 rounded-full align-middle justify-start focus:outline-none shadow border border-gray-300 dark:bg-shoorah-darkBgColor dark:text-white font-sans dark:border-none ">
                      <select
                        className="w-full border-none focus-within:outline-none focus:outline-none focus-visible:outline-none bg-transparent text-sm dark:text-white"
                        value={form?.surveyCategory}
                        name="surveyCategory"
                        required
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, surveyCategory: e.target.value }))
                        }
                      >
                        <option value="" className="dark:bg-shoorah-darkBgColor text-base">
                          Please Select
                        </option>
                        {categoryList?.map((item) => (
                          <option
                            key={item?.id}
                            value={item?.id}
                            className="dark:bg-shoorah-darkBgColor text-base"
                          >
                            {item?.categoryName}
                          </option>
                        ))}
                      </select>
                      {
                        <PlusCircleIcon
                          className="ml-2 w-6 h-6 text-shoorah-secondary"
                          onClick={() => setOpenCategory(true)}
                        />
                      }
                    </div>
                  </div>
                  <span className="error text-xs text-red-400">{''}</span>
                </div>
              </div>

              {/* logo */}
              <div className="flex py-3 md:px-5">
                <div className="space-y-6 mr-14 xl:w-1/6 max-[460px]:w-1/2">
                  <div className="">
                    <div className="">
                      {previewLogo ? (
                        <>
                          <div className="relative">
                            <div
                              onClick={() => logoFile.current.click()}
                              className="mt-1 cursor-pointer flex justify-between border px-3 py-2 rounded-3xl"
                            >
                              <p
                                title={
                                  selectedLogo?.name
                                    ? selectedLogo?.name
                                    : previewLogo?.split('/')[previewLogo?.split('/')?.length - 1]
                                }
                              >
                                {selectedLogo?.name
                                  ? selectedLogo?.name.substring(0, 15) +
                                    (selectedLogo?.name.length > 15 ? '...' : '')
                                  : previewLogo
                                      ?.split('/')
                                      [previewLogo?.split('/')?.length - 1].substring(0, 15) +
                                    (previewLogo?.split('/')[previewLogo?.split('/')?.length - 1]
                                      .length > 15
                                      ? '...'
                                      : '')}
                              </p>
                            </div>
                            <input
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              className="hidden"
                              ref={logoFile}
                              onChange={(e) => handleLogoImage(e)}
                            />

                            <XMarkIcon
                              className="absolute top-1/2 transform -translate-y-1/2 right-[10px] w-[20px] text-red-500 cursor-pointer"
                              onClick={() => {
                                setSelectedLogo('');
                                setPreviewLogo('');
                                setIsLogoUpdated(false);
                              }}
                            />
                          </div>
                          <div className="mx-auto border rounded-lg mt-2 text-center">
                            <LazyLoadImageProp
                              imageSrc={previewLogo}
                              className="mx-auto max-h-[250px]"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            className="block w-full rounded-3xl bg-shoorah-secondary text-white font-bold appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-base"
                            type="button"
                            onClick={() => logoFile.current.click()}
                          >
                            <ArrowUpTrayIcon className="w-[20px] inline mr-3" />
                            LOGO
                          </button>
                          <input
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            className="hidden"
                            ref={logoFile}
                            onChange={(e) => handleLogoImage(e)}
                          />
                          <span className="error text-xs text-red-400">
                            {/* {error.meditationImage} */}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-6 mr-14 xl:w-1/6 max-[460px]:w-1/2">
                  <div className="">
                    <div className="">
                      {previewImage ? (
                        <>
                          <div className="relative">
                            <div
                              onClick={() => imageFile.current.click()}
                              className="mt-1 cursor-pointer flex justify-between border px-3 py-2 rounded-3xl"
                            >
                              <p
                                title={
                                  selectedImage?.name
                                    ? selectedImage?.name
                                    : previewImage?.split('/')[previewImage?.split('/')?.length - 1]
                                }
                              >
                                {selectedImage?.name
                                  ? selectedImage?.name.substring(0, 15) +
                                    (selectedImage?.name.length > 15 ? '...' : '')
                                  : previewImage
                                      ?.split('/')
                                      [previewImage?.split('/')?.length - 1].substring(0, 15) +
                                    (previewImage?.split('/')[previewImage?.split('/')?.length - 1]
                                      .length > 15
                                      ? '...'
                                      : '')}
                              </p>
                            </div>
                            <input
                              type="file"
                              accept=".jpg, .jpeg, .png"
                              className="hidden"
                              ref={imageFile}
                              onChange={(e) => handleImageImage(e)}
                            />

                            <XMarkIcon
                              className="absolute top-1/2 transform -translate-y-1/2 right-[10px] w-[20px] text-red-500 cursor-pointer"
                              onClick={() => {
                                setSelectedImage('');
                                setPreviewImage('');
                                setIsImageUpdated(false);
                              }}
                            />
                          </div>
                          <div className="mx-auto border rounded-lg mt-2 text-center">
                            <LazyLoadImageProp
                              imageSrc={previewImage}
                              className="mx-auto max-h-[250px]"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            className="block w-full rounded-3xl bg-shoorah-secondary text-white font-bold appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-base"
                            type="button"
                            onClick={() => imageFile.current.click()}
                          >
                            <ArrowUpTrayIcon className="w-[20px] inline mr-3" />
                            IMAGE
                          </button>
                          <input
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            className="hidden"
                            ref={imageFile}
                            onChange={(e) => handleImageImage(e)}
                          />
                          <span className="error text-xs text-red-400">
                            {/* {error.meditationImage} */}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* progress */}
            </div>
            <ProgressBar />
          </div>
          {questionsList?.map((item, i) => {
            return (
              <div key={item?.id} className="xl:space-y-2 md:px-5">
                <div className="text-shoorah-black pl-5 py-2 font-bold text-lg dark:text-shoorah-lightPrimary">
                  Add questions:
                </div>
                <div className="rounded-3xl shadow shadow-slate-300 ">
                  <div className="bg-shoorah-secondary text-shoorah-offWhite flex gap-4 rounded-t-3xl pl-7 pr-7 pt-1 pb-1 relative items-center">
                    <h2 className="font-semibold text-white uppercase">Edit</h2>
                    <h2 className="font-semibold text-gray-300 uppercase">Options</h2>
                    <div className="grow" />
                    {questionsList?.length > 1 && (
                      <XMarkIcon
                        className="text-shoorah-secondary h-4 w-4 bg-white rounded-full cursor-pointer hover:bg-red-500"
                        onClick={() => handleCancelQuestions(i)}
                      />
                    )}
                  </div>
                  <div className="xl:px-30 xl:mx-8 md:px-3 p-5 md:mx-5 max-[640px]:p-2 ">
                    <div>
                      <div className="pl-8 pb-2 font-bold dark:text-shoorah-lightPrimary">
                        Question {i + 1}
                      </div>
                      <div className="xl:ml-4 md:mb-2 md:ml-1 flex rounded-full shadow-sm shadow-slate-300 justify-between border ">
                        <input
                          id={item?.id}
                          key={item.id}
                          type="text"
                          name="question"
                          className="m-1 pl-5 py-1 rounded-l-xl align-middle justify-start focus:outline-none bg-transparent w-full dark:text-white"
                          placeholder="Enter a question"
                          value={item.question}
                          autoFocus={false}
                          autoComplete="off"
                          onChange={(e) => handleQuestionsChange(e, item.id)}
                          required
                        />
                        <ReactTooltip
                          anchorId={item?.id}
                          place="top"
                          className="bg-shoorah-secondary"
                        >
                          {item.question}
                        </ReactTooltip>

                        <button className="bg-gray-200  xl:px-12 lg:px-8 px-4 rounded-r-full ">
                          Question
                        </button>
                      </div>
                      {item?.question_error ? (
                        <span className="pl-6 error text-xs text-red-400">
                          Please Enter Question
                        </span>
                      ) : (
                        ''
                      )}
                    </div>

                    {item?.options?.map((ops, index) => {
                      return (
                        <CustomInput
                          key={ops.id}
                          value={ops.value}
                          optionError={ops.error}
                          name={'questions-' + ops.id}
                          placeholder={'Enter an answer choice'}
                          status={ops?.options_status}
                          handlePlus={() => handleAddInput(i, index)}
                          handleMinus={
                            item?.options?.length > 1
                              ? () => handleRemoveInput(item.id, ops.id)
                              : null
                          }
                          onChange={(e) => handleInputChange(item.id, ops.id, e)}
                          onChangePositive={(toggle) => onChangePositive(toggle, item.id, ops.id)}
                        />
                      );
                    })}
                    <div className="flex uppercase text-sm items-center gap-1 py-4 ml-3 pl-36 max-[640px]:pl-5 justify-center dark:text-shoorah-offWhite">
                      <img
                        loading='lazy'
                        src={PlusIcon}
                        width={25}
                        style={{ marginRight: 4 }}
                        onClick={() => handleBulkModal(item)}
                        alt=""
                      />
                      <div>Bulk Answer</div>
                      <QuestionMarkCircleIcon
                        width={25}
                        className="text-shoorah-secondary"
                        aria-hidden="true"
                        color="black"
                      />
                    </div>

                    {item?.isOtherOption ? (
                      <CustomInput
                        // key={item.id}
                        value={'Other'}
                        name={'questions-' + item.id}
                        placeholder={'Enter an answer choice'}
                      />
                    ) : null}

                    {item?.isNoneOfTheAbove ? (
                      <CustomInput
                        // key={item.id}
                        value={'None of the above'}
                        name={'questions-' + item.id}
                        placeholder={'Enter an answer choice'}
                      />
                    ) : null}

                    <div className="flex flex-col gap-4 p-3 m-2 max-[540px]:p-1 max-[540px]:m-1 max-[540px]:gap-1">
                      <CustomCheckBox
                        title={'Add an "Other" Answer Option'}
                        check={item.isOtherOption}
                        onClick={() =>
                          handleBoolQuestionsChange(item.id, 'isOtherOption', item.isOtherOption)
                        }
                      />
                      <CustomCheckBox
                        title={'Add a "None of the above" Answer option'}
                        check={questionsList[i].isNoneOfTheAbove}
                        onClick={() =>
                          handleBoolQuestionsChange(
                            item.id,
                            'isNoneOfTheAbove',
                            item.isNoneOfTheAbove
                          )
                        }
                      />
                      <CustomCheckBox
                        title={'Add a skip question button'}
                        check={questionsList[i].skipable}
                        onClick={() =>
                          handleBoolQuestionsChange(item.id, 'skipable', item.skipable)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 xl:space-y-2 md:px-5">
            <div
              className="flex justify-between bg-shoorah-secondary  p-2  max-[640px]:py-3 rounded-full my-5 "
              onClick={handleQuestions}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-shoorah-offWhite"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <button className="text-white xl:text-base">ADD NEW QUESTIONS</button>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#4A56DB"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  color="#4A56DB"
                  stroke="currentColor"
                  className="w-6 h-6  text-shoorah-offWhite bg-shoorah-secondary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            className={
              'xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 xl:space-y-2 md:px-5 flex justify-center items-center'
            }
          >
            {/* if tempId is not null then show Modify Template */}

            {tempId && isSuperAndSubAdmin() && (!isPreview || type === 'draft') && (
              <button
                className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                onClick={handleSaveAsTemplate}
              >
                {/* { SURVEY_CONSTANT.MODIFY_TEMPLATE} */}
                {type === 'draft'
                  ? SURVEY_CONSTANT.NEW_SURVEY_BUTTON_TEMPLATE
                  : SURVEY_CONSTANT.MODIFY_TEMPLATE}
              </button>
            )}

            {console.log('type 🎉🎉🎉', type)}

            {((surveyId && (isSuperAndSubAdmin() || isCopanySuperOrSubAdmin()) && !isPreview) ||
              type === 'draft') && (
              <button
                className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                onClick={createSurveyButton}
              >
                {type === 'draft' ? SURVEY_CONSTANT.CREATE_SURVEY : SURVEY_CONSTANT.MODIFY_SURVEY}
              </button>
            )}

            {((tempId === null &&
              surveyId === null &&
              (isCopanySuperOrSubAdmin() || isSuperAndSubAdmin()) &&
              !isPreview) ||
              type === 'draft') && (
              <button
                className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                onClick={saveAsDraft}
              >
                {SURVEY_CONSTANT.NEW_SURVEY_BUTTON_DRAFT}
              </button>
            )}
            {tempId === null && surveyId === null && isSuperAndSubAdmin() && !isPreview && (
              <button
                className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                onClick={handleSaveAsTemplate}
              >
                {SURVEY_CONSTANT.NEW_SURVEY_BUTTON_TEMPLATE}
              </button>
            )}
            {tempId === null &&
              surveyId === null &&
              (isCopanySuperOrSubAdmin() || isSuperAndSubAdmin()) &&
              !isPreview && (
                <button
                  className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                  onClick={createSurveyButton}
                >
                  {SURVEY_CONSTANT.CREATE_SURVEY}
                </button>
              )}

            {/* <button
              className="m-1 border-2 font-bold	border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
              onClick={handleSaveAsDraft}
            >
              {SURVEY_CONSTANT.NEW_SURVEY_BUTTON_DRAFT}
            </button> */}

            {/* {isSuperAndSubAdmin() && (
              <button
                className="m-1 border-2 font-bold	border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                onClick={handleSaveAsTemplate}
              >
                {SURVEY_CONSTANT.NEW_SURVEY_BUTTON_TEMPLATE}
              </button>
            )}
            <button
              onClick={handleNextButton}
              className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
            >
              {SURVEY_CONSTANT.NEW_SURVEY_BUTTON_NEXT}
            </button> */}
          </div>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setOpen}
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg bg-gray-50 dark:bg-shoorah-darkBgTabColor">
                    <div className="bg-white dark:bg-shoorah-darkBgTabColor">
                      <div className="sm:flex sm:items-start">
                        <div className="">
                          <Dialog.Title
                            as="h1"
                            className="text-3xl text-black text-left p-2 m-3 dark:text-white"
                          >
                            Add Answer in Bulk
                          </Dialog.Title>
                          <div className="mt-2 flex gap-3  bg-shoorah-secondary text-white p-3 ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#3A47AB"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-15 h-20"
                              color="white"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                              />
                            </svg>
                            <p className="text-sm">
                              {SURVEY_CONSTANT.NEW_SURVEY_BULK_BUTTON_HEADER_1}
                              <br /> {SURVEY_CONSTANT.NEW_SURVEY_BULK_BUTTON_HEADER_2}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 ">
                      <textarea
                        className="border border-shoorah-viking w-full focus:border-shoorah-viking focus-within:border-shoorah-viking focus-visible:border-shoorah-viking"
                        rows={5}
                        maxLength={200}
                        onChange={(e) => setBulkAnswer(e.target.value)}
                      ></textarea>
                      <p className="text-sm dark:text-white">
                        a maximum of 200 choices are allowed for this question type.
                      </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-shoorah-darkBgTabColor">
                      <button
                        type="button"
                        className={`inline-flex w-full justify-center rounded-full  px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${
                          !bulkAnswer || bulkAnswer?.trim() === ''
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-shoorah-secondary'
                        }`}
                        onClick={handleBulkAnswer}
                        disabled={!bulkAnswer || bulkAnswer?.trim() === ''}
                      >
                        SAVE
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto "
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        CANCEL
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <Transition.Root show={openCategory} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setOpenCategory}
          >
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg bg-gray-50 dark:bg-shoorah-darkBgTabColor">
                    <div>
                      <form>
                        <div className="bg-white dark:bg-shoorah-darkBgTabColor dark:text-white ">
                          <div className="sm:flex sm:items-start">
                            <div className="text-center">
                              <Dialog.Title
                                as="h1"
                                className="text-3xl text-black text-center p-2 m-3 dark:text-white"
                              >
                                {SURVEY_CONSTANT.NEW_SURVEY_CATEGORY_ADD}
                              </Dialog.Title>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 ">
                          <CommonInput
                            name="surveyCategory"
                            value={newCategory?.value}
                            onChange={handleCategoryChange}
                            type="text"
                            label={SURVEY_CONSTANT.NEW_SURVEY_CATEGORY_NAME}
                            placeholder={SURVEY_CONSTANT.NEW_SURVEY_CATEGORY_NAME}
                            classNames={
                              'rounded-full border border-gray-500 align-middle justify-start w-full px-3 py-2 outline-gray-500 dark:text-white dark:bg-shoorah-darkBgColor'
                            }
                            isRequired
                            error={newCategory?.error}
                          />
                          {newCategory.error && (
                            <span className="error text-xs text-red-400">
                              Please Enter Category Name
                            </span>
                          )}
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2 dark:bg-shoorah-darkBgTabColor">
                          <button
                            type="button"
                            className="border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary rounded-3xl py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-shoorah-offWhite focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2"
                            onClick={() => setOpenCategory(false)}
                            ref={cancelButtonRef}
                          >
                            CANCEL
                          </button>
                          <PrimaryButton
                            btnType={'button'}
                            btnText={'SAVE'}
                            disabled={newCategory?.disabled}
                            onClick={handleAddCategory}
                          />
                        </div>
                      </form>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
};

export default AddEditPulseSurvey;

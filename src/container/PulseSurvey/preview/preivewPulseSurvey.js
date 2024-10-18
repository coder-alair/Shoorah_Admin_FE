import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Api } from '../../../api';
import { DEPARTMENT, AREA_LIST } from '../../../utils/constants';
import { SurveyContext } from '../../../context/PreviewSurveyContext';
import { errorToast, getLocalStorageItem, getUserType, successToast } from '../../../utils/helper';

import moment from 'moment';
import Loader from '../../../component/common/Loader';
import ProgressBar from '../../../component/common/Input/ProgressBar';
import CustomCheckBox from '../../../component/common/CustomCheckBox';
import CustomSelectBox from '../../../component/common/CustomSelectBox';
import { getPathForSurvey, isSuperAndSubAdmin } from '../../../utils/helper';
import DataFilter from '../DataFilter';
import { SURVEY_CONSTANT } from '../../../core/web.constants';
import { CompanyApi } from '../../../api/companyApi';
import axios from 'axios';

const PreviewPulseSurveys = () => {
  const { surveyMeta, setSurveyMeta } = useContext(SurveyContext);
  const navigate = useNavigate();
  const [state, setState] = useState({});
  const [other, setOther] = useState(false);
  const [loader, setLoader] = useState(false);
  const [surveyOption, setSurveyOption] = useState({
    area: [],
    duration: 0,
    audience: [],
    template_category: 'All',
    time: moment().format('hh:mm:ss')
  });
  const [surveyDuration, setSurveyDuration] = useState(0);

  const isEdit = Boolean(state?.isEdit);
  const isDraft = surveyMeta?.type === 'draft';
  const isTemplate = surveyMeta?.type === 'template';
  const isSave = surveyMeta?.type === 'save';
  const user = JSON.parse(getLocalStorageItem('userData'));
  const typeofUser = getUserType(user?.userType);
  const isAdmin = ['Super Admin', 'Sub Admin'].includes(typeofUser);

  useEffect(() => {
    setSurveyOption((prev) => {
      return {
        ...prev,
        duration: surveyDuration
      };
    });
  }, [surveyDuration]);

  useEffect(() => {
    if (surveyMeta) setState(surveyMeta);

    setTimeout(() => {
      if (!surveyMeta) {
        navigate(getPathForSurvey('/pulse-survey'));
        errorToast('No pulse survey preview found!');
      }
    }, 3000);
  }, [surveyMeta]);

  useEffect(() => {
    if (state?.other) {
      console.log('🚀 ~ useEffect ~ state?.other:', state?.other);
      const { time, area, audience, departments, template_category, duration } = state?.other || {
        time: '',
        area: [],
        duration: 0,
        audience: [],
        departments: [],
        template_category: 'B2B'
      };
      setSurveyOption({
        time: time,
        duration: duration || 0,
        area: area?.map?.((item) => item.name),
        template_category: template_category,
        audience: (departments || audience).map((item) => item.name)
      });
      setSurveyDuration(duration || 0);
    }
  }, [state?.other]);

  const isValid = () => {
    if (isTemplate || isDraft) return true;
    const { area, audience, time } = surveyOption;
    if (!time) {
      errorToast('Please select time!');
      return false;
    } else if (area?.length === 0) {
      errorToast('Please select area!');
      return false;
    } else if (Number(surveyDuration) <= 0) {
      errorToast('Please select pulse survey duration!');
      return false;
    } else return true;
  };

  const getCategoryValue = (category) => {
    switch (category) {
      case 'B2B':
        return 1;
      case 'B2C':
        return 2;
      default:
        return 3;
    }
  };
  const mapAreaToValue = (area) => {
    switch (area) {
      case 'email':
        return '1';
      case 'app':
        return '2';
      case 'web':
        return '3';
      default:
        return '';
    }
  };
  const handleSubmitSurveyApi = () => {
    setLoader(true);
    const userData = JSON.parse(getLocalStorageItem('userData'));
    const { surveyData, questionsList, surveyId, type } = state || {};
    const { surveyTitle } = surveyData || {};
    const newQuestionsList = surveyMeta?.questionsList?.map((item) => ({
      questionId: item?.quid || null,
      title: item?.question,
      options: item?.options.map((option) => option.value),
      skipable: item?.skipable
    }));
    const data = {
      surveyId: surveyMeta?.surveyId || '',
      surveyTitle: surveyMeta?.surveyData?.surveyTitle,
      surveyDuration: String(surveyDuration),
      surveyCategory: surveyMeta?.surveyData?.surveyCategory || null,
      templateCategory: getCategoryValue(surveyOption?.template_category),
      departments: surveyOption.audience.map((name) => ({ name })),
      notifyTime: String(surveyOption?.time),
      surveyArea: surveyOption.area?.length > 0 ? mapAreaToValue(surveyOption.area[0]) : '',
      isDraft: surveyMeta?.type === 'draft',
      isTemplate: surveyMeta?.type === 'draft' ? null : surveyMeta?.type === 'template',
      isSurveyImageDeleted: surveyMeta?.isSurveyImageDeleted,
      isSurveyLogoDeleted: surveyMeta?.isSurveyLogoDeleted,
      questions: newQuestionsList,
      surveyLogo: surveyMeta?.logo?.type,
      surveyImage: surveyMeta?.image?.type,
      status: surveyMeta?.status
    };

    const fetchPromise = isSuperAndSubAdmin()
      ? Api.addEditPulseSurvey(data)
      : CompanyApi.addEditPulseSurveyB2b(data);

    fetchPromise
      .then((res) => res?.data)
      .then(async (response) => {
        const code = Number(response?.meta?.code || response?.code);
        switch (code) {
          case 0:
          case 400:
            setLoader(false);
            errorToast(response?.data?.meta?.message || response?.message);
            break;

          case 1:
            if (response?.meta?.surveyLogo?.uploadURL) {
              await axios.put(response?.meta?.surveyLogo?.uploadURL, surveyMeta?.logo, {
                headers: {
                  'content-type': `${surveyMeta?.logo?.type?.split('/')[0]}/${surveyMeta?.logo?.name?.split('.')[1]
                    }`
                }
              });
            }
            if (response?.meta?.surveyImage?.uploadURL) {
              await axios.put(response?.meta?.surveyImage?.uploadURL, surveyMeta?.image, {
                headers: {
                  'content-type': `${surveyMeta?.image?.type?.split('/')[0]}/${surveyMeta?.image.name?.split('.')[1]
                    }`
                }
              });
            }
            setLoader(false);

            switch (surveyMeta?.type) {
              case 'template':
                if (userData?.userType === 1) {
                  successToast('Template created and sent for approval successfully');
                } else {
                  successToast('Template created successfully');
                }
                break;
              case 'draft':
                successToast('Draft Pulse Survey created successfully');
                break;
              case 'save':
                if (userData?.userType === 1) {
                  successToast('New Pulse Survey created and sent for approval successfully');
                } else {
                  successToast('New Pulse Survey created successfully');
                }
                break;
              default:
                successToast(SURVEY_CONSTANT.NEW_SURVEY_CREATE_SUCCESS);
            }

            surveyMeta?.type !== 'template'
              ? navigate(getPathForSurvey('/survey-list'))
              : navigate(getPathForSurvey('/pulse-survey'));
            setSurveyMeta(null);
            break;

          default:
            setLoader(false);
        }
      });
  };

  const handleSubmit = () => {
    if (!isValid()) return;
    handleSubmitSurveyApi();
  };

  return (
    <>
      {loader && <Loader />}
      <div className="mt-10">
        <div className="flex pl-10 p-5 max-[460px]:justify-between justify-between font-bold text-xl dark:text-white">
          {SURVEY_CONSTANT.SURVEY_PREVIEW_TITLE}
        </div>
        <div className="bg-white dark:bg-shoorah-darkBgTabColor rounded-[30px] xl:mx-10 p-5 max-[640px]:p-5 max-[640px]:mx-2 shadow py-4 px-8 gap-2 relative">
          <Link
            to={getPathForSurvey('/pulse-survey/add-edit-survey?preview=true')}
            className="absolute top-4 right-8 text-gray-500 max-[640px]:right-4 max-[640px]:top-2 "
          >
            <button className="absolute top-2 right-8 text-gray-500 max-[640px]:right-4 max-[640px]:top-1 dark:text-white ">
              EXIT
            </button>
          </Link>
          <div className="flex-wrap md:flex gap-3 align-middle justify-center max-[780px]:pt-8 max-[640px]:pt-5">
            <ProgressBar />
          </div>
          <div className="py-3">
            <div>
              <img src={surveyMeta?.previewLogo} loading='lazy' className="h-40 mb-3 border-1" alt="" />
            </div>
            <div>
              <img src={surveyMeta?.previewImage} loading='lazy' className="h-40 border-1" alt="" />
            </div>
          </div>
          <div className="font-bold text-3xl pt-8 dark:text-white">
            {state?.surveyData?.surveyTitle}
          </div>
          <div>
            <div className="rounded-xl border-2 border-shoorah-primary mt-6 px-4">
              {state?.questionsList?.map((item, i) => {
                console.log('🚀 ~ {state?.questionsList?.map ~ item:', item);
                const itemId = item?._id || 'question-list-item-' + i;
                return (
                  <div
                    key={itemId}
                    className="p-2 border-b-[1px] border-shoorah-primary last:border-b-0 mt-2"
                  >
                    <div className="font-semibold text-xl dark:text-white">
                      {i + 1}.{item?.question}
                      {!item?.skipable && <span className="text-red-600">&#42;</span>}
                    </div>
                    <div className="flex flex-col pt-2">
                      {item?.options?.map((opt, i) => {
                        return (
                          <div key={i} className="flex m-1 p-1 gap-2 justify-start items-center ">
                            <input
                              id={i}
                              type="radio"
                              name="options"
                              className="font-extrabold w-5 h-5 p-0 m-0 "
                            />
                            <label
                              htmlFor={i}
                              className="pl-2 text-l font-medium capitalize dark:text-white "
                            >
                              {opt?.value}
                            </label>
                          </div>
                        );
                      })}
                      <div className="flex justify-center">
                        {other ? (
                          <input
                            type="text"
                            className="mr-14 flex align-middle justify-start p-3 focus:outline-none max-[640px]:p-2 max-[640px]:mr-1 w-3/4 max-[640px]:w-full shadow rounded-full dark:text-white dark:bg-shoorah-darkBgColor"
                            placeholder="Enter optional answer"
                          ></input>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {isSave && (
              <div className="flex justify-center">
                <div className="flex items-center justify-center pt-5 gap-2 w-3/6 max-[640px]:w-full ">
                  <label className="font-semiBold dark:text-white">
                    {SURVEY_CONSTANT.NEW_SURVEY_DURATION_TITLE}:{' '}
                  </label>
                  <label className="w-[100px] text-center dark:text-white font-semiBold">
                    <b>{surveyDuration}</b> Minute(s)
                  </label>
                  <button
                    className="rounded-full border w-[30px] h-[30px] bg-shoorah-secondary text-white font-semibold"
                    onClick={() =>
                      setSurveyDuration((prev) => (Number(prev) > 0 ? Number(prev) - 1 : 0))
                    }
                  >
                    -
                  </button>
                  <button
                    className="rounded-full border w-[30px] h-[30px] bg-shoorah-secondary text-white font-semibold"
                    onClick={() => setSurveyDuration((prev) => Number(prev) + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            {!isTemplate && !isDraft ? (
              <div className="flex flex-col py-5">
                <div className="flex xl:flex-row lg:flex-row sm:flex-row max-[540px]:flex-wrap pt-5 gap-4 align-middle justify-center">
                  {/* <div className="flex justify-center xl:basis-1/4 lg:basis-1/2 md:basis-full max-[540px]:basis-full ">
                    <CustomSelectBox
                      extra={
                        <div className="flex justify-between text-md mb-2">
                          <div>All {isAdmin ? 'B2C Users' : 'Staff Members'}</div>
                          <div>
                            <CustomCheckBox
                              onClick={() => {
                                const hasAll =
                                  surveyOption.audience.length ===
                                  DEPARTMENT.filter((item) => item).length - 1;
                                const items = DEPARTMENT.map((item) => item?.value).filter(
                                  (value) => value
                                );
                                setSurveyOption((prev) => ({
                                  ...prev,
                                  audience: !hasAll ? items : []
                                }));
                              }}
                              check={surveyOption.audience.length === DEPARTMENT.length - 1}
                            />
                          </div>
                        </div>
                      }
                      options={DEPARTMENT.filter(({ value }) => value)}
                      onChange={(data) => {
                        setSurveyOption((prev) => ({
                          ...prev,
                          audience: data
                        }));
                      }}
                      style={{ width: 250 }}
                      label={'Select Audience'}
                      optionLabel={'Departments*'}
                      selectedOptions={surveyOption.audience}
                      name="audience-dropdown"
                    />
                  </div> */}
                  {
                    <div className="flex justify-center xl:basis-1/4 lg:basis-1/2 md:basis-full  w-full">
                      <CustomSelectBox
                        extra={
                          <div className="flex justify-between text-md mb-2 dark:text-white">
                            <div>Set Time: </div>
                            <div>
                              <input
                                onChange={(e) =>
                                  setSurveyOption((prev) => ({
                                    ...prev,
                                    time: e.target.value
                                  }))
                                }
                                type="time"
                                style={{ width: 100 }}
                                value={surveyOption.time}
                                className="text-sm font-semibold border-1 rounded-full dark:bg-shoorah-darkBgColor"
                              />
                            </div>
                          </div>
                        }
                        options={AREA_LIST}
                        onChange={(data) =>
                          setSurveyOption((prev) => ({
                            ...prev,
                            area: data
                          }))
                        }
                        style={{ width: 250 }}
                        selectedOptions={surveyOption.area}
                        label={'Set Time & Area'}
                        optionLabel={'Pulse Survey Area*'}
                        name="area-dropdown"
                      />
                    </div>
                  }
                </div>
              </div>
            ) : (
              <div className="py-2"></div>
            )}
          </div>
          {isSave && isAdmin && (
            <div className="py-2">
              <div className="flex justify-center">
                <DataFilter
                  // only2Options
                  title="Survey for"
                  onChange={(type) =>
                    setSurveyOption((prev) => ({
                      ...prev,
                      template_category: type
                    }))
                  }
                  selected={surveyOption?.template_category}
                />
              </div>
            </div>
          )}
          <div className="flex justify-center pt-5">
            <button
              className="m-2 border-2 font-bold text-shoorah-offWhite bg-shoorah-secondary p-3	border-shoorah-secondary rounded-full w-3/6 max-[640px]:w-full hover:bg-white hover:text-shoorah-secondary dark:hover:bg-shoorah-darkBgColor"
              onClick={handleSubmit}
              disabled={loader}
            >
              {loader ? <Loader compact /> : isEdit || isTemplate || isDraft ? 'SAVE' : 'SEND'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewPulseSurveys;

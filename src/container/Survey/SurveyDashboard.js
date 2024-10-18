import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import completeIcon from '../../assets/images/Complete.svg';
import openIcon from '../../assets/images/Open.svg';
import deliveredIcon from '../../assets/images/Delivered.svg';
import incompleteIcon from '../../assets/images/InComplete.svg';
import Carousel from '../../component/common/Carousel';
import { getUserType, isSuperAdmin } from '../../utils/helper';
import { Api } from '../../api';
import { SurveyContext } from '../../context/PreviewSurveyContext';
import { getPathForSurvey } from '../../utils/helper';
import DataFilter from './DataFilter';
import { SURVEY_CONSTANT } from '../../core/web.constants';
import { CompanyApi } from '../../api/companyApi';

const SurveyDashboard = () => {
  const [refetch, setRefetch] = useState(false);
  const [list, setList] = useState([]);
  const [statistics, setStatistics] = useState({});
  const { setSurveyMeta } = useContext(SurveyContext);
  const [insightType, setInsightType] = useState('All');
  const [templateType, setTemplateType] = useState('All');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const userType = getUserType(userData?.userType);
  const isUserSuperOrSubAdmin = ['Super Admin', 'Sub Admin'].includes(userType);

  useEffect(() => {
    setSurveyMeta(null);
  }, []);

  useEffect(() => {
    const promise = isUserSuperOrSubAdmin
      ? Api.getPulseSurveys(1, 100, false, true)
      : CompanyApi.getPulseSurveysB2b(1, 100, false, true);

    promise
      .then((response) => response.data)
      .then((response) => setList(response?.data?.[0]?.SurveyTemplateList || []));
  }, [refetch, templateType]);

  useEffect(() => {
    const promise = isUserSuperOrSubAdmin
      ? Api.getSurveyInsights(insightType)
      : Api.getSurveyInsights();

    promise
      .then((response) => response.data)
      .then((response) => setStatistics(response?.data[0] || {}));
  }, [refetch, insightType]);

  return (
    <div className="xl:m-3 lg:p-3">
      <div className="h-[15px] md:h-[50px] lg:h-[40px]" />
      <div className="grid xl:grid-cols-2 gap-10">
        <div className="grid grid-cols-1 gap-10">
          <div className="bg-white dark:bg-shoorah-darkBgTabColor rounded-3xl p-5 shadow-lg">
            <h1 className="text-xl font-semibold dark:text-white">
              {SURVEY_CONSTANT.SURVEY_TITLE}
            </h1>
            <p className="text-xs dark:text-white">
              <br />
              {SURVEY_CONSTANT.SURVEY_HEADING_1}
              <br />
              <br /> {SURVEY_CONSTANT.SURVEY_HEADING_2}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-lg dark:bg-shoorah-darkBgTabColor">
            <h1 className="text-2xl font-semibold text-xl dark:text-white">
              {SURVEY_CONSTANT.NEW_SURVEY_CREATE_HEADING}
            </h1>
            <div className="grid xl:grid-cols-2 md:grid-cols-2  sm:grid-cols-1 p-5 gap-4 align-middle text-center">
              <Link
                to={getPathForSurvey('/surveys/add-edit')}
                className="w-full p-5 bg-shoorah-secondary text-shoorah-offWhite rounded-3xl text-base dark:text-white"
              >
                {SURVEY_CONSTANT.NEW_SURVEY_CREATE}
              </Link>
              <Link
                to={getPathForSurvey('/surveys/my-survey')}
                className="w-full p-5 bg-shoorah-navyblue rounded-3xl text-shoorah-offWhite text-base"
              >
                {SURVEY_CONSTANT.MY_SURVEY_LIST_BUTTON}
              </Link>
            </div>
            <Link
              to={getPathForSurvey('/surveys/my-survey?listType=draft')}
              className="text-shoorah-gray4 underline text-xs"
            >
              {SURVEY_CONSTANT.SURVEY_VIEW_DRAFTS_BUTTON}
            </Link>
          </div>
        </div>
        <div>
          <div className="flex gap-2 items-center pb-5">
            <h1 className="font-semibold text-xl dark:text-white">
              {SURVEY_CONSTANT.SURVEY_INSIGHTS_HEADER}
            </h1>
            {isUserSuperOrSubAdmin && (
              <>
                <div className="grow" />
                <div>
                  <DataFilter onChange={setInsightType} />
                </div>
              </>
            )}
          </div>
          <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 ">
            <div className="shadow-lg  bg-white rounded-3xl p-5 flex dark:bg-shoorah-darkBgTabColor">
              <img loading='lazy' src={completeIcon} className="h-20 w-20 p-3" />
              <div className="p-3">
                <h1 className="font-extrabold text-2xl text-shoorah-primary dark:text-white">
                  Total: {statistics?.complete || 0}
                </h1>
                <p className="text-sm text-shoorah-gray4 dark:text-white">Completed</p>
              </div>
            </div>
            <div className="shadow-xl  bg-white rounded-3xl p-5 flex dark:bg-shoorah-darkBgTabColor">
              <img loading='lazy' src={incompleteIcon} className="h-20 w-20 p-3" alt="" />
              <div className="p-3">
                <h1 className="font-extrabold text-2xl text-shoorah-darkRed dark:text-white ">
                  Total: {statistics?.incomplete || 0}
                </h1>
                <p className="text-sm text-shoorah-gray4 dark:text-white">Incomplete</p>
              </div>
            </div>
            {/* <div className='shadow-xl  bg-white rounded-3xl p-5 flex dark:bg-shoorah-darkBgTabColor'>
              <img src={deliveredIcon} className='h-20 w-20 p-3' alt='' />
              <div className='p-3'>
                <h1 className='font-extrabold text-2xl text-teal-400 dark:text-white'>Total: 0</h1>
                <p className='text-sm text-shoorah-gray4 dark:text-white'>Delivered</p>
              </div>
            </div> */}
            <div className="shadow-xl  bg-white rounded-3xl p-5 flex dark:bg-shoorah-darkBgTabColor">
              <img loading='lazy' src={openIcon} className="h-20 w-20 p-3 dark:text-white" alt="" />
              <div className="p-3">
                <h1 className="font-extrabold text-2xl text-shoorah-green dark:text-white">
                  Total: {statistics?.open || 0}
                </h1>
                <p className="text-sm text-shoorah-gray4 dark:text-white">Currently Open</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isUserSuperOrSubAdmin && (
        <>
          <div className="pt-[40px]">
            <div className="flex align-text-top justify-items-middle bg-white rounded-3xl p-5 shadow-lg dark:bg-shoorah-darkBgTabColor ">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-10 w-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#3A47AB"
                    color="white"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div className="text-xs w-full flex justify-start items-center  dark:text-white ">
                {SURVEY_CONSTANT.SURVEY_DID_YOU_KNOW_TEXT}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="pt-[40px]">
        <div className="p-5 pb-10 rounded-3xl shadow-lg bg-white dark:bg-shoorah-darkBgTabColor">
          <div className="flex items-center mb-5">
            <h1 className="font-semibold text-xl dark:text-white">
              {SURVEY_CONSTANT.SURVEY_EXPLORE_TEMPS}
            </h1>
            {isUserSuperOrSubAdmin && (
              <>
                <div className="grow" />
                <DataFilter onChange={setTemplateType} />
              </>
            )}
          </div>
          <Carousel data={list} onRefetch={() => setRefetch((prev) => !prev)} />
        </div>
      </div>
    </div>
  );
};

export default SurveyDashboard;

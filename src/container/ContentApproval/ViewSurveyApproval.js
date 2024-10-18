import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Api } from '../../api';
import {
  errorToast,
  getKeyByValue,
  getKeyByValueFromArrayObj,
  getPathForSurvey,
  isSuperAndSubAdmin,
  successToast
} from '../../utils/helper';
import { SURVEY_CONSTANT } from '../../core/web.constants';
import Breadcrumb from '../../component/common/Breadcrumb';
import ProgressBar from '../../component/common/Input/ProgressBar';
import {
  APPROVAL_STATUS,
  CONTENT_APPROVAL_STATUS,
  SURVEY_AREA,
  SURVEY_SCOPE
} from '../../utils/constants';
import CommonTextarea from '../../component/common/CommonTextarea';
import SecondaryButton from '../../component/common/Buttons/SecondaryButton';
import PrimaryButton from '../../component/common/Buttons/PrimaryButton';
import { CompanyApi } from '../../api/companyApi';
import altImg from '../../assets/images/alt-img.jpeg';
import Loader from '../../component/common/Loader';

const pages = [
  { name: 'Content Approval', href: getPathForSurvey('/content-approval'), current: false },
  {
    name: 'View Survey Approval',
    href: getPathForSurvey('/view-survey'),
    current: true
  }
];

const approvalStatusTextColor = {
  0: 'text-gray-700',
  1: 'text-green-700',
  2: 'text-red-700'
};
console.log(approvalStatusTextColor);

const approvalStatusBGColor = {
  0: 'bg-gray-200',
  1: 'bg-green-200',
  2: 'bg-red-200'
};

export default function ViewSurveyApproval(props) {
  const { surveyId } = useParams();
  const [searchParams] = useSearchParams();

  const type = searchParams.get('type');
  console.log('🚀 ~ ViewSurveyApproval ~ type:', type);

  const [surveyData, setSurveyData] = useState({});
  const [form, setForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSurveyData();
  }, [surveyId]);

  const getSurveyData = async () => {
    const res = await (isSuperAndSubAdmin()
      ? Api.getPulseSurveyById(surveyId)
      : CompanyApi.getPulseSurveyByIdB2b(surveyId));
    if (res?.data?.meta?.code === 1) {
      setSurveyData(res?.data?.data);
    } else if (res?.data?.meta?.code === 0) {
      errorToast(res?.data?.meta?.message);
    }
  };

  const radioHandler = (e) => {
    let { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: parseInt(value)
    }));
  };

  const handleChange = (e) => {
    // setError((prevState) => ({
    //   ...prevState,
    //   [e.target.name]: ''
    // }));

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const submitApproval = async () => {
    let data = { ...form, surveyId };
    console.log('🚀 ~ submitApproval ~ data:', data);
    setIsLoading(true);
    try {
      const response = await (isSuperAndSubAdmin()
        ? Api.submitApproval(data)
        : CompanyApi.submitApprovalB2b(data));
      if (response?.data?.meta?.code === 1) {
        successToast(response?.data?.meta?.message);
      } else if (response?.data?.meta?.code === 0) {
        errorToast(response?.data?.meta?.message);
      }
    } catch (error) {
      console.log('🚀 ~ submitApproval ~ error:', error);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loader />}
      <Breadcrumb pageList={pages} />
      <div className="mt-2">
        <div className="flex pl-10 p-5 max-[460px]:justify-between justify-between font-bold text-xl dark:text-white">
          {SURVEY_CONSTANT.REVIEW_SURVEY_TITLE}
        </div>
        <div className="relative bg-white dark:bg-shoorah-darkBgTabColor rounded-[30px] xl:mx-10 max-[640px]:mx-2 shadow gap-2">
          {/* <div className="border-2 rounded-3xl border-green-700 h-20 w-full">
            <div className="font-bold text-green-700 text-xl p-2">Approved</div>
            <div></div>
          </div> */}

{ type &&      <div
            id="sticky-banner"
            tabIndex={-1}
            className={`overflow-hidden break-all whitespace-pre-wrap rounded-t-[32px] top-0 start-0 z-50 flex justify-between w-full p-4 border-b border-gray-200 ${
              approvalStatusTextColor[surveyData?.approvalStatus]
            }  ${approvalStatusBGColor[surveyData?.approvalStatus]} dark:border-gray-600`}
          >
            <div className="flex items-center mx-auto">
              <p className={`flex items-center text-sm font-normal `}>
                <span className={'font-semibold'}>
                  "{surveyData?.approvalUpdatedBy}" has{' '}
                  {surveyData?.approvalStatus
                    ? getKeyByValueFromArrayObj(
                        APPROVAL_STATUS,
                        surveyData?.approvalStatus
                      ).toLowerCase()
                    : 'updated'}{' '}
                  the survey
                  {surveyData?.comment ? ` with comment: "${surveyData?.comment}"` : ''}!
                </span>
              </p>
            </div>
            <div className="flex items-center"></div>
            </div>}
          <div className="p-5 max-[640px]:p-5 py-4 px-8">
            <div className="flex-wrap md:flex gap-3 align-middle justify-center max-[780px]:pt-8 max-[640px]:pt-5">
              <ProgressBar />
            </div>
            <div className="py-3 flex w-full ">
              <div className="w-1/2 flex items-center justify-center">
                <img src={surveyData?.surveyLogo || altImg} loading='lazy' className="h-40 mb-3 border-1" alt="" />
              </div>
              <div className="w-1/2 flex items-center justify-center">
                <img src={surveyData?.surveyImage || altImg} loading='lazy' className="h-40 border-1" alt="" />
              </div>
            </div>
            <div className="font-bold text-3xl pt-8 dark:text-white">{surveyData?.surveyTitle}</div>
            <div>
              <div className="rounded-xl border-2 border-shoorah-primary mt-6 px-4">
                {surveyData?.questions?.map((item, i) => {
                  console.log('🚀 ~ {surveyData?.questions?.map ~ item:', item);
                  const itemId = item?._id || 'question-list-item-' + i;
                  return (
                    <div
                      key={itemId}
                      className="p-2 border-b-[1px] border-shoorah-primary last:border-b-0 mt-2"
                    >
                      <div className="font-semibold text-xl dark:text-white">
                        {i + 1}.{item?.title}
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
                                {opt}
                              </label>
                            </div>
                          );
                        })}
                        {/* <div className="flex justify-center">
                      {other ? (
                        <input
                          type="text"
                          className="mr-14 flex align-middle justify-start p-3 focus:outline-none max-[640px]:p-2 max-[640px]:mr-1 w-3/4 max-[640px]:w-full shadow rounded-full dark:text-white dark:bg-shoorah-darkBgColor"
                          placeholder="Enter optional answer"
                        ></input>
                      ) : (
                        ''
                      )}
                    </div> */}
                      </div>
                    </div>
                  );
                })}
              </div>
              {
              type &&
              <>
              <div className="flex justify-center">
                <div className="flex items-center justify-center pt-5 gap-2 w-3/6 max-[640px]:w-full ">
                  <label className="font-semiBold dark:text-white">
                    {SURVEY_CONSTANT.NEW_SURVEY_DURATION_TITLE}:{' '}
                  </label>
                  <label className="w-[100px] text-center dark:text-white font-semiBold">
                    <b>{surveyData?.surveyDuration}</b> Minute(s)
                  </label>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex items-center justify-center pt-5 gap-2 w-3/6 max-[640px]:w-full ">
                  <label className="font-semiBold dark:text-white">
                    {SURVEY_CONSTANT.NOTIFY_TIME}:{' '}
                  </label>
                  <label className="w-[100px] text-center dark:text-white font-semiBold">
                    <b>{surveyData?.notifyTime}</b>
                  </label>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex items-center justify-center pt-5 gap-2 w-3/6 max-[640px]:w-full ">
                  <label className="font-semiBold dark:text-white">
                    {SURVEY_CONSTANT.TARGET}:{' '}
                  </label>
                  <label className="w-[100px] text-center dark:text-white font-semiBold">
                    <b>{getKeyByValue(SURVEY_AREA, surveyData?.surveyArea)}</b>
                  </label>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="flex items-center justify-center pt-5 gap-2 w-3/6 max-[640px]:w-full ">
                  <label className="font-semiBold dark:text-white">{SURVEY_CONSTANT.SCOPE}: </label>
                  <label className="w-[100px] text-center dark:text-white font-semiBold">
                    <b>{getKeyByValue(SURVEY_SCOPE, surveyData?.templateCategory)}</b>
                  </label>
                </div>
              </div>
              </>}
              {console.log('🚀 ~ ViewSurveyApproval ~ type:', type)}
              {type === 'approval' && (
                <fieldset className="mt-4 flex flex-col items-center">
                  <div className="flex space-x-4">
                    {CONTENT_APPROVAL_STATUS.map((status, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          id={status.name}
                          name="surveyStatus"
                          type="radio"
                          value={status.value}
                          onChange={(e) => radioHandler(e)}
                          //   checked={status.value === form.status}
                          className="h-5 w-5 border-gray-300 text-shoorah-primary focus:ring-shoorah-primary cursor-pointer"
                        />
                        <label
                          htmlFor={status.name}
                          className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {status.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 min-w-[80%] md:min-w-[50%]">
                    <CommonTextarea
                      rows={4}
                      name="comment"
                      id="comment"
                      value={form.comment}
                      onChange={handleChange}
                      label="Comment"
                      // error={error.comment}
                      isRequired
                    />
                  </div>
                  <div className="mt-4 flex w-[50%] justify-center">
                    <div className="mr-2">
                      <SecondaryButton btnText="Cancel" btnType="button" />
                    </div>
                    <div className="ml-2">
                      <PrimaryButton disabled={isLoading} onClick={submitApproval} btnText="Save" />
                    </div>
                  </div>
                </fieldset>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

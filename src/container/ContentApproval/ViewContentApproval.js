import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../component/common/Breadcrumb';
import CommonInput from '../../component/common/Input/CommonInput';
import PropTypes from 'prop-types';
import { CONTENT_APPROVAL_STATUS, CONTENT_TYPE } from '../../utils/constants';
import CommonTextarea from '../../component/common/CommonTextarea';
import moment from 'moment';
import { Api } from '../../api';
import { errorToast, successToast } from '../../utils/helper';
import Loader from '../../component/common/Loader';
import { Helmet } from 'react-helmet';
import contentApprovalValidation from '../../validation/contentApprovalValidation';
import { useLocation, useNavigate } from 'react-router-dom';
import ApprovalHistory from '../../component/ApprovalHistory/ApprovalHistory';
import ConfirmPopup from '../../component/common/modals/ConfirmPopup';
import PrimaryButton from '../../component/common/Buttons/PrimaryButton';
import SecondaryButton from '../../component/common/Buttons/SecondaryButton';
import FormAudioPlayer from '../../component/AudioPlayer/FormAudioPlayer';
import { ReactComponent as NoDataFoundImg } from '../../assets/images/no-data-found.svg';

const pages = [
  { name: 'Content Approval', href: '/content-approval', current: false },
  {
    name: 'View Content Approval',
    href: '/content-approval/view',
    current: true
  }
];

export default function ViewContentApproval(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const prop = location?.state;

  const [form, setForm] = useState({
    name: '',
    focusName: '',
    comment: '',
    createdBy: '',
    createdOn: '',
    updatedBy: '',
    updatedOn: '',
    status: '',
    type: '',
    id: '',
    image: '',
    audioUrl: '',
    By: null,
    focusType: null,
    comments: []
  });
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [propsData, setPropsData] = useState({});
  useEffect(() => {
    let gen_id;
    if (location?.state) {
      let propsData = location?.state;
      setPropsData(location?.state);
      console.log(location.state);
      let arr = [];
      let contentType = '';
      if (propsData?.option) {
        if (propsData?.option === 2) {
          gen_id = propsData?.contentId || propsData?._id;
        } else if (propsData?.option === 1) {
          gen_id = propsData?.parentId;
        }
      } else {
        gen_id = propsData?.contentId || propsData?.content_type_id;
      }

      Api.getContentApprovalView(propsData.contentType || propsData.content_type, gen_id).then(
        (response) => {
          const contentApprovalData = response?.data?.data;
          if (response?.data?.meta?.code === 1) {
            contentApprovalData?.focus?.length > 0 &&
              contentApprovalData?.focus?.map((item) => {
                arr.push(item.display_name);
              });
            CONTENT_TYPE?.map((type) => {
              if (contentApprovalData.contentType === type.value) {
                contentType = type.name;
              }
            });
            setForm({
              id: contentApprovalData.id,
              name: contentApprovalData.displayName,
              focusName: arr,
              comment: '',
              createdBy: contentApprovalData?.createdBy?.name,
              createdOn: moment(contentApprovalData?.createdOn).format('YYYY-MM-DD'),
              updatedBy: contentApprovalData?.updatedBy?.name,
              updatedOn: moment(contentApprovalData?.updatedOn).format('YYYY-MM-DD'),
              status: contentApprovalData.contentStatus,
              type: propsData.contentType === 8 ? status(contentApprovalData) : contentType,
              description: contentApprovalData.description,
              image: contentApprovalData?.image,
              audioUrl: contentApprovalData?.url,
              By: contentApprovalData?.contentBy,
              focusType: contentApprovalData?.focusType,
              comments: contentApprovalData?.comments
            });
            setIsApproved(contentApprovalData?.contentStatus === 1);
            setLoader(false);
          } else if (response?.code === 401) {
            setLoader(false);
            errorToast(response?.message);
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        }
      );
    }
  }, [location?.state]);

  function status(contentApprovalData) {
    return contentApprovalData?.isTemplate ? 'survey Template' : 'survey';
  }

  const handleChange = (e) => {
    setError((prevState) => ({
      ...prevState,
      [e.target.name]: ''
    }));

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const radioHandler = (e) => {
    let { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: parseInt(value)
    }));
  };

  const handleSubmit = (e, fromPopup = false) => {
    e.preventDefault();
    const { errors, isValid } = contentApprovalValidation(form);
    if (isValid) {
      if (props?.location?.state && !fromPopup) {
        setOpenConfirmPopup(true);
      } else {
        setLoader(true);
        const payload = {
          contentStatus: form.status,
          id: form.id,
          comment: form.comment
        };
        Api.updateApproval(payload).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/content-approval');
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

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>View Content Approval | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />

      {loader ? (
        <Loader />
      ) : (
        <>
          {form?.id ? (
            <div className="mt-6 mx-3">
              <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-shoorah-darkBgTabColor dark:text-white rounded-[10px] px-6 py-10 w-full">
                  <div className="flex-wrap lg:flex gap-2">
                    <div className="grid content-center w-full  lg:gap-10 2xl:gap-20 lg:grid-cols-2">
                      <div className="space-y-6 mr-14 w-full">
                        <CommonInput
                          id="title"
                          name="title"
                          value={form.name}
                          onChange={handleChange}
                          type="text"
                          label="Name"
                          error={error.name}
                          disabled={true}
                        />
                        <CommonInput
                          id="type"
                          name="type"
                          value={form.type}
                          onChange={handleChange}
                          type="text"
                          label="Content Type"
                          error={error.name}
                          disabled={true}
                        />
                        <CommonTextarea
                          rows={6}
                          name="description"
                          id="description"
                          value={form.description}
                          onChange={handleChange}
                          label="Description"
                          error={error.description}
                          disabled={true}
                        />
                        {prop?.contentType === 1 && (
                          <CommonInput
                            id="type"
                            name="type"
                            value={form?.focusType === 1 ? 'Main' : 'Affirmation'}
                            onChange={handleChange}
                            type="text"
                            label="Focus Type"
                            error={error.name}
                            disabled={true}
                          />
                        )}
                        {prop?.contentType === 3 ||
                        prop?.contentType === 4 ||
                        prop?.contentType === 5 ? (
                          <div>
                            <div className="mt-4">
                              <label
                                htmlFor="meditationName"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Image
                              </label>
                              <div className="mt-1">
                                <div className="mx-auto border rounded-lg mt-2">
                                  <img
                                    src={form?.image}
                                    loading='lazy'
                                    className="mx-auto max-h-[250px]"
                                    alt="images"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {form?.type !== 'Focus' && (
                          <div>
                            {propsData.contentType !== 8 && (
                              <div className="block text-sm font-medium text-gray-700 mb-1">
                                Focus
                              </div>
                            )}
                            {form?.focusName?.length > 0 && (
                              <div className="flex flex-wrap">
                                {form?.focusName?.map((item, index) => {
                                  return (
                                    <div
                                      className="relative mr-2 mb-2 px-4 py-2 rounded-3xl w-fit bg-gray-200 text-sm"
                                      key={index}
                                    >
                                      {item}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          {isApproved ? (
                            <p className="mt-2 inline-flex rounded-full bg-green-100 font-semibold px-[20px] py-[7px] text-sm leading-5 capitalize text-green-700">
                              Approved
                            </p>
                          ) : (
                            <fieldset className="mt-4">
                              <div className="flex space-x-4">
                                {CONTENT_APPROVAL_STATUS.map((status, index) => (
                                  <div key={index} className="flex items-center">
                                    <input
                                      id={status.name}
                                      name="status"
                                      type="radio"
                                      value={status.value}
                                      onChange={(e) => radioHandler(e)}
                                      checked={status.value === form.status}
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
                            </fieldset>
                          )}
                        </div>
                        {(form?.status === 0 || form?.status === 2) && (
                          <CommonTextarea
                            rows={4}
                            name="comment"
                            id="comment"
                            value={form.comment}
                            onChange={handleChange}
                            label="Comment"
                            error={error.comment}
                            isRequired
                          />
                        )}
                      </div>
                      <div className="space-y-6 w-full mt-6 lg:mt-0">
                        <CommonInput
                          id="createdBy"
                          name="createdBy"
                          value={form.createdBy}
                          onChange={handleChange}
                          type="text"
                          label="Created by"
                          error={error.createdBy}
                          disabled={true}
                        />
                        <CommonInput
                          id="createdOn"
                          name="createdOn"
                          value={form.createdOn}
                          onChange={handleChange}
                          type="date"
                          label="Created On"
                          error={error.createdOn}
                          disabled={true}
                        />
                        <CommonInput
                          id="updatedBy"
                          name="updatedBy"
                          value={form.updatedBy}
                          onChange={handleChange}
                          type="text"
                          label="Updated by"
                          error={error.updatedBy}
                          disabled={true}
                        />
                        <CommonInput
                          id="updatedOn"
                          name="updatedOn"
                          value={form.updatedOn}
                          onChange={handleChange}
                          type="date"
                          label="Updated On"
                          error={error.updatedOn}
                          disabled={true}
                        />
                        {prop?.contentType === 3 ||
                        prop?.contentType === 4 ||
                        prop?.contentType === 5 ? (
                          <div className="w-full mt-6">
                            <label className="mb-0 block text-sm font-medium text-gray-700">
                              Audio
                            </label>
                            <FormAudioPlayer audio={form?.audioUrl} flag={1} />
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="grid content-center 2xl:w-1/2 lg:w-3/4 lg:gap-10 2xl:gap-20 lg:grid-cols-1">
                      <div className="space-y-6 w-full mt-6 lg:mt-0">
                        {!isApproved && (
                          <div className="text-right flex justify-end gap-x-4 ">
                            <SecondaryButton btnText="Cancel" btnType="button" />
                            <PrimaryButton btnText="Save" btnType="submit" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {form?.comments?.length > 0 && (
                    <ApprovalHistory data={form?.comments} title="Content approval" />
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="py-[20px] bg-white border-t border-[#EAEAEA]">
              <NoDataFoundImg
                className={`m-auto text-indigo-50 border border-shoorah-blue rounded-lg`}
              />
              <p className="text-center text-shoorah-gray4 text-sm mt-3">No results</p>
            </div>
          )}
        </>
      )}
      {openConfirmPopup && (
        <ConfirmPopup
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          message={'Are you sure you want to update content approval status?'}
          setAccepted={(e) => handleSubmit(e, true)}
        />
      )}
    </>
  );
}

ViewContentApproval.propTypes = {
  location: PropTypes.any
};

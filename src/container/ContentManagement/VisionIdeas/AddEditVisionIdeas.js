import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import { Api } from '../../../api';
import { STATUS } from '../../../utils/constants';
import { MaxCharlimit, errorToast, getLocalStorageItem, successToast } from '../../../utils/helper';

import Loader from '../../../component/common/Loader';
import Breadcrumb from '../../../component/common/Breadcrumb';
import CommonInput from '../../../component/common/Input/CommonInput';
import ConfirmPopup from '../../../component/common/modals/ConfirmPopup';
import SecondaryButton from '../../../component/common/Buttons/SecondaryButton';
import AddEditVisionIdeasVali from '../../../validation/AddEditVisionIdeasVali';
import ApprovalHistory from '../../../component/ApprovalHistory/ApprovalHistory';

export default function AddEditRituals(props) {
  const propsData = props?.location?.state;
  const navigate = useNavigate();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});

  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [isView, setIsView] = useState(false);
  const [pages, setPages] = useState([
    { name: 'Vision Ideas', href: '/content-management/vision-ideas' },
    {
      name: 'Add Vision Ideas',
      href: '/content-management/vision-ideas/add-edit'
    }
  ]);

  const [form, setForm] = useState({
    ideaId: '',
    ideaName: '',
    ideaStatus: 1,
    isDraft: false,
    contentType: 1,
    meditationBy: 0,
    status: 1,
    approvalStatus: '',
    comments: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    const updatedError = { ...error, [name]: '' };
    setError(updatedError);
    if (value.length <= MaxCharlimit) {
      setForm(updatedForm);
    }
  };
  const handleSubmit = (e, fromPopup = false) => {
    e.preventDefault();

    if (e?.target?.id === 'draft') {
      if (!form.ideaName) {
        return errorToast('Idea name is required.');
      }

      // draft api
      setLoader(true);
      if (propsData && !fromPopup) {
        setOpenConfirmPopup(true);
        setLoader(false);
      } else {
        const payload = {
          isDraft: true,
          approvalStatus: 0,
          ideaId: form.ideaId,
          ideaName: form.ideaName,
          ideaStatus: form.ideaStatus
        };

        Object.keys(payload).forEach((key) => {
          if (payload[key] === null) {
            delete payload[key];
          }
        });

        Api.addDraftVisionIdeas(payload).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/content-management/vision-ideas', {
              state: { flag: userData?.userType ? 0 : null }
            });
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        });
      }

      return;
    }

    // add ritual api
    const { isValid, errors } = AddEditVisionIdeasVali(form);
    if (isValid) {
      setLoader(true);
      if (propsData && !fromPopup) {
        setOpenConfirmPopup(true);
        setLoader(false);
      } else {
        const payload = {
          isDraft: false,
          ideaName: form.ideaName,
          ideaStatus: form.ideaStatus,
          ideaId: form?.ideaId || undefined,
          approvalStatus: parseInt(form.approvalStatus)
        };
        Api.addVisionIdeas(payload).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/content-management/vision-ideas', {
              state: { flag: userData?.userType ? 0 : null }
            });
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

  const radioHandler = (e) => {
    let { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: parseInt(value)
    }));
  };

  useEffect(() => {
    if (propsData) {
      setLoader(true);
      setPages([
        { name: 'Vision Ideas', href: '/content-management/vision-ideas' },
        {
          name: `${propsData?.action === 'view' ? 'View' : 'Edit'} Vision Ideas`,
          href: `/content-management/vision-ideas/${
            propsData?.action === 'view' ? 'view' : 'add-edit'
          }`
        }
      ]);

      setIsView(propsData?.action === 'view');

      Api.getVisionIdeasById(propsData?.id).then((response) => {
        if (response?.data?.meta?.code === 1) {
          setLoader(false);
          const visionIdeaData = response.data.data;

          setForm({
            ideaId: visionIdeaData.id,
            ideaName: visionIdeaData.ideaName,
            comments: visionIdeaData?.comments,
            ideaStatus: visionIdeaData.ideaStatus,
            approvalStatus: visionIdeaData.approvalStatus
          });
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
  }, [propsData]);

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {propsData ? (
          <title>Edit Vision Ideas | Shoorah Admin</title>
        ) : (
          <title>Add Vision Ideas | Shoorah Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />

      <div className="mt-6 px-3">
        <div className="bg-white dark:bg-shoorah-darkBgTabColor dark:text-white rounded-[10px] px-6 py-10">
          <div className="flex-wrap lg:flex gap-2">
            <div className="">
              <div className="space-y-6 mr-14 w-full">
                <div>
                  <CommonInput
                    id="ideaName"
                    name="ideaName"
                    value={form.ideaName}
                    onChange={handleChange}
                    type="text"
                    label="Idea Name"
                    error={error.ideaName}
                    isRequired
                    isLengthValidate
                    disabled={isView}
                  />
                </div>

                <div className={`${isView ? 'cursor-default' : 'cursor-pointer'}`}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Status
                  </label>
                  <fieldset className="mt-4">
                    <div className="flex space-x-4">
                      {STATUS.map((status, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="radio"
                            id={status.name}
                            name="ideaStatus"
                            disabled={isView}
                            value={status.value}
                            onChange={(e) => radioHandler(e)}
                            checked={status.value === form.ideaStatus}
                            className="h-5 w-5 border-gray-300 text-shoorah-primary focusIds:ring-shoorah-primary"
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

              {!isView && (
                <>
                  <div className="text-right mt-6 flex gap-4 justify-end flex-wrap">
                    <div>
                      <SecondaryButton btnText="Cancel" btnType="button" />
                    </div>
                    <button
                      onClick={(e) => handleSubmit(e)}
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
                </>
              )}
            </div>
          </div>
          {isView && form?.comments?.length > 0 && (
            <ApprovalHistory data={form?.comments} title="View" />
          )}
        </div>
      </div>

      {openConfirmPopup && (
        <ConfirmPopup
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          setAccepted={(e) => handleSubmit(e, true)}
          message={'Are you sure you want to update vision ideas details?'}
        />
      )}
    </>
  );
}

AddEditRituals.propTypes = {
  location: PropTypes.any
};

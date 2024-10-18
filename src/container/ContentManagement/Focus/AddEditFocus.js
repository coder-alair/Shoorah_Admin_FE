import Breadcrumb from '../../../component/common/Breadcrumb';
import { useEffect, useState } from 'react';
import { Api } from '../../../api';
import Loader from '../../../component/common/Loader';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { MaxCharlimit, errorToast, getLocalStorageItem, successToast } from '../../../utils/helper';
import { FOCUS_TYPE, STATUS } from '../../../utils/constants';
import FocusAddEditValidation from '../../../validation/focusAddEditValidation';
import { Helmet } from 'react-helmet';
import CommonInput from '../../../component/common/Input/CommonInput';
import PrimaryButton from '../../../component/common/Buttons/PrimaryButton';
import SecondaryButton from '../../../component/common/Buttons/SecondaryButton';
import ConfirmPopup from '../../../component/common/modals/ConfirmPopup';
import ApprovalHistory from '../../../component/ApprovalHistory/ApprovalHistory';

function AddEditFocus(props) {
  let location = useLocation();
  let propsData = location?.state;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: '',
    name: '',
    status: 1,
    focusType: 1,
    approvalStatus: '',
    comments: []
  });
  const [error, setError] = useState({});
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const [loader, setLoader] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [isView, setIsView] = useState(false);
  const [openConfirmPopupDraft, setOpenConfirmPopupDraft] = useState(false);
  const [openConfirmPopupSave, setOpenConfirmPopupSave] = useState(false);
  const [pages, setPages] = useState([
    { name: 'Focus', href: '/content-management/focus' },
    { name: 'Add focus', href: '/content-management/focus/add-edit' }
  ]);

  useEffect(() => {
    if (propsData) {
      setLoader(true);
      setPages([
        { name: 'Focus', href: '/content-management/focus' },
        {
          name: `${propsData?.action === 'view' ? 'View' : 'Edit'} focus`,
          href: `/content-management/focus/${propsData?.action === 'view' ? 'view' : 'add-edit'}`
        }
      ]);
      setIsView(propsData?.action === 'view');
      Api.getFocusById(propsData?.id).then((response) => {
        const focusData = response?.data?.data;
        if (response?.data?.meta?.code === 1) {
          setLoader(false);
          setForm({
            id: focusData.id,
            name: focusData.focusName,
            status: focusData.focusStatus,
            focusType: focusData.focusType,
            approvalStatus: focusData.approvalStatus,
            comments: focusData?.comments
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    const updatedError = { ...error, [name]: '' };
    setError(updatedError);
    if (value.length <= MaxCharlimit) {
      setForm(updatedForm);
    }
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
    const { errors, isValid } = FocusAddEditValidation(form);

    if (isValid) {
      if (propsData && !fromPopup) {
        setOpenConfirmPopupSave(true);
      } else {
        setLoader(true);
        const payload = {
          focusId: form.id,
          focusName: form.name,
          focusType: parseInt(form.focusType),
          focusStatus: parseInt(form.status),
          approvalStatus: parseInt(form.approvalStatus),
          isDraft: false
        };
        Api.addEditFocus(payload).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/content-management/focus', {
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

  const handleDraft = (e, fromPopup = false) => {
    e.preventDefault();
    if (!form.name) {
      errorToast('Name can not be empty');
      return;
    }

    if (propsData && !fromPopup) {
      setOpenConfirmPopupDraft(true);
    }

    let payload = {
      focusId: form.id,
      focusName: form.name,
      focusType: parseInt(form.focusType),
      focusStatus: parseInt(form.status),
      approvalStatus: parseInt(form.approvalStatus),
      isDraft: true
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === null) {
        delete payload[key];
      }
    });

    Api.addEditDraftFocus(payload).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setLoader(false);
        successToast(response?.data?.meta?.message);
        navigate('/content-management/focus', {
          state: { flag: userData?.userType ? 0 : null }
        });
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });

    return;
  };

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {propsData ? (
          <title>Edit Focus | Shoorah Admin</title>
        ) : (
          <title>Add Focus | Shoorah Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-shoorah-darkBgTabColor  dark:text-white rounded-[10px] px-6 py-10">
            <div className="flex-wrap lg:flex gap-4">
              <div className="space-y-6 m-auto lg:m-0 w-full lg:w-[430px]">
                <CommonInput
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  label="Focus Name"
                  error={error.name}
                  disabled={isView}
                  isRequired
                  isLengthValidate
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Focus type
                  </label>
                  <fieldset className="mt-4">
                    <div className="flex space-x-4">
                      {FOCUS_TYPE.map((focus, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            id={focus.name}
                            name="focusType"
                            type="radio"
                            value={focus.value}
                            disabled={isView}
                            onChange={(e) => radioHandler(e)}
                            checked={focus.value === form.focusType}
                            className={`h-5 w-5 border-gray-300 text-shoorah-primary focus:ring-shoorah-primary ${
                              isView ? 'cursor-default' : 'cursor-pointer'
                            }`}
                          />
                          <label
                            htmlFor={focus.name}
                            className="ml-3 block text-sm font-medium text-gray-700 dark:text-white"
                          >
                            {focus.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div>
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
                            disabled={isView}
                            value={status.value}
                            onChange={(e) => radioHandler(e)}
                            checked={status.value === form.status}
                            className={`h-5 w-5 border-gray-300 text-shoorah-primary focus:ring-shoorah-primary ${
                              isView ? 'cursor-default' : 'cursor-pointer'
                            } `}
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
                {!isView && (
                  <div className="text-right mt-12  flex gap-x-4">
                    <div className="hidden lg:block">
                      <SecondaryButton btnText="Cancel" btnType="button" />
                    </div>

                    {/* TODO: admin check */}
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
                    <PrimaryButton
                      btnText={userData?.userType ? 'Submit For Approval' : 'Submit'}
                      btnType="submit"
                    />
                  </div>
                )}
              </div>
            </div>

            {isView && form?.comments?.length > 0 && (
              <ApprovalHistory data={form?.comments} title="View" />
            )}
          </div>
        </form>
      </div>
      {openConfirmPopupSave && (
        <ConfirmPopup
          open={openConfirmPopupSave}
          setOpen={setOpenConfirmPopupSave}
          message={'Are you sure you want to update focus details?'}
          setAccepted={(e) => handleSubmit(e, true)}
        />
      )}
      {openConfirmPopupDraft && (
        <ConfirmPopup
          open={openConfirmPopupDraft}
          setOpen={setOpenConfirmPopupDraft}
          message={'Are you sure you want to update focus details?'}
          setAccepted={(e) => handleDraft(e, true)}
        />
      )}
    </>
  );
}

AddEditFocus.propTypes = {
  location: PropTypes.any
};

export default AddEditFocus;

import Breadcrumb from '../../../component/common/Breadcrumb';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { AFFIRMATION_TYPE, STATUS } from '../../../utils/constants';
import { ArrowUpTrayIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { Api } from '../../../api';
import { Helmet } from 'react-helmet';
import affirmationValidation from '../../../validation/affirmationValidation';
import {
  MaxCharlimitLongText,
  errorToast,
  getLocalStorageItem,
  successToast
} from '../../../utils/helper';
import Loader from '../../../component/common/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import CommonInput from '../../../component/common/Input/CommonInput';
import CommonTextarea from '../../../component/common/CommonTextarea';
import SecondaryButton from '../../../component/common/Buttons/SecondaryButton';
import ConfirmPopup from '../../../component/common/modals/ConfirmPopup';
import ApprovalHistory from '../../../component/ApprovalHistory/ApprovalHistory';
import CustomSelect from '../../../component/common/CustomSelect';

function AddEditAffirmation(props) {
  let location = useLocation();
  let propsData = location?.state;
  const navigate = useNavigate();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});
  const [focusList, setFocusList] = useState([]);
  const [selectedFocus, setSelectedFocus] = useState([]);
  const [focusListIDs, setFocusListIDs] = useState([]);
  const [openConfirmPopupDraft, setOpenConfirmPopupDraft] = useState(false);
  const [openConfirmPopupSave, setOpenConfirmPopupSave] = useState(false);

  const [isView, setIsView] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    status: 1,
    affirmationType: 1,
    approvalStatus: '',
    csvFile: '',
    comments: []
  });
  const [pages, setPages] = useState([
    { name: 'Affirmation', href: '/content-management/affirmation' },
    {
      name: 'Add Affirmation',
      href: '/content-management/affirmation/add-edit'
    }
  ]);

  useEffect(() => {
    if (propsData) {
      setLoader(true);
      setPages([
        { name: 'Affirmation', href: '/content-management/affirmation' },
        {
          name: `${propsData?.action === 'view' ? 'View' : 'Edit'} Affirmation`,
          href: `/content-management/affirmation/${
            propsData?.action === 'view' ? 'view' : 'add-edit'
          }`
        }
      ]);
      setIsView(propsData?.action === 'view');
      Api.getAffirmationById(propsData?.id || propsData?._id).then((response) => {
        const affirmationData = response?.data?.data;
        if (response?.data?.meta?.code === 1) {
          let arr = [];
          affirmationData?.focus?.map((item) => {
            arr.push({
              id: item?._id,
              name: item?.display_name,
              checked: true
            });
          });
          setSelectedFocus(arr);
          const Ids = affirmationData?.focus.map(function (i) {
            return i._id;
          });
          setForm({
            id: affirmationData?.id || affirmationData?._id,
            name: affirmationData.affirmationName,
            description: affirmationData.description ? affirmationData.description : '',
            status: affirmationData.affirmationStatus,
            affirmationType: 2,
            focusIds: Ids,
            approvalStatus: affirmationData.approvalStatus,
            csvFile: affirmationData.csfFile ? affirmationData.csvFile : '',
            comments: affirmationData?.comments
          });
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
      });
    }
  }, [propsData]);

  useEffect(() => {
    Api.getCategoriesById(2).then((res) => {
      setCategoriesList(res?.data?.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    const updatedError = { ...error, [name]: '' };
    setError(updatedError);
    if (!(name === 'description' && value.length > MaxCharlimitLongText)) {
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

  const handleDraft = (e, fromPopup = false) => {
    // draft api
    e.preventDefault();

    let tempFocusIdArray = selectedCategory.map((data) => {
      return data?.value;
    });

    tempFocusIdArray = [].concat(...tempFocusIdArray);

    if (!form.name && !form.csvFile) {
      errorToast('Name or Csv file is required');
      return;
    }

    if (form.affirmationType === 1) {
      if (true) {
        if (propsData && !fromPopup) {
          return setOpenConfirmPopupDraft(true);
        }
        const Ids = tempFocusIdArray;

        let formData = new FormData();
        formData.append('csvFile', form.csvFile);
        formData.append('affirmationType', 1);
        formData.append('focusIds', JSON.stringify(Ids));

        Api.addEditAffirmationCSV(formData, 2).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/content-management/affirmation', {
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
    }

    if (form.affirmationType === 2) {
      if (true) {
        if (propsData && !fromPopup) {
          return setOpenConfirmPopupDraft(true);
        }

        const Ids = tempFocusIdArray;

        setForm({ ...form, focusIds: Ids });

        const payload = {
          affirmationId: form.id,
          affirmationType: form.affirmationType,
          affirmationName: form.name,
          description: form.description,
          affirmationStatus: form.status,
          focusIds: form.focusIds,
          approvalStatus: 0,
          isDraft: true
        };

        Object.keys(payload).forEach((key) => {
          if (payload[key] === null) {
            delete payload[key];
          }
        });
        Api.addEditDraftAffirmation(payload).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/content-management/affirmation', {
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
    }
    return;
  };

  const handleSubmit = (e, fromPopup = false) => {
    e.preventDefault();

    let tempFocusIdArray = selectedCategory.map((data) => {
      return data?.value;
    });

    tempFocusIdArray = [].concat(...tempFocusIdArray);

    const { isValid, errors } = affirmationValidation(form, selectedCategory.value);
    setError(errors);
    if (form.affirmationType === 1) {
      if (isValid) {
        if (propsData && !fromPopup) {
          return setOpenConfirmPopupSave(true);
        }

        const Ids = tempFocusIdArray;

        let formData = new FormData();
        formData.append('csvFile', form.csvFile);
        formData.append('affirmationType', 1);
        formData.append('focusIds', JSON.stringify(Ids));

        Api.addEditAffirmationCSV(formData, 2).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/content-management/affirmation', {
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
    }

    if (form.affirmationType === 2) {
      if (isValid) {
        if (propsData && !fromPopup) {
          return setOpenConfirmPopupSave(true);
        }
        const Ids = [...tempFocusIdArray];

        setForm({ ...form, focusIds: Ids });

        const payload = {
          affirmationId: form.id,
          affirmationType: form.affirmationType,
          affirmationName: form.name,
          description: form.description,
          affirmationStatus: form.status,
          focusIds: form.focusIds,
          approvalStatus: parseInt(form.approvalStatus),
          isDraft: false
        };
        Api.addEditAffirmation(payload).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/content-management/affirmation', {
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
    }
  };

  const handleSelectedFocusList = (list) => {
    setFocusListIDs(list);
    if (list?.length > 0) {
      const { errors } = affirmationValidation(form, list);
      setError(errors);
    }
  };

  const handleCSVSelect = (e) => {
    setError({});
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.files[0]
    }));
  };

  useEffect(() => {
    Api.getFocusNamesList(2).then((response) => {
      setFocusList(response?.data?.data);
    });
  }, []);

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {propsData ? (
          <title>Edit Affirmation | Shoorah Admin</title>
        ) : (
          <title>Add Affirmation | Shoorah Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <div>
          <div className="px-4 sm:px-6 py-10 rounded-[10px] dark:bg-shoorah-darkBgTabColor  dark:text-white bg-white gap-4">
            <div className="space-y-6 m-auto lg:m-0 w-full lg:w-[430px]">
              {propsData?.action !== 'view' && propsData?.action !== 'edit' && (
                <div>
                  <fieldset className="mt-4">
                    <div className="space-x-4 flex">
                      {AFFIRMATION_TYPE.map((affirmation_type, index) => (
                        <div key={index} className="flex items-center self-center">
                          <input
                            id={affirmation_type.name}
                            name="affirmationType"
                            type="radio"
                            value={affirmation_type.value}
                            onChange={(e) => radioHandler(e)}
                            checked={affirmation_type.value === form.affirmationType}
                            className={
                              propsData?.action === 'edit' || isView
                                ? affirmation_type.value !== form.affirmationType
                                  ? 'cursor-not-allowed'
                                  : ''
                                : 'h-5 w-5 border-gray-300 dark:text-white text-shoorah-primary focus:ring-shoorah-primary cursor-pointer'
                            }
                          />
                          <label
                            htmlFor={affirmation_type.name}
                            className="ml-3 block text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
                          >
                            {affirmation_type.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
              {form.affirmationType === 1 && (
                <div className="my-10">
                  <div className="mt-4 flex items-center lg:flex-row flex-col gap-y-4">
                    <button className="px-4 lg:py-3 py-1 rounded-[65px] border border-[#EAEAEA] dark:text-white text-[#4A56DB]">
                      <label htmlFor="dropzone-file" className="cursor-pointer">
                        <ArrowUpTrayIcon className="w-[20px] inline mr-2" />
                        Select CSV file
                      </label>
                    </button>
                    <span className="ml-4">
                      <a
                        href="https://d12231i07r54en.cloudfront.net/app_configs/affirmation-sample.csv"
                        className="text-shoorah-primary underline underline-offset-4"
                      >
                        Download sample file
                        <ArrowDownTrayIcon className="w-[20px] inline ml-3" />
                      </a>
                    </span>
                  </div>
                  <label className="text-m text-gray-400">
                    {form.csvFile ? form.csvFile.name : null}
                  </label>
                  <span className="error text-xs text-red-400">{!isView && error.csv}</span>

                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    name="csvFile"
                    onChange={(e) => handleCSVSelect(e)}
                    accept=".csv"
                    disabled={isView}
                  />

                  <div className="mt-5 mb-3">
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
                  </div>
                </div>
              )}
              {form.affirmationType === 2 && (
                <>
                  <CommonInput
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    disabled={isView}
                    label="Affirmations Name"
                    error={error.name}
                    isRequired
                  />
                  <CommonTextarea
                    rows={4}
                    name="description"
                    id="description"
                    value={form.description}
                    onChange={handleChange}
                    disabled={isView}
                    label="Description"
                    isLengthValidate
                  />
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
                              }`}
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
                </>
              )}

              {!isView && (
                <div className="text-right mt-12 flex gap-x-4 ">
                  <div className=" hidden lg:block">
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
                    type="submit"
                    id="submit"
                    onClick={handleSubmit}
                    className="border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary rounded-3xl py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2"
                  >
                    {userData?.userType ? 'Submit For Approval' : 'Submit'}
                  </button>
                </div>
              )}
            </div>
            {isView && form?.comments?.length > 0 && (
              <ApprovalHistory data={form?.comments} title="View" />
            )}
          </div>
        </div>
      </div>
      {openConfirmPopupDraft && (
        <ConfirmPopup
          open={openConfirmPopupDraft}
          setOpen={setOpenConfirmPopupDraft}
          message={'Are you sure you want to update affirmation details?'}
          setAccepted={(e) => handleDraft(e, true)}
        />
      )}
      {openConfirmPopupSave && (
        <ConfirmPopup
          open={openConfirmPopupSave}
          setOpen={setOpenConfirmPopupSave}
          message={'Are you sure you want to update affirmation details?'}
          setAccepted={(e) => handleSubmit(e, true)}
        />
      )}
    </>
  );
}

AddEditAffirmation.propTypes = {
  location: PropTypes.any
};

export default AddEditAffirmation;

import React, { useEffect } from 'react';
import { useState } from 'react';
import Breadcrumb from '../../../component/common/Breadcrumb';
import { STATUS } from '../../../utils/constants';
import MultipleSelect from '../../../component/common/MultipleSelect';
import { Api } from '../../../api';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import CommonInput from '../../../component/common/Input/CommonInput';
import SecondaryButton from '../../../component/common/Buttons/SecondaryButton';
import { MaxCharlimit, errorToast, getLocalStorageItem, successToast } from '../../../utils/helper';
import Loader from '../../../component/common/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import AddEditRitualsVali from '../../../validation/AddEditRitualsVali';
import ConfirmPopup from '../../../component/common/modals/ConfirmPopup';
import ApprovalHistory from '../../../component/ApprovalHistory/ApprovalHistory';
import CustomSelect from '../../../component/common/CustomSelect';

export default function AddEditRituals(props) {
  let location = useLocation();
  let propsData = location?.state;
  const navigate = useNavigate();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const [categoriesList, setCategoriesList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});
  const [selectedFocus, setSelectedFocus] = useState([]);
  const [focusListIDs, setFocusListIDs] = useState([]);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [isView, setIsView] = useState(false);
  const [pages, setPages] = useState([
    { name: 'Rituals', href: '/content-management/rituals' },
    {
      name: 'Add Ritual',
      href: '/content-management/rituals/add-edit'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState([]);

  const [form, setForm] = useState({
    ritualId: '',
    ritualName: '',
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

    let tempFocusIdArray = selectedCategory.map((data) => {
      return data?.value;
    });

    tempFocusIdArray = [].concat(...tempFocusIdArray);
    if (e?.target?.id === 'draft') {
      if (!form.ritualName) {
        return errorToast('Ritual name is required.');
      }

      // draft api
      setLoader(true);
      if (propsData && !fromPopup) {
        setOpenConfirmPopup(true);
        setLoader(false);
      } else {
        const focusIds = focusListIDs.map((item) => {
          return item.id;
        });
        const payload = {
          ritualId: form.ritualId,
          ritualName: form.ritualName,
          focusIds: tempFocusIdArray,
          ritualStatus: form.status,
          approvalStatus: 0
        };

        Object.keys(payload).forEach((key) => {
          if (payload[key] === null) {
            delete payload[key];
          }
        });
        Api.addDraftRitual(payload).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/content-management/rituals', {
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
    const { isValid, errors } = AddEditRitualsVali(form, selectedCategory);
    if (isValid) {
      setLoader(true);
      if (propsData && !fromPopup) {
        setOpenConfirmPopup(true);
        setLoader(false);
      } else {
        const focusIds = focusListIDs.map((item) => {
          return item.id;
        });
        const payload = {
          ritualId: form.ritualId,
          ritualName: form.ritualName,
          focusIds: tempFocusIdArray,
          ritualStatus: form.status,
          approvalStatus: parseInt(form.approvalStatus)
        };
        Api.addRitual(payload).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/content-management/rituals', {
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
    Api.getCategoriesById(7).then((res) => {
      setCategoriesList(res?.data?.data);
    });

    // Api.getFocusNamesList(1).then((response) => {
    //   setCategoriesList(response?.data?.data);
    // });
  }, []);

  useEffect(() => {
    if (propsData) {
      setLoader(true);
      setPages([
        { name: 'Rituals', href: '/content-management/rituals' },
        {
          name: `${propsData?.action === 'view' ? 'View' : 'Edit'} Ritual`,
          href: `/content-management/rituals/${propsData?.action === 'view' ? 'view' : 'add-edit'}`
        }
      ]);

      setIsView(propsData?.action === 'view');
      let arr = [];
      Api.getRitualById(propsData?.id).then((response) => {
        if (response?.data?.meta?.code === 1) {
          setLoader(false);
          const ritualData = response.data.data;

          ritualData?.focus?.map((item) => {
            arr.push({
              id: item?._id,
              name: item.display_name,
              checked: true
            });
          });
          setSelectedFocus(arr);
          setForm({
            ritualId: ritualData?.id,
            ritualName: ritualData?.ritualName,
            contentType: ritualData?.ritualType,
            status: ritualData?.ritualStatus,
            approvalStatus: ritualData?.approvalStatus,
            comments: ritualData?.comments
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

  const handleSelectedFocusList = (list) => {
    setFocusListIDs(list);
    if (list?.length > 0) {
      const { errors } = AddEditRitualsVali(form, list);
      setError(errors);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {propsData ? (
          <title>Edit Ritual | Shoorah Admin</title>
        ) : (
          <title>Add Ritual | Shoorah Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />

      <div className="mt-6 px-3">
        <div className="bg-white dark:bg-shoorah-darkBgTabColor dark:text-white rounded-[10px] px-6 py-10">
          <div className="flex-wrap lg:flex gap-2">
            <div className="grid content-center sm:w-full 2xl:w-2/3 lg:w-full lg:gap-5 2xl:gap-10 lg:grid-cols-2">
              <div className="space-y-6 mr-14 w-full">
                <div>
                  <CommonInput
                    id="ritualName"
                    name="ritualName"
                    value={form.ritualName}
                    onChange={handleChange}
                    type="text"
                    label="Ritual Name"
                    error={error.ritualName}
                    isRequired
                    isLengthValidate
                    disabled={isView}
                  />
                </div>
                <div>
                  <CustomSelect
                    data={categoriesList}
                    selected={selectedCategory}
                    setSelected={setSelectedCategory}
                    label={'Select Category'}
                    disabled={isView}
                    isMultiple={true}
                  />
                  <span className="error text-xs text-red-400">{error.focus}</span>
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
                            id={status.name}
                            name="status"
                            type="radio"
                            value={status.value}
                            onChange={(e) => radioHandler(e)}
                            disabled={isView}
                            checked={status.value === form.status}
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
                  <div className="space-y-6 w-full mt-6 lg:mt-0"> </div>
                  <div className="text-right flex gap-x-4 justify-end">
                    <div className="lg:block hidden">
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
          message={'Are you sure you want to update ritual details?'}
          setAccepted={(e) => handleSubmit(e, true)}
        />
      )}
    </>
  );
}

AddEditRituals.propTypes = {
  location: PropTypes.any
};

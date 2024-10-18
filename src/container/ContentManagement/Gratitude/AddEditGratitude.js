import React, { useEffect } from 'react';
import { useState } from 'react';
import Breadcrumb from '../../../component/common/Breadcrumb';
import ToggleSwitch from '../../../component/common/ToggleSwitch';
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import { CONTENT_TYPE_WITH_TEXT, STATUS } from '../../../utils/constants';
import MultipleSelect from '../../../component/common/MultipleSelect';
import { Api } from '../../../api';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import CommonInput from '../../../component/common/Input/CommonInput';
import PrimaryButton from '../../../component/common/Buttons/PrimaryButton';
import SecondaryButton from '../../../component/common/Buttons/SecondaryButton';
import AddEditGratituteVali from '../../../validation/AddEditGratituteVali';
import { errorToast, getLocalStorageItem, successToast } from '../../../utils/helper';
import Loader from '../../../component/common/Loader';
import ConfirmPopup from '../../../component/common/modals/ConfirmPopup';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AddEditGratitude(props) {
  let location = useLocation();
  const [toggleValue, setToggleValue] = useState(false);
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const [focusList, setFocusList] = useState([]);
  const [selectedFocus, setSelectedFocus] = useState([]);
  const [focusListIDs, setFocusListIDs] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [pages, setPages] = useState([
    { name: 'Gratitude', href: '/content-management/gratitude' },
    { name: 'Add Gratitude', href: '/content-management/gratitude/add-edit' }
  ]);
  const [form, setForm] = useState({
    gratitudeId: '',
    gratitudeTitle: '',
    gratitudeType: 1,
    gratitudeStatus: 1,
    approvalStatus: ''
  });
  const navigate = useNavigate();
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

  const handleSubmit = (e, fromPopup = false) => {
    e.preventDefault();
    const { isValid, errors } = AddEditGratituteVali(form, focusListIDs);
    if (isValid) {
      if (props?.location?.state && !fromPopup) {
        setOpenConfirmPopup(true);
      } else {
        const focusIds = focusListIDs.map((item) => {
          return item.id;
        });
        const payload = {
          gratitudeId: form.gratitudeId,
          gratitudeTitle: form.gratitudeTitle,
          gratitudeType: form.gratitudeType,
          focusIds: focusIds,
          isKnowledgeCategory: toggleValue,
          gratitudeStatus: form.gratitudeStatus,
          gratitudeUrl: '/sdasdf',
          duration: '01:12',
          thumbnail: 'asfasf',
          approvalStatus: parseInt(form.approvalStatus)
        };
        Api.addGratitude(payload).then((response) => {
          if (response.data.meta.code === 1) {
            setLoader(false);
            successToast(response.data.meta.message);
            navigate('/content-management/gratitude');
          } else if (response.data.meta.code === 0) {
            setLoader(false);
            errorToast(response.data.meta.message);
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
    Api.getFocusNamesList(1).then((response) => {
      setFocusList(response?.data?.data);
    });
  }, []);

  useEffect(() => {
    if (location?.state) {
      setLoader(true);
      setPages([
        { name: 'Gratitude', href: '/content-management/gratitude' },
        {
          name: 'Edit Gratitude',
          href: '/content-management/gratitude/add-edit'
        }
      ]);
      let propsData = location?.state;
      let arr = [];
      Api.getGratitudeList('', '', '', '', '', propsData.id).then((response) => {
        if (response?.data?.meta?.code === 1) {
          setLoader(false);
          const gratitudeData = response?.data?.data[0];
          gratitudeData?.focus?.map((item) => {
            arr.push({
              id: item?._id,
              name: item.display_name,
              checked: true
            });
          });
          setForm({
            gratitudeId: gratitudeData.id,
            gratitudeTitle: gratitudeData.gratitudeTitle,
            gratitudeType: gratitudeData.gratitudeType,
            gratitudeStatus: gratitudeData.gratitudeStatus,
            approvalStatus: gratitudeData.approvalStatus
          });
          setSelectedFocus(arr);
          setToggleValue(gratitudeData.isKnowledgeCategory);
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
  }, [location?.state]);

  const handleSelectedFocusList = (list) => {
    setFocusListIDs(list);
    if (list?.length > 0) {
      const { errors } = AddEditGratituteVali(form, list);
      setError(errors);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {props?.location?.state ? (
          <title>Edit Gratitude | Shoorah Admin</title>
        ) : (
          <title>Add Gratitude | Shoorah Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div>
        <div className="px-4 sm:px-6 py-10 rounded-[10px] bg-white mt-6">
          <form className="mx-auto 2xl:w-[80%]" onSubmit={handleSubmit}>
            <div className="grid content-center lg:gap-20 2xl:gap-40 lg:grid-cols-2">
              <div className="space-y-6 mr-14 w-full">
                <CommonInput
                  id="gratitudeTitle"
                  name="gratitudeTitle"
                  value={form.gratitudeTitle}
                  type="text"
                  onChange={handleChange}
                  label="Gratitude Text"
                  error={error.gratitudeTitle}
                  isRequired
                />
                <div>
                  <MultipleSelect
                    data={focusList}
                    selectedFocus={selectedFocus}
                    handleSelectedFocusList={handleSelectedFocusList}
                    label={'Select focus'}
                  />
                  <span className="error text-xs text-red-400">{error.focus}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    is Contain Video / Image?
                  </label>
                  <fieldset className="mt-4">
                    <div className="flex space-x-4">
                      {CONTENT_TYPE_WITH_TEXT.map((gratitudeType, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            id={gratitudeType.name}
                            name="gratitudeType"
                            type="radio"
                            value={gratitudeType.value}
                            onChange={(e) => radioHandler(e)}
                            checked={gratitudeType.value === form.gratitudeType}
                            className="h-5 w-5 border-gray-300 text-shoorah-primary focus:ring-shoorah-primary cursor-pointer"
                          />
                          <label
                            htmlFor={gratitudeType.name}
                            className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            {gratitudeType.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <fieldset className="mt-4">
                    <div className="flex space-x-4">
                      {STATUS.map((status, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            id={status.name}
                            name="gratitudeStatus"
                            type="radio"
                            value={status.value}
                            onChange={(e) => radioHandler(e)}
                            checked={status.value === form.gratitudeStatus}
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Add this into Knowledge Category?
                  </label>
                  <div className="mt-3">
                    <ToggleSwitch toggleValue={toggleValue} setToggleValue={setToggleValue} />
                  </div>
                </div>
              </div>
              <div className="space-y-6 w-full mt-6 lg:mt-0">
                <div>
                  <div className="mt-1">
                    <button className="block w-full rounded-3xl appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-base">
                      <ArrowUpTrayIcon className="w-[20px] inline mr-3" />
                      Upload
                    </button>
                  </div>
                </div>
                <div>
                  <div className="">
                    <label htmlFor="thubnail" className="block text-sm font-medium text-gray-700">
                      Thumbnail
                    </label>
                    <div className="border border-dashed rounded-3xl w-[250px] h-[150px] flex justify-center items-center mt-1">
                      <div>
                        <ArrowUpTrayIcon className="w-[20px] mr-3 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-gray-500">select video thumbnail</p>
                      </div>
                    </div>
                  </div>
                  {/* <span className='error text-xs text-red-400'>{error.email}</span> */}
                </div>
              </div>
            </div>
            <div className="text-right mt-10">
              <SecondaryButton btnText="Cancel" btnType="button" />
              <PrimaryButton
                btnText={userData?.userType ? 'Submit For Approval' : 'Submit'}
                btnType="submit"
              />
            </div>
          </form>
        </div>
      </div>
      {openConfirmPopup && (
        <ConfirmPopup
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          message={'Are you sure you want to update gratitude details?'}
          setAccepted={(e) => handleSubmit(e, true)}
        />
      )}
    </>
  );
}

AddEditGratitude.propTypes = {
  location: PropTypes.any
};

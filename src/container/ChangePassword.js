import React, { useState } from 'react';
import { Api } from '../api';
import Breadcrumb from '../component/common/Breadcrumb';
import Loader from '../component/common/Loader';
import { errorToast, successToast } from '../utils/helper';
import changePassValidations from '../validation/changePassValidations';
import CommonInput from '../component/common/Input/CommonInput';
import PrimaryButton from '../component/common/Buttons/PrimaryButton';

const pages = [{ name: 'Change Password', href: '/change-password', current: true }];

export default function ChangePassword() {
  const [form, setForm] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = changePassValidations(form);
    if (isValid) {
      setLoader(true);
      const payload = {
        oldPassword: form.password,
        newPassword: form.newPassword
      };
      const response = await Api.changePassword(payload);
      if (response?.data?.meta?.code === 1) {
        setForm({
          password: '',
          newPassword: '',
          confirmPassword: ''
        });
        setLoader(false);
        successToast(response?.data?.meta?.message);
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      }
    }
    setError(errors);
    setLoader(false);
  };

  return (
    <>
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      <div className="mt-6 mx-3 flex-wrap lg:flex px-4 py-10 rounded-[10px] dark:bg-shoorah-darkBgTabColor dark:text-white bg-white gap-4">
        {/* <div className='text-[28px] font-bold'>Change Password</div> */}
        <div className="sm:w-[430px] w-full">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <CommonInput
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                label="Enter old password"
                error={error.password}
                classNames="px-4 py-2 sm:px-5 sm:py-3"
                isRequired
                placeholder="Please enter your old password"
                isIcon
              />
              <CommonInput
                id="newPassword"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                label="Enter new password"
                classNames="px-4 py-2 sm:px-5 sm:py-3"
                error={error.newPassword}
                isRequired
                placeholder="Please enter new password"
                isIcon
              />
              <CommonInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                label="Confirm new password"
                error={error.confirmPassword}
                classNames="px-4 py-2 sm:px-5 sm:py-3"
                placeholder="Please re-enter new password"
                isRequired
                isIcon
              />
              <div className="text-end">
                <PrimaryButton btnText={'Save'} btnType="submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

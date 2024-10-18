import React, { useEffect, useState } from 'react';
import { ArrowPathIcon, ChevronLeftIcon } from '@heroicons/react/20/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import { errorToast, getLocalStorageItem, successToast } from '../utils/helper';
import { Api } from '../api';
import Loader from '../component/common/Loader';
import resetPasswordValidation from '../validation/resetPasswordValidation';
import LeftImage from '../assets/images/left-image.svg';
import CommonInput from '../component/common/Input/CommonInput';
import Timer from '../component/common/Timer';
import validator from 'validator';

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const email = query.get('email');

  const [form, setForm] = useState({
    otp: '',
    new_password: '',
    confirm_password: ''
  });
  const [loader, setLoader] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const [error, setError] = useState({});

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

  useEffect(() => {
    if (getLocalStorageItem('token') && getLocalStorageItem('userData')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleResendOtp = () => {
    setLoader(true);
    const payload = {
      email: email
    };
    Api.forgotPassword(payload).then((response) => {
      if (response?.data?.meta?.code === 3) {
        setLoader(false);
        successToast(response?.data?.meta?.message);
        setTimeUp(false);
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = resetPasswordValidation(form);
    if (isValid) {
      setLoader(true);
      const payload = {
        email: email,
        otp: form.otp,
        newPassword: form.new_password
      };
      Api.resetPassword(payload).then((response) => {
        if (response?.data?.meta?.code === 1) {
          setLoader(false);
          successToast(response?.data?.meta?.message);
          navigate('/login');
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      });
    } else {
      setLoader(false);
      setError(errors);
    }
  };

  useEffect(() => {
    if (form.new_password?.length > 5 && form.confirm_password?.length > 5) {
      if (!validator.equals(form.new_password, form.confirm_password)) {
        setError({
          confirm_password: 'New password and confirm password do not match.',
          new_password: 'New password and confirm password do not match.',
          otp: error.otp
        });
      } else {
        setError({
          confirm_password: '',
          new_password: '',
          otp: error.otp
        });
      }
    } else {
      setError({
        confirm_password: '',
        new_password: '',
        otp: error.otp
      });
    }
  }, [form.new_password, form.confirm_password]);

  return (
    <>
      {loader && <Loader />}
      <div className="flex h-screen">
        <div className="lg:w-[50%] relative hidden lg:block">
          <img
            className="absolute inset-0 h-screen w-full object-cover"
            src={LeftImage}
            loading='lazy'
            alt="login left image"
          />
        </div>
        <div className="w-full lg:w-[50%] flex flex-col justify-center bg-white">
          <div className="mx-auto w-full px-4 sm:px-[100px] lg:px-[30px] xl:px-[100px] 2xl:px-[230px]">
            <div>
              <h2 className="text-3xl lg:text-4xl font-semibold">
                Reset <span className="text-shoorah-secondary">Password</span>
              </h2>
              <p className="mt-2 mb-3 text-[#0B0F18]">
                Enter the OTP which has been sent to your registered email address.
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="relative">
                      <CommonInput
                        id="otp"
                        name="otp"
                        type="text"
                        value={form.otp}
                        onChange={handleChange}
                        error={error.otp}
                        label="Enter OTP"
                        classNames="px-4 py-2 sm:px-5 sm:py-3"
                        placeholder="Enter OTP"
                        isRequired
                      />
                      <div className={`flex justify-between ${error.otp ? '' : 'mt-2'}`}>
                        {timeUp ? (
                          <div className={`flex`}>
                            <span className="text-shoorah-secondary text-sm ml-1">
                              Didn&lsquo;t receive code?
                            </span>
                          </div>
                        ) : (
                          <div className={`flex`}>
                            <Timer setTimeUp={setTimeUp} />
                          </div>
                        )}
                        <div
                          className={`flex ${
                            timeUp ? 'text-shoorah-secondary cursor-pointer' : 'text-gray-300'
                          }`}
                          onClick={() => {
                            timeUp && handleResendOtp();
                          }}
                        >
                          <ArrowPathIcon className="w-[20px]" />
                          <span className="text-sm ml-1">Resend OTP</span>
                        </div>
                      </div>
                    </div>
                    <CommonInput
                      id="new_password"
                      name="new_password"
                      type="password"
                      value={form.new_password}
                      onChange={handleChange}
                      label="Enter new password"
                      error={error.new_password}
                      classNames="px-4 py-2 sm:px-5 sm:py-3"
                      placeholder="Enter new password"
                      isRequired
                      isIcon
                    />

                    <CommonInput
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      value={form.confirm_password}
                      onChange={handleChange}
                      label="Confirm New Password"
                      error={error.confirm_password}
                      classNames="px-4 py-2 sm:px-5 sm:py-3"
                      placeholder="Enter your password"
                      isRequired
                      isIcon
                    />
                  </div>

                  <div className="text-center mt-10">
                    <button
                      type="submit"
                      className="rounded-3xl w-full border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex w-auto justify-center mt-10 items-center mx-auto">
                <div onClick={() => navigate('/login')}>
                  <ChevronLeftIcon className="cursor-pointer self-center w-[25px] ml-auto text-shoorah-secondary border border-shoorah-secondary rounded-full" />
                </div>
                <span
                  onClick={() => navigate('/login')}
                  className="cursor-pointer ml-2 self-center text-base text-shoorah-secondary"
                >
                  Back to login
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;

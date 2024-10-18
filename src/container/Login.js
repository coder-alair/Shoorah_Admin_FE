import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Api } from '../api';
import loginValidation from '../validation/loginValidation';
import { Link, useNavigate } from 'react-router-dom';
import {
  errorToast,
  getLocalStorageItem,
  setLocalStorageItem,
  successToast,
  useOutsideClick
} from '../utils/helper';
import Loader from '../component/common/Loader';
import CommonInput from '../component/common/Input/CommonInput';
import LeftImage from '../assets/images/left-image.svg';
import RightImage from '../assets/images/new-shoorah-logo.svg';

import { Dialog } from '@headlessui/react';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  let [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const wrapperRef = useRef(null);

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

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
      if (userData?.userType === 0 || userData?.userType === 1) {
        navigate('/dashboard');
      } else if (userData?.userType === 3 || userData?.userType === 4) {
        navigate(`/${userData?.slug}/dashboard`);
      } else if (userData?.userType === 5) {
        navigate(`/partner-dashboard`);
      } else if (userData?.userType === 6) {
        navigate(`/expert-dashboard`);
      } else {
        navigate(`/login`);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = loginValidation(form);
    if (isValid) {
      setLoader(true);
      const payload = {
        email: form.email,
        password: form.password
      };
      Api.login(payload).then((response) => {
        if (response?.data?.meta?.code === 2) {
          // setLocalStorageItem("token", response?.data?.meta?.token);
          // setLocalStorageItem("userData", JSON.stringify(response?.data?.data));
          // setLocalStorageItem(
          //   "refreshToken",
          //   response?.data?.meta?.refreshToken
          // );
          // setLoader(false);
          // if (response?.data?.data?.userType) {
          //   if (response?.data?.data?.slug) {
          //     navigate(`${response?.data?.data?.slug}/dashboard`);
          //   } else {
          //     errorToast("Something went wrong with company creds !");
          //   }
          // } else {
          //   navigate("/dashboard");
          // }
          setIsOtpOpen(true);
          successToast(
            `Otp sent successfully to your registered email, if not found please check your junk or spam folder.`
          );
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

  const handleOtp = (e) => {
    e.preventDefault();
    setLoader(true);

    let payload = {
      email: form.email,
      otp: otpValue
    };

    Object.keys(payload).forEach((key) => payload[key] === null && delete payload[key]);

    Api.adminVerifyOtp(payload).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setLocalStorageItem('token', response?.data?.meta?.token);
        setLocalStorageItem('userData', JSON.stringify(response?.data?.data));
        setLocalStorageItem('refreshToken', response?.data?.meta?.refreshToken);
        setLoader(false);
        if (response?.data?.data?.userType === 3 || response?.data?.data?.userType === 4) {
          if (response?.data?.data?.slug) {
            window.location.href = `/${response?.data?.data?.slug}/dashboard`;
          }
        }
        if (response?.data?.data?.userType === 5) {
          window.location.href = `/partner-dashboard`;
        } else if (response?.data?.data?.userType === 0 || response?.data?.data?.userType === 1) {
          window.location.href = '/dashboard';
        } else if (response?.data?.data?.userType === 6) {
          response?.data?.data?.expertApprove === 'false'
            ? navigate(`/expert-me`)
            : navigate(`/expert-dashboard`);
        }
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  return (
    <>
      {loader && <Loader />}
      <div className="flex relative h-screen bg-white dark:bg-shoorah-darkBgTabColor  dark:text-white ">
        <div className="lg:w-[50%] relative hidden lg:block">
          <img
            className="absolute inset-0 h-screen w-full object-cover"
            src={LeftImage}
            loading='lazy'
            alt="login left image"
          />
        </div>

        <motion.div
          initial={{
            x: 100,
            opacity: 0
          }}
          animate={{
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.5
            }
          }}
          className="w-full lg:w-[50%] flex flex-col  justify-evenly"
        >
          <div className="flex w-full justify-center items-end">
            <img
              className=" min-h-[60px] w-[10rem] sm:w-[14rem] lg:hidden"
              src={RightImage}
              loading='lazy'
              alt="right image"
            />
            <p className="mb-[8px] lg:hidden text-shoorah-secondary font-semibold text-lg">
              Business
            </p>
          </div>
          <div className="mx-auto  w-full px-4 sm:px-[100px] lg:px-[30px] xl:px-[100px] 2xl:px-[180px]">
            <div>
              <h2 className="text-3xl lg:text-4xl font-semibold">
                Welcome <span className="text-shoorah-secondary">back!</span>
              </h2>
              <p className="mt-2 mb-3 dark:text-white text-[#0B0F18]">
                Please login to your account
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <CommonInput
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    label="Email"
                    error={error.email}
                    classNames="px-4 py-2 sm:px-5 sm:py-3"
                    placeholder="Enter your email"
                    isRequired
                  />

                  <div className="space-y-1">
                    <CommonInput
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      label="Password"
                      error={error.password}
                      classNames="px-4 py-2 sm:px-5 sm:py-3"
                      placeholder="Enter your password"
                      isRequired
                      isIcon
                    />
                    <div className="flex items-center justify-end">
                      {/*<div className='flex items-center'>*/}
                      {/*  <input*/}
                      {/*    id='remember-me'*/}
                      {/*    name='remember-me'*/}
                      {/*    type='checkbox'*/}
                      {/*    className='h-4 w-4 rounded accent-shoorah-primary border-gray-300 text-shoorah-primary focus:ring-shoorah-primary'*/}
                      {/*  />*/}
                      {/*  <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>*/}
                      {/*    Remember me*/}
                      {/*  </label>*/}
                      {/*</div>*/}

                      <div className="text-sm">
                        <Link
                          to={'/forgot-password'}
                          className="font-medium text-shoorah-primary hover:text-shoorah-secondary"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary w-full py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={isOtpOpen} onClose={() => setIsOtpOpen(false)} className="relative z-50">
        <div
          className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-black/30 px-4"
          aria-hidden="true"
        >
          <form
            onSubmit={handleOtp}
            className=" relative flex h-auto w-full flex-col items-center justify-center gap-y-4 rounded-2xl bg-white p-4 xl:w-[40vw]"
          >
            <svg
              onClick={() => {
                setIsOtpOpen(false);
                setLoader(false);
              }}
              className="absolute right-4 top-2 h-6 w-6 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <h4 className="text-2xl font-semibold">
              Please Enter the <span className={` text-3xl text-shoorah-secondary`}>OTP</span>
            </h4>
            <div>
              <p className="mb-1 text-center text-base">
                Please enter the OTP sent to your email{' '}
                <span className={`text-shoorah-secondary font-semibold`}> {form.email}</span>
              </p>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => {
                  setOtpValue(e.target.value);
                }}
                placeholder="######"
                className={`block w-full appearance-none rounded-3xl border border-gray-300 px-4 py-2 text-center text-2xl font-semibold placeholder-gray-400 outline-none sm:px-5 sm:py-3 focus:outline-none sm:text-md`}
              />
              <p className="mt-2 flex items-center justify-center gap-x-2 text-sm text-gray-400">
                Didn't received OTP?{' '}
                <span
                  onClick={(e) => {
                    // successToast(
                    //   `Otp sent successfully to your registered ${
                    //     isEmailOpted ? "email" : "phone number"
                    //   }, if no found please check your junk folder`
                    // );
                    handleSubmit(e);
                  }}
                  className={` text-shoorah-secondary cursor-pointer font-semibold`}
                >
                  Resend
                </span>
              </p>
            </div>
            <div className="w-full text-center">
              <button
                disabled={otpValue.length < 4}
                type="submit"
                className={`rounded-3xl border border-transparent disabled:bg-gray-500 bg-shoorah-primary  w-full px-10 py-2 text-sm font-medium text-white shadow-sm sm:py-3 focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}

export default Login;

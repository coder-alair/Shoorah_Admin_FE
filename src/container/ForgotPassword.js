import React, { useEffect, useState } from 'react';
import { errorToast, getLocalStorageItem, successToast } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { Api } from '../api';
import Loader from '../component/common/Loader';
import forgotPassValidation from '../validation/forgotPasswordValidation';
import LeftImage from '../assets/images/left-image.svg';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import CommonInput from '../component/common/Input/CommonInput';

function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: ''
  });

  const [loader, setLoader] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = forgotPassValidation(form);
    if (isValid) {
      setLoader(true);
      const payload = {
        email: form.email
      };
      Api.forgotPassword(payload).then((response) => {
        if (response?.data?.meta?.code === 3) {
          setLoader(false);
          successToast(response?.data?.meta?.message);
          navigate(`/reset-password?email=${form.email}`);
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

  return (
    <>
      {loader && <Loader />}
      <div className="flex h-screen ">
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
                Forgot <span className="text-shoorah-secondary">Password</span>
              </h2>
              <p className="mt-2 mb-3 text-[#0B0F18]">
                Enter registered email address to get the OTP for reset password
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <CommonInput
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    label="Email Address"
                    error={error.email}
                    classNames="px-4 py-2 sm:px-5 sm:py-3"
                    placeholder="Enter your email"
                    isRequired
                  />

                  <div className="text-center">
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

export default ForgotPassword;

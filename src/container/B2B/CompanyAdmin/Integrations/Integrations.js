import React, { Fragment, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../../../component/common/Breadcrumb';
import { getLocalStorageItem, isSuperAdmin, useOutsideClick } from '../../../../utils/helper';
import { Transition } from '@headlessui/react';
import slack from '../../../../assets/images/slack.png';
import zapier from '../../../../assets/images/zapier.png';
import teams from '../../../../assets/images/teams.png';

function Integrations() {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const pages = [{ name: 'Integrations', href: `/${userData.slug}/integrations`, current: true }];
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const location = useLocation();
  const wrapperRef = useRef(null);

  const handleGoBack = () => {
    if (isSuperAdmin()) {
      navigate('/dashboard');
    } else {
      navigate(`/${userData?.slug}/dashboard`);
    }
  };

  useOutsideClick(wrapperRef, () => {
    if (popup) setPopup(!popup);
  });

  return (
    <div className="h-screen flex flex-col">
      <Helmet>
        <meta charSet="utf-8" />
        <title>B2B | Integrations</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="flex relative mx-3 my-3 rounded-3xl flex-grow flex-col dark:bg-shoorah-darkBgTabColor  bg-white pt-16 pb-12">
        <button
          className="absolute right-3 top-3 rounded-3xl py-2 sm:py-3 px-6 text-sm font-medium text-white shadow-sm border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2"
          onClick={(e) => {
            setPopup(!popup);
          }}
          ref={wrapperRef}
        >
          Instructions
        </button>
        <Transition
          show={popup}
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute p-5 right-[0px] sm:right-[14px] z-[2] w-[100%] sm:w-[400px] lg:w-[500px] dark:bg-shoorah-darkBgTabColor dark:text-white mx-auto  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  ">
            <div className="flex mx-3 my-5 px-5 rounded-3xl flex-grow flex-col dark:bg-shoorah-darkBgTabColor  bg-white pt-6 pb-3">
              <div>
                <h1 className="text-3xl font-semibold text-[#3a47ab]">
                  Now integrations on zapier is available with shoorah
                </h1>
                <span className="text-xs">
                  Use zapier to integrate with shoorah and get daily nudges, reports stats, solution
                  details directly on your any sync app.
                </span>
              </div>

              <div className="mt-[2rem] flex flex-col items-center">
                <h1 className="text-xl font-semibold text-center">
                  First login to your zapier dashboard{' '}
                </h1>
                <a className="text-lg mt-2 text-decoration-none" href="https://zapier.com/app/home">
                  ( click here )
                </a>
                <h1 className="text-xl font-semibold">↓ </h1>
              </div>

              <div className="mt-[1rem] flex flex-col items-center">
                <h1 className="text-xl font-semibold text-center">Create a zap </h1>
                <h1 className="text-xl font-semibold">↓ </h1>
              </div>
              <div className="mt-[1rem] flex flex-col items-center">
                <h1 className="text-xl font-semibold text-center">
                  Choose triggers like scheduler or any other app trigger
                </h1>
                <h1 className="text-xl font-semibold">↓ </h1>
              </div>

              <div className="mt-[1rem] flex flex-col items-center">
                <h1 className="text-xl font-semibold text-center">
                  then add action and choose shoorah app
                </h1>
                <h1 className="text-xl font-semibold">↓ </h1>
              </div>

              <div className="mt-[1rem] flex flex-col items-center">
                <h1 className="text-xl font-semibold text-center">
                  set the required settings and sync with your desired app
                </h1>
                <h1 className="text-xl font-semibold">↓ </h1>
              </div>

              <div className="mt-[1rem] flex flex-col items-center">
                <h1 className="text-xl font-semibold text-center">
                  Congratulations your automation with shoorah is done.
                </h1>
              </div>
            </div>
          </div>
        </Transition>

        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex w-[200px] md:w-[50%] flex-col md:flex-row items-center justify-center gap-[1rem] mx-auto">
            <img src={slack} alt="slack" loading='lazy' className="w-full animate-pulse h-[110px] md:h-[100px]" />
            <img src={zapier} alt="slack" loading='lazy' className="w-full animate-pulse	 h-[110px] md:h-[100px]" />
            <img src={teams} alt="slack" loading='lazy' className="w-full animate-pulse	  h-[110px] md:h-[100px]" />
          </div>
          <div className="py-16">
            <div className="text-center">
              <h1 className="mt-2 text-2xl font-bold tracking-tight dark:text-white text-gray-900 sm:text-3xl">
                Zapier is available for your integration...
              </h1>
              {/* <p className="mt-2 text-base dark:text-white text-gray-500">
                We are working on it and will notify about availability soon.
              </p> */}
              <div className="mt-6">
                <a
                  // onClick={handleGoBack}
                  target="_blank"
                  href="https://zapier.com/app/home"
                  className="text-base font-medium dark:text-white text-shoorah-primary hover:text-shoorah-primary"
                  rel="noreferrer"
                >
                  Go to zapier
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Integrations;

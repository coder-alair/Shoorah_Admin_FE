import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalStorageItem } from '../utils/helper';

const NotFound = () => {
  const navigate = useNavigate();
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const handleGoBack = () => {
    if (userData.userType === 3 || userData.userType === 4) {
      navigate(`/${userData?.slug}/dashboard`);
    } else if (userData.userType === 5) {
      navigate(`/partner-dashboard`);
    } else if (userData.userType === 6) {
      navigate(`/expert-dashboard`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <div className="flex h-screen flex-col bg-white pt-16 pb-12">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <p className="text-base font-semibold text-shoorah-primary">404</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Page not found.
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Sorry, we couldn’t find the page you’re looking for.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleGoBack}
                  type="button"
                  className="text-base font-medium text-shoorah-primary hover:text-shoorah-primary"
                >
                  Go back home
                  <span aria-hidden="true"> &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default NotFound;

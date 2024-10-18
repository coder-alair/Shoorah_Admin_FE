import React from 'react';
import PropTypes from 'prop-types';
import { XCircleIcon } from '@heroicons/react/24/solid';

const UploadImg = ({ id, title, onChange, onRemove, image }) => {
  return (
    <>
      <div className="relative flex max-[460px]:w-full text-shoorah-offWhite mt-3 marker:flex xl:w-auto rounded-3xl appearance-none px-3 py-2 placeholder-gray-400  focus:outline-none focus:ring-shoorah-primary sm:text-white bg-shoorah-secondary font-sans text-base font-semibold">
        <div className="w-full">
          <label className="flex items-center">
            <svg
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-[20px] inline mr-3 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            {title}
            <input
              id={id}
              type="file"
              accept=".jpg, .jpeg, .png"
              className="hidden"
              onChange={onChange}
            />
          </label>
        </div>
        {image && (
          <div>
            <XCircleIcon
              className="absolute h-6 w-6 rounded-full bg-white drop-shadow-2 text-red-600 right-4 top-[-12px]"
              onClick={onRemove}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default UploadImg;

UploadImg.propTypes = {
  title: PropTypes.any,
  onChange: PropTypes.func,
  onRemove: PropTypes.func
};

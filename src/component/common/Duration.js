import React from 'react';
import PropTypes from 'prop-types';

export default function Duration({ min, sec, setSec, setMin, disabled }) {
  const secondChange = (type, count) => {
    if (type === 'increment') {
      if (count === 59) {
        setSec(0);
        setMin(min + 1);
      } else {
        setSec(sec + 1);
      }
    }
    if (type === 'decrement' && count > 0) setSec(sec - 1);
  };
  const minutesChange = (type, count) => {
    if (type === 'increment' && count < 60) setMin(min + 1);
    if (type === 'decrement' && count > 0) setMin(min - 1);
  };
  return (
    <div>
      <div className="mt-2 flex-wrap flex">
        <div className="py-2 mr-10">
          <div className="text-sm text-gray-500 dark:text-white"> Minutes </div>
          <div className="flex mt-3">
            <div className="self-center">
              <button
                type="button"
                className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                onClick={() => minutesChange('decrement', min)}
                disabled={disabled}
              >
                {' '}
                -
              </button>
            </div>
            <div className="flex justify-center items-center mx-4 dark:bg-shoorah-darkBgColor dark:text-white bg-white rounded-3xl w-[80px] h-[37px] text-shoorah-secondary">
              <p className="m-0">{min} mins </p>
            </div>
            <div className="self-center">
              <button
                type="button"
                className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                onClick={() => minutesChange('increment', min)}
                disabled={disabled}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="py-2">
          <div className="text-sm text-gray-500 dark:text-white"> Seconds </div>
          <div className="flex mt-3">
            <div className="self-center">
              <button
                type="button"
                className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                onClick={() => secondChange('decrement', sec)}
                disabled={disabled}
              >
                -
              </button>
            </div>
            <div className="flex justify-center items-center mx-4 dark:bg-shoorah-darkBgColor dark:text-white bg-white text-shoorah-secondary rounded-3xl w-[80px] h-[37px]">
              <p className="m-0">{sec} sec </p>
            </div>
            <div className="self-center">
              <button
                type="button"
                className="px-3 py-1 rounded-3xl border border-[#4A56DB] text-[#4A56DB] disabled:text-gray-400 disabled:border-gray-400"
                onClick={() => secondChange('increment', sec)}
                disabled={disabled}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Duration.propTypes = {
  min: PropTypes.any,
  sec: PropTypes.any,
  setMin: PropTypes.any,
  setSec: PropTypes.any,
  disabled: PropTypes.bool
};

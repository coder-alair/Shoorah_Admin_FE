import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useOutsideClick } from '../../utils/helper';

let blockEvent = false;

const CustomSelectBox = ({
  label,
  hasOption,
  optionLabel,
  options,
  selectedOptions,
  onChange,
  extra,
  name,
  ...rest
}) => {
  const wrapperRef = useRef(null);
  const [opened, setOpened] = useState(false);
  const [openOption, setOpenOption] = useState(true);
  const isActive = selectedOptions.length > 0 ? true : false;

  const handelSelectClick = () => {
    blockEvent = true;
    setOpened(() => !opened);
  };

  useOutsideClick(wrapperRef, () => {
    !blockEvent && setOpened(false);

    setTimeout(() => {
      blockEvent = false;
    }, 1000);
  });

  return (
    <div
      key={name}
      className="custom-select-box select-none cursor-pointer relative rounded-full bg-shoorah-secondary text-white"
      {...rest}
      ref={wrapperRef}
    >
      <div
        onClick={() => handelSelectClick()}
        className="flex items-center justify-between p-2 pl-6 pr-6 max-[540px]:basis-full"
      >
        <div className="grow uppercase whitespace-nowrap">{label}</div>
        <div>
          {!opened ? (
            <ChevronDownIcon key={name + '-down-icon'} className="h-6 w-6 text-white" />
          ) : (
            <ChevronUpIcon key={name + '-up-icon'} className="h-6 w-6 text-white" />
          )}
        </div>
      </div>
      {opened && (
        <div
          className="absolute top-[50px] left-[16px] w-full pb-4 z-50"
          style={{ width: 'calc(100% - 32px)' }}
        >
          <div className="border-1 text-black rounded-xl shadow-lg bg-white p-3 w-full dark:text-white dark:bg-shoorah-darkBgTabColor">
            {extra}
            {options.length > 0 && (
              <div>
                {hasOption && (
                  <div>
                    <div
                      onClick={() => setOpenOption((prev) => !prev)}
                      className="rounded-full text-sm items-center flex bg-shoorah-secondary text-white p-1 pl-4 pr-4"
                    >
                      <div className="grow">{optionLabel}</div>
                      <div>
                        {!openOption ? (
                          <ChevronDownIcon className="h-5 w-5 text-white" />
                        ) : (
                          <ChevronUpIcon className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {openOption && (
                  <div
                    className={`mt-1 dark:bg-shoorah-darkBgColor ${
                      hasOption
                        ? 'text-black dark:text-white border-1 rounded-xl shadow-lg bg-white w-full p-3'
                        : ''
                    }`}
                  >
                    <div className="flex gap-2 text-sm " style={{ flexFlow: 'column' }}>
                      {options.map((option) => {
                        const { name, value } = option;
                        const selected = selectedOptions.includes(value);
                        return (
                          <div
                            key={'item-sub-option-' + value}
                            className="flex gap-2 w-full justify-between items-start"
                            onClick={() =>
                              onChange(
                                selected
                                  ? selectedOptions.filter((item) => item !== value)
                                  : [...selectedOptions, value]
                              )
                            }
                          >
                            <div>{name}</div>
                            <RadioButton checked={selected} style={{ marginTop: 4 }} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              className={
                isActive
                  ? 'rounded-full bg-shoorah-secondary text-white mt-3 p-1 w-full text-sm'
                  : 'rounded-full bg-shoorah-secondary opacity-25 text-white text-center p-1 mt-3 w-full text-sm'
              }
              disabled={!isActive}
              onClick={handelSelectClick}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function RadioButton({ checked, ...rest }) {
  return (
    <input
      {...rest}
      type="radio"
      checked={checked}
      className="w-4 border-gray-300 text-shoorah-primary focus:ring-shoorah-primary cursor-pointer"
    />
  );
}

CustomSelectBox.defaultProps = {
  options: [],
  extra: <></>,
  label: 'Select',
  hasOption: true,
  onChange: () => {},
  optionLabel: 'Select',
  selectedOptions: []
};

CustomSelectBox.propTypes = {
  extra: PropTypes.any,
  label: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  hasOption: PropTypes.bool,
  optionLabel: PropTypes.string,
  selectedOptions: PropTypes.array
};

export default CustomSelectBox;

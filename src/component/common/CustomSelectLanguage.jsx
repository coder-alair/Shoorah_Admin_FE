import { Fragment, useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { ChevronDownIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { useOutsideClick } from '../../utils/helper';
import PropTypes from 'prop-types';

const CustomSelectLanguage = ({ data, label, disabled, selected, setSelected, isMultiple }) => {
  const wrapperRef = useRef(null);
  const [show, setShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    let tempArr = [];
    data?.map((item) => {
      tempArr.push({
        id: item?.id,
        name: item?.name,
        value: item?.focuses
      });
    });
    setDataList(tempArr);
  }, [data]);

  useOutsideClick(wrapperRef, () => {
    if (show) setShow(!show);
  });

  const handleMultiSelect = (item) => {
    const index = selected?.findIndex((obj) => obj.name === item.name);

    if (index === -1) {
      // If no object with the same name is found, add the new object to the array
      setSelected([
        ...selected,
        {
          name: item?.name,
          value: [...item?.value]
        }
      ]);
    } else {
      // If an object with the same name is found, remove it from the array
      const array = [...selected];
      array.splice(index, 1);
      setSelected(array);
    }
  };

  return (
    <div className={!disabled ? 'cursor-pointer' : 'cursor-default'}>
      {!disabled && (
        <div
          className="relative inline-block text-left mt-1"
          style={{ width: '-webkit-fill-available' }}
          ref={wrapperRef}
        >
          <div
            onClick={() => {
              !disabled && setShow(!show);
            }}
            className={`${
              disabled
                ? 'bg-gray-50'
                : 'bg-white dark:bg-shoorah-darkBgColor dark:border-none dark:text-white'
            } flex justify-between w-full rounded-3xl mr-4 py-2 pt-3 text-sm overflow-hidden font-medium text-gray-300 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary`}
          >
            {/* {label} here */}
            {isMultiple ? (
              selected.length > 0 ? (
                <div className="items-center gap-2">
                  {selected.map((data) => (
                    <span
                      className="relative flex gap-x-1 mt-2 whitespace-nowrap bg-shoorah-primary px-1 rounded-full text-white items-center"
                      key={data.value}
                    >
                      {data.name}

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-2 h-2"
                        onClick={() => handleMultiSelect(data)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  ))}
                </div>
              ) : (
                'Please Select'
              )
            ) : selected ? (
              selected?.name
            ) : (
              label + ' here'
            )}
            <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
          </div>

          <Transition
            show={show}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="absolute bg-white cursor-pointer overflow-auto left-0 z-10 my-2 w-full origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 max-h-[150px] h-auto">
                <div>
                  {dataList?.length > 0 &&
                    dataList?.map((item, index) => {
                      return (
                        <div
                          onClick={() => {
                            if (isMultiple) {
                              handleMultiSelect(item);

                              return;
                            }

                            setSelected({
                              name: item?.name,
                              value: [...item?.value]
                            });
                            setShow(!show);
                          }}
                          className="relative flex items-start p-2"
                          key={index}
                        >
                          <div className="ml-3 text-sm cursor-pointer">
                            <label
                              htmlFor={item.name}
                              className="font-medium text-gray-700 flex items-center"
                            >
                              {isMultiple &&
                                !(selected?.findIndex((obj) => obj.name === item.name) === -1) && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m4.5 12.75 6 6 9-13.5"
                                    />
                                  </svg>
                                )}
                              {item.name}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  {isMultiple && false && (
                    <input
                      onChange={(e) => {
                        const data = e.target.value.trim();
                        if (data === '') {
                          return;
                        }
                        setNewCategory(data);
                      }}
                      onKeyDown={(e) => {
                        if (newCategory === '') {
                          return;
                        }

                        if (e.key === 'Enter') {
                          handleMultiSelect({
                            name: newCategory,
                            value: newCategory
                          });

                          setNewCategory('');
                        }
                      }}
                      className="ml-4 w-[80%] mb-2 appearance-none text-sm cursor-pointer"
                      type="text"
                      value={newCategory}
                      placeholder="Add New"
                    />
                  )}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      )}
    </div>
  );
};

CustomSelectLanguage.propTypes = {
  data: PropTypes.any,
  selectedFocus: PropTypes.any,
  disabled: PropTypes.bool,
  handleSelectedFocusList: PropTypes.any,
  label: PropTypes.string
};

export default CustomSelectLanguage;

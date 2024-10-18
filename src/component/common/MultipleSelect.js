import { Fragment, useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { ChevronDownIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { useOutsideClick } from '../../utils/helper';
import PropTypes from 'prop-types';

const MultipleSelect = ({ data, label, selectedFocus, handleSelectedFocusList, disabled }) => {
  const wrapperRef = useRef(null);
  const [show, setShow] = useState(false);
  const [arr, setArr] = useState([]);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    let tempArr = [];
    setArr(selectedFocus);
    data?.map((item) => {
      tempArr.push({
        id: item?.id,
        name: item.focusName,
        checked: selectedFocus?.some((e) => e.id === item.id)
      });
    });
    setDataList(tempArr);
  }, [data, selectedFocus]);

  useEffect(() => {
    handleSelectedFocusList(arr);
  }, [arr]);

  const handleCheckbox = (e, item) => {
    if (e?.target?.checked) {
      dataList?.map((data) => {
        if (data.id === item.id) {
          let tempArr = [{ name: item.name, id: item?.id, checked: true }];
          let filterData = dataList.map((obj) => tempArr.find((o) => o.id === obj.id) || obj);
          setDataList(filterData);
        }
      });
      setArr((prevState) => [...prevState, { name: item.name, id: item?.id, checked: true }]);
    } else {
      dataList?.map((data) => {
        if (data.id === item.id) {
          let tempArr = [{ name: item.name, id: item?.id, checked: false }];
          let filterData = dataList.map((obj) => tempArr.find((o) => o.id === obj.id) || obj);
          setDataList(filterData);
        }
      });
      const filterData = arr.filter((data) => data.id !== item.id);
      setArr(filterData);
    }
  };

  const deleteCapsule = (item) => {
    let tempArr = [{ name: item.name, id: item?.id, checked: false }];
    let filterData = dataList.map((obj) => tempArr.find((o) => o.id === obj.id) || obj);
    setDataList(filterData);
    const filterArrData = arr.filter((data) => data.id !== item.id);
    setArr(filterArrData);
  };

  useOutsideClick(wrapperRef, () => {
    if (show) setShow(!show);
  });

  return (
    <div className={!disabled ? 'cursor-pointer' : 'cursor-default'}>
      <label
        htmlFor="meditationName"
        className="block text-sm font-medium dark:text-white text-gray-700"
      >
        {disabled ? 'Focus' : label} {!disabled && <span className="text-red-400">&#42;</span>}
      </label>

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
              disabled ? 'bg-gray-50' : 'bg-white'
            } flex justify-between w-full rounded-3xl dark:bg-shoorah-darkBgColor dark:border-none dark:text-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary`}
          >
            {label} here
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
            <div className="absolute bg-white overflow-auto left-0 z-10 my-2  w-full origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 max-h-[150px] h-auto">
                <div>
                  {dataList?.length > 0 &&
                    dataList?.map((item, index) => {
                      return (
                        <div className="relative flex items-start p-2" key={index}>
                          <div className="flex h-5 items-center">
                            <input
                              id={item.name}
                              name="comments"
                              checked={item?.checked}
                              type="checkbox"
                              onChange={(e) => handleCheckbox(e, item)}
                              className="h-4 w-4 rounded border-gray-300 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="ml-3 text-sm cursor-pointer">
                            <label htmlFor={item.name} className="font-medium text-gray-700">
                              {item.name}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      )}
      {arr?.length > 0 && (
        <div className="flex flex-wrap mt-3">
          {arr?.map((item, index) => {
            return (
              <div
                className="relative mr-2 mb-2 px-4 py-2 rounded-3xl w-fit bg-gray-200 text-sm"
                key={index}
              >
                {item.name}
                {!disabled && (
                  <XCircleIcon
                    onClick={() => deleteCapsule(item)}
                    className="w-[20px] absolute top-[-7px] cursor-pointer right-0 text-red-400"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

MultipleSelect.propTypes = {
  data: PropTypes.any,
  selectedFocus: PropTypes.any,
  disabled: PropTypes.bool,
  handleSelectedFocusList: PropTypes.any,
  label: PropTypes.string
};

export default MultipleSelect;

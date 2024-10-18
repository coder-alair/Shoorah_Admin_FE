/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Transition } from '@headlessui/react';
import { errorToast, getLocalStorageItem, useOutsideClick } from '../../utils/helper';
import { Api } from '../../api';
import { XCircleIcon } from '@heroicons/react/20/solid';
import { CompanyApi } from '../../api/companyApi';

const SearchableSelect = ({ setSelectedList, label, error }) => {
  const wrapperRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setError] = useState('');
  const [dropDownData, setDropDownData] = useState([]);
  const [arr, setArr] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  useEffect(() => {
    setError(error);
  }, [error]);

  const handleAPICall = (searchKey) => {
    if (userData.userType === 0) {
      Api.getUserEmailList('users-email-list', page, limit, searchKey).then((response) => {
        if (response?.data?.meta?.code === 1) {
          setLoader(false);
          let temp = [];
          response?.data?.data?.map((e) => {
            temp.push({
              id: e?.id,
              name: e.email,
              checked: arr.some((a) => a.id === e.id)
            });
          });
          setDropDownData(temp);
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      });
    } else {
      CompanyApi.getUserEmailList('users-email-list', page, limit, searchKey).then((response) => {
        if (response?.data?.meta?.code === 1) {
          setLoader(false);
          let temp = [];
          response?.data?.data?.map((e) => {
            temp.push({
              id: e?.id,
              name: e.email,
              checked: arr.some((a) => a.id === e.id)
            });
          });
          setDropDownData(temp);
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      });
    }
  };

  useEffect(() => {
    setSelectedList(arr);
  }, [arr]);

  useEffect(() => {
    setLoader(true);
    setDropDownData([]);
    if (searchTerm) {
      let searchParam = searchTerm.trim();
      const delayDebounceFn = setTimeout(() => {
        handleAPICall(searchParam);
      }, 600);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setLoader(false);
    }
  }, [searchTerm]);

  const handleCheckbox = (e, item) => {
    if (e?.target?.checked) {
      dropDownData?.map((data) => {
        if (data.id === item.id) {
          let tempArr = [{ name: item.name, id: item?.id, checked: true }];
          let filterData = dropDownData.map((obj) => tempArr.find((o) => o.id === obj.id) || obj);
          setDropDownData(filterData);
        }
      });
      setArr((prevState) => [...prevState, { name: item.name, id: item?.id, checked: true }]);
    } else {
      dropDownData?.map((data) => {
        if (data.id === item.id) {
          let tempArr = [{ name: item.name, id: item?.id, checked: false }];
          let filterData = dropDownData.map((obj) => tempArr.find((o) => o.id === obj.id) || obj);
          setDropDownData(filterData);
        }
      });
      const filterData = arr.filter((data) => data.id !== item.id);
      setArr(filterData);
    }
  };

  const deleteCapsule = (item) => {
    let tempArr = [{ name: item.name, id: item?.id, checked: false }];
    let filterData = dropDownData.map((obj) => tempArr.find((o) => o.id === obj.id) || obj);
    setDropDownData(filterData);
    const filterArrData = arr.filter((data) => data.id !== item.id);
    setArr(filterArrData);
  };

  useOutsideClick(wrapperRef, () => {
    if (openDropdown) setOpenDropdown(!openDropdown);
  });

  return (
    <div>
      <div className="relative" ref={wrapperRef}>
        <label
          htmlFor="searchTerm"
          className="block text-sm font-medium dark:text-white text-gray-700"
        >
          {label} <span className="text-red-400">&#42;</span>
        </label>
        <input
          type="text"
          name="searchTerm"
          id="searchTerm"
          placeholder="Search email address"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setOpenDropdown(true);
            setError('');
          }}
          className={`px-3 py-2 mt-1 block w-full rounded-3xl dark:text-white dark:border-none dark:bg-shoorah-darkBgColor appearance-none border border-gray-300 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-sm`}
        />
        {errorMessage && <span className="error text-xs text-red-400">{errorMessage}</span>}
        <Transition
          show={openDropdown}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="absolute bg-white dark:bg-shoorah-darkBgColor overflow-auto left-0 z-10 my-2  w-full origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1 max-h-[150px] h-auto">
              <div>
                {dropDownData?.length > 0 &&
                  dropDownData?.map((item, index) => {
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
                          <label
                            htmlFor={item.name}
                            className="font-medium dark:text-white text-gray-700"
                          >
                            {item.name}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                {!loader && dropDownData?.length === 0 && (
                  <div className="text-center py-2">
                    <p className="m-0 text-sm">No data</p>
                  </div>
                )}
                {loader && (
                  <div className="text-center py-2">
                    <p className="m-0 text-sm">Loading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Transition>
      </div>
      {arr?.length > 0 && (
        <div className="flex flex-wrap mt-3 pt-3">
          {arr?.map((item, index) => {
            return (
              <div
                className="relative mr-2 mb-2 px-4 py-2 rounded-3xl w-fit dark:bg-shoorah-darkBgColor bg-gray-200 text-sm"
                key={index}
              >
                {item.name}
                <XCircleIcon
                  onClick={() => deleteCapsule(item)}
                  className="w-[20px] absolute top-[-7px] cursor-pointer right-0 text-red-400"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

SearchableSelect.propTypes = {
  setSelectedList: PropTypes.any,
  label: PropTypes.string,
  error: PropTypes.string
};

export default SearchableSelect;

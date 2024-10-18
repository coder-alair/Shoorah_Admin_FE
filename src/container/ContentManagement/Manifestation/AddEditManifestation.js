import React from 'react';
import { useState } from 'react';
import Breadcrumb from '../../../component/common/Breadcrumb';
import ToggleSwitch from '../../../component/common/ToggleSwitch';
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
import { CONTENT_TYPE_WITH_TEXT, STATUS } from '../../../utils/constants';
import MultipleSelect from '../../../component/common/MultipleSelect';
import { getLocalStorageItem } from '../../../utils/helper';

const pages = [
  {
    name: 'Manifestation',
    href: '/content-management/manifestation',
    current: false
  },
  {
    name: 'Add Manifestation',
    href: '/content-management/manifestation/add-edit',
    current: true
  }
];

export default function AddEditManifestation() {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const [toggleValue, setToggleValue] = useState(false);
  const [form, setForm] = useState({
    contentType: 0,
    meditationBy: 0,
    status: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({});
  };

  const radioHandler = (e) => {
    let { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: parseInt(value)
    }));
  };

  return (
    <>
      {/* {loader && <Loader />} */}
      <Breadcrumb pageList={pages} />
      <div>
        <div className="lg:flex justify-center px-4 sm:px-6 py-10 rounded-[10px] bg-white mt-6">
          <div className="mt-6 mr-14 w-full lg:w-[430px]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  is Contain Video / Image?
                </label>
                <fieldset className="mt-4">
                  <div className="flex space-x-4">
                    {CONTENT_TYPE_WITH_TEXT.map((status, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          id={status.name}
                          name="contentType"
                          type="radio"
                          value={status.value}
                          onChange={(e) => radioHandler(e)}
                          checked={status.value === form.contentType}
                          className="h-5 w-5 border-gray-300 text-shoorah-primary focus:ring-shoorah-primary cursor-pointer"
                        />
                        <label
                          htmlFor={status.name}
                          className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {status.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div>
                <label htmlFor="meditationName" className="block text-sm font-medium text-gray-700">
                  Manifestation Text
                </label>
                <div className="mt-1">
                  <input
                    id="gratitudeText"
                    name="gratitudeText"
                    type="text"
                    //   onChange={handleChange}
                    className="block w-full rounded-3xl appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-sm"
                  />
                </div>
                {/* <span className='error text-xs text-red-400'>{error.email}</span> */}
              </div>
              <div>
                <MultipleSelect />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <fieldset className="mt-4">
                  <div className="space-y-4">
                    {STATUS.map((status, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          id={status.name}
                          name="status"
                          type="radio"
                          value={status.value}
                          onChange={(e) => radioHandler(e)}
                          checked={status.value === form.status}
                          className="h-5 w-5 border-gray-300 text-shoorah-primary focus:ring-shoorah-primary cursor-pointer"
                        />
                        <label
                          htmlFor={status.name}
                          className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {status.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Add this into Knowledge Category?
                </label>
                <div className="mt-3">
                  <ToggleSwitch toggleValue={toggleValue} setToggleValue={setToggleValue} />
                </div>
              </div>
            </form>
          </div>
          <div className="mt-6 w-full lg:w-[430px]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <div className="mt-1">
                  <button className="block w-full rounded-3xl appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-base">
                    <ArrowUpTrayIcon className="w-[20px] inline mr-3" />
                    Upload
                  </button>
                </div>
              </div>
              <div>
                <div className="">
                  <label htmlFor="thubnail" className="block text-sm font-medium text-gray-700">
                    Thumbnail
                  </label>
                  <div className="border border-dashed rounded-3xl w-[250px] h-[150px] flex justify-center items-center mt-1">
                    <div>
                      <ArrowUpTrayIcon className="w-[20px] mr-3 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-gray-500">select video thumbnail</p>
                    </div>
                  </div>
                </div>
                {/* <span className='error text-xs text-red-400'>{error.email}</span> */}
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2"
                >
                  {userData?.userType ? 'Submit For Approval' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../../../component/common/Breadcrumb';
import {
  currentDateWithFormat,
  errorToast,
  getLocalStorageItem,
  successToast
} from '../../../../utils/helper';
import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import AddCompanyUserValidation from '../../../../validation/AddCompanyUserValidation';
import { Country, State, City } from 'country-state-city';
import { DEPARTMENT, ETHINICITY, GENDER, MARITAL_STATUS } from '../../../../utils/constants';
import { CompanyApi } from '../../../../api/companyApi';
import Loader from '../../../../component/common/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { format, subYears } from 'date-fns';

function AddUser(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location?.state;
  const [pages, setPages] = useState([
    { name: 'Users', href: `/users`, current: false },
    {
      name: `${props?.match?.url.includes('edituser') ? 'Edit User' : 'Add User'}`,
      href: `${props?.match?.url.includes('edituser') ? 'edituser' : 'adduser'}`,
      current: true
    }
  ]);

  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState(null);
  const [country, setCountry] = useState(Country.getAllCountries());
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [gender, setGender] = useState([0]);

  let data = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const minDate = '1950-01-01';
  const [userData, setUserData] = useState({
    name: '',
    dob: '',
    gender: gender[0],
    marital_status: '',
    dom: '',
    contact_number: null,
    employee_id: '',
    email: '',
    department: '',
    designation: '',
    country: '',
    state: '',
    city: '',
    password: '',
    rePassword: '',
    ethnicity: '',
    role: 2
  });
  const [valid, setValid] = useState({ isSubmit: false });
  const [number, setNumber] = useState('');
  const [showPass, setShowPass] = useState({ pass: false, rePass: false });
  const getCodeByCountryName = (name) => {
    const data = Country.getAllCountries().filter(
      (e) => e.name.toLowerCase() === name.toLowerCase()
    );
    return data.length > 0 ? data[0].isoCode : false;
  };
  const getCodeByStateName = (name, countryCode) => {
    if (countryCode) {
      const data = State.getAllStates(countryCode).filter(
        (e) => e.name.toLowerCase() === name.toLowerCase()
      );
      return data.length > 0 ? data[0].isoCode : false;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (data) {
      if (data.userType === 3 || data.userType === 4) {
        setPages([
          { name: 'Users', href: `/${data?.slug}/users`, current: false },
          {
            name: `${window.location.pathname.includes('edituser') ? 'Edit User' : 'Add User'}`,
            href: `${
              window.location.pathname.includes('edituser')
                ? `/${data?.slug}/users/edituser`
                : `/${data?.slug}/adduser`
            }`,
            current: true
          }
        ]);
      } else {
        setPages([
          { name: 'Users', href: `/users`, current: false },
          {
            name: `${props?.match?.url.includes('edituser') ? 'Edit User' : 'Add User'}`,
            href: `${props?.match?.url.includes('edituser') ? 'edituser' : 'adduser'}`,
            current: true
          }
        ]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (user) {
      setUserData({
        ...userData,
        id: user?._id,
        name: user.name ? user.name : '',
        dob: user?.date_of_birth ? currentDateWithFormat(new Date(user.date_of_birth)) : '',
        dom: user.date_of_marriage ? currentDateWithFormat(new Date(user.date_of_marriage)) : '',
        gender: user?.gender ? user?.gender?.[0] : '',
        marital_status: user.marital_status ? user.marital_status : '',
        contact_number: user.contact_number ? user.contact_number : null,
        employee_id: user.employee_id ? user.employee_id : '',
        email: user.email_address ? user.email_address : '',
        department: user.department ? user.department : '',
        designation: user.designation ? user.designation : '',
        country: user.country
          ? getCodeByCountryName(user.country)
            ? getCodeByCountryName(user.country)
            : ''
          : '',
        state: user.state
          ? getCodeByStateName(user.state, getCodeByCountryName(user.country))
            ? getCodeByStateName(user.state, getCodeByCountryName(user.country))
            : ''
          : '',
        city: user.city ? user.city : '',
        ethnicity: user?.ethnicity,
        role: user?.role
      });
      setNumber(user?.contact_number ? user?.contact_number.toString() : '');
    }
  }, []);

  useEffect(() => {
    const states = State.getStatesOfCountry(userData.country);
    setState(states);
  }, [userData.country]);
  useEffect(() => {
    const cities = City.getCitiesOfState(userData.country, userData.state);
    setCity(cities);
  }, [userData.state]);
  useEffect(() => {
    if (userData.marital_status === '1') {
      setUserData({ ...userData, dom: '' });
    }
  }, [userData.marital_status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleClick = () => {
    const validate = AddCompanyUserValidation(userData);
    setValid({
      ...valid,
      isSubmit: true,
      errors: validate.errors,
      isValid: validate.isValid
    });

    if (!validate.isValid) {
      return;
    }
    setLoader(true);
    if (user?._id) {
      const data = {
        name: userData.name.trim(),
        date_of_birth: userData.dob.trim(),
        marital_status: userData.marital_status.trim(),
        date_of_marriage: userData.dom.trim(),
        contact_number: number,
        department: userData.department.trim(),
        designation: userData.designation.trim(),
        country: userData.country ? Country.getCountryByCode(userData.country).name : '',
        state: userData.country
          ? State.getStateByCodeAndCountry(userData.state, userData.country).name
          : '',
        city: userData.city,
        gender: [`${gender[0]}`],
        employee_id: userData.employee_id,
        ethnicity: userData.ethnicity ? userData.ethnicity.trim() : ''
      };
      CompanyApi.updateCompanyUser(user._id, data)
        .then((res) => {
          setLoader(false);
          if (res.data?.meta?.code === 1) {
            successToast('User is updated successfully !');
            navigate(-1);
          } else {
            errorToast(res.data?.meta?.message);
          }
        })
        .catch((err) => {
          setLoader(false);
        });
    } else {
      const data = {
        name: userData.name.trim(),
        date_of_birth: userData.dob ? userData.dob.trim() : '',
        marital_status: userData.marital_status ? userData.marital_status.trim() : '',
        date_of_marriage: userData.dom ? userData.dom.trim() : '',
        contact_number: number,
        employee_id: userData.employee_id.trim(),
        email_address: userData.email.trim(),
        department: userData.department ? userData.department.trim() : '',
        designation: userData.designation ? userData.designation.trim() : '',
        country: userData.country ? Country.getCountryByCode(userData.country).name : '',
        state: userData.state
          ? State.getStateByCodeAndCountry(userData.state, userData.country).name
          : '',
        city: userData.city ? userData.city : '',
        password: userData.password.trim(),
        gender: [`${userData.gender}`],
        ethnicity: userData.ethnicity ? userData.ethnicity.trim() : ''
      };
      CompanyApi.addCompanyUser(data)
        .then((res) => {
          setLoader(false);
          if (res.data?.meta?.code === 1) {
            successToast('User is added successfully !');
            navigate(-1);
          } else {
            errorToast(res.data?.meta?.message);
          }
        })
        .catch((err) => {
          setLoader(false);
        });
    }
  };

  return (
    <div>
      {loader ? <Loader /> : null}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Add User | Company Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <form
        className="mt-4 mx-3 p-4 dark:bg-shoorah-darkBgTabColor dark:text-white rounded-2xl bg-white"
        autoComplete="off"
      >
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full justify-between border-b py-3 mt-6">
                <span className="text-lg font-medium">Personal details</span>
                <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5`} />
              </DisclosureButton>
              <DisclosurePanel className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="name">
                    Name<span className="text-[#FF0000]"></span>
                  </label>
                  <input
                    autoComplete="off"
                    className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    type="text"
                    value={userData.name}
                    id="name"
                    name="name"
                    onChange={handleChange}
                    placeholder="Enter Name"
                  />
                  <span className="text-sm text-red-700">
                    {valid.isSubmit && valid?.errors?.name && valid?.errors?.name}
                  </span>
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="dob">
                    Date of Birth
                  </label>
                  <input
                    autoComplete="off"
                    className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    // max={currentDateWithFormat(new Date())}
                    type="date"
                    value={userData.dob}
                    max={format(subYears(new Date(), 9), 'yyyy-MM-dd')}
                    min={format(subYears(new Date(), 90), 'yyyy-MM-dd')}
                    id="dob"
                    name="dob"
                    onChange={handleChange}
                    placeholder="Enter DOB"
                  />
                  <span className="text-sm text-red-700">
                    {valid.isSubmit && valid?.errors?.dob && valid?.errors?.dob}
                  </span>
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="marital_status">
                    Marital Status
                  </label>
                  <select
                    className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    value={userData?.marital_status}
                    onChange={handleChange}
                    id="marital_status"
                    name="marital_status"
                  >
                    <option value={''} disabled>
                      Select Marital Status
                    </option>
                    {MARITAL_STATUS.map((e) => (
                      <option value={e.value}>{e.name}</option>
                    ))}
                  </select>
                  <span className="text-sm text-red-700">
                    {valid.isSubmit &&
                      valid?.errors?.marital_status &&
                      valid?.errors?.marital_status}
                  </span>
                </div>
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="gender">
                    Gender<span className="text-[#FF0000]"></span>
                  </label>
                  <select
                    className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    value={gender[0]}
                    onChange={(e) => {
                      setGender([e.target.value]);
                      setUserData({ ...userData, gender: gender[0] });
                    }}
                    id="gender"
                    name="gender"
                  >
                    <option value={''} disabled>
                      Select Gender
                    </option>
                    {GENDER.map((e) => (
                      <option value={e.value}>{e.name}</option>
                    ))}
                  </select>
                  <span className="text-sm text-red-700">
                    {valid.isSubmit && valid?.errors?.gender && valid?.errors?.gender}
                  </span>
                </div>
                {/* <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="role">
                    Role<span className="text-[#FF0000]"></span>
                  </label>
                  <select
                    className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    value={userData?.role}
                    onChange={handleChange}
                    id="role"
                    name="role"
                  >
                    <option value={""} disabled>
                      Select Role
                    </option>
                    <option value="1">Sub Admin</option>
                    <option value="2">User</option>
                  </select>
                  <span className="text-sm text-red-700">
                    {valid.isSubmit &&
                      valid?.errors?.role &&
                      valid?.errors?.role}
                  </span>
                </div> */}
                <div className="flex flex-col justify-between mt-3">
                  <label className="text-sm font-normal mb-2" htmlFor="contact_number">
                    Contact Number<span className="text-[#FF0000]"></span>
                  </label>
                  <PhoneInput
                    className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                    placeholder="Enter Contact Number"
                    name="contact_number"
                    value={number}
                    onChange={(e) => {
                      if (e) {
                        setNumber(e);
                      } else {
                        setNumber(null);
                      }
                    }}
                  />
                  {/* {valid.isSubmit && !isValidPhoneNumber(number) && (
                    <span className="text-sm text-red-700">
                      Please enter a valid contact number
                    </span>
                  )} */}
                </div>
              </DisclosurePanel>
              <Disclosure defaultOpen={true}>
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex w-full justify-between mt-6 border-b py-3">
                      <span className="text-lg font-medium">Professional details</span>
                      <ChevronUpIcon className={`${!open ? 'rotate-180 transform' : ''} h-5 w-5`} />
                    </DisclosureButton>
                    <DisclosurePanel className="grid gap-4 lg:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
                      <div className="flex flex-col justify-between mt-3">
                        <label className="text-sm font-normal mb-2" htmlFor="employee_id">
                          Employee ID<span className="text-[#FF0000]"></span>
                        </label>
                        <input
                          autoComplete="off"
                          className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                          type="text"
                          value={userData.employee_id}
                          id="employee_id"
                          name="employee_id"
                          onChange={handleChange}
                          placeholder="Enter Employee ID"
                        />
                        <span className="text-sm text-red-700">
                          {valid.isSubmit &&
                            valid?.errors?.employee_id &&
                            valid?.errors?.employee_id}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between mt-3">
                        <label className="text-sm font-normal mb-2" htmlFor="email">
                          Email<span className="text-[#FF0000]"></span>
                        </label>
                        <input
                          autoComplete="off"
                          className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                          type="email"
                          value={userData.email}
                          id="email"
                          name="email"
                          onChange={handleChange}
                          placeholder="Enter Email"
                          disabled={user?._id ? true : false}
                        />
                        <span className="text-sm text-red-700">
                          {valid.isSubmit && valid?.errors?.email && valid?.errors?.email}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between mt-3">
                        <label className="text-sm font-normal mb-2" htmlFor="department">
                          Department
                        </label>
                        <select
                          className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                          value={userData?.department}
                          onChange={handleChange}
                          id="department"
                          name="department"
                        >
                          <option value={''} disabled>
                            Select
                          </option>
                          {DEPARTMENT.map((e) => (
                            <option value={e.value}>{e.name}</option>
                          ))}
                        </select>
                        <span className="text-sm text-red-700">
                          {valid.isSubmit && valid?.errors?.department && valid?.errors?.department}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between mt-3">
                        <label className="text-sm font-normal mb-2" htmlFor="ethnicity">
                          ethnicity
                        </label>
                        <select
                          className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                          value={userData?.ethnicity}
                          onChange={handleChange}
                          id="ethnicity"
                          name="ethnicity"
                        >
                          <option value={''} disabled>
                            Select
                          </option>
                          {ETHINICITY.map((e) => (
                            <option value={e.value}>{e.name}</option>
                          ))}
                        </select>
                        <span className="text-sm text-red-700">
                          {valid.isSubmit && valid?.errors?.ethnicity && valid?.errors?.ethnicity}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between mt-3">
                        <label className="text-sm font-normal mb-2" htmlFor="designation">
                          Designation
                        </label>
                        <input
                          autoComplete="off"
                          className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                          type="text"
                          value={userData.designation}
                          id="designation"
                          name="designation"
                          onChange={handleChange}
                          placeholder="Enter Designation"
                        />
                        <span className="text-sm text-red-700">
                          {valid.isSubmit &&
                            valid?.errors?.designation &&
                            valid?.errors?.designation}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between mt-3">
                        <label className="text-sm font-normal mb-2" htmlFor="country">
                          Country
                        </label>
                        <select
                          className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                          value={userData?.country}
                          onChange={handleChange}
                          id="country"
                          name="country"
                        >
                          <option value={''} disabled>
                            Select
                          </option>
                          {country.map((e) => (
                            <option value={e.isoCode}>{e.name}</option>
                          ))}
                        </select>
                        <span className="text-sm text-red-700">
                          {valid.isSubmit && valid?.errors?.country && valid?.errors?.country}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between mt-3">
                        <label className="text-sm font-normal mb-2" htmlFor="state">
                          State
                        </label>
                        <select
                          className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                          value={userData?.state}
                          onChange={handleChange}
                          id="state"
                          name="state"
                        >
                          <option value={''} disabled>
                            Select
                          </option>
                          {state.map((e) => (
                            <option value={e.isoCode}>{e.name}</option>
                          ))}
                        </select>
                        <span className="text-sm text-red-700">
                          {valid.isSubmit && valid?.errors?.state && valid?.errors?.state}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between mt-3">
                        <label className="text-sm font-normal mb-2" htmlFor="city">
                          City (Working Location)
                        </label>
                        <select
                          className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgColor dark:border-none border-[#F1F2F4] rounded-md h-10 px-2"
                          value={userData?.city}
                          onChange={handleChange}
                          id="city"
                          name="city"
                        >
                          <option value={''} disabled>
                            Select
                          </option>
                          {city.map((e) => (
                            <option value={e.name.toLowerCase()}>{e.name}</option>
                          ))}
                        </select>
                        <span className="text-sm text-red-700">
                          {valid.isSubmit && valid?.errors?.city && valid?.errors?.city}
                        </span>
                      </div>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            </>
          )}
        </Disclosure>
        <div className="flex items-center justify-center mt-6">
          <button
            className="bg-[#3A47AB] py-3 px-10 text-white w-[192px] h-[48px] rounded-md"
            type="button"
            onClick={handleClick}
          >
            {props?.match?.url.includes('edituser') ? 'Save User' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;

import Breadcrumb from '../../component/common/Breadcrumb';
import SelectMenu from '../../component/common/SelectMenu';
import ProfilePic from '../../assets/images/dummy-avatar.png';
import { STATUS, USER_TYPE, USER_TYPE_B2B } from '../../utils/constants';
import ToggleSwitch from '../../component/common/ToggleSwitch';
import { CameraIcon } from '@heroicons/react/20/solid';
import { useEffect, useRef, useState } from 'react';
import adminAddEditValidation from '../../validation/adminAddEditValidation';
import { Api } from '../../api';
import Loader from '../../component/common/Loader';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  capitalize,
  errorToast,
  getFileType,
  successToast,
  getLocalStorageItem
} from '../../utils/helper';
import { Helmet } from 'react-helmet';
import CommonInput from '../../component/common/Input/CommonInput';
import PrimaryButton from '../../component/common/Buttons/PrimaryButton';
import SecondaryButton from '../../component/common/Buttons/SecondaryButton';
import ConfirmPopup from '../../component/common/modals/ConfirmPopup';
import axios from 'axios';
import LazyLoadImageProp from '../../component/common/LazyLoadImage';
import { CompanyApi } from '../../api/companyApi';

function SubAdminAddEdit() {
  let location = useLocation();
  let propsData = location?.state;
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  // const redirectUrl = userData?.slug
  //   ? `/${userData?.slug}/sub-admins/add-edit`
  //   : '/sub-admins/add-edit';

  const [form, setForm] = useState({
    id: '',
    email: '',
    name: '',
    status: 1
  });
  const [error, setError] = useState({});
  const [selectedMenu, setSelectedMenu] = useState({});
  const [toggleValue, setToggleValue] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState('');
  const [pages, setPages] = useState([
    {
      name: 'Sub Admin',
      href: userData?.slug ? `/${userData?.slug}/sub-admins` : '/sub-admins',
      current: true
    },
    {
      name: 'Add Sub Admin',
      href: userData?.slug ? `/${userData?.slug}/sub-admins/add-edit` : '/sub-admins/add-edit',
      current: true
    }
  ]);

  useEffect(() => {
    if (propsData) {
      setLoader(true);
      setPages([
        {
          name: 'Sub Admin',
          href: userData?.slug ? `/${userData?.slug}/sub-admins` : '/sub-admins',
          current: true
        },
        {
          name: 'Edit Sub Admin',
          href: userData?.slug ? `/${userData?.slug}/sub-admins/add-edit` : '/sub-admins/add-edit',
          current: true
        }
      ]);

      if (userData.userType === 0) {
        Api.getAdmins('', '', '', '', '', '', propsData.id).then((response) => {
          const adminData = response?.data?.data[0];
          if (response?.data?.meta?.code === 1) {
            setForm({
              id: adminData.id,
              email: adminData.email,
              name: capitalize(adminData.name),
              status: adminData.accountStatus
            });
            setPreview(adminData?.profile);
            setSelectedMenu(USER_TYPE.filter((user) => user.value === adminData.userType)?.[0]);
            setToggleValue(
              adminData?.moduleAccess
                ? JSON?.parse(adminData?.moduleAccess)?.earning_module_access
                : null
            );
            setLoader(false);
          } else if (response?.code === 401) {
            setLoader(false);
            errorToast(response?.message);
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        });
      } else {
        // company apis
        CompanyApi.getAdmins('', '', '', '', '', '', propsData.id).then((response) => {
          const adminData = response?.data?.data[0];
          if (response?.data?.meta?.code === 1) {
            setForm({
              id: adminData.id,
              email: adminData.email,
              name: capitalize(adminData.name),
              status: adminData.accountStatus
            });
            setPreview(adminData?.profile);
            setSelectedMenu(USER_TYPE_B2B.filter((user) => user.value === adminData.userType)?.[0]);
            setToggleValue(
              adminData?.moduleAccess
                ? JSON?.parse(adminData?.moduleAccess)?.earning_module_access
                : null
            );
            setLoader(false);
          } else if (response?.code === 401) {
            setLoader(false);
            errorToast(response?.message);
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        });
      }

      setLoader(false);
    }
  }, [propsData]);

  const handleMenuChange = (menu) => {
    if (menu) {
      setSelectedMenu(menu);
      const { errors } = adminAddEditValidation(form, menu);
      setError(errors);
    }
  };

  const handleChange = (e) => {
    setError((prevState) => ({
      ...prevState,
      [e.target.name]: ''
    }));

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const radioHandler = (e) => {
    let { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: parseInt(value)
    }));
  };

  const handleSubmit = (e, fromPopup = false) => {
    e.preventDefault();
    const { errors, isValid } = adminAddEditValidation(form, selectedMenu);
    if (isValid) {
      if (location?.state && !fromPopup) {
        setOpenConfirmPopup(true);
      } else {
        setLoader(true);
        const payload = {
          userId: form.id,
          name: capitalize(form.name),
          email: form.email,
          userType: selectedMenu.value,
          accountStatus: parseInt(form.status),
          moduleAccess: {
            earning_module_access: toggleValue
          },
          profile: selectedFile?.type ? getFileType(selectedFile) : null
        };
console.log('payload', payload)
        if (userData.userType === 0) {
          Api.addEditAdmin(payload).then((response) => {
            if (response?.data?.meta?.code === 1) {
              if (response?.data?.meta?.uploadURL) {
                axios
                  .put(response?.data?.meta?.uploadURL, selectedFile, {
                    headers: {
                      'content-type': `${selectedFile?.type?.split('/')[0]}/${
                        selectedFile?.name?.split('.')[1]
                      }`
                    }
                  })
                  .then((resp) => {
                    if (resp?.status === 200) {
                      setLoader(false);
                      successToast(response?.data?.meta?.message);
                      navigate('/sub-admins');
                    }
                  })
                  .catch(() => {
                    errorToast('Something went wrong');
                  });
              } else {
                setLoader(false);
                successToast(response?.data?.meta?.message);
                navigate('/sub-admins');
              }
            } else if (response?.data?.meta?.code === 0) {
              setLoader(false);
              errorToast(response?.data?.meta?.message);
            } else {
              setLoader(false);
            }
          });
        } else {
          CompanyApi.addEditAdmin(payload).then((response) => {
            if (response?.data?.meta?.code === 1) {
              if (response?.data?.meta?.uploadURL) {
                axios
                  .put(response?.data?.meta?.uploadURL, selectedFile, {
                    headers: {
                      'content-type': `${selectedFile?.type?.split('/')[0]}/${
                        selectedFile?.name?.split('.')[1]
                      }`
                    }
                  })
                  .then((resp) => {
                    if (resp?.status === 200) {
                      setLoader(false);
                      successToast(response?.data?.meta?.message);

                      navigate(`/${userData?.slug}/sub-admins`);
                    }
                  })
                  .catch(() => {
                    errorToast('Something went wrong');
                  });
              } else {
                setLoader(false);
                successToast(response?.data?.meta?.message);

                navigate(`/${userData?.slug}/sub-admins`);
              }
            } else if (response?.data?.meta?.code === 0) {
              setLoader(false);
              errorToast(response?.data?.meta?.message);
            } else {
              setLoader(false);
            }
          });
        }
      }
    } else {
      setError(errors);
    }
  };
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    if (e?.target?.files[0]) {
      if (!e?.target?.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        errorToast(
          `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid image.`
        );
      } else {
        setSelectedFile(e.target.files[0]);
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setPreview(objectUrl);
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreview(undefined);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {location?.state ? (
          <title>Edit Sub Admin | Shoorah Admin</title>
        ) : (
          <title>Add Sub Admin | Shoorah Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <form onSubmit={handleSubmit}>
          <div className="flex-wrap lg:flex px-4 py-10 rounded-[10px] bg-white dark:bg-shoorah-darkBgTabColor  dark:text-white gap-4">
            <div className="lg:mr-10 mb-4">
              <div>
                <input
                  onChange={onSelectFile}
                  className="hidden"
                  ref={imageRef}
                  type="file"
                  accept=".jpg, .jpeg, .png"
                />
                <div className="">
                  {!loader ? (
                    <div
                      className="relative m-auto w-[200px] rounded-[50%] cursor-pointer"
                      onClick={() => {
                        imageRef?.current?.click();
                      }}
                    >
                      <LazyLoadImageProp
                        imageSrc={preview ? preview : ProfilePic}
                        className={
                          'border border-gray-300 w-[200px] h-[200px] rounded-[50%] m-auto'
                        }
                      />

                      <div className="absolute bottom-0 right-[25px] bg-gray-200 p-2 rounded-[50%]">
                        <CameraIcon className="w-[20px]" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative m-auto w-[200px] rounded-[50%]"></div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6 m-auto lg:m-0 w-full lg:w-[430px]">
              <CommonInput
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                label="Name"
                error={error.name}
                isRequired
              />
              <CommonInput
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                label="Email address"
                error={error.email}
                isRequired
              />
              <div>
                <SelectMenu
                  menuList={userData.userType === 0 ? USER_TYPE : USER_TYPE_B2B}
                  label="User Type"
                  defaultSelected={selectedMenu}
                  setSelectedMenu={handleMenuChange}
                />
                <span className="error text-xs text-red-400">{error.selectedMenu}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white">
                  Status
                </label>
                <fieldset className="mt-4">
                  <div className="flex space-x-4">
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
                          className="ml-3 block text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
                        >
                          {status.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              {userData.userType === 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Earning Module Access
                  </label>
                  <div className="mt-3">
                    <ToggleSwitch toggleValue={toggleValue} setToggleValue={setToggleValue} />
                  </div>
                </div>
              )}
              <div className="text-right flex justify-end gap-x-2 mt-12">
                <SecondaryButton btnText="Cancel" btnType="button" />
                <PrimaryButton btnText="Submit" btnType="submit" />
              </div>
            </div>
          </div>
        </form>
      </div>

      {openConfirmPopup && (
        <ConfirmPopup
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          message={'Are you sure you want to update sub admin details?'}
          setAccepted={(e) => handleSubmit(e, true)}
        />
      )}
    </>
  );
}

SubAdminAddEdit.propTypes = {
  location: PropTypes.any
};

export default SubAdminAddEdit;

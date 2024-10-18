import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../component/common/Breadcrumb';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Loader from '../../component/common/Loader';
import { Api } from '../../api';
import { errorToast, successToast } from '../../utils/helper';
import cmsValidation from '../../validation/cmsValidation';
import ConfirmPopup from '../../component/common/modals/ConfirmPopup';
import CKEditor from 'react-ckeditor-component';

const AddEditCMS = (props) => {
  const navigate = useNavigate();
  let location = useLocation();
  const propsData = location?.state;
  const [pages] = useState([
    { name: 'CMS', href: '/cms' },
    {
      name: `${propsData?.action === 'view' ? 'View' : 'Edit'} CMS`,
      href: '/cms/edit-view'
    }
  ]);
  const [form, setForm] = useState({
    id: '',
    title: '',
    alias: ''
  });
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [isView, setIsView] = useState(false);
  const [contentState, setContentState] = useState(null);

  useEffect(() => {
    setIsView(propsData?.action === 'view');
    setContentState(propsData?.description);
    setForm({
      id: propsData?.id,
      title: propsData?.title,
      alias: propsData?.alias
    });
  }, [props]);

  const onChange = (evt) => {
    if (!isView) {
      let newContent = evt.editor.getData();
      setContentState(newContent);
    }
  };

  const handleSubmit = (fromPopup) => {
    const { errors, isValid } = cmsValidation(form, contentState);
    if (isValid) {
      if (propsData && !fromPopup) {
        setOpenConfirmPopup(true);
      } else {
        setLoader(true);
        const payload = {
          description: contentState,
          cmsId: form.id,
          title: form.title,
          alias: form.alias
        };
        Api.addEditCMS(payload).then((response) => {
          if (response?.data?.meta?.code === 1) {
            setLoader(false);
            successToast(response?.data?.meta?.message);
            navigate('/cms');
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        });
      }
    } else {
      setError(errors);
    }
  };

  const config = {
    readOnly: isView,
    uiColor: '#ffffff'
  };

  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>{propsData?.action === 'view' ? 'View' : 'Edit'} CMS | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <div className="bg-white rounded-3xl dark:bg-shoorah-darkBgTabColor dark:text-white  px-4 space-y-4 py-6">
          <div className="w-full sm:w-[400px]">
            <p className="text-gray-700 dark:text-white font-semibold">{form.title}</p>
          </div>

          <CKEditor
            activeClass="ckeditor_outer"
            content={contentState}
            events={{
              change: onChange
            }}
            config={config}
          />

          <span className="error text-xs text-red-400">{error.message}</span>
          {!isView && (
            <div className="text-right mt-5">
              <button
                className={`rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary py-2 sm:py-3 px-10 text-sm font-medium text-white shadow-sm hover:bg-shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2`}
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
      {openConfirmPopup && (
        <ConfirmPopup
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          message={'Are you sure you want to update cms content?'}
          setAccepted={() => handleSubmit(true)}
        />
      )}
    </>
  );
};

AddEditCMS.propTypes = {
  location: PropTypes.any
};

export default AddEditCMS;

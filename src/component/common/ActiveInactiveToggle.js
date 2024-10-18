import { Switch } from '@headlessui/react';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Api } from '../../api';
import { successToast, errorToast } from '../../utils/helper';
import ConfirmPopup from './modals/ConfirmPopup';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ActiveInactiveToggle({ accountStatus, userId }) {
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(accountStatus);
  }, [accountStatus]);

  useEffect(() => {}, [enabled]);

  const handlePopUp = () => {
    setOpenConfirmPopup(true);
  };
  const handleStatus = (e) => {
    e.preventDefault();
    const payload = {
      userId: userId,
      accountStatus: !enabled ? 0 : 1
    };
    Api.updateUserDetail(payload).then((response) => {
      if (response.data.meta.code === 1) {
        successToast(response?.data?.meta?.message);
      } else if (response.data.meta.code === 0) {
        errorToast(response.data.meta.message);
      }
    });
  };

  return (
    <>
      <Switch
        checked={enabled}
        onChange={() => {
          setEnabled(!enabled);
        }}
        onClick={() => {
          handlePopUp();
        }}
        className={classNames(
          enabled ? 'bg-green-600' : 'bg-red-600',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-shoorah-darkBgTabColor shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      {openConfirmPopup && (
        <ConfirmPopup
          open={openConfirmPopup}
          setOpen={setOpenConfirmPopup}
          message={'Are you sure you want to update user status?'}
          setAccepted={(e) => handleStatus(e)}
          handleNo={() => {
            setOpenConfirmPopup(false);
            setEnabled(accountStatus);
          }}
        />
      )}
    </>
  );
}

ActiveInactiveToggle.propTypes = {
  accountStatus: PropTypes.any,
  userId: PropTypes.any
};

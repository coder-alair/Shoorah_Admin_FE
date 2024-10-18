import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import PropTypes from 'prop-types';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ToggleSwitch = ({ setToggleValue, toggleValue, disabled }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(toggleValue);
  }, [toggleValue]);

  return (
    <Switch
      checked={enabled}
      onChange={() => {
        setEnabled(!enabled);
        setToggleValue(!enabled);
      }}
      disabled={disabled}
      className={classNames(
        enabled ? 'bg-shoorah-primary' : 'bg-gray-200',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2'
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        )}
      />
    </Switch>
  );
};

ToggleSwitch.propTypes = {
  setToggleValue: PropTypes.any,
  toggleValue: PropTypes.bool,
  disabled: PropTypes.bool
};

export default ToggleSwitch;

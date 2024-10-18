import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SelectMenu = ({
  menuList,
  label,
  setSelectedMenu,
  defaultSelected,
  isRequired = true,
  showLabel = true,
  column = false,
  customClassFlag
}) => {
  const [selected, setSelected] = useState(
    defaultSelected ? menuList.find((el) => el.value === defaultSelected) : menuList[0]
  );

  const handleChange = (e) => {
    setSelected(e);
    setSelectedMenu(e);
  };

  useEffect(() => {
    if (defaultSelected?.name) {
      setSelected(defaultSelected);
    }
  }, [defaultSelected]);

  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <div className={`${column ? 'flex flex-col lg:flex-row gap-3' : ''}`}>
          {showLabel ? (
            <div
              className={`block ${
                customClassFlag ? 'text-md mr-2 w-auto' : 'text-sm'
              } font-medium dark:text-white text-gray-700`}
            >
              {label} {isRequired && <span className="text-red-400">&#42;</span>}
            </div>
          ) : (
            ''
          )}

          <div className={`${customClassFlag ? 'w-[270px] ' : ''}relative mt-1`}>
            <Listbox.Button className="relative w-full rounded-3xl text-shoorah-sidebarBackground dark:text-white cursor-pointer border border-gray-300 bg-white dark:border-none dark:bg-shoorah-darkBgColor py-2 pl-3 pr-6 text-left focus:border-shoorah-primary focus:outline-none focus:ring-shoorah-primary sm:text-sm">
              <span className="block truncate capitalize mr-2">
                {selected?.name ? selected?.name : 'Please Select'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 dark:text-white text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 shadow-lg max-h-100 w-full overflow-auto rounded-md max-h-40 dark:bg-shoorah-darkBgTabColor bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {menuList.map((menu, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-shoorah-primary' : 'text-gray-900 dark:text-white',
                        'relative cursor-default select-none py-2 pl-2 pr-4 capitalize'
                      )
                    }
                    // disabled={menu?.value === ''}
                    value={menu}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate cursor-pointer'
                          )}
                        >
                          {menu?.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-shoorah-primary',
                              'absolute inset-y-0 right-0 flex items-center pr-1 dark:text-white'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
};

SelectMenu.propTypes = {
  menuList: PropTypes.any,
  label: PropTypes.string,
  setSelectedMenu: PropTypes.any,
  showLabel: PropTypes.bool,
  isRequired: PropTypes.bool,
  defaultSelected: PropTypes.any,
  customClassFlag: PropTypes.any
};

export default SelectMenu;

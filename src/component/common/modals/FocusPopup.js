import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';

const FocusPopup = ({ open, setOpen, data }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Focus
                  </Dialog.Title>
                  <div className="sm:flex sm:items-start">
                    <div className="flex flex-wrap mt-3">
                      {data.map((value, key) => (
                        <div
                          className="relative mr-2 mb-2 px-4 py-2 rounded-3xl w-fit bg-gray-200 text-sm"
                          key={key}
                        >
                          {value.display_name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

FocusPopup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  data: PropTypes.any
};

export default FocusPopup;

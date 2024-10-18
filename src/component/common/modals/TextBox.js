import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import CommonInput from '../Input/CommonInput';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter, isSuperAdmin } from '../../../utils/helper';
import AudioPlayer from '../../AudioPlayer/AudioPlayer';

const TextBox = ({ open, setOpen, title, message, type, audioUrl, id }) => {
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [activePlaying, setActivePlaying] = useState(null);

  const handleNo = () => {
    setOpen(false);
  };

  const activePlayerHandler = (id) => {
    setActivePlaying(id);
  };

  const pauseHandler = () => {
    setActivePlaying(null);
  };

  useEffect(() => {
    if (type) {
      let url;
      switch (type) {
        case 1:
          url = '/content-approval';
          break;
        case 2:
          url = '/content-approval';
          break;
        case 10:
          url = '/B2B-company-list';
          break;
        case 15:
          url = '/partner-introduced';
          break;
        case 16:
          url = '/app-issues';
          break;
        case 20:
          url = '/surveys';
          break;
        case 21:
          url = '/B2B-company-list';
          break;
        default:
          url = '/notifications';
          break;
      }
      setUrl(url);
    }
  }, [type]);

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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                <div className="mb-2 w-full px-3 py-3">
                  <p className=" w-full text-left text-xl text-gray-700 lg:text-center lg:text-4xl">
                    {title}
                  </p>
                </div>
                <div className="bg-white px-4 pb-3">
                  <div className="sm:flex sm:items-start">
                    <div className="text-center  ">
                      <div className="flex h-[10vh] w-full flex-col gap-y-2 overflow-y-auto text-left text-xs text-gray-700 lg:h-auto lg:text-base">
                        {audioUrl && (
                          <div className={`h-auto flex justify-start gap-2 rounded-full `}>
                            <p className="w-full text-left text-base font-medium text-gray-700 lg:text-left lg:text-xl">
                              Listen audio :
                            </p>
                            <AudioPlayer
                              onPlay={() => activePlayerHandler(id)}
                              pauseHandler={pauseHandler}
                              playing={activePlaying === id}
                              audioPath={audioUrl}
                            />
                          </div>
                        )}

                        <div>
                          <p className="">
                            Message : <span className=""> {capitalizeFirstLetter(message)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {isSuperAdmin() && (
                    <button
                      type="button"
                      className={`inline-flex w-full justify-center bg-shoorah-primary darkBg: rounded-3xl border border-transparent font-semibold  px-6 py-2 text-base  text-white shadow-sm focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
                      onClick={() => navigate(url)}
                    >
                      Check it
                    </button>
                  )}

                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-3xl border border-gray-300 bg-white px-6 py-2 text-base font-semibold  text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      handleNo();
                    }}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

TextBox.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  handleNo: PropTypes.func,
  message: PropTypes.string
};

export default TextBox;

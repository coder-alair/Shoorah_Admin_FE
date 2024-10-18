import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import 'react-html5video/dist/styles.css';
import { DefaultPlayer as Video } from 'react-html5video';
import { XCircleIcon } from '@heroicons/react/24/outline';

function VideoPlayer({ open, setOpen }) {
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[620px]">
                <div className="p-5 bg-white">
                  <div className="flex justify-between mb-4">
                    <p className="m-0 self-center font-medium">Relax for sometime</p>
                    <XCircleIcon
                      onClick={() => setOpen(false)}
                      className="w-[30px] cursor-pointer"
                    />
                  </div>
                  <Video
                    autoPlay
                    loop
                    controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                    poster="http://sourceposter.jpg"
                    onCanPlayThrough={() => {
                      // Do stuff
                    }}
                  >
                    <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" />
                  </Video>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

VideoPlayer.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func
};
export default VideoPlayer;

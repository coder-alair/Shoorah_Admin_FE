import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function ApprovalHistory({ data, title }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium dark:text-white text-gray-600 underline">
        {title} history
      </h3>
      <div className="flow-root dark:bg-shoorah-darkBgColor bg-gray-100 px-6 py-6 mt-3 rounded-[10px]">
        <ul className="flex flex-col gap-2 lg:gap-0" role="list">
          {data?.map((event, eventIdx) => (
            <li key={event._id}>
              <div className="relative">
                {eventIdx !== data.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 dark:bg-shoorah-darkBgColor dark:text-white bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-center space-x-3">
                  <div>
                    <span
                      className={`${
                        event.content_status === 0
                          ? 'bg-gray-400'
                          : event.content_status === 1
                          ? 'bg-green-400'
                          : 'bg-red-400'
                      } h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white shadow-3xl`}
                    >
                      {event.content_status === 0 && <PencilIcon className="h-5 w-5 text-white" />}
                      {event.content_status === 1 && <CheckIcon className="h-5 w-5 text-white" />}
                      {event.content_status === 2 && <XMarkIcon className="h-5 w-5 text-white" />}
                    </span>
                  </div>
                  <div className="pl-2 w-full justify-between pt-1.5">
                    {event.comment && (
                      <div>
                        <p className="text-sm dark:text-white text-gray-500 mb-2 sm:mb-1">
                          {event.comment}{' '}
                        </p>
                      </div>
                    )}
                    <div className="flex-wrap flex justify-between whitespace-nowrap dark:text-white text-gray-600">
                      <p className="text-[15px]">
                        {event.content_status === 1 ? (
                          <>
                            Approved by <span>{event.commented_by}</span>
                          </>
                        ) : event.content_status === 2 ? (
                          <>
                            Rejected by <span>{event.commented_by}</span>
                          </>
                        ) : (
                          <>
                            Added in draft by <span>{event.commented_by}</span>
                          </>
                        )}
                      </p>
                      <p className="text-[15px]">{moment(event.commented_on).format('lll')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ApprovalHistory.propTypes = {
  data: PropTypes.any,
  title: PropTypes.string
};

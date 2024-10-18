import React from 'react';
import PropTypes from 'prop-types';
import lock from '../../assets/images/Lock.svg';
import unlock from '../../assets/images/Unlock.svg';

const BadgeList = ({ badgeList }) => {
  return (
    <div>
      {badgeList.map((outerValue, outerKey) => (
        <div
          key={outerKey}
          className="box-border flex flex-col items-start gap-6 p-6 w-[650px] h-auto bg-white rounded-2xl m-6 shadow-lg"
        >
          <>
            <div>{outerValue?.key?.replace('_', ' ')}</div>
            {outerValue?.value?.map((value, key) => (
              <div
                className={`flex flex-col justify-center relative overflow-hidden sm:px-3 ' ${
                  value.isUnlocked ? 'sm:py-3' : ''
                }`}
                key={key}
              >
                <div className="max-w-7xl mx-auto">
                  <div className="relative group">
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${
                        value.isUnlocked ? 'from-green-200 to-green-200' : ' '
                      } rounded-lg blur opacity-25'
                      `}
                    ></div>
                    <div
                      className={`relative px-7 py-6 ${
                        value.isUnlocked ? 'bg-white' : 'bg-gray-200 '
                      } ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6
                      `}
                    >
                      <div className="space-y-2">
                        <p className="text-slate-800">{value.title}</p>
                        <span className="block text-indigo-400 group-hover:text-slate-800 transition duration-200">
                          {value.description}
                        </span>
                      </div>
                      <img
                        loading='lazy'
                        src={value.isUnlocked ? unlock : lock}
                        className="w-8 h-8 text-purple-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        </div>
      ))}
    </div>
  );
};

BadgeList.propTypes = {
  badgeList: PropTypes.any
};

export default BadgeList;

import React from 'react';
import PropTypes from 'prop-types';
import badge1 from '../../assets/images/Bronze.svg';
import badge2 from '../../assets/images/Silver.svg';
import badge3 from '../../assets/images/Gold.svg';
import badge4 from '../../assets/images/Platinum.svg';
import badge5 from '../../assets/images/Diamond.svg';
import badge6 from '../../assets/images/badge6.svg';
import lock from '../../assets/images/Lock.svg';

const Badges = ({ badgeData, selectedBadge, handleBadgeList }) => {
  return (
    <ul className="flex flex-wrap items-center justify-left mb-5 mt-4 text-gray-900 dark:text-white temmm">
      {badgeData?.length > 0 &&
        badgeData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center cursor-pointer mr-4"
          >
            {item.badgeType === 1 ||
            item.badgeType === 2 ||
            item.badgeType === 3 ||
            item.badgeType === 4 ||
            item.badgeType === 5 ? (
              <div
                className={`${
                  selectedBadge === item.badgeType ? 'selected' : 'unselected'
                } relative`}
              >
                <img
                  loading='lazy'
                  src={
                    item.badgeType === 1
                      ? badge1
                      : item.badgeType === 2
                      ? badge2
                      : item.badgeType === 3
                      ? badge3
                      : item.badgeType === 4
                      ? badge4
                      : item.badgeType === 5
                      ? badge5
                      : badge6
                  }
                  className="w-24"
                  alt="badge"
                  onClick={() => handleBadgeList(item.badgeType)}
                />
                <span
                  className={`${
                    item.badgeType === 1
                      ? 'text-shoorah-bronze border-[#CD7F32]'
                      : item.badgeType === 2
                      ? 'text-shoorah-silver border-[#808080]'
                      : item.badgeType === 3
                      ? 'text-shoorah-gold border-[#ffd700]'
                      : item.badgeType === 4
                      ? 'text-shoorah-platinum border-[#8F65EE]'
                      : item.badgeType === 5
                      ? 'text-shoorah-diamond border-[#49D261]'
                      : ''
                  }  bg-white border-solid border-2 rounded-full w-7 h-7 absolute flex justify-center items-center text-center absolute bottom-9 right-${
                    item.badgeType === 4 ? 12 : 11
                  }`}
                >
                  {item.badgeCount === 0 ? (
                    <img loading='lazy' src={lock} className="w-5" alt="img" />
                  ) : (
                    item.badgeCount
                  )}
                </span>
                <p className="text-shoorah-silver text-xl font-medium text-center">
                  {item.badgeType === 1
                    ? 'BRONZE'
                    : item.badgeType === 2
                    ? 'SILVER'
                    : item.badgeType === 3
                    ? 'GOLD'
                    : item.badgeType === 4
                    ? 'PLATINUM'
                    : item.badgeType === 5
                    ? 'DIAMOND'
                    : null}
                </p>
              </div>
            ) : null}
          </div>
        ))}
    </ul>
  );
};

Badges.propTypes = {
  badgeData: PropTypes.any,
  selectedBadge: PropTypes.any,
  handleBadgeList: PropTypes.any
};

export default Badges;

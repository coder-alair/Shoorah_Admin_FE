import React from 'react';
import PropTypes from 'prop-types';

const CustomCheckBox = ({ title, check, onClick }) => {
  return (
    <div className="flex align-middle text-sm">
      <div>
        {check ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 120 112"
            onClick={onClick}
          >
            <defs>
              <clipPath id="clip-check-box-icon_">
                <rect width="30" height="30" />
              </clipPath>
            </defs>
            <g id="check-box-icon_" data-name="check-box-icon ">
              <g id="Group_2187" data-name="Group 2187" transform="translate(9 -6)">
                <g
                  id="Rectangle_10615"
                  data-name="Rectangle 10615"
                  transform="translate(10 21)"
                  fill="none"
                  stroke="#a8aeed"
                >
                  <rect width="83" height="83" rx="22" stroke="none" />
                  <rect x="3.5" y="3.5" width="76" height="76" rx="18.5" fill="none" />
                </g>
              </g>
              <path
                id="_42eb6d42b0be15c0f5b9b7928476b69a"
                data-name="42eb6d42b0be15c0f5b9b7928476b69a"
                d="M17.791,109.544a3.683,3.683,0,0,1-2.616-1.083L1.106,94.391a3.693,3.693,0,0,1,5.222-5.222l11.463,11.463L40.708,77.706a3.693,3.693,0,1,1,5.222,5.222L20.4,108.461A3.685,3.685,0,0,1,17.791,109.544Z"
                transform="translate(36.975 -36.625)"
                fill="#a8aeed"
              />
            </g>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 120 112"
            onClick={onClick}
          >
            <defs>
              <clipPath id="clip-box-icon_">
                <rect width="30" height="30" />
              </clipPath>
            </defs>
            <g id="box-icon_" data-name="box-icon ">
              <g id="Group_2187" data-name="Group 2187" transform="translate(9 -6)">
                <g
                  id="Rectangle_10615"
                  data-name="Rectangle 10615"
                  transform="translate(10 21)"
                  fill="none"
                  stroke="#a8aeed"
                >
                  <rect width="83" height="83" rx="22" stroke="none" />
                  <rect x="3.5" y="3.5" width="76" height="76" rx="18.5" fill="none" />
                </g>
              </g>
            </g>
          </svg>
        )}
      </div>
      {title && <p className="m-1 dark:text-shoorah-offWhite text-xs">{title}</p>}
    </div>
  );
};

CustomCheckBox.propTypes = {
  title: PropTypes.string,
  check: PropTypes.bool,
  onClick: PropTypes.func
};
export default CustomCheckBox;

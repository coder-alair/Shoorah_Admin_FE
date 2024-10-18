import React, { useEffect, useState } from 'react';
import { errorToast, getLocalStorageItem } from '../../../utils/helper';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../../component/common/Loader';
import { PartnerApi } from '../../../api/partnerApi';
import parser from 'html-react-parser';

function PartnerAssets(props) {
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState();

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  return (
    <div>
      {loader ? <Loader /> : null}
      <div className="px-5 w-full overflow-hidden h-full">
        {/* centre grid */}
        <div className="col-span-3 relative h-full flex flex-col gap-y-4 hide-scrollbar overflow-y-auto ">
          {/* greetings box */}
          <div className="flex flex-col gap-2">
            <span className="text-shoorah-newDashboardBlue dark:text-white text-3xl font-bold">
              Shoorah Assets
            </span>

            <p className="text-lg text-gray-500 ">
              Partners can use the assets supplied from the link above, to promote Shoorah on the
              following platforms; Website, Social Media, and printed marketing content.
            </p>
            <p className="text-lg text-gray-500 ">
              At no time can any "partners" share their commissions by offering % to promote to
              users. No % promotions can be marketing for gaining the advantage of sales over other
              partners, or if a partner is granted a "unique" discount code %,
            </p>
            <p className="text-lg text-gray-500 ">
              this can not be promoted online as a marketing technique, but solely for discretional
              1-to-1 direct sales with your client. 
            </p>

            <a
              className="bg-white my-3 dark:bg-shoorah-primary dark:text-white flex items-center gap-3 p-2 px-6 rounded-lg w-fit"
              target="_blank"
              href="https://drive.google.com/drive/folders/1ercPBTsn1AW8r_hDKT2kOX6uFp0GfJZJ" rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="28px"
                height="28px"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              <p className="text-md  ">Download Shoorah Assets</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerAssets;

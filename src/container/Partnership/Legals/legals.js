import React, { useEffect, useState } from 'react';
import { errorToast, getLocalStorageItem } from '../../../utils/helper';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../../component/common/Loader';
import { PartnerApi } from '../../../api/partnerApi';
import parser from 'html-react-parser';

function PartnerLegals(props) {
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState();

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const getCmsData = () => {
    setLoader(true);
    PartnerApi.getCms(`partner-legals`)
      .then((res) => {
        if (res.data.meta.code === 1) {
          setLoader(false);
          setData(res.data.data);
        } else {
          setLoader(false);
          errorToast(res.data.meta.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCmsData();
  }, []);

  return (
    <div>
      {loader ? <Loader /> : null}
      <div className="px-5 w-full overflow-hidden h-full">
        {/* centre grid */}
        <div className="col-span-3 relative h-full flex flex-col gap-y-4 hide-scrollbar overflow-y-auto ">
          {/* greetings box */}
          <div className="flex flex-col gap-2">
            {/* <h1 className="text-shoorah-newDashboardBlue dark:text-white text-xl lg:text-3xl font-medium ">
                            {moment().format("dddd")}
                        </h1> */}
            <span className="text-shoorah-newDashboardBlue dark:text-white text-3xl font-bold">
              Legals
            </span>
            <p className="P22Mackinac mx-auto dark:text-white text-[0.9rem] md:text-[1.2rem]">
              {data && data?.description && parser(data?.description)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerLegals;

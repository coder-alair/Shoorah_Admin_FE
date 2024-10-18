import React, { Fragment, useEffect, useRef, useState } from 'react';
import Pagination from '../../../../component/common/Pagination/Pagination';
import Table from '../../../../component/common/Table';
import { useNavigate } from 'react-router-dom';
import { PER_PAGE, badgesCategory, gendersCategory } from '../../../../utils/constants';
import SelectMenu from '../../../../component/common/SelectMenu';
import SearchInput from '../../../../component/common/Input/SearchInput';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../../../component/common/Breadcrumb';
import {
  downloadOWBMHReportToCSV,
  downloadOWBMHReportToPDF,
  downloadSingleRadialReportToCSV,
  downloadSingleRadialReportToPDF,
  errorToast,
  getJWTToken,
  getLocalStorageItem,
  successToast,
  useOutsideClick
} from '../../../../utils/helper';
import { CompanyApi } from '../../../../api/companyApi';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import HybridRevenueShowcase from '../../../DashboardContent.js/HybridRevenueShowcase';
import { RadialBar, RadialBarChart } from 'recharts';
import { DateRangePicker } from 'react-date-range';
import { CalendarIcon } from '@heroicons/react/24/outline';
import Loader from '../../../../component/common/Loader';

function CBadges() {
  const [isLoading, setIsLoading] = useState(true);
  const [badgesData, setBadgesData] = useState([
    { name: 'Users', status: '12K' },
    {
      name: 'Badges Count',
      status: '1200'
    }
  ]);
  const [badgesFilter, setBadgesFilter] = useState({
    gender: 6,
    badges: 0
  });

  const [badesByGenderFilter, setBadesByGenderFilter] = useState({
    badges: 0
  });

  const [gendersData, setGendersData] = useState([
    { name: 'Total', x: 100, fill: '#E5EAF9' },
    { name: 'Male', x: 80, fill: '#B6C0F3' },
    { name: 'Female', x: 60, fill: '#888beb' },
    { name: 'Non Binary', x: 20, fill: '#6167e8' },
    { name: 'Intersex', x: 20, fill: '#4a56db' },
    { name: 'Transgenders', x: 20, fill: '#3a47ab' },
    { name: 'Non Prefer', x: 20, fill: '#313b6b' }
  ]);

  const [badgesGraphData, setBadgesGraphData] = useState([
    { name: 'Total', x: 100, fill: '#E5EAF9', background: '#ff0000' },
    { name: 'Bronze', x: 80, fill: '#B6C0F3' },
    { name: 'Silver', x: 60, fill: '#888beb' },
    { name: 'Gold', x: 20, fill: '#6167e8' },
    { name: 'Platinum', x: 20, fill: '#4a56db' },
    { name: 'Diamond', x: 20, fill: '#3a47ab' },
    { name: 'Guru', x: 20, fill: '#313b6b' }
  ]);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getTime() - 24 * 3600000),
    endDate: new Date()
  });

  const [showFilterModal, setShowFilterModal] = useState(false);

  const wrapperRef = useRef(null);
  useEffect(() => {
    getStatsData();
  }, [badgesFilter, badesByGenderFilter]);

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const companyId = userData?.companyId;
  const pages = [{ name: 'Badges', href: `/${userData.slug}/badges`, current: true }];

  //   retrievers
  const getStatsData = async () => {
    setIsLoading(true);
    await CompanyApi.getBadgesStats(
      companyId,
      dateRange.startDate,
      dateRange.endDate,
      badgesFilter.badges,
      badgesFilter.gender
    ).then(({ data }) => {
      if (data?.meta?.code === 1) {
        setBadgesData([
          { name: 'Users', status: data?.data?.totalUsers },
          {
            name: 'Badges Count',
            status: data?.data?.totalBadgesCount
          }
        ]);
      } else {
        errorToast(data?.meta?.message);
      }
    });

    await CompanyApi.getB2BbadgesStatsByGender(
      companyId,
      dateRange.startDate,
      dateRange.endDate,
      badesByGenderFilter?.badges
    ).then((response) => {
      setGendersData([
        {
          name: 'Total',
          x: response?.data?.data?.totalBadgesCount,
          fill: '#9146FF'
        },
        {
          name: 'Male',
          x: response?.data?.data?.maleBadgesCount,
          fill: '#B6C0F3'
        },
        {
          name: 'Female',
          x: response?.data?.data?.femaleBadgesCount,
          fill: '#888beb'
        },
        {
          name: 'Non Binary',
          x: response?.data?.data?.nonBinaryBadgesCount,
          fill: '#6167e8'
        },
        {
          name: 'Intersex',
          x: response?.data?.data?.interSexBadgesCount,
          fill: '#4a56db'
        },
        {
          name: 'Transgenders',
          x: response?.data?.data?.transgenderBadgesCount,
          fill: '#3a47ab'
        },
        {
          name: 'Non Prefer',
          x: response?.data?.data?.notPreferBadgesCount,
          fill: '#313b6b'
        }
      ]);
      // setGendersData([
      //   { name: "Total", x: response?.data?.data?.totalUsers, fill: "#186F65" },
      //   {
      //     name: "Male",
      //     x: response?.data?.data?.maleBadgesCount,
      //     fill: "#B5CB99",
      //   },
      //   {
      //     name: "Female",
      //     x: response?.data?.data?.femaleBadgesCount,
      //     fill: "#B2533E",
      //   },
      //   {
      //     name: "Other",
      //     x: response?.data?.data?.nonBinaryBadgesCount,
      //     fill: "#21BDAD",
      //   },
      // ]);
    });

    await CompanyApi.getTotalBadges(companyId).then((response) => {
      setBadgesGraphData([
        {
          name: 'Total',
          x: response?.data?.data?.totalBadges,
          fill: '#9146FF',
          background: '#ff0000'
        },
        {
          name: 'Bronze',
          x: response?.data?.data?.bronzeCount,
          fill: '#B6C0F3',
          background: '#ff0000'
        },
        {
          name: 'Silver',
          x: response?.data?.data?.silverCount,
          fill: '#888beb',
          background: '#ff0000'
        },
        {
          name: 'Gold',
          x: response?.data?.data?.goldCount,
          fill: '#6167e8',
          background: '#ff0000'
        },

        {
          name: 'Platinum',
          x: response?.data?.data?.platinumCount,
          fill: '#4a56db',
          background: '#ff0000'
        },
        {
          name: 'Diamond',
          x: response?.data?.data?.daimondCount,
          fill: '#3a47ab',
          background: '#ff0000'
        },
        {
          name: 'Guru',
          x: response?.data?.data?.guruCount,
          fill: '#3a47ab',
          background: '#ff0000'
        }
      ]);
      // setBadgesGraphData([
      //   {
      //     name: "Total",
      //     x: response?.data?.data?.totalBadges,
      //     fill: "#186F65",
      //   },
      //   {
      //     name: "Bronze",
      //     x: response?.data?.data?.bronzeCount,
      //     fill: "#B5CB99",
      //   },
      //   {
      //     name: "Silver",
      //     x: response?.data?.data?.silverCount,
      //     fill: "#B2533E",
      //   },
      //   { name: "Gold", x: response?.data?.data?.goldCount, fill: "#21BDAD" },
      //   {
      //     name: "Platinum",
      //     x: response?.data?.data?.platinumCount,
      //     fill: "#591dc2",
      //   },
      //   {
      //     name: "Diamond",
      //     x: response?.data?.data?.daimondCount,
      //     fill: "#84b23e",
      //   },
      // ]);
    });

    setIsLoading(false);
  };
  //   handlers
  const handleChange = (e) => {
    const { name, value, id } = e.target;
    setBadgesFilter({ ...badgesFilter, [id]: value });
    return;
  };

  const handleSelectRange = (e) => {
    let start = new Date(e?.selection?.startDate);
    start.setHours(new Date().getHours());
    start.setMinutes(new Date().getMinutes());
    start.setSeconds(new Date().getSeconds());
    let end = new Date(e?.selection?.endDate);
    end.setHours(new Date().getHours());
    end.setMinutes(new Date().getMinutes());
    end.setSeconds(new Date().getSeconds());
    const date = {
      startDate: start,
      endDate: end
    };
    setDateRange(date);
  };

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>B2B | Badges</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-6 px-3">
          {/* Filters */}
          <div className="border border-gray-300 rounded-3xl p-4 mt-6 dark:bg-shoorah-darkBgTabColor dark:border-none bg-white">
            <div className=" dark:text-white text-black text-xl font-medium p-2 mb-4 w-full flex flex-col gap-y-4 lg:flex-row items-center justify-between">
              <h4> {'Badges Stats'}</h4>
              <div className=" flex w-full lg:w-auto items-center gap-x-2">
                {/* gender */}
                <select
                  className="border dark:bg-shoorah-darkBgColor w-1/2 lg:w-auto dark:text-white dark:border-none text-[#666666] rounded-md h-8 px-1"
                  // value={graphParam.companyName}
                  id="gender"
                  name="gender"
                  onChange={handleChange}
                  value={badgesFilter.gender}
                >
                  <option value={''} disabled>
                    Select Gender
                  </option>
                  {gendersCategory.map(({ name, value }) => (
                    <option key={value} value={value}>
                      {name}
                    </option>
                  ))}
                </select>

                {/* badges */}
                <select
                  className="border w-1/2 lg:w-auto dark:bg-shoorah-darkBgColor dark:text-white dark:border-none text-[#666666] rounded-md h-8 px-1"
                  // value={graphParam.companyName}
                  id="badges"
                  name="badges"
                  onChange={handleChange}
                  value={badgesFilter.badges}
                >
                  <option value={''} disabled>
                    Select Badges
                  </option>
                  {badgesCategory.map(({ name, value }) => (
                    <option key={value} value={value}>
                      {name}
                    </option>
                  ))}
                </select>

                {/* date */}
                <button
                  className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                  onClick={() => setShowFilterModal((state) => !state)}
                >
                  <CalendarIcon className="text-white w-[18px] h-[20px] inline" />
                </button>
                <Transition
                  show={showFilterModal}
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className="absolute  z-[2] mt-2 mx-auto  origin-top-right rounded-md dark:bg-shoorah-darkBgTabColor dark:border-none bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    ref={wrapperRef}
                  >
                    <div>
                      <DateRangePicker
                        ranges={[
                          {
                            startDate: dateRange?.startDate ? dateRange?.startDate : new Date(),
                            endDate: dateRange?.endDate ? dateRange?.endDate : new Date(),
                            key: 'selection'
                          }
                        ]}
                        onChange={handleSelectRange}
                        maxDate={new Date()}
                      />
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
            <HybridRevenueShowcase data={badgesData} />
          </div>

          <div className="my-10 w-full text-center dark:text-white font-bold lg:text-lg lg:px-24">
            The more active users, the more badges will be unlocked. Encourage your teams to use
            Shoorah to unlock more badges.
          </div>

          <div className=" grid gap-x-4 grid-cols-1 gap-y-4 lg:grid-cols-2">
            <div className="border flex flex-col  border-gray-300 rounded-3xl p-4 dark:bg-shoorah-darkBgTabColor dark:border-none bg-white">
              <div className="flex justify-between items-center">
                <div className=" dark:text-white text-black text-xl w-full flex md:flex-row flex-col gap-y-4 items-center justify-between  font-medium p-2">
                  <p>Badges by Gender</p>
                  <select
                    className="border w-1/2 lg:w-auto dark:bg-shoorah-darkBgColor dark:text-white dark:border-none text-[#666666] rounded-md h-8 px-1"
                    // value={graphParam.companyName}
                    id="badges"
                    name="badges"
                    onChange={(e) =>
                      setBadesByGenderFilter({
                        ...badesByGenderFilter,
                        badges: e.target.value
                      })
                    }
                    value={badesByGenderFilter.badges}
                  >
                    <option value={''} disabled>
                      Select Badges
                    </option>
                    {badgesCategory.map(({ name, value }) => (
                      <option key={value} value={value}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <button
              className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
              //   onClick={() => setShowFilterModal((state) => !state)}
            >
              <CalendarIcon className="text-white w-[18px] h-[20px] inline" />
            </button> */}
              </div>
              <div className="mt-4  flex-grow dark:text-white relative gap-y-2 lg:gap-y-8 h-auto justify-center items-center flex flex-col  ">
                <div className="flex justify-center items-center mr-6">
                  <RadialBarChart
                    width={200}
                    height={200}
                    data={gendersData}
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="110%"
                    barSize={10}
                  >
                    <RadialBar minAngle={15} dataKey="x" clockWise background />
                  </RadialBarChart>
                </div>

                <span className=" grid grid-cols-2  gap-x-12 gap-y-6 dashboard_sec2_custom">
                  {/* <span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 inline-block  rounded-full bg-[#E5EAF9]"></span>
                      <div>
                        <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">Total</div>
                      </div>{" "}
                      <div className="text-xl font-medium">
                        {badgesGraphData[0]?.x}
                      </div>
                    </div>
                  </span> */}
                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: gendersData[0].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full "
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            All
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">{gendersData[0]?.x}</div>
                    </div>
                  </span>
                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: gendersData[1].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full "
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Male
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">{gendersData[1]?.x}</div>
                    </div>
                  </span>
                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: gendersData[2].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full "
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Female
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">{gendersData[2]?.x}</div>
                    </div>
                  </span>

                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: gendersData[3].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full "
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Non Binary
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">{gendersData[3]?.x}</div>
                    </div>
                  </span>

                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: gendersData[4].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full"
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Intersex
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">{gendersData[4]?.x}</div>
                    </div>
                  </span>

                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: gendersData[5].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full "
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Transgenders
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">{gendersData[5]?.x}</div>
                    </div>
                  </span>

                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: gendersData[6].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full "
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Non Prefer
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">{gendersData[6]?.x}</div>
                    </div>
                  </span>
                </span>
              </div>
            </div>
            <div className="border border-gray-300 rounded-3xl p-4 dark:bg-shoorah-darkBgTabColor dark:border-none bg-white">
              <div className="flex justify-between items-center">
                <div className=" dark:text-white text-black text-xl font-medium p-2">
                  Total Unlocked Badges
                </div>
              </div>
              <div className="mt-4 dark:text-white gap-y-2 relative h-auto justify-center items-center flex flex-col lg:gap-y-8">
                <div className="flex justify-center items-center mr-6">
                  <RadialBarChart
                    width={200}
                    height={200}
                    data={badgesGraphData}
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="110%"
                    barSize={10}
                  >
                    <RadialBar minAngle={15} dataKey="x" clockWise background />
                  </RadialBarChart>
                </div>
                <span className=" grid grid-cols-2  gap-x-12 gap-y-6 dashboard_sec2_custom">
                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: badgesGraphData[0].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full"
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Total
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">
                        {badgesGraphData[0]?.x}
                      </div>
                    </div>
                  </span>

                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: badgesGraphData[1].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full"
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Bronze
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">
                        {badgesGraphData[1]?.x}
                      </div>
                    </div>
                  </span>
                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: badgesGraphData[2].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full "
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Silver
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">
                        {badgesGraphData[2]?.x}
                      </div>
                    </div>
                  </span>
                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: badgesGraphData[3].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full"
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Gold
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">
                        {badgesGraphData[3]?.x}
                      </div>
                    </div>
                  </span>

                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: badgesGraphData[4].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full "
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Platinum
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">
                        {badgesGraphData[4]?.x}
                      </div>
                    </div>
                  </span>

                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: badgesGraphData[5].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full "
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Daimond
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">
                        {badgesGraphData[5]?.x}
                      </div>
                    </div>
                  </span>

                  <span>
                    <div className="grid grid-cols-2 items-center">
                      <div className="flex gap-1 items-center">
                        <span
                          style={{
                            backgroundColor: badgesGraphData[6].fill
                          }}
                          className="w-2 h-2 flex-shrink-0 inline-block  rounded-full "
                        ></span>
                        <div>
                          <div className="text-gray-400 md:text-base text-sm whitespace-nowrap ">
                            Guru
                          </div>
                        </div>
                      </div>
                      <div className="text-xl text-center  font-medium">
                        {badgesGraphData[6]?.x}
                      </div>
                    </div>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CBadges;

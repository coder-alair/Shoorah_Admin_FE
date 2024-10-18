import React, { useEffect, useMemo, useState } from 'react';
import CompanyCount from '../CompanyCount';
import ReactApexChart from 'react-apexcharts';
import { Api } from '../../../../api';
import { barGraphOption, dummyColumnData } from '../../CompanyAdmin/Dashboard/dummy';
import { CompanyTypeData } from '../../../../utils/constants';
import DashboardSurveyChart from '../../../Survey/DashboardSurveyChart';

function BTBDashboard() {
  const [companyList, setCompanyList] = useState([]);
  const [surveyData, setSurveyData] = useState({});
  const [graphParam, setGraphParam] = useState({
    companyGraphYear: new Date().getFullYear(),
    companyName: '',
    categoryName: ''
  });
  const [barGraphData, setBarGraphData] = useState({ options: {}, series: [] });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'categoryName') {
      setGraphParam({ ...graphParam, companyName: '', [name]: value });
      return;
    }
    setGraphParam({ ...graphParam, categoryName: '', [name]: value });
  };
  const getSurveyData = () => {
    Api.getB2BSurveyDashboardData()
      .then((res) => res.data)
      .then((response) => {
        setSurveyData(response?.data[0] || {});
      });
  };
  const getCompanyList = () => {
    Api.getCompanyList()
      .then((res) => {
        if (res.data?.meta?.code === 1) {
          setCompanyList(res.data?.data);
          if (res.data?.data.length > 0) {
            setGraphParam({
              ...graphParam,
              companyName: res.data?.data[0]._id
            });
          }
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getCompanyList();
    getSurveyData();
  }, []);

  useEffect(() => {
    // TODO: api integration for industry type
    if (graphParam.companyName || graphParam.categoryName) {
      getOverallCompanyData(
        graphParam.companyName,
        graphParam.companyGraphYear,
        graphParam.categoryName
      );
    }
  }, [graphParam]);

  const getOverallCompanyData = (id, year, category) => {
    Api.getOverallCompanyGraph(id, year, category)
      .then((res) => {
        setBarGraphData(barGraphOption(res.data.labels, res.data.overallPercentage));
      })
      .catch((err) => {});
  };

  const year = useMemo(() => {
    let row = [];
    for (let i = 0; i < 100; i++) {
      row.push(<option value={2000 + i}>{2000 + i}</option>);
    }
    return row;
  }, []);

  return (
    <div className="px-3">
      {/* Top Chart for bulk data */}
      <CompanyCount heading={`Company Dashboard`} show={true} companyComparsion={true} />
      <div className="bg-white dark:bg-shoorah-darkBgTabColor dark:text-white dark:border-none mt-6 p-4 mb-4 rounded-lg">
        <div>
          <p className="text-center font-medium flex justify-between items-center">
            Overall Company Graph
            <div className=" lg:hidden text-end">
              <button
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                // onClick={() => setShowFilterModal((state) => !state)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z"
                    fill="#E5EAF9"
                  />
                </svg>
              </button>
            </div>
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col lg:flex-row gap-2 max-w-fit">
              <select
                className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none  rounded-md h-8 px-1"
                value={graphParam.companyGraphYear}
                id="companyGraphYear"
                name="companyGraphYear"
                onChange={handleChange}
              >
                <option value={''} disabled>
                  Select Year
                </option>
                {year}
              </select>
              <select
                className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none rounded-md h-8 px-1"
                value={graphParam.companyName}
                id="companyName"
                name="companyName"
                onChange={handleChange}
              >
                <option value={''}>Select Company</option>
                {companyList.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e?.company_name}
                  </option>
                ))}
              </select>

              <select
                className="border text-[#666666] dark:bg-shoorah-darkBgColor dark:text-white dark:border-none rounded-md h-8 px-1"
                value={graphParam.categoryName}
                id="categoryName"
                name="categoryName"
                onChange={handleChange}
              >
                <option value={''}>Select Category</option>
                {CompanyTypeData.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className=" lg:block hidden text-end">
              <button
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-2 py-1 text-xs font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none sm:w-auto"
                // onClick={() => setShowFilterModal((state) => !state)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9375 0.876719H10.1773C9.71287 0.340281 9.02837 0 8.26562 0H5.73438C4.97162 0 4.28712 0.340281 3.82266 0.876719H2.0625C1.28709 0.876719 0.65625 1.50881 0.65625 2.28572V14.591C0.65625 15.3679 1.28709 16 2.0625 16H11.9375C12.7129 16 13.3438 15.3679 13.3438 14.591V2.28572C13.3438 1.50878 12.7129 0.876719 11.9375 0.876719ZM5.73438 0.939344H8.26562C8.98991 0.939344 9.59141 1.42419 9.78906 2.06653H4.21094C4.40825 1.42531 5.00897 0.939344 5.73438 0.939344ZM12.4062 14.591C12.4062 14.85 12.196 15.0607 11.9375 15.0607H2.0625C1.80403 15.0607 1.59375 14.85 1.59375 14.591V2.28572C1.59375 2.02675 1.80403 1.81606 2.0625 1.81606H3.30769C3.23834 2.04983 3.20312 2.29238 3.20312 2.53622C3.20312 2.79559 3.413 3.00588 3.67188 3.00588H10.3281C10.587 3.00588 10.7969 2.79559 10.7969 2.53622C10.7969 2.29238 10.7617 2.04983 10.6923 1.81606H11.9375C12.196 1.81606 12.4062 2.02675 12.4062 2.28572V14.591Z"
                    fill="#E5EAF9"
                  />
                </svg>
              </button>
            </div> */}
          </div>
          <div className="lg:mx-40 lg:mx-30 sm:mx-20 mb-4 mt-10">
            <ReactApexChart
              options={barGraphData.options}
              series={barGraphData.series}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>
      <DashboardSurveyChart data={surveyData?.graphData?.slice(0, 10)} />
    </div>
  );
}

export default BTBDashboard;

// import React from 'react';
// import upcircle from '../../../../assets/images/upcircle.svg'
// import { RadialBarChart, RadialBar } from 'recharts';
// import PropTypes from 'prop-types';
// import Chart from 'react-apexcharts';
// import { Fragment, useContext, useEffect, useRef, useState } from 'react';

// const BTBdashboard = () => {

//   const [activePayingUserData, setActivePayingUserData] = useState([
//     { name: 'Therapy', x: 10, fill: '#313b6b' },
//     { name: 'Psychology', x: 12, fill: '#6167e8' },
//     { name: 'Counselling', x: 18, fill: '#B6C0F3' },

//   ]);

//   const dataline = [
//     { label: 'Director', value: 36, color: 'bg-blue-500' },
//     { label: 'Senior Manager', value: 24, color: 'bg-yellow-400' },
//     { label: 'Manager', value: 31, color: 'bg-orange-400' },
//     { label: 'Associate', value: 39, color: 'bg-green-400' },
//     { label: 'Staff', value: 53, color: 'bg-pink-500' },
//     { label: 'Producer', value: 32, color: 'bg-teal-400' }
// ];
//   const genderData = {
//     labels: ['Male', 'Female', 'Other'],
//     datasets: [
//       {
//         data: [55, 35, 10],
//         backgroundColor: ['#4c51bf', '#a0aec0', '#68d391'],
//         hoverBackgroundColor: ['#4c51bf', '#a0aec0', '#68d391'],
//       },
//     ],
//   };

//   const ageData = {
//     labels: ['<25', '25-35', '35-45', '>45'],
//     datasets: [
//       {
//         data: [20, 50, 20, 10],
//         backgroundColor: ['#4c51bf', '#a0aec0', '#68d391', '#f6ad55'],
//         hoverBackgroundColor: ['#4c51bf', '#a0aec0', '#68d391', '#f6ad55'],
//       },
//     ],
//   };

//   const sessionData = {
//     labels: ['Therapy', 'Psychology', 'Counselling'],
//     datasets: [
//       {
//         data: [40, 30, 30],
//         backgroundColor: ['#4c51bf', '#a0aec0', '#68d391'],
//         hoverBackgroundColor: ['#4c51bf', '#a0aec0', '#68d391'],
//       },
//     ],
//   };

//   return (

//     <div className="bg-gray-100 w-full h-auto pb-10 p-8 font-sans">

//       <header className="mb-8">

//         <div className='     flex flex-col md:flex-row w-full justify-between pb-8'>
//         <div className="md:w-2/3 relative top-[-10px]">
//           <h1 className="text-3xl leading-none ">Welcome to PEAP</h1>
//           <p className="text-gray-900 mt-4  text-sm   ">Our premium employee assistance program designed to provide you with comprehensive support for your personal and professional growth.</p>
//         </div>
//         <div className="flex flex-row justify-evenly w-full md:w-[20rem] h-[5rem] relative top-5 sm:top-[-20px]">
//         <button className="bg-white text-gray-500 px-6 rounded-3xl">Filter</button>
//         <button className="bg-white text-gray-500 px-6 rounded-3xl">Notifi</button>
//           </div>
//           </div>

//         </header>

//         <div className="grid  flex-row sm:grid-cols-12 justify-between items-center mb-8 gap-14">
//           <div className="    col-span-3    w-full  h-[20rem] bg-white p-6 rounded-3xl text-center mb-6 md:mb-0">

//             <p className="flext flex-col text-left w-[5rem] text-2xl text-gray-500">Total Members Supported</p>
//             <div className='flex justify-center  items-center h-[5rem] p-5 mt-8'>
//               <h2 className="text-6xl font-semibold   text-indigo-600">1,567</h2>
//           </div>
//           </div>
//           <div className=' col-span-3 w-full  h-[20rem] flex flex-col gap-6 mb-6 md:mb-0 '>
//               <div className="bg-white   text-center rounded-3xl overflow-hidden">
//                 <div className='flex justify-center items-center  h-[5.85rem]'>
//                   <h2 className="text-4xl font-semibold  h-[2rem]l ">3,567</h2>
//                   </div>
//               <div className=' pb-4 w-full  h-[4rem] bg-[#4a56db] flex items-center  justify-center  text-center'>
//                 <p className="text-xl text-white">Total Sessions</p>
//                 </div>
//           </div>
//               <div className="bg-white text-center rounded-3xl overflow-hidden">
//               <div className='flex justify-center items-center  h-[5.85rem]'>
//                   <h2 className="text-4xl font-semibold h-[2rem] ">546</h2>
//                   </div>
//               <div className='pb-4 w-full bg-[#4a56db] h-[4rem] flex items-center  justify-center text-center  tracking-tighter leading-none '>
//                 <p className="text-lg sm:text-xl  text-white">Work Related Cases</p>
//                 </div>
//           </div>
//           </div>
//           <div className=" col-span-6 w-full h-[20rem] flex flex-col justify-center items-center bg-white p-6 rounded-3xl text-center gap-12 ">
//               <p className="text-xl text-gray-800  w-48">How your employees have rated PEAP</p>
//               <div className=' flex flex-row gap-8   justify-center text-xl '>
//               <h2 className="text-7xl  font-normal  ">4.5 </h2>
//                 <span className=' flex items-end text-4xl   font-medium  '>/ 5</span>
//                 </div>
//             <div className="flex  flex-row  justify-center mt-2 ">

//             </div>

//           </div>
//       </div>

//         <div className=" flex flex-col sm:flex-row   justify-between w-full  gap-12 pt-5 ">
//         <div className="grid grid-cols-1  w-full col-span-4 justify-center  mt-14 sm:mt-0 mb-12 card bg-white rounded-3xl p-5">
//     <div className="relative left-5 text-black dark:text-white text-lg lg:text-xl font-medium p-2">
//    Gender
//     </div>
//     <div className="flex justify-center">
//       <RadialBarChart
//         width={500}
//         height={310}
//         data={activePayingUserData}
//         cx="50%"
//         cy="50%"
//         innerRadius="35%"
//         outerRadius="120%"
//         barSize={10}
//       >
//         <RadialBar minAngle={15} dataKey="x" clockWise background />
//       </RadialBarChart>
//     </div>
//     <div className=' w-full flex   justify-center'>
//   <span className="flex flex-row w-full  justify-center mt-9 mb-9   gap-x-9 lg:gap-y-6 dashboard_sec2_custom flex-wrap overflow-hidden">
//     {activePayingUserData.map(({ name, x, fill }) => (
//       <span key={name} className="flex items-center gap-1 overflow-hidden">
//         <span className={`w-4 h-4 rounded-md`} style={{ backgroundColor: `${fill}` }}></span>
//         <div className="flex flex-row gap-3 ml-0 mr-0 overflow-hidden">
//           <div className="truncate">
//             <div className="text-gray-400 truncate">{name}</div>
//           </div>
//         </div>
//       </span>
//     ))}
//   </span>
// </div>
//   </div>
//   <div className="grid grid-cols-1 w-full  col-span-4 justify-center  mt-14 sm:mt-0 mb-12 card bg-white rounded-3xl p-5">
//     <div className="relative left-5 text-black dark:text-white text-lg lg:text-xl font-medium p-2">
//  Age
//     </div>
//     <div className="flex justify-center">
//       <RadialBarChart
//         width={500}
//         height={310}
//         data={activePayingUserData}
//         cx="50%"
//         cy="50%"
//         innerRadius="35%"
//         outerRadius="120%"
//         barSize={10}
//       >
//         <RadialBar minAngle={15} dataKey="x" clockWise background />
//       </RadialBarChart>
//     </div>
//     <div className=' w-full flex   justify-center'>
//   <span className="flex flex-row w-full  justify-center mt-9 mb-9   gap-x-9 lg:gap-y-6 dashboard_sec2_custom flex-wrap overflow-hidden">
//     {activePayingUserData.map(({ name, x, fill }) => (
//       <span key={name} className="flex items-center gap-1 overflow-hidden">
//         <span className={`w-4 h-4 rounded-md`} style={{ backgroundColor: `${fill}` }}></span>
//         <div className="flex flex-row gap-3 ml-0 mr-0 overflow-hidden">
//           <div className="truncate">
//             <div className="text-gray-400 truncate">{name}</div>
//           </div>
//         </div>
//       </span>
//     ))}
//   </span>
// </div>
//   </div>
//         </div>
//         <div className="flex flex-row gap-5 w-full   ">
//         <div className=" relative flex-row  grid sm:grid-cols-12 w-full  justify-between gap-12 pt-3">

//           <div class="relative col-span-5 sm:col-span-8 sm:left-0 left-1 p-5 w-[94%]  sm:w-auto   rounded-3xl bg-white   mr-0 sm:ml-0 ml-3 ">

// <div className="flex justify-between items-center ">
//   <h2 className="text-xl font-semibold mt-5 ml-5 mb-5 ">Session Booked By Job Grade</h2>

// </div>
// <div className="  grid grid-cols-1    sm:w-auto sm:grid-cols-2 gap-x-4 sm:gap-x-20 gap-y-10 mt-3 ml-10 mr-0 sm:ml-10 sm:mr-10 ">
//   {dataline.map((item, index) => (
//       <div key={index} className="flex  w-[80%] flex-col items-center h-16 ">
//      <div className='flex justify-between w-full'>
//         <span className="text-gray-300 w-30">{item.label}</span>
//       <span className="text-gray-800">{item.value}</span>
//       </div>
//         <div className="flex w-full h-2 rounded-full bg-gray-200 overflow-hidden  mt-5">
//         <div className={` w-full h-2 ${item.color}`} style={{ width: `${(item.value / 50) * 50}%` }}></div>
//       </div>
//     </div>
//   ))}
// </div>
//   </div>

//           <div className=" relative col-span-4 w-full   bg-white p-6 rounded-3xl ">
//             <div h3 className="flex flex-row w-[20rem] justify-between pt-2 pl-3">
//             <h3 className=" w-[10rem] text-2xl font-normal text-gray-700 mb-2  ">WellPoints  Used</h3>
//               {/* <button className="bg-gray-300 text-white px-6 rounded-3xl">Months</button> */}
//               </div>

//             <div className="w-full flex  flex-col gap-6 mt-2 justify-center items-center  ">
//             <p className="text-gray-400  pt-1 ">1.01.2025 -   Present Date</p>
//               <h2 className="text-5xl  font-medium   text-[#4a56db] mb-2 ">1,567</h2>
//               <img  className="w-[4rem] h-[4rem] " src={ upcircle   }  alt='up' />

//             <p className= " text-center w-[18rem] text-gray-600">30% Increase compared to last month</p>
//             </div>
//           </div>

//           </div>
//         </div>
//       <div className="grid flex-row  sm:grid-cols-12 gap-12 pt-4   ">

//             <div className=" flex col-span-6 h-[36rem]  rounded-3xl bg-white  p-6 mt-10  justify-center">
//         <div className="grid grid-cols-1  col-span-4 justify-center  sm:mt-0  card bg-white rounded-3xl ">
//     <div className="relative left-5 text-black dark:text-white text-lg lg:text-xl font-medium p-2">
// Session Type
//     </div>
//     <div className="flex justify-center">
//       <RadialBarChart
//         width={500}
//         height={310}
//         data={activePayingUserData}
//         cx="50%"
//         cy="50%"
//         innerRadius="35%"
//         outerRadius="120%"
//         barSize={10}
//       >
//         <RadialBar minAngle={15} dataKey="x" clockWise background />
//       </RadialBarChart>
//     </div>
//     <div className=' w-full flex   justify-center'>
//   <span className="flex flex-row w-full  justify-center mt-9 mb-9   gap-x-9 lg:gap-y-6 dashboard_sec2_custom flex-wrap overflow-hidden">
//     {activePayingUserData.map(({ name, x, fill }) => (
//       <span key={name} className="flex items-center gap-1 overflow-hidden">
//         <span className={`w-4 h-4 rounded-md`} style={{ backgroundColor: `${fill}` }}></span>
//         <div className="flex flex-row gap-3 ml-0 mr-0 overflow-hidden">
//           <div className="truncate">
//             <div className="text-gray-400 truncate">{name}</div>
//           </div>
//         </div>
//       </span>
//     ))}
//   </span>
// </div>
//   </div>
//           </div>
//         <div className="  flex flex-col  col-span-6 bg-white p-6 gap-5 pl-8      rounded-3xl text-left mt-10" >
//           <h3 className="text-2xl font-normal text-gray-700 mb-2  ">WellPoints</h3>

//             <p className="text-gray-400 mb-2">Unallocated Balance</p>
//             <h2 className="text-7xl l font-medium text-[#4a56db] mb-2">10,000</h2>
//             <p className="text-gray-600  pt-4  ">Assign balace to members ?</p>
//             <p className="text-gray-400  pt-1 ">You can assign your Wellness points to all you staff members equally or assign them manually.</p>
//           <div className="w-full flex justify-between space-x-4">
//             <button className="bg-[#4a56db] text-white px-10 py-2 rounded-3xl ">Assign Equally</button>
//             <button className="bg-[#4a56db] text-white px-10 py-2  rounded-3xl">Assign Manually</button>
//           </div>
//           <div className="w-full  flex justify-between  mt-4">
//             <button className="bg-white text-gray-900 underline">Purchase More WellPoints</button>
//               <button className="bg-white text-gray-900 underline ml-2">Turn ON in-app requests</button>

//          </div>
//          <div className="w-full flex justify-between">
//                 <p className="text-gray-400  pt-1 ">Did you know? You can purchase up 100,000 WellPoints!</p>
//                 </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default BTBdashboard;

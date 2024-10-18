import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../../assets/css/calendar.css';
import Calendarflex from '../../../assets/images/Calendarflex.svg';
import Medicalbag from '../../../assets/images/Medicalbag.svg';
import Syncrefresh from '../../../assets/images/syncRefresh.svg';
import Clapflex from '../../../assets/images/clapflex.svg';
import Upcircle from '../../../assets/images/upcircle.svg';
import Ratingstar from '../../../assets/images/Ratingstar.svg';
import Halfstar from '../../../assets/images/Halfstar.svg';
import Happysmile from '../../../assets/images/happySmile.svg';
import Calendarsearch from '../../../assets/images/Calendarsearch.svg';
import Patientsearch from '../../../assets/images/Patientsearch.svg';
import Goalscubes from '../../../assets/images/Goalscubes.svg';
import Newnote from '../../../assets/images/Newnote.svg';
import Likenote from '../../../assets/images/Likenote.svg';
import Intervennotes from '../../../assets/images/Intervennotes.svg';

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const markedDates = [new Date('2024-05-05'), new Date('2024-05-10'), new Date('2024-05-15')];

const isDateMarked = (date) => {
  return markedDates.some((markedDate) => isSameDay(date, markedDate));
};

const tileClassName = ({ date }) => {
  return isDateMarked(date) ? 'marked-tile' : null;
};

const tileContent = ({ date, view }) => {
  if (view === 'month' && isDateMarked(date)) {
    return <span className="mark" />;
  }
  return null;
};

const ExpertDashboard = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleChange = (e) => {
    const date = new Date(e); // Convert the input to a Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setStartDate(formattedDate);
  };
  const today = new Date();
  return (
    // max - w - lg: Maximum width of 32rem(512px)

    <div className=" mx-auto  p-8 bg-gray-200 min-h-screen pb-30 font-sans  ">
      <div className="mt-6 mb-12">
        <h1 className="text-4xl  mb-2">Happy Monday, let’s make today count!</h1>
        <p className="text-gray-900 mt-4 ">Welcome to your PEAP Dashboard, Dr Reuben Hale.</p>
      </div>

      <div className="w-full flex flex-col justify-center">
        <div className="w-full grid grid-cols-12 xl:grid-cols-12 gap-10 col-span-12 relative">
          <div className="bg-[#e5eaf9] col-span-12 sm:col-span-6  p-6 rounded-[15rem] border-2 border-gray-300 flex items-center justify-evenly mb-6 md:mb-0">
            <button className="">
              <div className="flex w-[5rem] h-[5rem] bg-[#B6C0F3] justify-center rounded-[15rem] mr-4">
                <img className="w-[2.5rem]" loading='lazy' src={Calendarflex} alt="calendarf" />
              </div>
            </button>
            <div className="flex items-center justify-between w-full bg-[#B6C0F3] rounded-[15rem] p-4">
              <div className="flex-1 relative left-5">
                <p className="text-md tracking-tighter leading-none sm:leading-tight text-gray-500">
                  Total appointments this week
                </p>
                <p className="text-3xl text-blue-950">19 in total</p>
              </div>
              <div className="flex-shrink-0">
                <button className="flex items-center">
                  <img className="w-[25px]" loading='lazy' src={Syncrefresh} alt="sync" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#e5eaf9] col-span-12 sm:col-span-6  p-6 rounded-[15rem] border-2 border-gray-300 flex items-center justify-center mb-6 md:mb-0">
            <button className="flex justify-center items-center mr-4">
              <div className="flex w-[5rem] h-[5rem] bg-[#B6C0F3] justify-center items-center rounded-[15rem]">
                <img className="w-[2.5rem]" loading='lazy' src={Medicalbag} alt="medicalbag" />
              </div>
            </button>
            <div className="flex w-full p-4 bg-[#B6C0F3] items-center rounded-[15rem]">
              <div className="flex flex-col w-full relative left-[1rem]">
                <p className="text-lg text-gray-500 leading-none  tracking-tighter">
                  Next Appointment
                </p>
                <p className="text-3xl text-blue-950 leading-none tracking-tighter break-words">
                  Today at 10:30am
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className=" flex flex-col  md:flex-row  w-full rounded-[2rem]  justify-center mb-8  ">
          <div className=" flex flex-col md:flex-row w-full  bg-white pt-6  pb-10 pl-6 pr-2 rounded-[2rem] gap-2 border-2  justify-evenly border-gray-300 mb-6 mt-16   ">
            <div className=" flex flex-col w-full gap-12 ">
              <div className=" flex flex-col sm:grid sm:grid-cols-12 w-full items-center">
                <div className="col-span-6 mb-5 sm:mb-0">
                  <h2 className="relative  text-[1.4rem] font-medium  text-gray-700">
                    Most Recent Appointment
                  </h2>
                </div>

                <div className="col-span-6">
                  <div className=" flex flex-row gap-2  ">
                    <div className="flex border   w-full h-[3.5rem]  border-1  border-gray-300 2px rounded-[15rem] justify-evenly mr-6 ">
                      <img
                        className="w-[1.5rem] ml-2 mr-2 "
                        src={Patientsearch}
                        loading='lazy'
                        alt="Patientsearch"
                      />
                      <input
                        className="border-none w-full  text-blue-700 leading-tight focus:outline-none focus:shadow-outline  truncate  tracking-tighter  rounded-[15rem] text-xs"
                        placeholder="Patient Name / Surname"
                        // className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                        // {...props}
                      />
                    </div>

                    <div className="flex border w-full  h-[3.5rem]  border-1  border-gray-300 2px rounded-[15rem] justify-evenly mr-5 ">
                      <img
                        className="w-[1.5rem] ml-2 mr-2 "
                        src={Calendarsearch}
                        loading='lazy'
                        alt="Calendarsearch"
                      />
                      <input
                        className="border-none w-full  text-xs text-blue-700 leading-tight  truncate focus:outline-none focus:shadow-outline rounded-[15rem]"
                        placeholder="Appointment date"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white flex flex-col sm:grid sm:grid-cols-12 sm:flex-row  sm:gap-0 gap-10  mb-0 sm:mb-5">
                <div className="relative col-span-4    grid pl-0 sm:pl-3 pr-5  ">
                  <div className="  text-base  mb-4 flex flex-col justify-between ">
                    <div className="flex  flex-col text-[1.4rem] text-gray-600">
                      <p className="break-words w-full text-[1.4rem] font-semibold">
                        Client : Reuben Hale
                      </p>
                      <p className="break-words w-full text-[1rem] font-semibold "> Shoorah User</p>
                    </div>
                    <div className=" break-words w-full text-gray-600">
                      <p className="break-words w-[80%] text-[1.2rem] font-semibold">
                        {' '}
                        Date: 02.03.2024 | 10:30am{' '}
                      </p>
                    </div>
                    <div className="break-words w-full text-gray-600 font-medium">
                      Presenting Concerns :
                    </div>
                    <div className="">
                      <div className="flex break-words   justify-left w-[70%] gap-4 relative top-2 ">
                        <button className="px-9  bg-[#6167e8] text-white rounded-full leading-relaxed">
                          Anxiety
                        </button>
                        <button className="  px-9  sm:flex-col bg-[#6167e8] text-white rounded-full  leading-relaxed">
                          Anxiety
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative col-span-3  right-0 mt-0   ml-0 sm:ml-6  xl:flex xl:flex-col xl:justify-start">
                  <div className="flex  ">
                    <img
                      className=" bg-[#e5eaf9] w-[2rem] h-[2rem] mr-1 rounded-3xl  p-1"
                      src={Intervennotes}
                      loading='lazy'
                      alt="Add intervation notes*"
                    />

                    <button className=" tracking-tighter w-full flex flex-row text-xs  leading-tight  justify-between underline items-center  \ text-gray-700 rounded-lg">
                      Add Intervention Notes*
                    </button>
                  </div>
                  <div className="flex  mt-10 ">
                    <img
                      className=" bg-[#e5eaf9] w-[2rem] h-[2rem] mr-1 rounded-3xl  p-1"
                      src={Goalscubes}
                      loading='lazy'
                      alt="Add goal notes*"
                    />
                    <button className="  tracking-tighter w-full flex flex-row text-xs  justify-between underline items-center  \ text-gray-700 rounded-lg">
                      Add Goal Notes*
                    </button>
                  </div>
                  <div className="flex  mt-9  ">
                    <img
                      className=" bg-[#e5eaf9] w-[2rem] h-[2rem] mr-1 rounded-3xl  p-1"
                      src={Happysmile}
                      loading='lazy'
                      alt="Add goal notes*"
                    />
                    <button className="  tracking-tighter  w-full flex flex-row   justify-between underline items-center  \ text-gray-700 rounded-lg">
                      Add Impression Notes*
                    </button>
                  </div>
                </div>
                <div className=" col-span-5  grid ml-0 sm:ml-8 pr-5">
                  <div className="relative flex  flex-col ">
                    <div className=" flex items-center justify-end p-3 bg-[#e5eaf9] text-gray-700 rounded-[2rem] pr-6 pt-2 pb-2">
                      <div className="flex flex-row  items-center justify-evenly  text-blue-900 pt-2 pb-2">
                        <div className="  flex     text-gray-700  rounded-full relative items-center  justify-center top-[-2rem] ">
                          <img
                            className="bg-[#B6C0F3]  w-[3.5rem] m-2  p-3  rounded-full "
                            src={Newnote}
                            loading='lazy'
                            alt="newnote"
                          />
                        </div>
                        <div className="     flex flex-col justify-center place-items-center ml-4   bg-[#B6C0F3]   relative bg-blue rounded-[1.5rem]   ">
                          {/* <div className=" flex">
                            <p className=" flex text-xs  tracking-tighter pl-4 pt-3   leading-tight  w-full ">
                              This session was valuable, and I feel motivated to work on the goals we
                              discussed. I'm looking forward to our next session to continue making
                              progress.
                            </p>
                          </div> */}
                          <div className="container mx-auto p-2">
                            <div className="flex">
                              <p className="flex text-responsive pl-3 pt-2 pr-1 leading-none w-full">
                                This session was valuable, and I feel motivated to work on the goals
                                we discussed. forward for making progress.
                              </p>
                            </div>
                          </div>
                          <div className=" relative left-5 pr-10 flex flex-row justify-between  mb-1   w-full rounded-full ">
                            <div className=" flex items-center    tracking-tighter  leading-none text-center  font-sans text-gray-400   ">
                              {today.getDate()} .{today.getMonth()}. {today.getFullYear()}
                            </div>
                            <div className=" flex relative   w-[2rem]   rounded-full  ">
                              <button className="flex ">
                                <img className="w-[2.5rem]" loading='lazy' src={Likenote} alt="Happysmile" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" flex justify-end text-xs leading-none w-[90%]   ">
                      <button className=" text-xs font-normal leading-none  tracking-tighter  underline   text-black  ">
                        <p className="text-[12px] leading-none "> REPLY TO USER DATA ? </p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* flex-cols-1 */}
      <div className="flex flex-col  w-[1/2] md:flex-row  gap-10 justify-center ">
        {/* 
      <div className="xs:flex-col justify-items-center border relative max-w-[38rem]  xl:h-[70.5rem]   sm:h-[70.55rem] border-2 border-gray-300 rounded-3xl bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white"> */}
        <div className="xs:flex-col justify-items-center   w-full relative  lg:h-[70.5rem] sm:h-[70.55rem] xl:h-[57.5rem] border-2 border-gray-300 rounded-3xl bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white">
          <div className="text-black h-full dark:text-white text-lg lg:text-xl font-medium mb-4 w-full flex flex-col gap-[1rem] p-8">
            <h4 className="  mt-4 ml-2">Monthly Schedule </h4>
            <div
              className={`mx-auto overflow-hidden flex justify-center mt-[1.5rem] md:px-8 rounded-2xl xl:rounded-[3rem] w-full`}
            >
              <Calendar
                onChange={handleChange}
                className={`calendar dark:!text-white text-sm sm:text-lg`}
                tileContent={tileContent}
                tileClassName={tileClassName}
                nextLabel={
                  <button className="custom-next-button">
                    <svg
                      width="16"
                      className=""
                      height="16"
                      viewBox="0 0 8 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.375 0.75C1.375 0.75 6.625 3.858 6.625 6C6.625 8.14125 1.375 11.25 1.375 11.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="dark:text-white"
                      ></path>
                    </svg>
                  </button>
                }
                prevLabel={
                  <button className="custom-prev-button">
                    <svg
                      width="16"
                      className="rotate-180"
                      height="16"
                      viewBox="0 0 8 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.375 0.75C1.375 0.75 6.625 3.858 6.625 6C6.625 8.14125 1.375 11.25 1.375 11.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="dark:text-white"
                      ></path>
                    </svg>
                  </button>
                }
                defaultValue={new Date()}
                navigationLabel={({ date }) => (
                  <button
                    onClick={() => console.log('hello')}
                    style={{
                      cursor: 'default !important',
                      pointerEvents: 'none !important'
                    }}
                  >
                    {date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </button>
                )}
              />
            </div>

            <div className="flex flex-col   justify-center rounded-[2rem] h-[18rem] mx-0  sm:items-start items-center">
              <div class="w-[16rem]    relative mt-[1rem] mb-[2rem] ">
                <h2 className=" font-semibold">4 Appointment this week:</h2>
              </div>
              <div className=" flex  flex-col gap-6 relative left-1 pb-2  text-sm  ">
                <div className="flex  gap-3 ">
                  <p>11.11.2024 | 10:30am</p>
                  <div className="flex text-1xl ">
                    <button className="underline">View Client Session File</button>
                  </div>
                </div>
                <div className="flex flex-row gap-3 text-1xl">
                  <p>11.11.2024 | 10:30am</p>
                  <div className="flex gap-3 text-1xl ">
                    <button className="underline">View Client Session File</button>
                  </div>
                </div>
                <div className="flex flex-row gap-3 text-1xl">
                  <p>11.11.2024 | 10:30am</p>
                  <div className="flex gap-3 text-1xl ">
                    <button className="underline">View Client Session File</button>
                  </div>
                </div>
                <div className="flex flex-row gap-3 text-1xl">
                  <p>11.11.2024 | 10:30am</p>
                  <div className="flex gap-3 text-1xl ">
                    <button className="underline">View Client Session File</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6 h-full  w-full gap-y-8 rounded-[2rem] ">
          <div className="bg-white  p-6 rounded-[2rem]  border-2 border-gray-300">
            <div className="grid grid-cols-2 pl-4 pt-4">
              <div>
                {/* peap expert  */}
                <h2 className="text-2xl font-Normal mb-1 text-black">My Rating</h2>
                <div className="flex items-center mb-4">
                  <span className="text-sm font-normal text-gray-300">4.5 Star Peap Rating</span>
                </div>
                {/* justify-around */}
                <div className="flex  flex-row gap-1 ">
                  <img className="w-[25px]" loading='lazy' src={Ratingstar} alt="Ratingstar" />
                  <img className="w-[25px]" loading='lazy' src={Ratingstar} alt="Ratingstar" />
                  <img className="w-[25px]" loading='lazy' src={Ratingstar} alt="Ratingstar" />
                  <img className="w-[25px]" loading='lazy' src={Ratingstar} alt="Ratingstar" />
                  <img className="w-[25px]" loading='lazy' src={Halfstar} alt="Halfstar" />
                </div>
              </div>
              <div className=" flex flex-col">
                <h2 className="text-2xl font-Normal mb-1 text-black">Satisfaction Rate</h2>
                <div className="flex flex-col mb-4">
                  <span className="text-sm font-normal text-gray-300">
                    How your satisfied your client are?
                  </span>
                  <div>
                    <div className="flex mt-4 text-gray-600 items-center ">
                      <img className="w-[25px] mr-3" loading='lazy' src={Happysmile} alt="Happysmile" />
                      <p className="flex flex-wrap text-gray-300">95% of Clients are Satisfied</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="  w-full  pt-6 pb-6 pl-2 pr-2 bg-white  rounded-[2rem]  border-2 border-gray-300">
            <div className="  w-full pb-3  pt-3 font-medium text-xl  mb-4 text-gray-700">
              <span className="text-2xl pl-[1rem]"> My Top 5 Presenting Concerns </span>
            </div>

            <div className="    flex pt-5 flex-wrap    rounded-[2rem] justify-center">
              <div className=" w-[8rem] h-[5.5rem] rounded-2xl flex items-center justify-center px-4 py-2 bg-[#B6C0F3] text-blue-950 m-3 ">
                <div className=" flex flex-col align-middle">
                  <div className="flex   justify-center text-2xl">
                    <span className="flex   justify-center text-[2rem] ">5%</span>
                  </div>
                  <div className="flex justify-center  text-[1rem]">
                    <span className="">Anxiety</span>
                  </div>
                </div>
              </div>
              <div className="  w-[8rem] h-[5.5rem] rounded-2xl flex items-center justify-center px-4 py-2 bg-[#B6C0F3] text-blue-950 m-3 ">
                <div className=" flex flex-col align-middle">
                  <div className="flex   justify-center text-2xl">
                    <span className="flex   justify-center text-[2rem] ">5%</span>
                  </div>
                  <div className="flex justify-center  text-[1rem]">
                    <span className="">Anxiety</span>
                  </div>
                </div>
              </div>
              <div className="w-[8rem] h-[5.5rem] rounded-2xl flex items-center justify-center px-4 py-2 bg-[#B6C0F3] text-blue-950 m-3 ">
                <div className=" flex flex-col align-middle">
                  <div className="flex   justify-center text-2xl">
                    <span className="flex   justify-center text-[2rem] ">5%</span>
                  </div>
                  <div className="flex justify-center  text-[1rem]">
                    <span className="">Anxiety</span>
                  </div>
                </div>
              </div>
              <div className="  w-[8rem] h-[5.5rem] rounded-2xl flex items-center justify-center px-4 py-2 bg-[#B6C0F3] text-blue-950 m-3 ">
                <div className=" flex flex-col align-middle">
                  <div className="flex   justify-center text-2xl">
                    <span className="flex   justify-center text-[2rem] ">5%</span>
                  </div>
                  <div className="flex justify-center  text-[1rem]">
                    <span className="">Anxiety</span>
                  </div>
                </div>
              </div>
              <div className=" w-[8rem] h-[5.5rem] rounded-2xl flex items-center justify-center px-4 py-2 bg-[#B6C0F3] text-blue-950 m-3 ">
                <div className=" flex flex-col align-middle">
                  <div className="flex   justify-center text-2xl">
                    <span className="flex   justify-center text-[2rem] ">5%</span>
                  </div>
                  <div className="flex justify-center  text-[1rem]">
                    <span className="">Anxiety</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full  bg-white  p-5 rounded-[2rem] border-2 border-gray-300">
            <div className=" flex flex-col j w-full pt-2 pb-9 gap-5 ">
              <div className="flex justify-between ">
                <h2 className="  text-2xl font-medium mb-4 text-gray-700">Revenue</h2>
                <h2 className="  text-sm font-normal mb-4 text-gray-200">(Month to date)</h2>
              </div>

              <div className="flex justify-between ">
                <div className="flex ">
                  <div className="flex  justify-center w-[30px] h-[30px] bg-[#B6C0F3]  rounded-[50px] mr-6">
                    <img className="w-[15px]" loading='lazy' src={Clapflex} alt="calendarf" />
                  </div>
                  <p className="flex  items-center text-2xl font-normal text-black">£650.00</p>
                </div>
                <div className="flex ml-6 ">
                  <div className="flex  justify-center w-[30px] h-[30px] bg-[#B6C0F3]  rounded-[50px]  mr-8">
                    <img className="w-[15px]" loading='lazy' src={Upcircle} alt="calendarf" />
                  </div>
                  <p className="flex  items-center text-sm text-gray-600">
                    2.5% increase from last month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExpertDashboard;

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

const Expertapp = () => {
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

    <div className=" mx-auto  p-8 bg-gray-200 min-h-screen mb-20  ">
      <div className="mt-6 mb-12">
        <h1 className="text-4xl  mb-2">Happy Monday, let’s make today count!</h1>
        <p className="text-gray-900 mt-4 ">Welcome to your PEAP Dashboard, Dr Reuben Hale.</p>
      </div>

      {/* <div className="flex mb-12 justify-around xs:flex-col">
        <div className="bg-[#e5eaf9] w-[58rem] h-[13rem] p-6 rounded-[15rem] border-2 border-gray-300 flex items-center justify-evenly  ">
          <button className="">
            <div className="flex w-[5.5rem] h-[5.5rem] bg-[#B6C0F3] justify-center rounded-[15rem]">
              <img className="w-[2.5rem]  " src={Calendarflex} alt="calendarf" />
            </div>
          </button>
          <div className=" flex max-w-[29rem] h-[6rem] bg-[#B6C0F3]  place-items-center  justify-center rounded-[15rem]">
            <div className="relative  left-4 max-w-[13rem]">
              <p className="text-lg  text-gray-500">Total appointments this week</p>
              <p className="text-3xl text-blue-950">19 in total</p>
            </div>
            <div className=" flex  align-middle ml-[8rem]">
              <button className="flex place-items-center">
                <img className="w-[25px]" src={Syncrefresh} alt="sync" />
              </button>
            </div>
          </div>
        </div>
        <div className="ml-12 bg-[#e5eaf9]  w-[58rem] h-[13rem] p-6 rounded-[15rem]  border-2 border-gray-300 flex  items-center justify-evenly ">
          <button className="">
            <div className="flex w-[5.5rem] h-[5.5rem] bg-[#B6C0F3] justify-center rounded-[50px] ">
              <img className="w-[2.5rem]  " src={Medicalbag} alt="medicalbag" />
            </div>
          </button>
          <div className=" flex  max-w-[29rem] h-[6rem] bg-[#B6C0F3] place-items-center  rounded-[50px] pl-7 ">
            <div className="  flex flex-col ml-4">
              <p className="text-lg  text-gray-500">Next Appointment</p>
              <p className="text-3xl text-blue-950">Today at 10:30am</p>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div class="mb-1
2 justify-around  flex flex-row xs:flex xs:flex-col xs:items-center xs:gap-4">
  <div class="bg-[#e5eaf9] w-full xs:max-w-[90%] md:w-[58rem] h-[13rem] p-6 rounded-[15rem] border-2 border-gray-300 flex items-center justify-evenly">
    <button>
      <div class="flex w-[5.5rem] h-[5.5rem] bg-[#B6C0F3] justify-center rounded-[15rem]">
        <img class="w-[2.5rem]" src={Calendarflex} alt="calendarf" />
      </div>
    </button>
    <div class="flex flex-col xs:flex-row xs:items-center xs:max-w-[90%] md:max-w-[29rem] h-[6rem] bg-[#B6C0F3] justify-center rounded-[15rem]">
      <div class="xs:ml-4 md:ml-0 max-w-[13rem]">
        <p class="text-lg text-gray-500">Total appointments this week</p>
        <p class="text-3xl text-blue-950">19 in total</p>
      </div>
      <div class="xs:mt-2 md:mt-0 flex align-middle xs:ml-0 md:ml-[8rem]">
        <button class="flex place-items-center">
          <img class="w-[25px]" src={Syncrefresh} alt="sync" />
        </button>
      </div>
    </div>
  </div>

  <div class="bg-[#e5eaf9] w-full xs:max-w-[90%] md:w-[58rem] h-[13rem] p-6 rounded-[15rem] border-2 border-gray-300 flex items-center justify-evenly mt-4 xs:mt-0 xs:ml-0 md:ml-12">
    <button>
      <div class="flex w-[5.5rem] h-[5.5rem] bg-[#B6C0F3] justify-center rounded-[50px]">
        <img class="w-[2.5rem]" src={Medicalbag} alt="medicalbag" />
      </div>
    </button>
    <div class="flex max-w-[29rem] h-[6rem] bg-[#B6C0F3] place-items-center rounded-[50px] pl-7">
      <div class="flex flex-col ml-4">
        <p class="text-lg text-gray-500">Next Appointment</p>
        <p class="text-3xl text-blue-950">Today at 10:30am</p>
      </div>
    </div>
  </div>
</div> */}
      <div className="  w-[full] justify-center ">
        <div className="  flex flex-col md:flex-row  justify-center ">
          <div className="bg-[#e5eaf9] w-[40rem]  h-[10rem] p-6 rounded-[15rem] border-2 border-gray-300 flex items-center justify-evenly mb-6 md:mb-0">
            <button className="">
              <div className="flex w-[5rem] h-[5rem] bg-[#B6C0F3] justify-center rounded-[15rem]">
                <img className="w-[2.5rem]" src={Calendarflex} alt="calendarf" />
              </div>
            </button>
            <div className="flex max-w-[29rem] h-[5rem] bg-[#B6C0F3] place-items-center justify-center rounded-[15rem]">
              <div className="relative left-6 w-[20rem]">
                <p className="text-md leading-tight text-gray-500">Total appointments this week</p>
                <p className="text-3xl text-blue-950">19 in total</p>
              </div>
              <div className="flex align-middle relative ml-[4rem] left-[-2em]">
                <button className="flex place-items-center">
                  <img className="w-[25px]" src={Syncrefresh} loading='lazy' alt="sync" />
                </button>
              </div>
            </div>
          </div>
          <div className="ml-0 md:ml-12 bg-[#e5eaf9]   w-[40rem]  h-[10rem] p-6 rounded-[15rem] border-2 border-gray-300 flex items-center justify-evenly">
            <button className="">
              <div className="flex w-[5rem] h-[5rem] bg-[#B6C0F3] justify-center rounded-[50px]">
                <img className="w-[2.5rem]" src={Medicalbag} loading='lazy' alt="medicalbag" />
              </div>
            </button>
            <div className="flex max-w-[29rem] h-[5rem] bg-[#B6C0F3] place-items-center rounded-[50px] pl-7">
              <div className="flex flex-col ml-4  w-[22rem] ml-2 mr-2">
                <p className="text-lg text-gray-500 leading-tight">Next Appointment</p>
                <p className="text-3xl text-blue-950 leading-tight">Today at 10:30am</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex flex-col md:flex-row  rounded-[2rem]  justify-center w-full mb-8  ">
        <div className=" flex flex-col md:flex-row  bg-white p-6 rounded-[2rem] gap-2 border-2  justify-evenly border-gray-300 mb-6 mt-16  md:w-[82rem]   w-[full]">
          <div className="relative  w-[25rem] left-[-20px] ">
            <h2 className=" w-[20rem] relative left-5 mt-4 mb-16    text-2xl font-medium  text-gray-700">
              Most Recent Appointment
            </h2>
            <div className=" ml-8  text-base  mb-4 flex flex-col justify-between h-48">
              <p className="text-gray-600">
                <strong>Client:</strong> Reuben Hale
              </p>
              <p className="text-gray-600">
                <strong>Date:</strong> 02.03.2024 | 10:30am
              </p>
              <p className="text-gray-600">
                <strong>Presenting Concerns:</strong>
              </p>
              <div className="w-[21rem]">
                <div className="flex  justify-between  ">
                  <button className="px-9 py-1 bg-[#6167e8] text-white rounded-full">
                    Anxiety
                  </button>
                  <button className="px-9 py-1 bg-[#6167e8] text-white rounded-full">
                    Anxiety
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className=" relative right-0 left-[-20px] ">
            <div className="flex  mt-24     ">
              <img
                className=" bg-[#e5eaf9] w-[3rem] mr-4  rounded-3xl  p-2"
                loading='lazy'
                src={Intervennotes}
                alt="Add intervation notes*"
              />

              <button className=" tracking-tighter w-full flex flex-row text-xs  justify-between underline items-center  \ text-gray-700 rounded-lg">
                Add Intervention Notes*
              </button>
            </div>
            <div className="flex  mt-10  ">
              <img
                className=" bg-[#e5eaf9]  mr-4 w-[3rem] text-xs   rounded-3xl  p-2"
                src={Goalscubes}
                loading='lazy'
                alt="Add goal notes*"
              />
              <button className="  tracking-tighter w-full flex flex-row text-xs  justify-between underline items-center  \ text-gray-700 rounded-lg">
                Add Goal Notes*
              </button>
            </div>
            <div className="flex  mt-10  ">
              <img
                className=" bg-[#e5eaf9] w-[3rem] mr-4   rounded-3xl  p-2"
                src={Happysmile}
                loading='lazy'
                alt="Add goal notes*"
              />
              <button className="  tracking-tighter  w-full flex flex-row   justify-between underline items-center  \ text-gray-700 rounded-lg">
                Add Impression Notes*
              </button>
            </div>
          </div>

          <div className=" w-[30rem] h-[24rem] ">
            <div className=" w-[40rem] flex  flex-row   justify-around relative left-[-126px] mb-10 ">
              <div className="flex border  w-[16rem] h-[3.5rem]  border-1  border-gray-300 2px rounded-[15rem] justify-evenly ">
                <img className="w-[1.5rem] " loading='lazy' src={Patientsearch} alt="Happysmile" />
                <input
                  className="border-none r w-[12.2rem] text-blue-700 leading-tight focus:outline-none focus:shadow-outline rounded  rounded-[15rem] text-xs"
                  placeholder="Patients Name/ Surname"
                  // className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                  // {...props}
                />
              </div>
              <div className="flex border  w-[16rem] h-[3.5rem]  border-1  border-gray-300 2px rounded-[15rem] justify-evenly ">
                <img className="w-[1.5rem] " loading='lazy' src={Calendarsearch} alt="Happysmile" />
                <input
                  className="border-none rounded  w-[12.2rem]  text-xs text-blue-700 leading-tight focus:outline-none focus:shadow-outline rounded-[15rem]"
                  placeholder="Appointment date"
                />
              </div>
            </div>
            <div className="relative  ">
              <div className="w-[31rem]  items-center h-[13rem]    bg-[#e5eaf9] text-gray-700 rounded-[2rem]  pt-[20px] ">
                <div className="flex flex-row w-[32rem] h-[11rem] justify-evenly  text-blue-900">
                  <div className="w-[2.5rem]  h-[2.5rem] bg-red text-gray-700 border rounded-full">
                    <img
                      className="bg-[#B6C0F3]  mr-3 w-[2.5rem]   rounded-3xl p-2"
                      src={Newnote}
                      loading='lazy'
                      alt="newnote"
                    />
                  </div>
                  <div className=" flex flex-col justify-center place-items-center  w-[24.2rem] h-[10rem] bg-[#B6C0F3]   relative bg-blue rounded-[2rem]   ">
                    <div className=" flex    ">
                      <p className=" flex text-xs  tracking-tighter pl-1 pt-3   leading-tight  w-[21rem] h-[8rem]">
                        This session was valuable, and I feel motivated to work on the goals we
                        discussed. I'm looking forward to our next session to continue making
                        progress.
                      </p>
                    </div>
                    <div className=" relative left-5 pr-10 flex flex-row justify-between     w-[22rem]  h-[2rem] bg-red relative red rounded-full ">
                      <div className="    tracking-tighter  leading-none text-center  font-sans text-gray-400    leading-tight ">
                        {today.getDate()} .{today.getMonth()}. {today.getFullYear()}
                      </div>
                      <div className=" flex relative top-[-1rem]  w-[2rem] text-center align-middle  place-items-center  h-[2rem] rounded-full  ">
                        <button className="flex">
                          <img className="w-[2.5rem]" loading='lazy' src={Likenote} alt="Happysmile" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex justify-end text-xs leading-none   relative left-[-2rem] ">
              <button className=" text-xs font-normal leading-none  tracking-tighter  underline   text-black  ">
                REPLY TO USER DATA ?
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* flex-cols-1 */}
      <div className="flex flex-col  w-[1/2] md:flex-row  gap-10 justify-center ">
        <div className=" xs:flex-col justify-items-center border relative max-w-[38rem] h-[57.5rem] border-gray-300 rounded-3xl  bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
          <div className="text-black h-full dark:text-white text-lg lg:text-xl font-medium mb-4 w-full flex flex-col gap-[1rem]">
            <h4 className="  mt-10 ml-10 ">Monthly Schedule </h4>

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
            <div className=" flex flex-col rounded-[2rem]  max-w-[40rem] h-[18rem]  justify-center ">
              <div class="w-[16rem] xl:left-8  relative mt-[4rem] mb-[1rem] ">
                <h2 className=" font-semibold">4 Appointment this week:</h2>
              </div>
              <div className=" max-w-[27.5rem]  flex  flex-col gap-5 relative xl:left-8 text-sm  ">
                <div className="flex  gap-12 ">
                  <p>11.11.2024 | 10:30am</p>
                  <div className="flex text-1xl ">
                    <button className="underline">View Client Session File</button>
                  </div>
                </div>
                <div className="flex flex-row gap-12 text-1xl">
                  <p>11.11.2024 | 10:30am</p>
                  <div className="flex gap-3 text-1xl ">
                    <button className="underline">View Client Session File</button>
                  </div>
                </div>
                <div className="flex flex-row gap-12 text-1xl">
                  <p>11.11.2024 | 10:30am</p>
                  <div className="flex gap-3 text-1xl ">
                    <button className="underline">View Client Session File</button>
                  </div>
                </div>
                <div className="flex flex-row gap-12 text-1xl">
                  <p>11.11.2024 | 10:30am</p>
                  <div className="flex gap-3 text-1xl ">
                    <button className="underline">View Client Session File</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6 h-full  gap-y-10 rounded-[2rem] ">
          <div className="bg-white max-w-[41rem] p-6 rounded-[2rem]  border-2 border-gray-300">
            <div className="grid grid-cols-2 pl-4 pt-4">
              <div>
                {/* peap expert  */}
                <h2 className="text-2xl font-Normal mb-1 text-black">My Rating</h2>
                <div className="flex items-center mb-4">
                  <span className="text-sm font-normal text-gray-300">4.5 Star Peap Rating</span>
                </div>
                <div className="flex  flex-row  justify-evenly max-w-[145px]">
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

          <div className="   max-w-[41rem]  bg-white p-6  rounded-[2rem]  border-2 border-gray-300">
            <div className="   max-w-[30rem]  pt-3 font-medium text-xl  mb-4 text-gray-700">
              <span className="text-2xl pl-[1rem]"> My Top 5 Presenting Concerns </span>
            </div>

            <div className="    flex pt-5 flex-wrap    rounded-[2rem] justify-center">
              <div className=" w-[9rem] h-[6rem] rounded-2xl flex items-center justify-center px-4 py-2 bg-[#B6C0F3] text-blue-950 m-3 ">
                <div className=" flex flex-col align-middle">
                  <div className="flex   justify-center text-2xl">
                    <span className="flex   justify-center text-[2rem] ">5%</span>
                  </div>
                  <div className="flex justify-center  text-[1rem]">
                    <span className="">Anxiety</span>
                  </div>
                </div>
              </div>
              <div className="  w-[9rem] h-[6rem] rounded-2xl flex items-center justify-center px-4 py-2 bg-[#B6C0F3] text-blue-950 m-3 ">
                <div className=" flex flex-col align-middle">
                  <div className="flex   justify-center text-2xl">
                    <span className="flex   justify-center text-[2rem] ">5%</span>
                  </div>
                  <div className="flex justify-center  text-[1rem]">
                    <span className="">Anxiety</span>
                  </div>
                </div>
              </div>
              <div className="w-[9rem] h-[6rem] rounded-2xl flex items-center justify-center px-4 py-2 bg-[#B6C0F3] text-blue-950 m-3 ">
                <div className=" flex flex-col align-middle">
                  <div className="flex   justify-center text-2xl">
                    <span className="flex   justify-center text-[2rem] ">5%</span>
                  </div>
                  <div className="flex justify-center  text-[1rem]">
                    <span className="">Anxiety</span>
                  </div>
                </div>
              </div>
              <div className="  w-[9rem] h-[6rem] rounded-2xl flex items-center justify-center px-4 py-2 bg-[#B6C0F3] text-blue-950 m-3 ">
                <div className=" flex flex-col align-middle">
                  <div className="flex   justify-center text-2xl">
                    <span className="flex   justify-center text-[2rem] ">5%</span>
                  </div>
                  <div className="flex justify-center  text-[1rem]">
                    <span className="">Anxiety</span>
                  </div>
                </div>
              </div>
              <div className=" w-[9rem] h-[6rem] rounded-2xl flex items-center justify-center px-4 py-2 bg-[#B6C0F3] text-blue-950 m-3 ">
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
          <div className="flex justify-center max-w-[41rem]  bg-white  p-5 rounded-[2rem] border-2 border-gray-300">
            <div className=" flex flex-col justify-center  h-[10rem] ">
              <div className="flex justify-between ">
                <h2 className="  text-2xl font-medium mb-4 text-gray-700">Revenue</h2>
                <h2 className="  text-sm font-normal mb-4 text-gray-200">(Month to date)</h2>
              </div>

              <div className="flex justify-between ">
                <div className="flex ">
                  <div className="flex  justify-center w-[30px] h-[30px] bg-[#B6C0F3]  rounded-[50px] mr-8">
                    <img className="w-[15px]  " loading='lazy' src={Clapflex} alt="calendarf" />
                  </div>
                  <p className="flex  items-center text-2xl font-normal text-black">£650.00</p>
                </div>
                <div className="flex ">
                  <div className="flex  justify-center w-[30px] h-[30px] bg-[#B6C0F3]  rounded-[50px]  mr-8">
                    <img className="w-[20px]  " loading='lazy' src={Upcircle} alt="calendarf" />
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

export default Expertapp;

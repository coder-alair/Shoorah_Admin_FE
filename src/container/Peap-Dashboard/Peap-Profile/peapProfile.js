import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ProfileCard from '../../Peap/mySpecialistProfile/profileCard';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../../assets/css/calendar.css';
import { APPLICATION_TITLE } from '../../../utils/constants';
import moment from 'moment';
import { getLocalStorageItem } from '../../../utils/helper';
import { MONTH_NAMES } from '../../../utils/constants';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import CustomSelectLanguage from '../../../component/common/CustomSelectLanguage';

const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
const name = userData?.name?.split(' ');
const userType = userData?.userType;

const PeapProfile = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [categoriesList, setCategoriesList] = useState([
    {
      _id: '653fc389d90a400d73f6a1e5',
      name: 'English',
      status: 1,
      focuses: [
        '63d3b7ec0badb58972f9180d',
        '63d79bece792f486c4f4df2a',
        '64452a7aae809fb12dc6beb6',
        '64452a8dae809fb12dc6bec9',
        '64452b6eae809fb12dc6bedc',
        '64452ca9ae809fb12dc6bf67',
        '64452cc6ae809fb12dc6bf80',
        '6445440fae809fb12dc6c450',
        '64454515ae809fb12dc6c5af',
        '64454effae809fb12dc6c812',
        '6448bf7fe4bdd1275bdfbadb',
        '644a99cb2c985ef301715cc6'
      ],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-10-30T14:54:01.070Z',
      updatedAt: '2023-11-30T12:47:45.235Z',
      __v: 0
    },
    {
      _id: '653fc389d90a400d73f6a1ef',
      name: 'Hindi',
      status: 1,
      focuses: [
        '63d3b7ec0badb58972f9183e',
        '64452b8eae809fb12dc6bf1b',
        '64453d5bae809fb12dc6c17d',
        '64454430ae809fb12dc6c476',
        '6448baa8e4bdd1275bdfb419',
        '644a9c572c985ef301715d8b'
      ],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-10-30T14:54:01.223Z',
      updatedAt: '2023-11-30T12:47:45.609Z',
      __v: 0
    },
    {
      _id: '653fc389d90a400d73f6a1f9',
      name: 'Spanish',
      status: 1,
      focuses: [
        '63d3b7ec0badb58972f91880',
        '64452a6bae809fb12dc6bea3',
        '64453e2eae809fb12dc6c1fd',
        '644544dfae809fb12dc6c54d',
        '63d79bede792f486c4f4dfa9'
      ],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-10-30T14:54:01.413Z',
      updatedAt: '2023-11-30T12:47:46.838Z',
      __v: 0
    },
    {
      _id: '653fc389d90a400d73f6a205',
      name: 'French',
      status: 1,
      focuses: ['63d3b7ed0badb58972f91940'],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-10-30T14:54:01.660Z',
      updatedAt: '2023-11-30T12:47:35.386Z',
      __v: 0
    },
    {
      _id: '653fc389d90a400d73f6a20f',
      name: 'Russian',
      status: 1,
      focuses: ['63d3b7ee0badb58972f91975'],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-10-30T14:54:01.806Z',
      updatedAt: '2023-11-30T12:47:35.727Z',
      __v: 0
    },
    {
      _id: '653fc38ad90a400d73f6a218',
      name: 'German',
      status: 1,
      focuses: ['63d3b7ee0badb58972f919a5', '64452b7cae809fb12dc6bf02', '64452bccae809fb12dc6bf54'],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-10-30T14:54:02.042Z',
      updatedAt: '2023-11-30T12:47:39.163Z',
      __v: 0
    },
    {
      _id: '653fc38bd90a400d73f6a247',
      name: 'Arabic',
      status: 1,
      focuses: ['64452b75ae809fb12dc6beef', '644bb6652c985ef3017171af', '644bb7b72c985ef3017171fa'],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-10-30T14:54:03.481Z',
      updatedAt: '2023-11-30T12:47:46.435Z',
      __v: 0
    },
    {
      _id: '653fc38ed90a400d73f6a29d',
      name: 'Mandarin',
      status: 1,
      focuses: ['6445449cae809fb12dc6c4ee'],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-10-30T14:54:06.032Z',
      updatedAt: '2023-11-30T12:47:41.724Z',
      __v: 0
    },
    {
      _id: '653fc38ed90a400d73f6a2b5',
      name: 'Japanese',
      status: 1,
      focuses: ['64454536ae809fb12dc6c5cb', '6445566dae809fb12dc6cadf'],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-10-30T14:54:06.861Z',
      updatedAt: '2023-11-30T12:47:43.609Z',
      __v: 0
    },
    {
      _id: '653fc38fd90a400d73f6a2ce',
      name: 'Korean',
      status: 1,
      focuses: ['644559fdae809fb12dc6cba7'],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-10-30T14:54:07.769Z',
      updatedAt: '2023-11-30T12:47:43.943Z',
      __v: 0
    },
    {
      _id: '65688469bb72aa8f34932388',
      name: 'Italian',
      status: 1,
      focuses: ['64452a7aae809fb12dc6beb6'],
      contentType: 3,
      deletedAt: null,
      createdAt: '2023-11-30T12:47:37.096Z',
      updatedAt: '2023-11-30T12:47:37.096Z',
      __v: 0
    }
  ]);
  const [fileName, setFileName] = useState('Choose file');
  const isVerified = true;
  const focuses = [
    {
      name: 'Specialisations one',
      id: 1
    },
    {
      name: 'Specialisations',
      id: 2
    },
    {
      name: 'Specialisations three',
      id: 3
    },
    {
      name: 'Specialisations',
      id: 4
    },
    {
      name: 'Specialisations five',
      id: 5
    },
    {
      name: 'Specialisations six',
      id: 6
    },
    {
      name: 'Specialisations',
      id: 7
    },
    {
      name: 'Specialisations eight',
      id: 8
    },
    {
      name: 'Specialisations',
      id: 9
    },
    {
      name: 'Specialisations ten',
      id: 10
    },
    {
      name: 'Specialisations',
      id: 11
    },
    {
      name: 'Specialisations seven',
      id: 12
    },
    {
      name: 'Specialisations eight',
      id: 13
    },
    {
      name: 'Specialisations',
      id: 14
    },
    {
      name: 'Specialisations ten',
      id: 15
    },
    {
      name: 'Specialisations six',
      id: 16
    },
    {
      name: 'Specialisations',
      id: 17
    },
    {
      name: 'Specialisations eight',
      id: 18
    },
    {
      name: 'Specialisations nine',
      id: 19
    },
    {
      name: 'Specialisations ten',
      id: 20
    },
    {
      name: 'Specialisations nine',
      id: 21
    },
    {
      name: 'Specialisations ten',
      id: 22
    },
    {
      name: 'Specialisations',
      id: 23
    },
    {
      name: 'Specialisations ten',
      id: 24
    }
  ];

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

  const handleChange = (e) => {
    const date = new Date(e); // Convert the input to a Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setStartDate(formattedDate);
  };
  // const [isYellow, setYellow] = useState(false);
  const [status, setStatus] = useState('send'); // Possible values: 'send', 'pending', 'approved'

  const handleClick = () => {
    switch (status) {
      case 'send':
        setStatus('pending');
        break;
      case 'pending':
        setStatus('approved');
        break;
      case 'approved':
        setStatus('send');
        break;
      default:
        break;
    }
  };

  const scrollToTop = () => {
    console.log('Scroll to top triggered');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleSelect = (id) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        newSelectedItems.add(id);
      }
      return newSelectedItems;
    });
  };

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isApprove, setIsApprove] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  const togglePopup1 = () => {
    setIsApprove(!isApprove);
  };

  const [fileNames, setFileNames] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newFileNames = files.map((file) => file.name);
    setFileNames([...fileNames, ...newFileNames]);
  };

  const handleRemoveFile = (index) => {
    const newFileNames = fileNames.filter((_, i) => i !== index);
    setFileNames(newFileNames);
  };

  const [hasValue, setHasValue] = useState(false);
  console.log(hasValue, '');

  const handleInputChange = (event) => {
    setHasValue(event.target.value !== '');
  };

  const [isView, setIsView] = useState(false);
  const [error, setError] = useState({ focus: '' });

  return (
    <div className="px-3">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Peap Profile | Shoorah Admin</title>
      </Helmet>
      {userData?.userType === 6 ? (
        <>
          <div className="mt-[3rem] text-3xl pl-8 px-3">My Profile</div>
          <div className="mt-[.5rem] text-gray-400 text-xl pl-8 px-3 flex justify-between">
            Here you can find all your clients
            <button
              className={`py-3 px-4 relative top-[-1.5rem] w-[180px] h-[37px] rounded-xl tracking-tighter leading-none justify-center text-xs transition-all duration-300 ease-in-out ${
                status === 'pending'
                  ? 'bg-yellow-400 text-white'
                  : status === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-[#3A47AB] text-white'
              }`}
              onClick={handleClick}
            >
              {status === 'pending'
                ? APPLICATION_TITLE?.PENDING
                : status === 'approved'
                ? 'Approved'
                : APPLICATION_TITLE?.SEND_APPROVAL}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-[3rem] text-3xl pl-8 px-3">Specialist Profile</div>
          <div className="mt-[1rem] text-gray-400 text-xl pl-8 px-3">
            {moment().format('DD MMM YYYY')}
          </div>
          <div className=" flex flex-col sm:flex-row justify-center sm:justify-end gap-5 sm:gap-10 sm:ml-0 sm:mr-10 m-10">
            <div className="relative group w-full sm:w-[180px] h-[37px] top-[-1.5rem]">
              <button
                className="py-2 px-4 relative text-white bg-shoorah-primary w-full h-full rounded-xl tracking-tighter leading-none justify-center overflow-hidden"
                onClick={togglePopup1}
              >
                <span className="absolute inset-0 transition-all duration-300 ease-in-out transform -translate-x-full group-hover:translate-x-0"></span>
                <span className="relative">Approve</span>
              </button>
            </div>
            <div className="relative group w-full sm:w-[180px] h-[37px] top-[-1.5rem] z-10">
              <button
                className="py-2 px-4 relative text-white bg-shoorah-primary w-full h-full rounded-xl tracking-tighter leading-none justify-center overflow-hidden"
                onClick={togglePopup}
              >
                <span className="absolute inset-0 transition-all duration-300 ease-in-out transform -translate-x-full group-hover:translate-x-0"></span>
                <span className="relative">Unapprove</span>
              </button>
            </div>
            {isApprove && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40  ">
                <div className="flex flex-col bg-white w-[90%] sm:w-[35%] h-fit rounded-3xl p-4 relative gap-5  items-center  justify-center pl-5 pr-5 pt-10 pb-3 sm:pb-11">
                  <button
                    className="absolute top-4 right-6 ml-2 text-shoorah-primary"
                    onClick={togglePopup1}
                  >
                    &times;
                  </button>

                  <div className="w-[80%]  flex flex-col  justify-center  text-gray-600 text-xl  gap-10 pl-4 pr-4  pt-5 pb-2 text-center ">
                    Are you sure to you want to "Approve" ?
                  </div>
                  <div className="w-[78%] flex sm:flex-row justify-center rounded-xl  items-center gap-6 flex-col p-2  ">
                    <button
                      className={`relative  text-white bg-shoorah-primary w-[40%] h-12 rounded-xl tracking-tighter leading-none justify-center text-xs transition-all duration-300 ease-in-out overflow-hidden`}
                    >
                      Yes
                    </button>
                    <button
                      className={`relative  text-white bg-shoorah-primary w-[40%] h-12 rounded-xl tracking-tighter leading-none justify-center text-xs transition-all duration-300 ease-in-out overflow-hidden`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
            {isPopupVisible && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10  ">
                <div className="bg-white w-[90%] sm:w-[40%] h-fit rounded-3xl p-4 relative flex items-center  justify-center pl-5 pr-5 pt-10 pb-10">
                  <button
                    className="absolute top-4 right-6 ml-2 text-shoorah-primary"
                    onClick={togglePopup}
                  >
                    &times;
                  </button>

                  <div className="w-full  flex flex-col  justify-center   gap-10 pl-10 pr-10  pt-5 pb-2 ">
                    <div className="border w-full rounded-2xl flex justify-center">
                      <input
                        type="text"
                        placeholder="Subject for reapproval..."
                        className=" w-[95%]    p-3  placeholder:text-gray-300 text-gray-1000  focus:outline-none  rounded-3xl "
                      />
                    </div>
                    <div className=" border rounded-3xl w-full  flex justify-center items-center ">
                      <textarea
                        placeholder=" "
                        className=" w-[99%]  h-[25rem] placeholder:text-gray-300 p-5  rounded-3xl focus:outline-none m-2"
                      ></textarea>
                    </div>
                    <div className="w-full flex justify-end rounded-xl  items-center  ">
                      <button
                        className={`relative  text-white bg-shoorah-primary w-[20%] h-12 rounded-xl tracking-tighter leading-none justify-center text-xs transition-all duration-300 ease-in-out overflow-hidden`}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <div className="mt-[3rem] sm:mb-0 mb-20  w-full ">
        <ProfileCard />
      </div>
      <div className="mt-6 mb-5 flex flex-col md:flex-row md:h-fit  gap-x-10 gap-4 ">
        {/* left col*/}
        <div className=" ml-0 sm:ml-8 flex flex-col py-3 gap-[3rem] w-full md:w-[50%] h-fit">
          <div className="border relative  border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
            <div className="text-black dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem] justify-between">
              <h4>Client-Viewable Information</h4>
              <p className="text-sm text-gray-300 font-normal">
                Please note that these details are visible to clients and can be accessed by them.
                Ensured all information is accurate, professional and suitable for client viewing.
              </p>
              <div className="w-full mt-[2rem] flex gap-5 rounded-3xl border border-1 py-1 ">
                <div className="flex  pl-3 w-[3rem] justify-center items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 48 48"
                    id="User-Identifier-Card--Streamline-Flex"
                    height="48"
                    width="48"
                  >
                    <g id="user-identifier-card">
                      <path
                        id="Intersect"
                        fill="#d7e0ff"
                        d="M2.142277714285714 36.42822857142857c0.27018514285714285 3.285942857142857 2.9495622857142854 5.833714285714286 6.241916571428571 6.008914285714285 10.61094857142857 0.5650285714285714 20.620662857142857 0.5650285714285714 31.231577142857137 0 3.2924571428571427 -0.1752 5.971885714285714 -2.7229714285714284 6.242057142857142 -6.008914285714285 0.5705142857142856 -6.9402857142857135 0.5705142857142856 -13.09758857142857 0 -20.03784 -0.27017142857142856 -3.2859771428571425 -2.9495999999999998 -5.833748571428571 -6.242057142857142 -6.0090514285714285 -10.610914285714285 -0.5649942857142857 -20.620628571428572 -0.5649942857142857 -31.231577142857137 0 -3.2923542857142856 0.17530285714285715 -5.971734857142857 2.723108571428571 -6.241916571428571 6.0090514285714285 -0.5706548571428571 6.940251428571427 -0.5706548571428571 13.097554285714285 0 20.03784Z"
                        strokeWidth="2"
                      ></path>
                      <path
                        id="Intersect_2"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.142277714285714 36.42822857142857c0.27018514285714285 3.285942857142857 2.9495622857142854 5.833714285714286 6.241916571428571 6.008914285714285 10.61094857142857 0.5650285714285714 20.620662857142857 0.5650285714285714 31.231577142857137 0 3.2924571428571427 -0.1752 5.971885714285714 -2.7229714285714284 6.242057142857142 -6.008914285714285 0.5705142857142856 -6.9402857142857135 0.5705142857142856 -13.09758857142857 0 -20.03784 -0.27017142857142856 -3.2859771428571425 -2.9495999999999998 -5.833748571428571 -6.242057142857142 -6.0090514285714285 -10.610914285714285 -0.5649942857142857 -20.620628571428572 -0.5649942857142857 -31.231577142857137 0 -3.2923542857142856 0.17530285714285715 -5.971734857142857 2.723108571428571 -6.241916571428571 6.0090514285714285 -0.5706548571428571 6.940251428571427 -0.5706548571428571 13.097554285714285 0 20.03784Z"
                        strokeWidth="2"
                      ></path>
                      <path
                        id="Vector 453"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M30.535714285714285 18.503485714285713h8.035371428571427"
                        strokeWidth="2"
                      ></path>
                      <path
                        id="Vector 454"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M30.535714285714285 25.55190857142857h8.035371428571427"
                        strokeWidth="2"
                      ></path>
                      <path
                        id="Vector"
                        fill="#ffffff"
                        d="M17.055565714285713 28.09858285714286c3.420925714285714 0 5.345211428571429 -1.9242514285714283 5.345211428571429 -5.345177142857143s-1.9242857142857144 -5.345211428571429 -5.345211428571429 -5.345211428571429 -5.345177142857143 1.9242857142857144 -5.345177142857143 5.345211428571429 1.9242514285714283 5.345177142857143 5.345177142857143 5.345177142857143Z"
                        strokeWidth="2"
                      ></path>
                      <path
                        id="Intersect_3"
                        fill="#ffffff"
                        fillRule="evenodd"
                        d="M26.244239999999998 42.85165714285714v-0.17965714285714285c-0.016148571428571425 -5.292685714285715 -3.618411428571428 -9.302022857142855 -9.191794285714286 -9.302022857142855 -5.473577142857143 0 -9.046011428571427 3.8670514285714286 -9.187474285714284 9.019165714285714 0.17112 0.022285714285714284 0.34426285714285715 0.0384 0.5191199999999999 0.04765714285714285 6.075257142857142 0.3236571428571428 11.953405714285713 0.46182857142857137 17.86014857142857 0.4148571428571428Z"
                        clipRule="evenodd"
                        strokeWidth="2"
                      ></path>
                      <path
                        id="Vector_2"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.055565714285713 28.09858285714286c3.420925714285714 0 5.345211428571429 -1.9242514285714283 5.345211428571429 -5.345177142857143s-1.9242857142857144 -5.345211428571429 -5.345211428571429 -5.345211428571429 -5.345177142857143 1.9242857142857144 -5.345177142857143 5.345211428571429 1.9242514285714283 5.345177142857143 5.345177142857143 5.345177142857143Z"
                        strokeWidth="2"
                      ></path>
                      <path
                        id="Intersect_4"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M26.244239999999998 42.85165714285714v-0.17965714285714285c-0.016148571428571425 -5.292685714285715 -3.618411428571428 -9.302022857142855 -9.191794285714286 -9.302022857142855 -5.473577142857143 0 -9.046011428571427 3.8670514285714286 -9.187474285714284 9.019165714285714 0.17112 0.022285714285714284 0.34426285714285715 0.0384 0.5191199999999999 0.04765714285714285 6.075257142857142 0.3236571428571428 11.953405714285713 0.46182857142857137 17.86014857142857 0.4148571428571428Z"
                        strokeWidth="2"
                      ></path>
                      <path
                        id="Vector 455"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m24 12.449485714285714 0 -7.3104"
                        strokeWidth="2"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="relative flex-1 mt-4">
                  <input
                    type="text"
                    id="medical-id"
                    placeholder=" "
                    className="peer block w-full bg-transparent rounded-md outline-none transition-all"
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="medical-id"
                    className={`text-sm text-gray-300 absolute
                    -translate-y-1/2 origin-left 
                     transition-all cursor-text
                      ${
                        hasValue
                          ? 'peer-placeholder-shown:-translate-y-1/2 -top-2'
                          : 'peer-placeholder-shown:-translate-y-1/2 peer-focus:-top-2 top-4'
                      }`}
                  >
                    {`${hasValue ? 'Medical Id no.' : 'Enter medical Id no.'}`}
                  </label>
                </div>
              </div>

              <div className="w-full flex gap-5 rounded-3xl border border-1 py-1 ">
                <div className="flex  pl-3 w-[3rem] justify-center items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    id="Graduation-Cap--Streamline-Flex"
                    height="48"
                    width="48"
                  >
                    <g id="graduation-cap--graduation-cap-education">
                      <path
                        id="Subtract"
                        fill="#d7e0ff"
                        fillRule="evenodd"
                        d="M3.53645 6.71896c0.74711 0.34681 1.54032 0.65537 2.30981 0.9547 0.01602 0.00623 0.03202 0.01245 0.04801 0.01867 0.65132 0.25339 1.58239 0.25354 2.23185 -0.00099 0.77788 -0.30485 1.5799 -0.61955 2.33748 -0.97219 0.0091 0.18653 0.0143 0.37431 0.0143 0.5632 0 0.50198 -0.0366 0.99601 -0.0851 1.47992 -0.0963 0.96106 -0.87704 1.73763 -1.83795 1.83543 -0.50809 0.0518 -1.02717 0.0918 -1.55482 0.0918 -0.52764 0 -1.04672 -0.04 -1.55481 -0.0918 -0.96091 -0.0978 -1.74165 -0.87437 -1.83794 -1.83543 -0.04848 -0.48391 -0.08506 -0.97794 -0.08506 -1.47992 0 -0.18896 0.00518 -0.37679 0.01423 -0.56339Z"
                        clipRule="evenodd"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector"
                        fill="#ffffff"
                        d="M1.63393 12.5011c0.55594 0 1.00661 -0.4507 1.00661 -1.0066s-0.45067 -1.0066 -1.00661 -1.0066 -1.006611 0.4507 -1.006611 1.0066 0.450671 1.0066 1.006611 1.0066Z"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector_2"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M1.63393 12.5011c0.55594 0 1.00661 -0.4507 1.00661 -1.0066s-0.45067 -1.0066 -1.00661 -1.0066 -1.006611 0.4507 -1.006611 1.0066 0.450671 1.0066 1.006611 1.0066Z"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Ellipse 347"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m1.63391 10.4879 0 -4.76915"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Intersect"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.4627 6.70099c0.0096 0.19251 0.0152 0.38636 0.0152 0.5814 0 0.4865 -0.0344 0.96554 -0.0807 1.43514 -0.0972 0.98718 -0.8953 1.78487 -1.87555 1.88357 -0.4975 0.0501 -1.00546 0.0885 -1.52162 0.0885s-1.02411 -0.0384 -1.52161 -0.0885c-0.98025 -0.0987 -1.77835 -0.89639 -1.87559 -1.88358 -0.04625 -0.46959 -0.08061 -0.94863 -0.08061 -1.43513 0 -0.19504 0.00552 -0.38889 0.01512 -0.5814"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Intersect_2"
                        fill="#d7e0ff"
                        d="M0.888905 4.13763c-0.518355 0.31891 -0.518049 0.77609 -0.002026 1.09591 0.714381 0.44276 1.452951 0.90254 2.311151 1.32394 0.8582 0.4214 1.79456 0.78406 2.69624 1.13485 0.65132 0.25338 1.58239 0.25353 2.23185 -0.001 0.89478 -0.35067 1.82152 -0.71436 2.67588 -1.13385 0.8543 -0.4195 1.5949 -0.87455 2.3091 -1.31392 0.5183 -0.3189 0.518 -0.77609 0.002 -1.0959 -0.7144 -0.44276 -1.4529 -0.90254 -2.3111 -1.32394 -0.85825 -0.4214 -1.7946 -0.78406 -2.69629 -1.13485 -0.65132 -0.25338 -1.58238 -0.25353 -2.23185 0.001 -0.89477 0.35066 -1.82151 0.71435 -2.67583 1.13385 -0.85432 0.41949 -1.59498 0.87455 -2.309125 1.31391Z"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Intersect_3"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M0.888905 4.13763c-0.518355 0.31891 -0.518049 0.77609 -0.002026 1.09591 0.714381 0.44276 1.452951 0.90254 2.311151 1.32394 0.8582 0.4214 1.79456 0.78406 2.69624 1.13485 0.65132 0.25338 1.58239 0.25353 2.23185 -0.001 0.89478 -0.35067 1.82152 -0.71436 2.67588 -1.13385 0.8543 -0.4195 1.5949 -0.87455 2.3091 -1.31392 0.5183 -0.3189 0.518 -0.77609 0.002 -1.0959 -0.7144 -0.44276 -1.4529 -0.90254 -2.3111 -1.32394 -0.85825 -0.4214 -1.7946 -0.78406 -2.69629 -1.13485 -0.65132 -0.25338 -1.58238 -0.25353 -2.23185 0.001 -0.89477 0.35066 -1.82151 0.71435 -2.67583 1.13385 -0.85432 0.41949 -1.59498 0.87455 -2.309125 1.31391Z"
                        strokeWidth="1"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="relative flex-1 mt-4">
                  <input
                    type="text"
                    id="Education-id"
                    placeholder=" "
                    className="peer block w-full bg-transparent rounded-md outline-none transition-all"
                  />
                  <label
                    htmlFor="Education-id"
                    class="text-sm text-gray-300 absolute top-4 
                    -translate-y-1/2 origin-left 
                     peer-placeholder-shown:-translate-y-1/2 peer-focus:-top-2
                    transition-all cursor-text"
                  >
                    Enter Education
                  </label>
                </div>
              </div>

              <div className="w-full flex gap-5 rounded-3xl border border-1 py-1 ">
                <div className="flex  pl-3 w-[3rem] justify-center items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    id="Shield-Cross--Streamline-Flex"
                    height="48"
                    width="48"
                  >
                    <g id="shield-cross--shield-secure-security-cross-add-plus">
                      <path
                        id="Vector 106"
                        fill="#d7e0ff"
                        d="M0.5 6.73088C0.5 2.76585 2.125 1.06655 2.66667 0.500122h8.66663C11.875 1.06655 13.5 2.76585 13.5 6.73088c0 4.53142 -4.26797 6.20282 -6.43464 6.76922C4.8987 12.9337 0.5 11.2623 0.5 6.73088Z"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector 107"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M0.5 6.73076C0.5 2.76573 2.125 1.06643 2.66667 0.5h8.66663C11.875 1.06643 13.5 2.76573 13.5 6.73076c0 4.53144 -4.26797 6.20284 -6.43464 6.76924C4.8987 12.9336 0.5 11.2622 0.5 6.73076Z"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Union"
                        fill="#ffffff"
                        fillRule="evenodd"
                        d="M6.2972 9.49834c-0.21862 -0.06231 -0.37834 -0.25843 -0.38821 -0.48553 -0.00527 -0.12129 -0.01082 -0.24354 -0.01642 -0.36669 -0.0113 -0.24855 -0.02276 -0.5008 -0.03239 -0.7563 -0.2555 -0.00963 -0.50774 -0.02109 -0.75629 -0.03239 -0.12316 -0.00559 -0.24541 -0.01115 -0.3667 -0.01642 -0.2271 -0.00987 -0.42322 -0.16959 -0.48553 -0.38821 -0.06486 -0.2276 -0.12739 -0.46255 -0.12739 -0.7028 0 -0.24025 0.06253 -0.4752 0.12739 -0.7028 0.06231 -0.21862 0.25843 -0.37834 0.48553 -0.38821 0.12129 -0.00527 0.24354 -0.01083 0.3667 -0.01642 0.24854 -0.0113 0.50079 -0.02276 0.75629 -0.03239 0.00963 -0.2555 0.02109 -0.50775 0.03239 -0.75629 0.00559 -0.12316 0.01115 -0.24541 0.01642 -0.3667 0.00987 -0.2271 0.16959 -0.42322 0.38821 -0.48553 0.2276 -0.06486 0.46255 -0.12739 0.7028 -0.12739 0.24025 0 0.4752 0.06253 0.7028 0.12739 0.21862 0.06231 0.37834 0.25843 0.38821 0.48553 0.00527 0.12129 0.01083 0.24354 0.01642 0.3667 0.0113 0.24854 0.02276 0.50079 0.03239 0.75629 0.2555 0.00963 0.50774 0.02109 0.75629 0.03239 0.12316 0.00559 0.24541 0.01115 0.3667 0.01642 0.2271 0.00987 0.42322 0.16959 0.48553 0.38821 0.06486 0.2276 0.12739 0.46255 0.12739 0.7028 0 0.24025 -0.06253 0.4752 -0.12739 0.7028 -0.06231 0.21862 -0.25843 0.37834 -0.48553 0.38821 -0.12129 0.00527 -0.24354 0.01083 -0.36671 0.01642 -0.24854 0.0113 -0.50078 0.02276 -0.75628 0.03239 -0.00963 0.2555 -0.02109 0.50775 -0.03239 0.75629 -0.00559 0.12316 -0.01115 0.24541 -0.01642 0.3667 -0.00987 0.2271 -0.16959 0.42322 -0.38821 0.48553 -0.2276 0.06486 -0.46255 0.12739 -0.7028 0.12739 -0.24025 0 -0.4752 -0.06253 -0.7028 -0.12739Z"
                        clipRule="evenodd"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Union_2"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.2972 9.49834c-0.21862 -0.06231 -0.37834 -0.25843 -0.38821 -0.48553 -0.00527 -0.12129 -0.01082 -0.24354 -0.01642 -0.36669 -0.0113 -0.24855 -0.02276 -0.5008 -0.03239 -0.7563 -0.2555 -0.00963 -0.50774 -0.02109 -0.75629 -0.03239 -0.12316 -0.00559 -0.24541 -0.01115 -0.3667 -0.01642 -0.2271 -0.00987 -0.42322 -0.16959 -0.48553 -0.38821 -0.06486 -0.2276 -0.12739 -0.46255 -0.12739 -0.7028 0 -0.24025 0.06253 -0.4752 0.12739 -0.7028 0.06231 -0.21862 0.25843 -0.37834 0.48553 -0.38821 0.12129 -0.00527 0.24354 -0.01083 0.3667 -0.01642 0.24854 -0.0113 0.50079 -0.02276 0.75629 -0.03239 0.00963 -0.2555 0.02109 -0.50775 0.03239 -0.75629 0.00559 -0.12316 0.01115 -0.24541 0.01642 -0.3667 0.00987 -0.2271 0.16959 -0.42322 0.38821 -0.48553 0.2276 -0.06486 0.46255 -0.12739 0.7028 -0.12739 0.24025 0 0.4752 0.06253 0.7028 0.12739 0.21862 0.06231 0.37834 0.25843 0.38821 0.48553 0.00527 0.12129 0.01083 0.24354 0.01642 0.3667 0.0113 0.24854 0.02276 0.50079 0.03239 0.75629 0.2555 0.00963 0.50774 0.02109 0.75629 0.03239 0.12316 0.00559 0.24541 0.01115 0.3667 0.01642 0.2271 0.00987 0.42322 0.16959 0.48553 0.38821 0.06486 0.2276 0.12739 0.46255 0.12739 0.7028 0 0.24025 -0.06253 0.4752 -0.12739 0.7028 -0.06231 0.21862 -0.25843 0.37834 -0.48553 0.38821 -0.12129 0.00527 -0.24354 0.01083 -0.36671 0.01642 -0.24854 0.0113 -0.50078 0.02276 -0.75628 0.03239 -0.00963 0.2555 -0.02109 0.50775 -0.03239 0.75629 -0.00559 0.12316 -0.01115 0.24541 -0.01642 0.3667 -0.00987 0.2271 -0.16959 0.42322 -0.38821 0.48553 -0.2276 0.06486 -0.46255 0.12739 -0.7028 0.12739 -0.24025 0 -0.4752 -0.06253 -0.7028 -0.12739Z"
                        strokeWidth="1"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="relative flex-1 mt-4">
                  <input
                    type="text"
                    id="Place-id"
                    placeholder=" "
                    className="peer block w-full bg-transparent rounded-md outline-none transition-all"
                  />
                  <label
                    htmlFor="Place-id"
                    class="text-sm text-gray-300 absolute top-4 
                    -translate-y-1/2 origin-left 
                     peer-placeholder-shown:-translate-y-1/2 peer-focus:-top-2
                    transition-all cursor-text"
                  >
                    Enter Place
                  </label>
                </div>
              </div>

              <div className="w-full flex gap-5 rounded-3xl border border-1 py-1 ">
                <div className="flex  pl-3 w-[3rem] justify-center items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    id="Linkedin-Logo--Streamline-Flex"
                    height="48"
                    width="48"
                  >
                    <desc>Linkedin Logo Streamline Icon: https://streamlinehq.com</desc>
                    <g id="linkedin--network-linkedin-professional">
                      <path
                        id="Vector 229 (Stroke)"
                        fill="#d7e0ff"
                        fillRule="evenodd"
                        d="M2.24062 5.7041c0.76769 0 1.39003 0.62234 1.39003 1.39003V11.86c0 0.7677 -0.62234 1.39 -1.39003 1.39 -0.76769 0 -1.390034 -0.6223 -1.390034 -1.39V7.09413c0 -0.76769 0.622344 -1.39003 1.390034 -1.39003Z"
                        clipRule="evenodd"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector 230 (Stroke)"
                        fill="#d7e0ff"
                        fillRule="evenodd"
                        d="M9.47705 8.48417c-0.54835 0 -0.99288 0.44453 -0.99288 0.99288V11.86c0 0.7677 -0.62234 1.39 -1.39004 1.39 -0.76769 0 -1.39003 -0.6223 -1.39003 -1.39V9.47705c0 -2.08374 1.68921 -3.77295 3.77295 -3.77295 2.08375 0 3.77295 1.68921 3.77295 3.77295V11.86c0 0.7677 -0.6223 1.39 -1.39 1.39 -0.7677 0 -1.3901 -0.6223 -1.3901 -1.39V9.47705c0 -0.54835 -0.4445 -0.99288 -0.99285 -0.99288Z"
                        clipRule="evenodd"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector 229 (Stroke)_2"
                        fillRule="evenodd"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.24062 5.7041c0.76769 0 1.39003 0.62234 1.39003 1.39003V11.86c0 0.7677 -0.62234 1.39 -1.39003 1.39 -0.7677 0 -1.390034 -0.6223 -1.390034 -1.39V7.09413c0 -0.76769 0.622334 -1.39003 1.390034 -1.39003Z"
                        clipRule="evenodd"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector 230 (Stroke)_2"
                        fillRule="evenodd"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.47705 8.48417c-0.54835 0 -0.99288 0.44453 -0.99288 0.99288V11.86c0 0.7677 -0.62234 1.39 -1.39004 1.39 -0.76769 0 -1.39003 -0.6223 -1.39003 -1.39V9.47705c0 -2.08374 1.68921 -3.77295 3.77295 -3.77295 2.08375 0 3.77295 1.68921 3.77295 3.77295V11.86c0 0.7677 -0.6223 1.39 -1.39 1.39 -0.7677 0 -1.3901 -0.6223 -1.3901 -1.39V9.47705c0 -0.54835 -0.4445 -0.99288 -0.99285 -0.99288Z"
                        clipRule="evenodd"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector"
                        fill="#d7e0ff"
                        d="M2.31436 0.749941c1.00119 0 1.56436 0.563169 1.56436 1.564359s-0.56317 1.56436 -1.56436 1.56436S0.75 3.31549 0.75 2.3143 1.31317 0.749941 2.31436 0.749941Z"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector_2"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.31436 0.749941c1.00119 0 1.56436 0.563169 1.56436 1.564359s-0.56317 1.56436 -1.56436 1.56436S0.75 3.31549 0.75 2.3143 1.31317 0.749941 2.31436 0.749941Z"
                        strokeWidth="1"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="relative flex-1 mt-4">
                  <input
                    type="text"
                    id="URL-id"
                    placeholder=" "
                    className="peer block w-full bg-transparent rounded-md outline-none transition-all"
                  />
                  <label
                    htmlFor="URL-id"
                    class="text-sm text-gray-300 absolute top-4 
                    -translate-y-1/2 origin-left 
                     peer-placeholder-shown:-translate-y-1/2 peer-focus:-top-2
                    transition-all cursor-text"
                  >
                    Add your URL here
                  </label>
                </div>
              </div>

              <div className="w-full flex gap-5 rounded-3xl border border-1 py-1 ">
                <div className="flex w-[3rem] pl-3 justify-center items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    id="Bag-Suitcase-2--Streamline-Flex"
                    height="48"
                    width="48"
                  >
                    <desc>Bag Suitcase 2 Streamline Icon: https://streamlinehq.com</desc>
                    <g id="bag-suitcase-2--product-business-briefcase">
                      <path
                        id="Intersect"
                        fill="#d7e0ff"
                        d="M6.99999 3.5c-1.60059 0 -3.27371 0 -4.67629 0.24064 -0.67229 0.11535 -1.20192 0.60821 -1.346258 1.24904C0.75 5.99944 0.75 6.94132 0.75 8.37501c0 1.43369 0 2.37559 0.227442 3.38529 0.144338 0.6409 0.673968 1.1337 1.346258 1.2491 1.40258 0.2406 3.0757 0.2406 4.67629 0.2406 1.6006 0 3.27371 0 4.67631 -0.2406 0.6723 -0.1154 1.2019 -0.6082 1.3462 -1.2491 0.2275 -1.0097 0.2275 -1.9516 0.2275 -3.38529s0 -2.37557 -0.2275 -3.38533c-0.1443 -0.64083 -0.6739 -1.13369 -1.3462 -1.24904C10.2737 3.5 8.60059 3.5 6.99999 3.5Z"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Intersect_2"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.99999 3.5c-1.60059 0 -3.27371 0 -4.67629 0.24064 -0.67229 0.11535 -1.20192 0.60821 -1.346258 1.24904C0.75 5.99944 0.75 6.94132 0.75 8.37501c0 1.43369 0 2.37559 0.227442 3.38529 0.144338 0.6409 0.673968 1.1337 1.346258 1.2491 1.40258 0.2406 3.0757 0.2406 4.67629 0.2406 1.6006 0 3.27371 0 4.67631 -0.2406 0.6723 -0.1154 1.2019 -0.6082 1.3462 -1.2491 0.2275 -1.0097 0.2275 -1.9516 0.2275 -3.38529s0 -2.37557 -0.2275 -3.38533c-0.1443 -0.64083 -0.6739 -1.13369 -1.3462 -1.24904C10.2737 3.5 8.60059 3.5 6.99999 3.5Z"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector 194"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.396 3.53469v-0.70135C4.396 1.68274 5.3676 0.75 6.56613 0.75h0.86806c1.19853 0 2.17013 0.93274 2.17013 2.08334v0.70135"
                        strokeWidth="1"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className="relative flex-1 mt-4">
                  <input
                    type="text"
                    id="Experience-id"
                    placeholder=" "
                    className="peer block w-full bg-transparent rounded-md outline-none transition-all"
                  />
                  <label
                    htmlFor="Experience-id"
                    class="text-sm text-gray-300 absolute top-4 
                    -translate-y-1/2 origin-left 
                     peer-placeholder-shown:-translate-y-1/2 peer-focus:-top-2
                    transition-all cursor-text"
                  >
                    Add Experience
                  </label>
                </div>
              </div>
              <div className="w-full flex gap-5 rounded-3xl border border-1 py-1 ">
                <div className="flex w-[3rem] pl-3 justify-center items-center ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    id="Linkedin-Logo--Streamline-Flex"
                    height="48"
                    width="48"
                  >
                    <g id="linkedin--network-linkedin-professional">
                      <path
                        id="Vector 229 (Stroke)"
                        fill="#d7e0ff"
                        fillRule="evenodd"
                        d="M2.24062 5.7041c0.76769 0 1.39003 0.62234 1.39003 1.39003V11.86c0 0.7677 -0.62234 1.39 -1.39003 1.39 -0.76769 0 -1.390034 -0.6223 -1.390034 -1.39V7.09413c0 -0.76769 0.622344 -1.39003 1.390034 -1.39003Z"
                        clipRule="evenodd"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector 229 (Stroke)_2"
                        fillRule="evenodd"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.24062 5.7041c0.76769 0 1.39003 0.62234 1.39003 1.39003V11.86c0 0.7677 -0.62234 1.39 -1.39003 1.39 -0.7677 0 -1.390034 -0.6223 -1.390034 -1.39V7.09413c0 -0.76769 0.622334 -1.39003 1.390034 -1.39003Z"
                        clipRule="evenodd"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector 230 (Stroke)"
                        fill="#d7e0ff"
                        fillRule="evenodd"
                        d="M9.47705 8.48417c-0.54835 0 -0.99288 0.44453 -0.99288 0.99288V11.86c0 0.7677 -0.62234 1.39 -1.39004 1.39 -0.76769 0 -1.39003 -0.6223 -1.39003 -1.39V9.47705c0 -2.08374 1.68921 -3.77295 3.77295 -3.77295 2.08375 0 3.77295 1.68921 3.77295 3.77295V11.86c0 0.7677 -0.6223 1.39 -1.39 1.39 -0.7677 0 -1.3901 -0.6223 -1.3901 -1.39V9.47705c0 -0.54835 -0.4445 -0.99288 -0.99285 -0.99288Z"
                        clipRule="evenodd"
                        strokeWidth="1"
                      ></path>
                      <path
                        id="Vector 230 (Stroke)_2"
                        fillRule="evenodd"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.47705 8.48417c-0.54835 0 -0.99288 0.44453 -0.99288 0.99288V11.86c0 0.7677 -0.62234 1.39 -1.39004 1.39 -0.76769 0 -1.39003 -0.6223 -1.39003 -1.39V9.47705c0 -2.08374 1.68921 -3.77295 3.77295 -3.77295 2.08375 0 3.77295 1.68921 3.77295 3.77295V11.86c0 0.7677 -0.6223 1.39 -1.39 1.39 -0.7677 0 -1.3901 -0.6223 -1.3901 -1.39V9.47705c0 -0.54835 -0.4445 -0.99288 -0.99285 -0.99288Z"
                        clipRule="evenodd"
                        strokeWidth="1"
                      ></path>
                    </g>
                  </svg>
                </div>
                <div className='pt-0 mt-0'>
                  <CustomSelectLanguage
                    data={categoriesList}
                    selected={selectedCategory}
                    setSelected={setSelectedCategory}
                    // selectedFocus={selectedFocus}
                    // handleSelectedFocusList={handleSelectedFocusList}
                    // label={'Select Categories'}
                    disabled={isView}
                    isMultiple={true}
                  />
                  <span className="error text-xs text-red-400">{error.focus}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border relative h-[40rem] w-full border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
            <div className="text-black dark:text-white h-full text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem] justify-between">
              <h4>Specialisations</h4>
              <p className="text-sm text-gray-300 font-normal">
                Areas of focus or specific treatment modalities.
              </p>

              {/* custom-scrollbar  : Removed this*/}
              <div className="overflow-auto h-full w-full ">
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  {focuses.map((item) => (
                    <p
                      key={item.id}
                      onClick={() => toggleSelect(item.id)}
                      className={`flex items-center justify-center px-4 text-[12px] text-center cursor-pointer border-2 rounded-3xl ${
                        selectedItems.has(item.id)
                          ? 'bg-blue-500 text-white border-blue-600'
                          : 'text-gray-400 border-slate-1000 hover:bg-blue-100'
                      }`}
                      style={{
                        paddig: item.id % 2 === 0 ? '10px' : '5px'
                      }}
                    >
                      {item.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border relative  w-full border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
            <div className="text-black dark:text-white h-full text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem]">
              <div className="flex flex-col gap-[1rem] ">
                <h4>Attachments</h4>
                <p className="text-sm text-gray-300 font-normal">
                  You can easily upload all relevant documents, including insurance documetation,
                  your CV, certificates and more.
                </p>
              </div>
              <div className="w-full mt-[1rem] p-2 flex gap-5 rounded-3xl border border-1">
                <div className="w-full flex flex-col">
                  <p className="text-sm ml-2 text-gray-300">C.V. Document</p>
                  <div>
                    {fileNames.length !== 0 ? (
                      fileNames.map((fileName, index) => (
                        <div key={index} className="flex items-center mb-2 mr-2">
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="w-[17px] h-[15px] hover:bg-red-100 flex justify-center items-center rounded-[5px] ml-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                              id="File-Delete--Streamline-Flex"
                              height="24"
                              width="24"
                            >
                              <desc>File Delete Streamline Icon: https://streamlinehq.com</desc>
                              <g id="file-delete--file-common-delete">
                                <path
                                  id="Subtract"
                                  fill="#d7e0ff"
                                  d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                  strokeWidth="1"
                                ></path>
                                <path
                                  id="Subtract_2"
                                  stroke="gray"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                  strokeWidth="1"
                                ></path>
                                <path
                                  id="Vector"
                                  stroke="gray"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.87501 4.87515 9.12486 9.125m0.00002 -4.25L4.87502 9.12485"
                                  strokeWidth="1"
                                ></path>
                              </g>
                            </svg>
                          </button>
                          <button className="w-full">
                            <input
                              type="text"
                              value={fileName}
                              readOnly
                              className="text-[16px] pointer-events-none pr-3 ml-3 placeholder:text-blue-950 text-gray-1000 w-full break-words"
                            />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center mb-2 mr-2">
                        <button className="w-[17px] h-[15px] hover:bg-red-100 flex justify-center items-center rounded-[5px] ml-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                            id="File-Delete--Streamline-Flex"
                            height="24"
                            width="24"
                          >
                            <desc>File Delete Streamline Icon: https://streamlinehq.com</desc>
                            <g id="file-delete--file-common-delete">
                              <path
                                id="Subtract"
                                fill="#d7e0ff"
                                d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Subtract_2"
                                stroke="gray"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector"
                                stroke="gray"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.87501 4.87515 9.12486 9.125m0.00002 -4.25L4.87502 9.12485"
                                strokeWidth="1"
                              ></path>
                            </g>
                          </svg>
                        </button>
                        <button className="w-full">
                          <input
                            type="text"
                            placeholder="No files selected"
                            className="text-[16px] bg-white dark:bg-shoorah-darkBgTabColor dark:border-none text-gray-900 dark:text-white pointer-events-none pr-3 ml-3 placeholder:text-[#353b5a] dark:placeholder:text-gray-400 w-full h-fit appearance-none outline-none"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="pt-2 pr-1 flex justify-center items-center">
                  <button
                    className="h-[15px] border hover:bg-red-100 border-3 border-shoorah-primary dark:border-white flex justify-center items-center rounded-[5px]"
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[11px] h-[11px] fill-current text-[#3a47ab] dark:text-white"
                      viewBox="0 0 448 512"
                    >
                      <path d="M432 256c0 13.3-10.7 24-24 24H272v136c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H72c-13.3 0-24-10.7-24-24s10.7-24 24-24h136V96c0-13.3 10.7-24 24-24s24 10.7 24 24v136h136c13.3 0 24 10.7 24 24z" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    multiple
                  />
                </p>
              </div>

              <div className="w-full mt-[1rem] p-2 flex gap-5 rounded-3xl border border-1">
                <div className="w-full flex flex-col">
                  <p className="text-sm ml-2 text-gray-300">
                    Insurance Documents ( no minimum selection )
                  </p>
                  <div>
                    {fileNames.length !== 0 ? (
                      fileNames.map((fileName, index) => (
                        <div key={index} className="flex items-center mb-2 mr-2">
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="w-[17px] h-[15px] hover:bg-red-100 flex justify-center items-center rounded-[5px] ml-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                              id="File-Delete--Streamline-Flex"
                              height="24"
                              width="24"
                            >
                              <desc>File Delete Streamline Icon: https://streamlinehq.com</desc>
                              <g id="file-delete--file-common-delete">
                                <path
                                  id="Subtract"
                                  fill="#d7e0ff"
                                  d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                  strokeWidth="1"
                                ></path>
                                <path
                                  id="Subtract_2"
                                  stroke="gray"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                  strokeWidth="1"
                                ></path>
                                <path
                                  id="Vector"
                                  stroke="gray"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.87501 4.87515 9.12486 9.125m0.00002 -4.25L4.87502 9.12485"
                                  strokeWidth="1"
                                ></path>
                              </g>
                            </svg>
                          </button>
                          <button className="w-full">
                            <input
                              type="text"
                              value={fileName}
                              readOnly
                              className="text-[16px] pointer-events-none pr-3 ml-3 placeholder:text-blue-950 text-gray-1000 w-full break-words"
                            />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center mb-2 mr-2">
                        <button className="w-[17px] h-[15px] hover:bg-red-100 flex justify-center items-center rounded-[5px] ml-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                            id="File-Delete--Streamline-Flex"
                            height="24"
                            width="24"
                          >
                            <desc>File Delete Streamline Icon: https://streamlinehq.com</desc>
                            <g id="file-delete--file-common-delete">
                              <path
                                id="Subtract"
                                fill="#d7e0ff"
                                d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Subtract_2"
                                stroke="gray"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector"
                                stroke="gray"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.87501 4.87515 9.12486 9.125m0.00002 -4.25L4.87502 9.12485"
                                strokeWidth="1"
                              ></path>
                            </g>
                          </svg>
                        </button>
                        <button className="w-full">
                          <input
                            type="text"
                            placeholder="No files selected"
                            className="text-[16px] bg-white dark:bg-shoorah-darkBgTabColor dark:border-none text-gray-900 dark:text-white pointer-events-none pr-3 ml-3 placeholder:text-blue-950 dark:placeholder:text-gray-400 w-full h-fit appearance-none outline-none"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="pt-8 pr-1 flex justify-center items-center">
                  <button
                    className="h-[15px] border hover:bg-red-100 border-3 border-shoorah-primary dark:border-white flex justify-center items-center rounded-[5px]"
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[11px] h-[11px] fill-current text-[#3a47ab] dark:text-white"
                      viewBox="0 0 448 512"
                    >
                      <path d="M432 256c0 13.3-10.7 24-24 24H272v136c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H72c-13.3 0-24-10.7-24-24s10.7-24 24-24h136V96c0-13.3 10.7-24 24-24s24 10.7 24 24v136h136c13.3 0 24 10.7 24 24z" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    multiple
                  />
                </p>
              </div>
              <div className="w-full mt-[1rem] p-2 flex gap-5 rounded-3xl border border-1">
                <div className="w-full flex flex-col">
                  <p className="text-sm ml-2 text-gray-300">
                    Certification Documents ( no minimum selection )
                  </p>
                  <div>
                    {fileNames.length !== 0 ? (
                      fileNames.map((fileName, index) => (
                        <div key={index} className="flex items-center mb-2 mr-2">
                          <button
                            onClick={() => handleRemoveFile(index)}
                            className="w-[17px] h-[15px] hover:bg-red-100 flex justify-center items-center rounded-[5px] ml-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                              id="File-Delete--Streamline-Flex"
                              height="24"
                              width="24"
                            >
                              <desc>File Delete Streamline Icon: https://streamlinehq.com</desc>
                              <g id="file-delete--file-common-delete">
                                <path
                                  id="Subtract"
                                  fill="#d7e0ff"
                                  d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                  strokeWidth="1"
                                ></path>
                                <path
                                  id="Subtract_2"
                                  stroke="gray"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                  strokeWidth="1"
                                ></path>
                                <path
                                  id="Vector"
                                  stroke="gray"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.87501 4.87515 9.12486 9.125m0.00002 -4.25L4.87502 9.12485"
                                  strokeWidth="1"
                                ></path>
                              </g>
                            </svg>
                          </button>
                          <button className="w-full">
                            <input
                              type="text"
                              value={fileName}
                              readOnly
                              className="text-[16px] pointer-events-none pr-3 ml-3 placeholder:text-blue-950 text-gray-1000 w-full break-words"
                            />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center mb-2 mr-2">
                        <button className="w-[17px] h-[15px] hover:bg-red-100 flex justify-center items-center rounded-[5px] ml-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                            id="File-Delete--Streamline-Flex"
                            height="24"
                            width="24"
                          >
                            <desc>File Delete Streamline Icon: https://streamlinehq.com</desc>
                            <g id="file-delete--file-common-delete">
                              <path
                                id="Subtract"
                                fill="#d7e0ff"
                                d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Subtract_2"
                                stroke="gray"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector"
                                stroke="gray"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.87501 4.87515 9.12486 9.125m0.00002 -4.25L4.87502 9.12485"
                                strokeWidth="1"
                              ></path>
                            </g>
                          </svg>
                        </button>
                        <button className="w-full">
                          <input
                            type="text"
                            placeholder="No files selected"
                            className="text-[16px] bg-white dark:bg-shoorah-darkBgTabColor dark:border-none text-gray-900 dark:text-white pointer-events-none pr-3 ml-3 placeholder:text-blue-950 dark:placeholder:text-gray-400 w-full h-fit appearance-none outline-none"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="pt-8 pr-1 flex justify-center items-center">
                  <button
                    className="h-[15px] border hover:bg-red-100 border-3 border-shoorah-primary dark:border-white flex justify-center items-center rounded-[5px]"
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[11px] h-[11px] fill-current text-[#3a47ab] dark:text-white"
                      viewBox="0 0 448 512"
                    >
                      <path d="M432 256c0 13.3-10.7 24-24 24H272v136c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H72c-13.3 0-24-10.7-24-24s10.7-24 24-24h136V96c0-13.3 10.7-24 24-24s24 10.7 24 24v136h136c13.3 0 24 10.7 24 24z" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    id="fileInput"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    multiple
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* right col */}
        <div className=" mr-0 sm:mr-8 flex flex-col py-3 gap-[35px] w-full md:w-[50%] h-fit">
          {/* h-[25rem] */}
          <div className="border relative pb-10  border-gray-300 rounded-3xl p-4 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
            <div className="text-black h-full  dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem] ">
              <div className="flex justify-between pr-3 ">
                <h4>Personal Bio</h4>
                <button className="text-sm">Edit</button>
              </div>
              <p className="text-sm text-gray-300  font-normal  h-20">
                Explore specialists bio to gain a deeper understanding of their professional
                journey. While these sections cannot be edited directly admins can request changes
                through messaging feature.
              </p>

              <div className="w-full mt-[2rem] h-[8rem] ">
                <textarea
                  // value={
                  //   'Explore specialists bio to gain a deeper understanding of their professional journey. While these sections cannot be edited directly admins can request changes through messaging feature.'
                  // }
                  id="description"
                  name="description"
                  maxLength={2000}
                  placeholder="Enter description..."
                  className={`p-5 text-sm flex rounded-2xl border border-1 placeholder:text-gray-300 text-gray-700  h-full w-full appearance-none outline-none w-[100%] resize-none break-all `}
                />
              </div>
            </div>
          </div>
          {/* h-full md:h-[27.8rem] */}
          {userData?.userType === 6 ? (
            <>
              <div className="border relative  border-gray-300 rounded-3xl p-4 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
                <div className="text-black h-full dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem]">
                  <h4>ID & DBS Check</h4>
                  <p className="text-sm font-normal text-gray-300">
                    Enhance client trust by uploading your DBS Check and verifying your ID here.
                    Displaying these credientials on your profile ensures clients that you are a
                    reliable and verified professional, promoting safety and confidence in your
                    practice.
                  </p>

                  <div className="w-full flex md:flex-row flex-col gap-[1rem] justify-center  mt-[0rem] h-full ">
                    <div className="w-full h-[12rem] border border-gray-300 pt-4 py-5 md:py-0 rounded-3xl flex flex-col justify-start items-center gap-2 ">
                      <div className="w-full flex justify-center gap-2   rounded-3xl pt-4">
                        <p className="text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                            id="User-Protection-Check--Streamline-Flex"
                            height="40"
                            width="40"
                          >
                            <desc>
                              User Protection Check Streamline Icon: https://streamlinehq.com
                            </desc>
                            <g id="user-protection-check--shield-secure-security-person-check-protection">
                              <path
                                id="Vector"
                                fill="#d7e0ff"
                                d="M5.42188 5.5c1.59999 0 2.5 -0.9 2.5 -2.5s-0.90001 -2.5 -2.5 -2.5c-1.6 0 -2.5 0.9 -2.5 2.5s0.9 2.5 2.5 2.5Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector 168"
                                fill="#ffffff"
                                d="M7.5 10.448c0 -1.78777 0.5 -2.55394 0.75 -2.80933h4.5c0.25 0.25539 0.75 1.02156 0.75 2.80933 0 2.0431 -1.9698 2.7967 -2.9698 3.0521C9.53017 13.2447 7.5 12.4911 7.5 10.448Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector 169"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.5 10.448c0 -1.78777 0.5 -2.55394 0.75 -2.80933h4.5c0.25 0.25539 0.75 1.02156 0.75 2.80933 0 2.0431 -1.9698 2.7967 -2.9698 3.0521C9.53017 13.2447 7.5 12.4911 7.5 10.448Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Subtract"
                                fill="#d7e0ff"
                                fillRule="evenodd"
                                d="M6.26307 7.54744C5.95784 8.25298 5.75 9.20162 5.75 10.448c0 0.4216 0.05411 0.8106 0.14995 1.1682H2.35196c-1.634973 0 -2.553843 -1.82569 -1.19306 -2.77229C2.37949 7.99484 3.84536 7.5 5.42188 7.5c0.28425 0 0.56492 0.01609 0.84119 0.04744Z"
                                clipRule="evenodd"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Subtract_2"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.81036 7.51006C5.68167 7.50338 5.55215 7.5 5.42188 7.5c-1.57652 0 -3.04239 0.49484 -4.26298 1.34391 -1.360783 0.9466 -0.441913 2.77229 1.19306 2.77229h3.06992"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector_2"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.42188 5.5c1.6 0 2.5 -0.9 2.5 -2.5s-0.9 -2.5 -2.5 -2.5 -2.5 0.9 -2.5 2.5 0.9 2.5 2.5 2.5Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector_3"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.55322 10.556 0.68858 0.7101c0.324 -0.9307 0.5938 -1.33916 1.205 -1.89354"
                                strokeWidth="1"
                              ></path>
                            </g>
                          </svg>
                        </p>
                        <p className="text-xl">DBS Check</p>
                      </div>

                      <p className="text-sm self-start pl-8 w-full flex  sm:justify-start justify-center   text-gray-300">
                        Upload your file for quick and efficient approval.
                      </p>
                      <div className="w-full flex">
                        <div className="w-full flex flex-col">
                          <p className="text-sm underline self-start pl-8 flex sm:justify-start justify-center w-full  text-gray-900">
                            {fileNames.length !== 0 ? (
                              fileNames.map((fileName, index) => (
                                <div key={index} className="flex items-center">
                                  <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="w-[15px] h-[15px] hover:bg-red-100 flex justify-center items-center rounded-[5px]"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 14 14"
                                      id="File-Delete--Streamline-Flex"
                                      height="24"
                                      width="24"
                                    >
                                      <desc>
                                        File Delete Streamline Icon: https://streamlinehq.com
                                      </desc>
                                      <g id="file-delete--file-common-delete">
                                        <path
                                          id="Subtract"
                                          fill="#d7e0ff"
                                          d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                          strokeWidth="1"
                                        ></path>
                                        <path
                                          id="Subtract_2"
                                          stroke="gray"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                          strokeWidth="1"
                                        ></path>
                                        <path
                                          id="Vector"
                                          stroke="gray"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M4.87501 4.87515 9.12486 9.125m0.00002 -4.25L4.87502 9.12485"
                                          strokeWidth="1"
                                        ></path>
                                      </g>
                                    </svg>
                                  </button>
                                  <button className="w-full">
                                    <input
                                      type="text"
                                      value={fileName}
                                      readOnly
                                      className="text-[16px] pointer-events-none pr-3 ml-2 placeholder:text-blue-950 text-gray-1000 w-full break-words"
                                    />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="flex items-center">
                                <button className="w-[15px] h-[15px] hover:bg-red-100 flex justify-center items-center rounded-[5px]">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    id="File-Delete--Streamline-Flex"
                                    height="24"
                                    width="24"
                                  >
                                    <desc>
                                      File Delete Streamline Icon: https://streamlinehq.com
                                    </desc>
                                    <g id="file-delete--file-common-delete">
                                      <path
                                        id="Subtract"
                                        fill="#d7e0ff"
                                        d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                        strokeWidth="1"
                                      ></path>
                                      <path
                                        id="Subtract_2"
                                        stroke="gray"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                        strokeWidth="1"
                                      ></path>
                                      <path
                                        id="Vector"
                                        stroke="gray"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.87501 4.87515 9.12486 9.125m0.00002 -4.25L4.87502 9.12485"
                                        strokeWidth="1"
                                      ></path>
                                    </g>
                                  </svg>
                                </button>
                                <button className="w-full">
                                  <input
                                    type="text"
                                    placeholder="No files selected"
                                    className="text-[12px] bg-white dark:bg-shoorah-darkBgTabColor dark:border-none text-gray-900 dark:text-white pointer-events-none pr-3 ml-3 placeholder:text-[#353b5a] dark:placeholder:text-gray-400 w-full h-fit appearance-none outline-none"
                                  />
                                </button>
                              </div>
                            )}
                          </p>
                        </div>
                        <p className="pr-2 flex justify-center items-center">
                          <button
                            onClick={() => document.getElementById('fileInput').click()}
                            className="w-[14px] h-[14px] text-shoorah-primary flex justify-center items-center rounded-[5px]  "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                              id="Upload-File--Streamline-Flex"
                              height="32"
                              width="32"
                            >
                              <desc>Upload File Streamline Icon: https://streamlinehq.com</desc>
                              <g id="upload-file">
                                <path
                                  id="Subtract"
                                  fill="#d7e0ff"
                                  d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                  strokeWidth="1"
                                ></path>
                                <path
                                  id="Subtract_2"
                                  stroke="#000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12.8534 11.5629C12.9494 10.0921 13 8.56549 13 7c0 -0.42599 -0.0037 -0.84909 -0.0111 -1.26898 -0.0138 -0.78391 -0.2654 -1.54895 -0.7457 -2.16867 -0.8249 -1.06446 -1.5593 -1.798 -2.69605 -2.664462 -0.3171 -0.241706 -0.70416 -0.373156 -1.10277 -0.382227C7.98804 0.505278 7.51108 0.5 7 0.5 5.45944 0.5 4.22884 0.547957 2.93872 0.639152c-0.9635 0.068107 -1.72917 0.834098 -1.79211 1.797948C1.05057 3.90794 1 5.4345 1 7c0 1.56549 0.05057 3.0921 0.14661 4.5629 0.06294 0.9639 0.82861 1.7298 1.79211 1.7979C4.22884 13.452 5.45943 13.5 7 13.5c1.54057 0 2.77116 -0.048 4.0613 -0.1392 0.9635 -0.0681 1.7292 -0.834 1.7921 -1.7979Z"
                                  strokeWidth="1"
                                ></path>
                                <path
                                  id="Vector"
                                  stroke="#000"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m7.00012 10 0 -5.99996"
                                  strokeWidth="1"
                                ></path>
                                <path
                                  id="Vector_2"
                                  stroke="#4147d5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.71094 6.2891C5.16876 5.37346 6.0844 4.45782 7.00001 4c0.91567 0.45782 1.83132 1.37346 2.28914 2.2891"
                                  strokeWidth="1"
                                ></path>
                              </g>
                            </svg>
                          </button>
                          <input
                            type="file"
                            id="fileInput"
                            accept=".pdf"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            multiple
                          />
                        </p>
                      </div>
                    </div>

                    <div className="w-full h-[12rem] border border-gray-300 pt-4 py-5 md:py-0 rounded-3xl flex flex-col justify-start items-center gap-2 ">
                      <div className="w-full   flex justify-center gap-4  rounded-3xl pt-4">
                        <p className="text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                            id="Passport--Streamline-Flex"
                            height="40"
                            width="40"
                          >
                            <desc>Passport Streamline Icon: https://streamlinehq.com</desc>
                            <g id="passport--travel-book-id-adventure-visa-airport">
                              <path
                                id="Union"
                                fill="#d7e0ff"
                                d="m10.7561 0.590922 0 2.606098c0.0891 0.00607 0.1783 0.01236 0.2675 0.01886 0.5537 0.04038 0.9764 0.49191 0.9764 1.03094v8.04098c0 0.5376 -0.4195 0.9867 -0.9714 1.0311 -2.3418 0.1885 -4.65346 0.2416 -6.99869 0.1033 -1.05097 -0.062 -1.88207 -0.8726 -1.94422 -1.8929 -0.15071 -2.47467 -0.0949 -4.91636 0.10695 -7.38791 0.253 -3.09783 6.39743 -3.946854 8.56346 -3.550468Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Union_2"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m10.7561 0.590922 0 2.606098c0.0891 0.00607 0.1783 0.01236 0.2675 0.01886 0.5537 0.04038 0.9764 0.49191 0.9764 1.03094v8.04098c0 0.5376 -0.4195 0.9867 -0.9714 1.0311 -2.3418 0.1885 -4.65346 0.2416 -6.99869 0.1033 -1.05097 -0.062 -1.88207 -0.8726 -1.94422 -1.8929 -0.15071 -2.47467 -0.0949 -4.91636 0.10695 -7.38791 0.253 -3.09783 6.39743 -3.946854 8.56346 -3.550468Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Intersect"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12.0001 4.24679c0 -0.53903 -0.4228 -0.99056 -0.9765 -1.03094 -1.68058 -0.12255 -3.85111 -0.16834 -5.52482 -0.1374"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector 124"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.39917 10.8834 -1.39912 0 -1.39912 0"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector"
                                fill="#ffffff"
                                d="M7.00001 8.84505c0.99829 0 1.55982 -0.56154 1.55982 -1.55982 0 -0.99829 -0.56153 -1.55983 -1.55982 -1.55983s-1.55982 0.56154 -1.55982 1.55983c0 0.99828 0.56153 1.55982 1.55982 1.55982Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector_2"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.00001 8.84505c0.99829 0 1.55982 -0.56154 1.55982 -1.55982 0 -0.99829 -0.56153 -1.55983 -1.55982 -1.55983s-1.55982 0.56154 -1.55982 1.55983c0 0.99828 0.56153 1.55982 1.55982 1.55982Z"
                                strokeWidth="1"
                              ></path>
                            </g>
                          </svg>
                        </p>
                        <p className="text-xl">Identity</p>
                      </div>
                      <p className="text-sm self-start pl-8 w-full flex  sm:justify-start justify-center   text-gray-300">
                        Secure third-party verification for ID approval.
                      </p>

                      <p className="text-sm cursor-pointer underline self-start pl-8 flex sm:justify-start justify-center w-full  text-gray-900">
                        Verify my ID.
                      </p>
                    </div>
                  </div>
                  <div className=" hover:bg-shoorah-secondary  hover:text-white    w-full flex justify-center gap-2 h-[3rem]  rounded-3xl border border-gray-300 ">
                    <button
                      // onClick={scrollToTop}
                      className="text-xl"
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      Upload Intro Video
                      <input
                        type="file"
                        id="fileInput"
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        multiple
                      />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="border relative  border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
                <div className="text-black h-full dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem]">
                  <h4>ID & DBS Check</h4>
                  <p className="text-sm text-gray-300">
                    Specialists conveniently upload their DBS and ID checks and verifications. While
                    the DBS checks require approval from a Shoorah Admin member. The ID verification
                    is efficiently handled by a reliable third-party software.
                  </p>

                  <div className="w-full flex md:flex-row flex-col gap-[1.5rem] justify-center mt-[1rem] h-full ">
                    <div className="w-full border  border-gray-300 pt-4 py-5  rounded-3xl flex flex-col justify-start items-center gap-5 ">
                      <div className="w-full flex justify-center gap-4  rounded-3xl ">
                        <p className="text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                            id="User-Protection-Check--Streamline-Flex"
                            height="40"
                            width="40"
                          >
                            <desc>
                              User Protection Check Streamline Icon: https://streamlinehq.com
                            </desc>
                            <g id="user-protection-check--shield-secure-security-person-check-protection">
                              <path
                                id="Vector"
                                fill="#d7e0ff"
                                d="M5.42188 5.5c1.59999 0 2.5 -0.9 2.5 -2.5s-0.90001 -2.5 -2.5 -2.5c-1.6 0 -2.5 0.9 -2.5 2.5s0.9 2.5 2.5 2.5Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector 168"
                                fill="#ffffff"
                                d="M7.5 10.448c0 -1.78777 0.5 -2.55394 0.75 -2.80933h4.5c0.25 0.25539 0.75 1.02156 0.75 2.80933 0 2.0431 -1.9698 2.7967 -2.9698 3.0521C9.53017 13.2447 7.5 12.4911 7.5 10.448Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector 169"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.5 10.448c0 -1.78777 0.5 -2.55394 0.75 -2.80933h4.5c0.25 0.25539 0.75 1.02156 0.75 2.80933 0 2.0431 -1.9698 2.7967 -2.9698 3.0521C9.53017 13.2447 7.5 12.4911 7.5 10.448Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Subtract"
                                fill="#d7e0ff"
                                fillRule="evenodd"
                                d="M6.26307 7.54744C5.95784 8.25298 5.75 9.20162 5.75 10.448c0 0.4216 0.05411 0.8106 0.14995 1.1682H2.35196c-1.634973 0 -2.553843 -1.82569 -1.19306 -2.77229C2.37949 7.99484 3.84536 7.5 5.42188 7.5c0.28425 0 0.56492 0.01609 0.84119 0.04744Z"
                                clipRule="evenodd"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Subtract_2"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.81036 7.51006C5.68167 7.50338 5.55215 7.5 5.42188 7.5c-1.57652 0 -3.04239 0.49484 -4.26298 1.34391 -1.360783 0.9466 -0.441913 2.77229 1.19306 2.77229h3.06992"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector_2"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5.42188 5.5c1.6 0 2.5 -0.9 2.5 -2.5s-0.9 -2.5 -2.5 -2.5 -2.5 0.9 -2.5 2.5 0.9 2.5 2.5 2.5Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector_3"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.55322 10.556 0.68858 0.7101c0.324 -0.9307 0.5938 -1.33916 1.205 -1.89354"
                                strokeWidth="1"
                              ></path>
                            </g>
                          </svg>
                        </p>
                        <p className="text-xl">DBS Check</p>
                      </div>
                      {/* relative left-5 */}
                      <div className=" flex justify-evenly ">
                        <p className="text-sm hover:underline text-center text-gray-300 cursor-pointer hover:text-blue-600">
                          View file to approve
                        </p>
                      </div>
                    </div>

                    <div className="w-full border   border-gray-300 pt-4 py-5 rounded-3xl flex flex-col justify-start items-center gap-5 ">
                      <div className="w-full flex justify-center gap-4  rounded-3xl ">
                        <p className="text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                            id="Passport--Streamline-Flex"
                            height="40"
                            width="40"
                          >
                            <desc>Passport Streamline Icon: https://streamlinehq.com</desc>
                            <g id="passport--travel-book-id-adventure-visa-airport">
                              <path
                                id="Union"
                                fill="#d7e0ff"
                                d="m10.7561 0.590922 0 2.606098c0.0891 0.00607 0.1783 0.01236 0.2675 0.01886 0.5537 0.04038 0.9764 0.49191 0.9764 1.03094v8.04098c0 0.5376 -0.4195 0.9867 -0.9714 1.0311 -2.3418 0.1885 -4.65346 0.2416 -6.99869 0.1033 -1.05097 -0.062 -1.88207 -0.8726 -1.94422 -1.8929 -0.15071 -2.47467 -0.0949 -4.91636 0.10695 -7.38791 0.253 -3.09783 6.39743 -3.946854 8.56346 -3.550468Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Union_2"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m10.7561 0.590922 0 2.606098c0.0891 0.00607 0.1783 0.01236 0.2675 0.01886 0.5537 0.04038 0.9764 0.49191 0.9764 1.03094v8.04098c0 0.5376 -0.4195 0.9867 -0.9714 1.0311 -2.3418 0.1885 -4.65346 0.2416 -6.99869 0.1033 -1.05097 -0.062 -1.88207 -0.8726 -1.94422 -1.8929 -0.15071 -2.47467 -0.0949 -4.91636 0.10695 -7.38791 0.253 -3.09783 6.39743 -3.946854 8.56346 -3.550468Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Intersect"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12.0001 4.24679c0 -0.53903 -0.4228 -0.99056 -0.9765 -1.03094 -1.68058 -0.12255 -3.85111 -0.16834 -5.52482 -0.1374"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector 124"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.39917 10.8834 -1.39912 0 -1.39912 0"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector"
                                fill="#ffffff"
                                d="M7.00001 8.84505c0.99829 0 1.55982 -0.56154 1.55982 -1.55982 0 -0.99829 -0.56153 -1.55983 -1.55982 -1.55983s-1.55982 0.56154 -1.55982 1.55983c0 0.99828 0.56153 1.55982 1.55982 1.55982Z"
                                strokeWidth="1"
                              ></path>
                              <path
                                id="Vector_2"
                                stroke="#000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.00001 8.84505c0.99829 0 1.55982 -0.56154 1.55982 -1.55982 0 -0.99829 -0.56153 -1.55983 -1.55982 -1.55983s-1.55982 0.56154 -1.55982 1.55983c0 0.99828 0.56153 1.55982 1.55982 1.55982Z"
                                strokeWidth="1"
                              ></path>
                            </g>
                          </svg>
                        </p>
                        <p className="text-xl">Identity</p>
                      </div>
                      {/* relative left-5 */}
                      <div className="flex justify-evenly items-center">
                        <p className="text-sm text-center text-gray-300">Third party confirmed </p>
                        {isVerified ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className=" hover:bg-blue-500  hover:text-white    w-full flex justify-center gap-2 h-[3rem]  rounded-3xl border border-gray-300 ">
                    <button className="text-xl">View Intro Video</button>
                  </div>
                </div>
              </div>
            </>
          )}
          {userData?.userType === 6 ? (
            <>
              <div
                onClick={scrollToTop}
                className={status !== 'approved' ? 'relative top-[-2.5rem]' : ''}
              >
                {status !== 'approved' && (
                  <div className="relative  top-[30rem] inset-0 z-10  flex items-center justify-center text-gray-600 text-sm   ">
                    <div className="bg-white bg-opacity-90 rounded-lg p-4 shadow-lg   hover:bg-shoorah-primary hover:text-white">
                      Get Approved to Start
                    </div>
                  </div>
                )}
                <div
                  className={` border relative  border-gray-300 rounded-3xl  bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ${
                    status !== 'approved' ? ' pointer-events-none filter blur-sm' : ''
                  }`}
                >
                  <div className=" relative h-full border-gray-300 rounded-3xl p-4 mt-4 mb-4 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
                    <div className="text-black h-full dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem]">
                      <h4>Add your availability {startDate} </h4>

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

                      <div className={` flex flex-col gap-4 justify-start mt-[1.5rem] w-full`}>
                        <div className="flex flex-col gap-2">
                          <p>11th November 2024</p>
                          <div className="flex gap-3">
                            <p className="py-2 px-8 text-sm rounded-full bg-shoorah-primary text-white">
                              2pm - 5pm
                            </p>
                            <p>icon</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p>12th November 2024</p>
                          <div className="flex gap-3">
                            <p className="py-2 px-8 text-sm rounded-full bg-shoorah-primary text-white">
                              2pm - 5pm
                            </p>
                            <p>icon</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p>13th November 2024</p>
                          <div className="flex gap-3">
                            <p className="py-2 px-8 text-sm rounded-full bg-shoorah-primary text-white">
                              2pm - 5pm
                            </p>
                            <p>icon</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <p>14th November 2024</p>
                          <div className="flex gap-3">
                            <p className="py-2 px-8 text-sm rounded-full bg-shoorah-primary text-white">
                              2pm - 5pm
                            </p>
                            <p>icon</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="border relative border-gray-300 rounded-3xl pt-6 pb-2 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
                <div className="text-black h-full dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem]">
                  <h4>Complaints</h4>
                  <p className="text-sm font-normal  text-gray-300">
                    Specialists with multiple complaints within a month may have their profiles
                    temporary pause for further review and quality assurance.
                  </p>

                  <div className="w-full  flex mt-[2rem] justify-between ">
                    <div className="text-gray-400 flex ">March {moment().format('YYYY')}</div>
                    <div className="self-end flex ">
                      <select
                        className="px-3 rounded-lg "
                        //  defaultValue={timeConstant.}
                        id="month"
                        name="month"
                        //  onChange={(e) => {

                        //  }}
                      >
                        {MONTH_NAMES.map(({ name, value }) => (
                          <option className=" " key={name} value={value}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="w-full  text-lg text-gray-400  flex mt-[2rem] justify-start ">
                    <div className=" w-[50%] flex ">Complaint</div>
                    <div className="flex w-[50%]">Date</div>
                  </div>

                  <div className="w-full text-sm flex justify-start ">
                    <div className="underline w-[50%] flex ">Appealed a way</div>
                    <div className="flex text-gray-400 w-[50%]">20 May, 2024</div>
                  </div>
                  <div className="w-full  text-sm flex justify-start ">
                    <div className="underline w-[50%] flex ">Appealed a way</div>
                    <div className="flex text-gray-400 w-[50%]">25 May, 2024</div>
                  </div>

                  <button className="px-12 text-sm mt-[2rem] bg-shoorah-secondary py-2 w-fit rounded-[3rem] text-white">
                    Manage
                  </button>
                </div>
              </div>
              <div className="border relative border-gray-300 rounded-3xl pt-6 pb-2 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
                <div className="text-black h-full dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem]">
                  <h4>Pricing Details</h4>
                  <p className="text-sm font-normal  text-gray-300">
                    Specialists can suggest a ( 30 min ) sessions pricing which needs to approved
                    here by the shoorah admin member.
                  </p>

                  <div className="w-full   text-lg text-gray-400  flex  justify-start ">
                    <div className=" w-full  flex ">Shoorah Price</div>
                    <div className="flex w-full">Public Pricing</div>
                  </div>

                  <div className="w-full  text-sm flex justify-start ">
                    <div className="w-full  text-lg flex ">
                      <button className=" text-sm px-8 py-1 rounded-full bg-shoorah-secondary text-white">
                        ￡50.00
                      </button>
                    </div>
                    <div className="flex text-gray-400 gap-3 w-full   justify-between">
                      <button className=" text-sm px-8 py-1 rounded-full bg-shoorah-secondary text-white">
                        ￡70.00
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeapProfile;

import moment from 'moment';
import React from 'react';
import { Helmet } from 'react-helmet';
import ProfileCard from './profileCard';
import { MONTH_NAMES } from '../../../utils/constants';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Api } from '../../../api';
import Loader from '../../../component/common/Loader';
const MySpecialistProfile = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('userId');
    setUserId(id);
    fetchUsers(id);
  }, [location]);

  const fetchUsers = (userId) => {
    setLoader(true);
    Api.getSpecialistData('', '', userId)
      .then((response) => {
        setLoader(false);
        if (response?.data?.meta?.code === 1) {
          setUsersList(response?.data?.data);
        } else {
          setUsersList([]);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.error('API call error: ', error);
      });
  };
  const focuses = [
    {
      name: 'hello one',
      id: 1
    },
    {
      name: 'hello',
      id: 2
    },
    {
      name: 'hello three',
      id: 3
    },
    {
      name: 'hello',
      id: 4
    },
    {
      name: 'hello five',
      id: 5
    },
    {
      name: 'hello six',
      id: 6
    },
    {
      name: 'hello',
      id: 7
    },
    {
      name: 'hello eight',
      id: 8
    },
    {
      name: 'hello',
      id: 9
    },
    {
      name: 'hello ten',
      id: 10
    },
    {
      name: 'hello',
      id: 11
    },
    {
      name: 'hello seven',
      id: 12
    },
    {
      name: 'hello eight',
      id: 13
    },
    {
      name: 'hello',
      id: 14
    },
    {
      name: 'hello ten',
      id: 15
    },
    {
      name: 'hello six',
      id: 16
    },
    {
      name: 'hello',
      id: 17
    },
    {
      name: 'hello eight',
      id: 18
    },
    {
      name: 'hello nine',
      id: 19
    },
    {
      name: 'hello ten',
      id: 20
    },
    {
      name: 'hello nine',
      id: 21
    },
    {
      name: 'hello ten',
      id: 22
    },
    {
      name: 'hello',
      id: 23
    },
    {
      name: 'hello ten',
      id: 24
    }
  ];

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isApprove, setIsApprove] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  const togglePopup1 = () => {
    setIsApprove(!isApprove);
  };

  return (
    <div className="px-3 ">
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Peap Profile | Shoorah Admin</title>
      </Helmet>

      <div className="mt-[3rem] text-3xl pl-8 px-3">Specialist Profile</div>
      <div className="mt-[1rem] text-gray-400 text-xl pl-8 px-3">
        {moment().format('DD MMM YYYY')}
      </div>
      <div className=" flex flex-col  sm:flex-row justify-center sm:justify-end gap-5 sm:gap-10 ml-[200px] sm:ml-0 mr-0 sm:mr-10  mt-10">
        <div className="relative group w-[180px] h-[37px] top-[-1.5rem]">
          <button
            className={`py-3 px-4 relative text-white bg-shoorah-primary w-full h-full rounded-xl tracking-tighter leading-none justify-center  overflow-hidden`}
            onClick={togglePopup1}
          >
            <span className="absolute inset-0 bg-green-500 transition-all duration-300 ease-in-out transform -translate-x-full group-hover:translate-x-0"></span>
            <span className="relative ">Approve</span>
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
                  {' '}
                  Yes{' '}
                </button>
                <button
                  className={`relative  text-white bg-shoorah-primary w-[40%] h-12 rounded-xl tracking-tighter leading-none justify-center text-xs transition-all duration-300 ease-in-out overflow-hidden`}
                >
                  {' '}
                  No{' '}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative group w-[180px] h-[37px] top-[-1.5rem] z-10">
          <button
            className={`py-3 px-4 relative text-white bg-shoorah-primary w-full h-full rounded-xl tracking-tighter leading-none justify-center text-xs transition-all duration-300 ease-in-out overflow-hidden`}
            onClick={togglePopup}
          >
            <span className="absolute inset-0 bg-red-500 transition-all duration-300 ease-in-out transform -translate-x-full group-hover:translate-x-0"></span>
            <span className="relative ">Unapprove</span>
          </button>
        </div>

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
                    {' '}
                    Send{' '}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-[3rem] w-full ">
        <ProfileCard />
      </div>

      <div className="mt-6 mb-5 flex flex-col md:flex-row   gap-x-14   gap-4 ">
        {/* left */}
        <div className="flex flex-col md:h-fit ml-0 sm:ml-8 py-3 gap-[3rem] w-full  md:w-[50%] relative top-14  sm:top-0">
          <div className="border relative  border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
            <div className="text-black dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem] justify-between">
              <h4>Specialist Information</h4>
              <p className="text-sm font-normal  text-gray-300">
                Specialist provide in-depth information on their profiles, offering clients of clear
                understanding of there expertise.
              </p>

              <div className="w-full mt-[2rem] flex gap-5 rounded-2xl border border-1 py-1 ">
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
                <div className="w-full flex flex-col justify-between ">
                  <p className="text-sm text-gray-300">Medical Id no.</p>
                  <div className="pr-3 placeholder:text-gray-400 text-blue-950   h-fit appearance-none outline-none">
                    {' '}
                    234697264961{' '}
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-5 rounded-2xl border border-1 py-1 ">
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
                <div className="w-full flex flex-col justify-between ">
                  <p className="text-sm text-gray-300">Education</p>
                  <div className="pr-3  text-blue-950  h-fit appearance-none outline-none">
                    {' '}
                    Cherry University of Vietnam
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-5 rounded-2xl border border-1 py-1 ">
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
                <div className="w-full flex flex-col justify-between ">
                  <p className="text-sm text-gray-300">Current Place of Practice</p>
                  <div className="pr-3 placeholder:text-gray-400 text-blue-950  h-fit appearance-none outline-none">
                    Blossom field Hospital
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-5 rounded-2xl border border-1 py-1 ">
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
                <div className="w-full flex flex-col justify-between ">
                  <p className="text-sm text-gray-300">Linkedln URL</p>
                  <div className="pr-3  text-blue-950  h-fit appearance-none outline-none">
                    {' '}
                    Add your URL here{' '}
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-5 rounded-2xl border border-1 py-1 ">
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
                <div className="w-full flex flex-col justify-between ">
                  <p className="text-sm text-gray-300">Years of Practical Experience</p>
                  <div className="pr-3  text-blue-950  h-fit appearance-none outline-none">
                    10 Years
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border relative h-[40rem] w-full border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
            <div className="text-black dark:text-white h-full text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem] justify-between">
              <h4>Specialisations</h4>
              <p className="text-sm font-normal  text-gray-300">
                Gain valuable insights into each specialist's unique skill sets, experience and
                areas of specialisation.
              </p>

              {/* custom-scrollbar  : Removed this*/}
              <div className="overflow-auto h-full w-full ">
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-3 w-full py-5">
                  {focuses.map((i, index) => (
                    <p
                      key={i.id}
                      className={`w-[40%] text-center  hover:bg-shoorah-primary leading-none tracking-tighter hover:border-none  hover:text-white cursor-pointer p-2  text-base border-slate-1000 rounded-3xl border-2 text-gray-400
                ${index % 4 === 2 ? 'ml-14 ' : ''}  ${index % 4 === 1 ? 'mr-14' : ''}`}
                    >
                      {i.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* h-full md:h-[30rem] */}
          <div className="border relative  w-full border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
            <div className="text-black dark:text-white h-full text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem]">
              <div className="flex flex-col gap-[1rem] ">
                <h4>Attachments</h4>
                <p className="text-sm text-gray-300 font-normal ">
                  Efficiently manage & approve specialist attachments with just a few clicks. Dont't
                  forget to review and take action on the attachment.
                </p>
              </div>

              <div className="w-full mt-[2rem] flex gap-5 rounded-2xl border border-1 py-2 ">
                <div className="w-full flex flex-col">
                  <p className="text-sm ml-3 text-gray-300">C.V. Document</p>

                  <div className="w-full flex  ">
                    <div className="flex  pl-3 w-[29px] justify-center  items-center ">
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
                    </div>
                    <button className="">
                      <input
                        type="text"
                        placeholder="Reuben_insure.co"
                        className="pointer-events-none pr-3 ml-3 placeholder:text-blue-950 text-gray-1000 w-full  h-fit appearance-none outline-none"
                      />
                    </button>

                    {/* <p className='text-sm flex gap-[1rem] pr-3 pb-2 self-end  text-gray-300'>
                                            <button className='w-[15px] h-[15px] border hover:bg-red-100 border-3 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[11px] h-[11px]' fill='#3a47ab' viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                            </button>

                                            <button className='w-[15px] h-[15px] border border-3 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[10px] h-[10px]' fill='#3a47ab' viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>

                                            </button>
                                        </p> */}
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-5 rounded-2xl border border-1 py-2 ">
                <div className="w-full flex flex-col">
                  <p className="text-sm ml-3 text-gray-300">
                    Insurance Documents ( no minimum selection )
                  </p>

                  <div className="w-full flex  ">
                    <div className="flex  pl-3 w-[29px] justify-center items-center ">
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
                    </div>
                    <button className="">
                      <input
                        type="text"
                        placeholder="Reuben_insure.co"
                        className=" pointer-events-none pr-3 ml-3 placeholder:text-blue-950 text-gray-1000 w-full  h-fit appearance-none outline-none"
                      />
                    </button>
                    {/* <p className='text-sm flex gap-[1rem] pr-3 pb-2 self-end  text-gray-300'>
                                            <button className='w-[15px] h-[15px] border border-3 hover:bg-red-100 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[11px] h-[11px]' fill='#3a47ab' viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                            </button>

                                            <button className='w-[15px] h-[15px] border border-3 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[10px] h-[10px]' fill='#3a47ab' viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>

                                            </button>
                                        </p> */}
                  </div>

                  <div className="w-full flex  ">
                    <div className="flex  pl-3 w-[29px] justify-center items-center ">
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
                    </div>
                    <button className="">
                      <input
                        type="text"
                        placeholder="Reuben_insure.co"
                        className=" pointer-events-none pr-3 ml-3 placeholder:text-blue-950 text-gray-1000 w-full  h-fit appearance-none outline-none"
                      />
                    </button>
                    {/* <p className='text-sm flex gap-[1rem] pr-3 pb-2 self-end  text-gray-300'>
                                            <button className='w-[15px] h-[15px] border border-3 hover:bg-red-100 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[11px] h-[11px]' fill='#3a47ab' viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                            </button>

                                            <button className='w-[15px] h-[15px] border border-3 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[10px] h-[10px]' fill='#3a47ab' viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>

                                            </button>
                                        </p> */}
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-5 rounded-2xl border border-1 py-2 ">
                <div className="w-full flex flex-col">
                  <p className="text-sm ml-3 text-gray-300">
                    Certification Documents ( no minimum selection )
                  </p>

                  <div className="w-full flex  ">
                    <div className="flex  pl-3 w-[29px] justify-center items-center ">
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
                    </div>
                    <button className="">
                      <input
                        type="text"
                        placeholder="Reuben_insure.co"
                        className="pointer-events-none  pr-3 ml-3 placeholder:text-blue-950 text-gray-1000 w-full  h-fit appearance-none outline-none"
                      />
                    </button>
                    {/* <p className='text-sm flex gap-[1rem] pr-3 pb-2 self-end  text-gray-300'>
                                            <button className='w-[15px] h-[15px] border  hover:bg-red-100 border-3 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[11px] h-[11px]' fill='#3a47ab' viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                            </button>

                                            <button className='w-[15px] h-[15px] border border-3 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[10px] h-[10px]' fill='#3a47ab' viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>

                                            </button>
                                        </p> */}
                  </div>

                  <div className="w-full flex  ">
                    <div className="flex  pl-3 w-[29px] justify-center items-center ">
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
                    </div>
                    <button className="">
                      <input
                        type="text"
                        placeholder="Reuben_insure.co"
                        className="pr-3 ml-3 pointer-events-none  placeholder:text-blue-950 text-gray-1000 w-full  h-fit appearance-none outline-none"
                      />
                    </button>
                    {/* <p className='text-sm flex gap-[1rem] pr-3 pb-2 self-end  text-gray-300'>
                                            <button className='w-[15px] h-[15px] border border-3 hover:bg-red-100 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[11px] h-[11px]' fill='#3a47ab' viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                            </button>

                                            <button className='w-[15px] h-[15px] border border-3 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='w-[10px] h-[10px]' fill='#3a47ab' viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>

                                            </button>
                                        </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right */}
        <div className="flex flex-col py-3 mr-0 sm:mr-8 gap-11 w-full md:w-[50%] md:h-fit">
          <div className="border relative h-full border-gray-300 rounded-3xl  pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
            <div className="text-black h-full  dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem] ">
              <div className="flex justify-between pr-3 ">
                <h4>Personal Bio</h4>
              </div>
              <p className="text-sm text-gray-300 font-normal  h-20">
                Explore specialists bio to gain a deeper understanding of their professional
                journey. While these sections cannot be edited directly admins can request changes
                through messaging feature.
              </p>

              <div className="w-full mt-[2rem] h-[8rem] ">
                <textarea
                  value={
                    'Explore specialists bio to gain a deeper understanding of their professional journey. While these sections cannot be edited directly admins can request changes through messaging feature.'
                  }
                  id="description"
                  name="description"
                  maxLength={2000}
                  placeholder="Enter description..."
                  // style={{
                  //     boxShadow:
                  //         "0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 1px 10px 0 rgba(0, 0, 0, 0.10)",
                  // }}
                  className={` p-5  text-sm  flex    rounded-2xl border border-1 placeholder:text-gray-400 text-gray-700  h-full w-full appearance-none outline-none w-[100%] resize-none break-all `}
                />
              </div>
            </div>
          </div>
          {/* h-full md:h-[23rem] */}
          <div className="border relative  border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
            <div className="text-black h-full dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem]">
              <h4>ID & DBS Check</h4>
              <p className="text-sm text-gray-300">
                Specialists conveniently upload their DBS and ID checks and verifications. While the
                DBS checks require approval from a Shoorah Admin member. The ID verification is
                efficiently handled by a reliable third-party software.
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
                        <desc>User Protection Check Streamline Icon: https://streamlinehq.com</desc>
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
                    <p className="text-sm underline text-center text-gray-300">
                      View file to approve
                    </p>
                    {/* <p className='text-sm flex gap-[1rem] self-end pr-3 text-gray-300 relative p-1 ml-3 '>
                                        <button className='w-[15px] h-[15px] border border-3 hover:bg-red-100 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                            <svg xmlns="http://www.w3.org/2000/svg" className='w-[11px] h-[11px]' fill='#3a47ab' viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                        </button>

                                        <button className='w-[15px] h-[15px] border border-3 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                            <svg xmlns="http://www.w3.org/2000/svg" className='w-[10px] h-[10px]' fill='#3a47ab' viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>

                                        </button>
                                        </p> */}
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
                  <div className=" flex justify-evenly  ">
                    <p className="text-sm underline text-center text-gray-300">
                      Thid party confirmed
                    </p>
                    {/* <p className='text-sm flex gap-[1rem] self-end pr-3 text-gray-300 relative p-1 ml-3 '>
                                        <button className='w-[15px] h-[15px] border border-3 hover:bg-red-100  border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                            <svg xmlns="http://www.w3.org/2000/svg" className='w-[11px] h-[11px]' fill='#3a47ab' viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                                        </button>

                                        <button className='w-[15px] h-[15px] border   border-3 border-shoorah-primary flex justify-center items-center rounded-[5px] '>
                                            <svg xmlns="http://www.w3.org/2000/svg" className='w-[10px] h-[10px]' fill='#3a47ab' viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>

                                        </button>
                                        </p> */}
                  </div>
                </div>
              </div>

              <div className=" hover:bg-blue-500  hover:text-white    w-full flex justify-center gap-2 h-[3rem]  rounded-3xl border border-gray-300 ">
                <button className="text-xl">View Intro Video</button>
              </div>
            </div>
          </div>

          <div className="border relative h-[30rem] border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
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

          <div className="border relative h-[15rem] border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
            <div className="text-black h-full dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem]">
              <h4>Pricing Details</h4>
              <p className="text-sm font-normal  text-gray-300">
                Specialists can suggest a ( 30 min ) sessions pricing which needs to approved here
                by the shoorah admin member.
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
          {/* h-[10rem] */}
          {/* <div className="border relative  border-gray-300 rounded-3xl pt-6 pb-6 pr-8 pl-8 bg-white dark:bg-shoorah-darkBgTabColor dark:border-none dark:text-white ">
                        <div className="text-black h-full dark:text-white text-lg lg:text-xl font-medium p-2 mb-4 w-full flex flex-col gap-[1rem]">
                            <h4>Public Pricing</h4>

                            <div className='flex justify-between '>
                                <button className='bg-gray-300 text-sm px-8 py-3 rounded-full hover:bg-shoorah-secondary hover:text-white'>
                                        ￡80
                                </button>
                                <button className='bg-gray-300 text-sm px-8 py-3 rounded-full hover:bg-shoorah-secondary hover:text-white'>
                                ￡100
                                </button>
                            </div> */}
        </div>
      </div>
    </div>
  );
};

export default MySpecialistProfile;

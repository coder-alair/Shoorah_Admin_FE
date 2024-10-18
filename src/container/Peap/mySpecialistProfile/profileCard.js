import React from 'react';

const ProfileCard = () => {
  return (
    <div className="h-[50rem] w-full md:h-full">
      <div className="flex flex-col md:flex-row gap-[2rem] h-full px-8 items-center">
        <div className="rounded-xl bg-shoorah-primary aspect-square w-full md:h-[10rem] md:w-[10rem] "></div>

        <div className="rounded-xl md:pl-3 h-[18rem] w-full">
          <p className="text-xl mt-5">Personal Details</p>

          <div className="rounded-xl mt-8 flex flex-col md:flex-row justify-around gap-4 items-end w-full">
            <div className="rounded-xl text-shoorah-gray2 flex flex-col justify-around gap-5 h-[10rem] w-full">
              <div className="rounded-xl flex items-center gap-[1rem]  w-full">
                <label className="w-[5rem] sm:w-[7rem] text-shoorah-gray2 pt-1">Title</label>
                <input
                  type="text"
                  placeholder="Mr."
                  className="w-[5rem] placeholder:text-shoorah-gray2 text-gray-700 border border-gray-200 h-fit appearance-none outline-none py-2 rounded-xl pl-3"
                />
              </div>

              <div className="rounded-xl  flex items-center gap-[1rem]  w-full">
                <label className="w-[7rem] text-shoorah-gray2 leading-tight pt-1">First Name</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  className="w-full md:w-[15rem] placeholder:text-gray-400 text-gray-600 border border-gray-200 h-fit appearance-none outline-none py-2 rounded-xl pl-3"
                />
              </div>

              <div className="rounded-xl flex items-center gap-[1rem]  w-full">
                <label className="w-[7rem] leading-tight text-shoorah-gray2 pt-1">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter Rix"
                  className="w-full md:w-[15rem] placeholder:text-shoorah-gray2 text-gray-600 border border-gray-200 h-fit appearance-none outline-none py-2 rounded-xl pl-3"
                />
              </div>
            </div>

            <div className="rounded-xl flex md:h-[10rem] w-full">
              <div className="rounded-xl flex flex-col mt-3 md:mt-0 md:justify-end gap-5 h-[10rem] w-full">
                <div className="rounded-xl flex  items-center gap-[1rem]  w-full">
                  <label className="w-[6rem] text-shoorah-gray2 pt-1">Location</label>
                  <input
                    type="text"
                    placeholder="Enter Location"
                    className="w-full md:w-[15rem]  placeholder:text-shoorah-gray2 text-gray-600 border border-gray-200 h-fit appearance-none outline-none py-2 rounded-xl pl-3"
                  />
                </div>

                <div className="rounded-xl flex items-center gap-[1rem]  w-full">
                  <label className="w-[6rem] text-shoorah-gray2 pt-1">DOB</label>
                  <input
                    type="text"
                    placeholder="Enter DOB"
                    className="w-full md:w-[15rem] placeholder:text-shoorah-gray2 text-gray-600 border border-gray-200 h-fit appearance-none outline-none py-2 rounded-xl pl-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

import { Api } from '../../../api';
import { useEffect, useRef, useState } from 'react';
import ProfileImage from '../../../assets/images/reuben-hale.png';
import { GENDER } from '../../../utils/constants';
import DemoVideo from '../../../assets/video/demo.mp4';
const PeapProfileDailog = ({ onClose, expertId }) => {
  const [profileData, setProfileData] = useState(null);
  const [showAllExperience, setShowAllExperience] = useState(false);
  const [showAllCertification, setShowAllCertification] = useState(false);

  const [showTooltipExperience, setShowTooltipExperience] = useState(false);
  const [showTooltipCertification, setShowTooltipCertification] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileData.linkedln_url);
      setTooltipVisible(true);
      setTimeout(() => setTooltipVisible(false),1000); 
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy LinkedIn URL.');
    }
  };

  const fetchProfileData = async (expertId) => {
    console.log('inside fetchProfileData', expertId);

    if (!expertId) return; // Don't fetch if no expertId

    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const response = await Api.getAccountInfo(expertId); // Await the API call
      console.log('🚀 ~ fetchProfileData ~ response', response?.data?.data);

      setProfileData(response?.data?.data);
    } catch (err) {
      console.error('Error fetching profile data:', err); // Log the error for debugging
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData(expertId);
  }, []);
  const formatDate = (isoDate) => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };
  const [videoUrl, setVideoUrl] = useState('');
  const handleProfileClick = () => {
    // Assuming profileData has a video_url property
    setVideoUrl(profileData?.video_url);
  };

  const getGenderName = (value) => {
    const genderItem = GENDER.find((g) => g.value === value);
    return genderItem ? genderItem.name : 'Not specified'; // Default if not found
  };

  const genderValue = profileData?.user_id?.gender[0];
  console.log('🚀 ~ PeapProfileDailog ~ profileData:', profileData);
  console.log('🚀 ~ PeapProfileDailog ~ profileData?.video_url:', profileData?.video_url);

  return (
    <div
      className="profile-popup fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5"
      onClick={onClose}
    >
      <div
        className="bg-white overflow-y-auto max-h-full rounded-3xl shadow-lg p-4 xl:p-6 lg:max-w-[80%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <button
          className="text-gray-500 hover:text-gray-700 text-xl absolute top-6 right-6 leading-none"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="text-2xl md:text-4xl font-medium text-[#0B1D2E] tracking-wide">
          {profileData?.user_id?.name}
        </div>
        <div className="text-shoorah-gray1 text-lg md:text-xl font-normal font-['Work Sans'] leading-[33.59px] mb-6">
          Showing account information for {profileData?.user_id?.name}
        </div>
        {/* 6 columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4 xl:gap-6 items-center mb-6 xl:mb-8">
          <div className="row-span-3 xl:row-span-2 h-full">
            {/* <img className="w-full h-full object-cover rounded-2xl" src={ProfileImage} alt="profile" /> */}
            <img
              loading='lazy'
              className="w-full h-full max-h-[300px] lg:max-h-[193px] object-cover rounded-2xl"
              src={profileData?.user_profile}
              alt="profile"
            />
          </div>
          <div className="flex items-center row-span-3 xl:row-span-2 h-full max-h-[300px] lg:max-h-[193px] rounded-2xl bg-black overflow-hidden">
            {profileData?.video_url ? (
              <video width="100%" height="100%" controls autoPlay muted loop>
                <source src={profileData.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-white">No video available</p>
            )}
          </div>
          <div className="col-span-1 justify-end headlessui-portal-rootitems-start">
            <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] leading-[14.50px] pb-1">
              Title & name
            </div>
            <input
              type="text"
              className="bg-white text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9] truncate"
              value={profileData?.user_id?.name}
              disabled
            />
          </div>
          <div className="col-span-1 justify-end items-start">
            <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] leading-[14.50px] pb-1">
              Date of birth
            </div>

            <input
              type="text"
              className="bg-white text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9] truncate"
              value={formatDate(profileData?.user_id?.dob)}
              disabled
            />
          </div>
          <div className="col-span-1 justify-end items-start">
            <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] leading-[14.50px] pb-1">
              Gender
            </div>
            <input
              type="text"
              className="bg-white text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9] truncate"
              value={getGenderName(genderValue)}
              disabled
            />
          </div>
          <div className="col-span-1  justify-end items-start">
            <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] leading-[14.50px] pb-1">
              Ethnicity
            </div>
            <input
              type="text"
              className="bg-white text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9] truncate"
              value={profileData?.user_id?.ethnicity}
              disabled
            />
          </div>
          <div className="col-span-1 justify-end items-start">
            <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] leading-[14.50px] pb-1">
              Location
            </div>
            <input
              type="text"
              className="bg-white text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9] truncate"
              value={profileData?.location}
              disabled
            />
          </div>
        </div>
        {/* 2 columns  */}
        {/* <div className="sm:grid sm:grid-cols-2 gap-4 mt-10">
          <div className="col-span-1 w-[621px] h-[473px] bg-white rounded-[10px] border border-[#d9d9d9]">
            <div className="sm:grid sm:grid-cols-2 gap-2 my-7">
              <div className="col-span-1">
                <div className="text-black text-sm font-normal font-['Work Sans'] leading-[14.50px]">
                  Industry Experience:
                </div>
                <div className="text-black text-sm font-normal font-['Work Sans'] leading-[14.50px]">
                  Industry Experience:
                </div>
              </div>
              <div className="col-span-1">
                <div className="text-black text-sm font-normal font-['Work Sans'] leading-[14.50px]">
                  Industry Experience:
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 justify-between  flex flex-col h-full">
            <div className="w-[165px] opacity-50 text-black text-sm font-normal font-['Work Sans'] leading-[14.50px]">
              Title & name
            </div>
            <input
              type="text"
              className="w-full h-[66px] bg-white rounded-[10px] border border-[#d9d9d9] p-2"
              placeholder="Input 1"
            />
          </div>
        </div> */}
        <div className="grid lg:grid-cols-2 gap-4 xl:gap-8">
          <div className="left">
            <p className="mb-3 text-black opacity-50 text-sm">Professional Experience</p>
            <div className="grid md:grid-cols-2 gap-[20px] border rounded-xl border-[#D9D9D9] p-5 lg:max-h-[500px] lg:h-full lg:overflow-y-auto">
              {/* <div>
                <p className="text-black text-sm">Industry Experience: </p>
              </div> */}
              {/* <div>
                <p className="text-black text-sm">Industry Experience:</p>
                <p className="text-black text-sm">
                  {showAllExperience ? (
                    <span className="font-medium">
                      {profileData?.industry_experience.join(', ') || 'N/A'}
                    </span>
                  ) : profileData?.industry_experience?.length > 1 ? (
                    <>
                      <span className="font-medium">
                        {profileData.expertAccountInfo.industry_experience.slice(0, 1).join(', ')}
                        ...
                      </span>
                      <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => setShowAllExperience(true)}
                      >
                        read more
                      </span>
                    </>
                  ) : (
                    <span className="font-medium">
                      {profileData?.expertAccountInfo?.industry_experience[0] || 'N/A'}
                    </span>
                  )}
                </p>
              </div> */}

              {/*  */}
              <div>
                <p className="text-black text-sm">Industry Experience:</p>
                {profileData?.industry_experience?.length > 0 ? (
                  <>
                    <span className="font-medium">
                      {profileData?.industry_experience.slice(0, 4).map((experience, index) => (
                        <span key={index} className="text-black text-sm">
                          {experience}
                          {index < 3 && <br />}{' '}
                          {/* Add a line break between items except after the last one */}
                        </span>
                      ))}
                      {profileData?.industry_experience.length > 4 && (
                        <span
                          className="text-black text-sm cursor-pointer"
                          onMouseEnter={() => setShowTooltipExperience(true)} // Set to true on hover
                          onMouseLeave={() => setShowTooltipExperience(false)} // Set to false on mouse leave
                        >
                          ...
                        </span>
                      )}
                    </span>
                    {showTooltipExperience && (
                      <div className="tooltip">
                        <p>{profileData?.industry_experience.join(', ')}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="font-medium">N/A</span>
                )}
              </div>
              <div>
                <p className="text-black text-sm">Years of experience:</p>
                <p className="text-black text-sm">
                  <span className="font-medium">{profileData?.year_of_experience}</span>
                </p>
              </div>
              {/* <div>
                <p className="text-black text-sm">Highest level of certification:</p>
              </div> */}
              {/* <div>
                <p className="text-black text-sm">Highest level of certification:</p>
                <p className="text-black text-sm">
                  {showAllCertification ? (
                    <span className="font-medium">
                      {profileData?.expertAccountInfo?.highest_certification.join(', ') || 'N/A'}
                    </span>
                  ) : profileData?.expertAccountInfo?.highest_certification?.length > 0 ? (
                    <>
                      <span className="font-medium">
                        {profileData.expertAccountInfo.highest_certification[0]}...
                      </span>
                      <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => setShowAllCertification(true)}
                      >
                        read more
                      </span>
                    </>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div> */}

              {/* <div>
                <p className="text-black text-sm">Highest level of certification:</p>
       

                  {profileData?.expertAccountInfo?.highest_certification?.length > 0 ? (
                    <>
                      <span className="font-medium">
                        {profileData.expertAccountInfo.highest_certification[0]}

                        {profileData.expertAccountInfo.highest_certification.length > 4 && (

                          <span
                            className="text-blue-500 cursor-pointer"
                            onMouseEnter={() => setShowTooltipCertification(true)}
                            onMouseLeave={() => setShowTooltipCertification(false)}
                          >
                            ...
                          </span>
                        )}
                      </span>
                      {showTooltipCertification && (
                        <div className="tooltip">
                          <p>{profileData.expertAccountInfo.highest_certification.join(', ')}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="font-medium">N/A</span>
                  )}
                <p className="text-black text-sm">Highest level of certification:</p>
                <p className="text-black text-sm">
              
                {profileData?.expertAccountInfo?.highest_certification ? (
                    profileData.expertAccountInfo.highest_certification.map((experience, index) => (
                      <p key={index} className="text-black text-sm">
                        {experience}
                      </p>
                    ))
                  ) : (
                    <p className="text-black text-sm">No Highest  certification available.</p>
                  )}
                </p>
              </div> */}
              {/* <div>
                <p className="text-black text-sm">Highest level of certification:</p>
                {profileData?.expertAccountInfo?.highest_certification?.length > 0 ? (
                  <>
                    <span className="font-medium">
                      {profileData.expertAccountInfo.highest_certification
                        .slice(0, 4)
                        .map((experience, index) => (
                          <p key={index} className="text-black text-sm">
                            {experience}
                          </p>
                        ))}
                      {profileData.expertAccountInfo.highest_certification.length > 4 && (
                        <span
                          className="text-blue-500 cursor-pointer"
                          onMouseEnter={() => setShowTooltipCertification(true)}
                          onMouseLeave={() => setShowTooltipCertification(false)}
                        >
                          ...
                        </span>
                      )}
                    </span>
                    {showTooltipCertification && (
                      <div className="tooltip">
                        <p>{profileData.expertAccountInfo.highest_certification.join(', ')}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="font-medium">N/A</span>
                )}
              </div> */}
              <div>
                <p className="text-black text-sm">Highest level of certification:</p>
                {profileData?.highest_certification?.length > 0 ? (
                  <>
                    <span className="font-medium">
                      {profileData?.highest_certification.slice(0, 4).map((experience, index) => (
                        <span key={index} className="text-black text-sm">
                          {experience}
                          {index < 3 && <br />}{' '}
                          {/* Add a line break between items except after the last one */}
                        </span>
                      ))}
                      {profileData?.highest_certification.length > 4 && (
                        <span
                          className="text-black text-sm cursor-pointer"
                          onMouseEnter={() => setShowTooltipCertification(true)}
                          onMouseLeave={() => setShowTooltipCertification(false)}
                        >
                          ...
                        </span>
                      )}
                    </span>
                    {showTooltipCertification && (
                      <div className="tooltip">
                        <p>{profileData?.highest_certification.join(', ')}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="font-medium">N/A</span>
                )}
              </div>

              <div>
                <p className="text-black text-sm">Specialties:</p>
                <p className="text-black text-sm">
                  <span className="font-medium">{profileData?.specialities}</span>
                </p>
              </div>
              <div>
                <p className="text-black text-sm">Qualifications:</p>
                <p className="text-black text-sm">
                  <span className="font-medium">{profileData?.qualification}</span>
                </p>
              </div>
              <div>
                <p className="text-black text-sm">Availability:</p>
                <p className="text-black text-sm">
                  <span className="font-medium">
                    {profileData?.availibility || 'Not specified'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-black text-sm">Languages:</p>
                <p className="text-black text-sm">
                  <span className="font-medium">
                    {profileData?.spoken_languages[0] || 'Not specified'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-black text-sm">Price per hour:</p>
                <p className="text-black text-sm">
                  <span className="font-medium">
                    {profileData?.price_per_hour || 'Not specified'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-black text-sm">Current job title:</p>
                <p className="text-black text-sm">
                  <span className="font-medium">
                    {profileData?.current_job_titile || 'Not specified'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-black text-sm">Medical ID number:</p>
                <p className="text-black text-sm">
                  <span className="font-medium">{profileData?.medical_no || 'Not specified'}</span>
                </p>
              </div>
              <div>
                <p className="text-black text-sm">Place of education:</p>
                <p className="text-black text-sm">
                  <span className="font-medium">
                    {profileData?.place_of_education || 'Not specified'}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-black text-sm">Place of practice:</p>
                <p className="text-black text-sm">
                  <span className="font-medium">
                    {profileData?.location_of_practice || 'Not specified'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="grid md:grid-cols-3 gap-4 xl:gap-6 mb-8">
              <div className="">
                <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] mb-3">
                  DBC Document
                </div>
                <a
                  href={profileData?.documents[0]?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9] block text-center"
                >
                  View file
                </a>
              </div>
              <div className="">
                <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] mb-3">
                  ID Status
                </div>
                <input
                  type="text"
                  className="bg-[#C2EC97] text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9] truncate"
                  value="Verified"
                  disabled
                />
              </div>
              {/* <div className="">
                <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] mb-3">
                  Linkedin URL
                </div>
                <input
                  type="text"

                  className="bg-white text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9] truncate"
                  value={profileData?.linkedln_url}

                  disabled
                />
              </div> */}

              <div>
                <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] mb-3">
                  LinkedIn URL
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="bg-white text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9] truncate cursor-pointer focus:outline-none"
                    value={profileData?.linkedln_url}
                    onClick={copyToClipboard} 
                    // disabled
                    readOnly 

                  />
                  {tooltipVisible && (
                    <div className="absolute left-0 top-full mt-1 bg-gray-700 text-white text-sm rounded px-2 py-1">
                      LinkedIn URL copied!
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] leading-[14.50px] pb-1">
                Personal bio
              </div>
              <textarea
                className="bg-white text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9]"
                name=""
                id=""
                value={profileData?.bio}
                disabled
              ></textarea>
            </div>
            <div className="">
              <div className="opacity-50 text-black text-sm font-normal font-['Work Sans'] leading-[14.50px] pb-1">
                Why they want to join PEAP?
              </div>
              <textarea
                className="bg-white text-sm font-medium rounded-[10px] text-black px-5 py-6 w-full leading-none border border-[#d9d9d9]"
                name=""
                id=""
                value={profileData?.reason_to_join}
                disabled
              ></textarea>
            </div>
          </div>
        </div>

        {/* Modal Content */}
      </div>
    </div>
  );
};

export default PeapProfileDailog;

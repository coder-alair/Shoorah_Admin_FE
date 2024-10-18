import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurveyContext } from '../../context/PreviewSurveyContext';
import { PencilSquareIcon, TrashIcon, EyeIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { Api } from '../../api';
import {
  successToast,
  errorToast,
  getUserType,
  isSuperAdmin,
  isSuperAndSubAdmin
} from '../../utils/helper';
import { getPathForSurvey, surveyNavigate } from '../../utils/helper';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../assets/css/index.css';
import altImg from '../../assets/images/alt-img.jpeg';

const Carousel = ({ data, onRefetch }) => {
  const navigate = useNavigate();
  const [meta, setMeta] = useState(false);
  const { surveyMeta, setSurveyMeta } = useContext(SurveyContext);

  const userData = JSON.parse(localStorage.getItem('userData'));
  const userType = getUserType(userData?.userType);
  const userId = userData?.id;
  const isUserSuperOrSubAdmin = userType === 'Super Admin' || userType === 'Sub Admin';
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (surveyMeta && meta)
      navigate(getPathForSurvey('/pulse-survey/add-edit-survey?preview=true'));
  }, [meta]);

  function handleDeleteApi(id) {
    Api.deletePulseSurvey(id).then((response) => {
      if (response?.data?.meta?.code === 1) {
        onRefetch && onRefetch();
        successToast(response?.data?.meta?.message);
      } else if (response?.data?.meta?.code === 0) {
        errorToast(response?.data?.meta?.message);
      }
    });
  }



  function handleEdit(id, isEdit) {
    if (isEdit === "editTemplate") {
      const baseUrl = `/pulse-survey/add-edit-survey?tempId=${id}`;
      surveyNavigate(baseUrl, navigate);
    }
    if (isEdit === "createSurvey") {
      const baseUrl = `/pulse-survey/add-edit-survey?surveyFromTemplate=${id}`;
      surveyNavigate(baseUrl, navigate);
    }
    if (isEdit === "preview") {
      const baseUrl = `/view-survey/${id}`;
      // const baseUrl = `/pulse-survey/add-edit-survey?tempId=${id}&preview=true`;
      surveyNavigate(baseUrl, navigate);
    }

    setShowModal(false);

  }
  const handleOptionSelect = (option) => {
    const baseUrl = `/pulse-survey/add-edit-survey?id=${selectedItem?.id}&template=${userData?.userType}`;
    let url;
    if (option === 'edit') {
      url = (userData?.userType === 3 || userData?.userType === 4) ? baseUrl : `${baseUrl}&editTemplate=true`;
    } else if (option === 'create') {
      url = `${baseUrl}&createSurvey=true`;
    }
    surveyNavigate(url, navigate);
    setShowModal(false);
  };

  function getConditionForEditDelete(createdBy, id) {
    return isUserSuperOrSubAdmin
      ? true
      : String(createdBy).toLowerCase().includes('company') || id === userId;
  }

  const settings = {
    dots: true,
    speed: 500,
    infinite: false,
    slidesToScroll: 1,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  };

  if (data.length === 0)
    return <div className="mt-5 text-center dark:text-white">No Templates Found</div>;

  return (
    <Fragment>
      <Slider {...settings} nextArrow={false} prevArrow={false}>
        {data?.map((item, i) => {
          const isEdit = getConditionForEditDelete(item?.createdBy?.name, item?.id);
          console.log('data', item);
          return (
            <div key={item._id}>
              <div className={'gap-4 group px-4 flex flex-col relative'}>
                <div className="absolute shadow-md hidden group-hover:flex top-[2px] right-[2px] px-2  py-2 mx-4 text-white bg-shoorah-navyblue rounded-xl flow-col gap-4">
                  <div className="cursor-pointer">

                  </div>
                  {
                    <>
                      {isSuperAndSubAdmin() && (
                        <div className="cursor-pointer">
                          <PencilSquareIcon
                            width={20}
                            onClick={() => handleEdit(item.id, "editTemplate")}
                            title="Edit this template"
                          />
                        </div>
                      )}
                      <div className="cursor-pointer">
                        <DocumentDuplicateIcon
                          width={20}
                          onClick={() => handleEdit(item.id, "createSurvey")}
                          title="Create Survey using this template"
                        />
                      </div>
                      <div className="cursor-pointer">
                        <EyeIcon
                          width={20}
                          onClick={() => handleEdit(item.id, "preview")}
                          title="Preview template"
                        />
                      </div>


                      {isSuperAndSubAdmin() && (
                        <div className="cursor-pointer">
                          <TrashIcon
                            width={20}
                            onClick={() => handleDeleteApi(item.id)}
                            title="Delete this template"
                          />
                        </div>
                      )}
                    </>
                  }
                </div>
                <img
                  src={item?.surveyLogo || item?.surveyImage || altImg}
                  alt=""
                  loading='lazy'
                  className={'rounded-xl border-2 max-h-[300px] object-cover'}
                  style={{
                    borderColor:
                      (i + 1) % 2 === 0
                        ? 'rgb(235 235 237 / var(--tw-text-opacity))'
                        : 'rgb(49 59 107 / var(--tw-bg-opacity))'
                  }}
                />

                {item?.survey_category && (
                  <div
                    className={
                      i % 2 === 0
                        ? 'bg-shoorah-primary py-2 px-6 rounded-xl  text-white w-max text-sm'
                        : 'bg-shoorah-navyblue py-2 px-6 rounded-xl  text-white w-max text-sm'
                    }
                  >
                    {item?.survey_category}
                  </div>
                )}
                <p className="font-bold px-1  text-base dark:text-white">
                  {item?.surveyTitle || 'N/A'}
                </p>
              </div>
            </div>
          );
        })}
      </Slider>
    </Fragment>
  );
};

export default Carousel;

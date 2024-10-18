import React, { useEffect } from 'react';
import { useState } from 'react';
import Breadcrumb from '../../../component/common/Breadcrumb';
import SelectMenu from '../../../component/common/SelectMenu';
import dummyImage from '../../../assets/images/dummyBook.png';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { CONTENT_TYPE } from '../../../utils/constants';
import PrimaryButton from '../../../component/common/Buttons/PrimaryButton';
import SecondaryButton from '../../../component/common/Buttons/SecondaryButton';
import { Api } from '../../../api';
import Loader from '../../../component/common/Loader';
import { errorToast, successToast } from '../../../utils/helper';
import { useLocation, useNavigate } from 'react-router-dom';

const position = [
  { name: '1st Place', value: 1 },
  { name: '2nd Place', value: 2 },
  { name: '3rd Place', value: 3 }
];
export default function AddEditTopPicks(props) {
  const navigate = useNavigate();
  let location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState({
    pickId: '',
    contentType: '',
    content: '',
    position: ''
  });
  const [loader, setLoader] = useState(false);
  const [content, setContent] = useState([{ name: 'select content', value: '' }]);
  const [preview, setPreview] = useState({});
  const [pages, setPages] = useState([
    { name: 'Top Picks', href: '/content-management/top-picks' },
    { name: 'Add Top Pick', href: '/content-management/top-picks/add-edit' }
  ]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    const payload = {
      pickId: selectedMenu.pickId,
      contentType: selectedMenu.contentType.value,
      contentTypeId: selectedMenu.content.value,
      position: selectedMenu.position.value
    };
    Api.addTopPick(payload).then((response) => {
      if (response.data.meta.code === 1) {
        setLoader(false);
        successToast(response.data.meta.message);
        navigate('/content-management/top-picks');
      } else if (response.data.meta.code === 0) {
        setLoader(false);
        errorToast(response.data.meta.message);
      } else {
        setLoader(false);
      }
    });
  };

  const handleMenuChange = (type, menu) => {
    setSelectedMenu({
      ...selectedMenu,
      [type]: menu
    });
  };

  useEffect(() => {
    if (location?.state) {
      setPages([
        { name: 'Top Picks', href: '/content-management/top-picks' },
        {
          name: 'Edit Top Pick',
          href: '/content-management/top-picks/add-edit'
        }
      ]);
      let propsData = location?.state;
      setLoader(true);
      Api.getTopPicksList('', '', '', propsData.id).then((response) => {
        if (response?.data?.meta?.code === 1) {
          const topPicksData = response.data.data[0];
          Api.getAllContentType(topPicksData.content_type).then((response) => {
            setLoader(false);
            const tempContentArray = response.data.data.map((item) => {
              return { name: item.disPlayName, value: item.id, ...item };
            });
            setSelectedMenu({
              pickId: topPicksData.id,
              contentType: CONTENT_TYPE.filter(
                (user) => user.value === topPicksData.content_type
              )?.[0],
              content: tempContentArray.find(
                (item) => item.value === topPicksData.content_type_id._id
              ),
              position: position.find((item) => item.value === topPicksData?.position)
            });
            setContent([{ name: 'select content', value: '' }, ...tempContentArray]);
          });
        } else if (response?.code === 401) {
          setLoader(false);
          errorToast(response?.message);
        } else if (response?.data?.meta?.code === 0) {
          setLoader(false);
          errorToast(response?.data?.meta?.message);
        } else {
          setLoader(false);
        }
      });
    }
  }, [location?.state]);

  const handleContentTypes = (contentTypeId) => {
    setLoader(true);
    Api.getAllContentType(contentTypeId).then((response) => {
      setLoader(false);
      const tempContentArray = response.data.data.map((item) => {
        return { name: item.disPlayName, value: item.id, ...item };
      });
      setContent([{ name: 'select content', value: '' }, ...tempContentArray]);
    });
  };

  useEffect(() => {
    if (selectedMenu.contentType?.value) {
      handleContentTypes(selectedMenu.contentType?.value);
    }
  }, [selectedMenu.contentType]);

  const handlePreview = () => {
    const found = content?.find((element) => element.id === selectedMenu?.content?.value);
    setPreview(found);
  };

  useEffect(() => {
    handlePreview();
  }, [selectedMenu.content]);
  return (
    <>
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        {location?.state ? (
          <title>Edit Top Pick | Shoorah Admin</title>
        ) : (
          <title>Add Top Pick | Shoorah Admin</title>
        )}
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div>
        <div className="px-4 sm:px-6 py-10 rounded-[10px] bg-white mt-6">
          <form className="mx-auto 2xl:w-[80%]" onSubmit={handleSubmit}>
            <div className="grid content-center lg:gap-20 2xl:gap-40 lg:grid-cols-2">
              <div className="space-y-6 mr-14 w-full">
                <div>
                  <SelectMenu
                    menuList={CONTENT_TYPE}
                    label="Select Content Type"
                    defaultSelected={selectedMenu.contentType}
                    setSelectedMenu={(menu) => handleMenuChange('contentType', menu)}
                  />
                  {/* <span className='error text-xs text-red-400'>{error.selectedMenu}</span> */}
                </div>
                <div>
                  <SelectMenu
                    menuList={content}
                    label="Select Content "
                    defaultSelected={selectedMenu.content}
                    setSelectedMenu={(menu) => handleMenuChange('content', menu)}
                  />
                  {/* <span className='error text-xs text-red-400'>{error.selectedMenu}</span> */}
                </div>
                <div>
                  <SelectMenu
                    menuList={position}
                    label="Select Position"
                    defaultSelected={selectedMenu.position}
                    setSelectedMenu={(menu) => handleMenuChange('position', menu)}
                  />
                  {/* <span className='error text-xs text-red-400'>{error.selectedMenu}</span> */}
                </div>
              </div>
              <div className="space-y-6 w-full lg:mt-0 mt-6 rounded-md bg-[#F6F6F6] p-5">
                <div>
                  <p className="font-semibold">Preview</p>
                </div>
                <div>
                  <p>Content text </p>
                  <p className="text-[#A1A1A1]">
                    {preview?.disPlayName ? preview?.disPlayName : 'content title'}
                  </p>
                </div>
                {selectedMenu?.contentType?.value !== 1 && preview?.focus_ids?.length > 0 ? (
                  <div>
                    <p>Focuses </p>
                    {preview?.focus_ids?.map((item, index) => {
                      return (
                        <p className="text-[#A1A1A1] inline" key={index}>
                          {item.display_name},&nbsp;
                        </p>
                      );
                    })}
                  </div>
                ) : null}
                <div className="max-w-[160px]">
                  <img src={dummyImage} loading='lazy' alt={'dummy-img'} />
                </div>
              </div>
            </div>
            <div className="text-right mt-10">
              <SecondaryButton btnText="Cancel" btnType="button" />
              <PrimaryButton btnText="Save" btnType="submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

AddEditTopPicks.propTypes = {
  location: PropTypes.any
};

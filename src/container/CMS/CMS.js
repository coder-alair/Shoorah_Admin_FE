import { useEffect, useState } from 'react';
import Breadcrumb from '../../component/common/Breadcrumb';
import Table from '../../component/common/Table';
import { Api } from '../../api';
import Pagination from '../../component/common/Pagination/Pagination';
import { errorToast, successToast } from '../../utils/helper';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import AddCmsValidation from '../../validation/AddCmsValidation';
import Loader from '../../component/common/Loader';

const pages = [{ name: 'CMS', href: '/cms', current: true }];

const columns = [
  {
    title: 'Title',
    key: 'title',
    sortable: false,
    type: 'text',
    align: 'left'
  },
  {
    title: '',
    key: 'action',
    type: 'action',
    align: 'right',
    isView: '/cms/edit-view',
    isEdit: '/cms/edit-view',
    isDelete: true
  }
];

const PAGE_SIZE = 10;
function CMS() {
  const [loader, setLoader] = useState(true);
  const [CMSList, setCMSList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [cmsData, setCmsData] = useState({
    title: '',
    alias: ''
  });

  const [valid, setValid] = useState({});
  const [refresh, setRefresh] = useState(1);

  const handlePagination = (pageNumber, pageSize, searchKey) => {
    setLoader(true);
    Api.getCMSList(pageNumber, pageSize, searchKey).then((response) => {
      if (response?.data?.meta?.code === 1) {
        setCurrentPage(pageNumber);
        setCMSList(response?.data?.data);
        setTotalCount(response?.data?.data?.totalRecords);
        setLoader(false);
      } else if (response?.data?.meta?.code === 0) {
        setCurrentPage(1);
        setCMSList([]);
        setTotalCount(0);
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  useEffect(() => {
    handlePagination(1, PAGE_SIZE, '');
  }, [refresh]);

  const deleteHandler = (id) => {
    setLoader(true);
    Api.deleteCMS(id).then((response) => {
      if (response?.data?.meta?.code === 1) {
        handlePagination(1, PAGE_SIZE, '');
        successToast(response?.data?.meta?.message);
      } else if (response?.data?.meta?.code === 0) {
        setLoader(false);
        errorToast(response?.data?.meta?.message);
      } else {
        setLoader(false);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCmsData({ ...cmsData, [name]: value });
  };

  useEffect(() => {
    let alias = cmsData?.title?.replaceAll(' ', '-').toLowerCase();
    setCmsData({ ...cmsData, alias });
  }, [cmsData.title]);

  // handlers
  const handleSubmit = () => {
    const validate = AddCmsValidation(cmsData);
    setValid({
      ...valid,
      isSubmit: true,
      errors: validate.errors,
      isValid: validate.isValid
    });

    let payload = {
      title: cmsData.title,
      alias: cmsData.alias
    };

    if (validate.isValid) {
      setLoader(true);
      Api.addEditCMS(payload).then((response) => {
        if (response?.data?.meta?.code === 1) {
          successToast(response?.data?.meta?.message);
          setShow(false);
          setCmsData({
            title: '',
            alias: ''
          });
          setValid({ ...valid, errors: {} });
          setRefresh(refresh + 1);
          setLoader(false);
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
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>CMS | Shoorah Admin</title>
      </Helmet>
      {loader ? <Loader /> : null}

      <Breadcrumb pageList={pages} />

      {show && (
        <div className="fixed inset-0 w-screen z-40 h-screen bg-black/25 flex justify-center items-center">
          <div className="bg-white dark:bg-shoorah-darkBgColor dark:border-none dark:text-white w-[95vw]  lg:w-[40vw]  border pt-0 border-[#F1F2F4] rounded-2xl overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-shoorah-primary to-shoorah-secondary py-2 px-4 text-white flex items-center justify-between">
              <h4 className="font-semibold text-base">Add CMS</h4>

              <span
                onClick={() => {
                  setShow(false);
                  setCmsData({
                    title: '',
                    alias: ''
                  });
                  setValid({ ...valid, errors: {} });
                }}
                className="font-semibold text-lg cursor-pointer"
              >
                X
              </span>
            </div>
            <div className="px-4">
              <div className="flex flex-col justify-between mt-3">
                <label
                  className="text-md dark:text-white block my-1 font-medium text-gray-700"
                  htmlFor="title"
                >
                  CMS Title <span className={` text-red-400`}>&#42;</span>
                </label>
                <input
                  className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4]  rounded-[3rem] h-10 px-4"
                  type="text"
                  value={cmsData.title}
                  id="title"
                  name="title"
                  onChange={handleChange}
                  placeholder="Enter CMS Title"
                />
                {valid.isSubmit && valid?.errors?.title && (
                  <span className="text-sm text-red-700">{valid?.errors?.title}</span>
                )}
              </div>
              <div className="flex flex-col justify-between  mt-3">
                <label
                  className="text-md block dark:text-white mb-1 font-medium text-gray-700"
                  htmlFor="alias"
                >
                  CMS Alias <span className={` text-red-400`}>&#42;</span>
                </label>
                <input
                  className="border text-[#666666] dark:text-white dark:bg-shoorah-darkBgTabColor dark:border-none  w-full outline-none border-[#F1F2F4] rounded-[3rem] h-10 px-4"
                  type="text"
                  value={cmsData.alias}
                  id="alias"
                  name="alias"
                  onChange={handleChange}
                  placeholder="Enter alias"
                  disabled
                />
                {valid.isSubmit && valid?.errors?.alias && (
                  <span className="text-sm text-red-700">{valid?.errors?.alias}</span>
                )}
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <button
                onClick={handleSubmit}
                className="bg-[#3A47AB] py-3 px-10 mt-4 text-white w-[192px] h-[48px] rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 px-3">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto"></div>

          {/* COMMENTED FOR FUTURE REFERENCE */}
          <div className="mt-4 sm:mt-0 sm:ml-8 sm:flex-none">
            <button
              onClick={() => {
                setShow(!show);
              }}
              type="button"
              className="inline-flex items-center justify-center rounded-3xl border border-transparent bg-gradient-to-r from-shoorah-primary to-shoorah-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:shoorah-primary focus:outline-none focus:ring-2 focus:ring-shoorah-primary focus:ring-offset-2 sm:w-auto"
            >
              Add New
            </button>
          </div>
        </div>
        <div className="mt-4">
          <Table
            columns={columns}
            data={CMSList}
            name={'cms_table'}
            setDeleteId={deleteHandler}
            bottomBorder={totalCount > PAGE_SIZE}
            loader={loader}
          />
        </div>
      </div>
      <div>
        {totalCount > PAGE_SIZE && CMSList.length > 0 && !loader ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => handlePagination(page, PAGE_SIZE, '')}
          />
        ) : (
          <span />
        )}
      </div>
    </>
  );
}

export default CMS;

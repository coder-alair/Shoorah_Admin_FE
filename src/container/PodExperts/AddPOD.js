import { Helmet } from 'react-helmet';
import Breadcrumb from '../../component/common/Breadcrumb';
import { useRef, useEffect, useState } from 'react';
import { errorToast, successToast } from '../../utils/helper';
import LazyLoadImageProp from '../../component/common/LazyLoadImage';
import ProfilePic from '../../assets/images/dummy-avatar.png';
import { CameraIcon } from '@heroicons/react/20/solid';
import CommonTextarea from '../../component/common/CommonTextarea';
import { Api } from '../../api';
import AddPodExpertsValidation from '../../validation/AddPodExpertsValidation';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CommonInput from '../../component/common/Input/CommonInput';
import { PER_PAGE, STATUS, POD_TYPES } from '../../utils/constants';
import SecondaryButton from '../../component/common/Buttons/SecondaryButton';
import PrimaryButton from '../../component/common/Buttons/PrimaryButton';
import SelectMenu from '../../component/common/SelectMenu';
import SearchInput from '../../component/common/Input/SearchInput';
import Table from '../../component/common/Table';
import Pagination from '../../component/common/Pagination/Pagination';
import { set } from 'date-fns';

const AddPOD = () => {
  //initial state
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [selectedPodType, setSelectedPodType] = useState(POD_TYPES[0]);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState('');
  const [loader, setLoader] = useState(false);
  const imageRef = useRef(null);
  const [podList, setPodList] = useState([]);
  const [valid, setValid] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const [addPodExpertsStates, setAddPodExpertsStates] = useState({
    fullName: '',
    description: '',
    image: null
  });
  const [form, setForm] = useState({
    id: '',
    description: '',
    name: '',
    status: 1,
    image: null
  });
  const [error, setError] = useState({});
  const [isView, setIsView] = useState(false);
  const location = useLocation();
  const propsData = location?.state;
  //constants
  const pages = [
    { name: 'Pod Experts', href: '/podExperts', current: true },
    {
      name: id ? 'Edit Pod Experts' : 'Add Code Exports',
      href: id ? '/addpodExperts' : '/EditpodExperts/:id',
      current: true
    }
  ];
  const columns = [
    {
      title: 'Listen Audio',
      key:
        selectedPodType.value === 3
          ? 'meditationUrl'
          : selectedPodType.value === 4
          ? 'soundUrl'
          : selectedPodType.value === 5
          ? 'audioUrl'
          : 'audioUrl',
      type: 'play',
      align: 'left'
    },
    {
      title:
        selectedPodType.value === 3
          ? 'Meditation Name'
          : selectedPodType.value === 4
          ? 'Sound Name'
          : selectedPodType.value === 5
          ? 'Shoorah Pod Name'
          : 'Breathwork Name',
      key: 'display_name',
      sortable: true,
      type: 'text',
      align: 'left',
      longText: true
    },
    {
      title: 'Duration',
      key: 'duration',
      sortable: false,
      type: 'text',
      align: 'left'
    },
    {
      title: 'Approval Status',
      key: 'approvalStatus',
      sortable: false,
      type: 'contentStatus',
      align: 'left'
    },
    {
      title: 'Created By',
      key1: 'createdBy',
      key2: 'name',
      sortable: false,
      type: 'text',
      align: 'left',
      nested: true
    },
    {
      title: 'Approved By',
      key1: 'approvedBy',
      key2: 'name',
      sortable: false,
      type: 'text',
      align: 'left',
      nested: true
    },
    {
      title: 'Created On',
      key: 'createdOn',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: 'Approved On',
      key: 'approvedOn',
      sortable: false,
      type: 'date',
      align: 'left'
    },
    {
      title: 'Played Minutes',
      key: 'timeSpent',
      type: 'text',
      sortable: true,
      align: 'center'
    },
    {
      title: 'Mostly Played',
      key: 'timeCounts',
      type: 'text',
      sortable: true,
      align: 'center'
    },
    {
      title: 'Rating',
      key: 'rating',
      type: 'rating',
      align: 'center'
    },
    {
      title: 'Status',
      key:
        selectedPodType.value === 3
          ? 'meditationStatus'
          : selectedPodType.value === 4
          ? 'soundStatus'
          : selectedPodType.value === 5
          ? 'podStatus'
          : 'breathworkStatus',
      sortable: false,
      type: 'badge',
      align: 'left'
    }
  ];

  //componentDidMount
  useEffect(() => {
    setIsView(propsData?.action === 'view');
  }, [propsData]);

  //fetching the pod expert profile data
  useEffect(() => {
    if (id) fetchPodExpertProfile();
  }, [id]);
  //fetch pods list of expert
  useEffect(() => {
    if (id) fetchPodData();
  }, [selectedPodType, currentPage, selectedPerPage, id, searchTerm]);

  // const handleAddUserChange = (e) => {
  //   const { name, value } = e.target;
  //   setAddPodExpertsStates({ ...addPodExpertsStates, [name]: value });
  // };

  //when user click on the image to upload
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setForm({ ...form, image: undefined });
      return;
    }
    const file = e.target.files[0];
    if (!file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      errorToast(
        `The specified file ${file.name} could not be uploaded. Please upload a valid image.`
      );
    } else {
      // setSelectedFile(file);
      setForm({ ...form, image: file });
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  };
  //when user click on the submit button
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    const validate = AddPodExpertsValidation(form);
    setValid({
      ...valid,
      isSubmit: true,
      errors: validate.errors,
      isValid: validate.isValid
    });

    if (validate.isValid) {
      setLoader(true);
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('imageType', form?.image || null);
      formData.append('isActive', Boolean(form.status));
      if (id) formData.append('id', id);

      const apiCall = id ? Api.updatePodExperts : Api.addPodExperts;
      apiCall(formData)
        .then((response) => {
          setLoader(false);
          if (response.status === 200) {
            successToast(`Pod Experts ${id ? 'updated' : 'created'} successfully`);
            setPreview('');
            // setSelectedFile(null);
            setForm({ ...form, image: null });
            setForm({ name: '', description: '', image: null });
            if (!id) navigate('/podExperts');
            fetchPodExpertProfile();
          }
        })
        .catch((err) => {
          setLoader(false);
          errorToast(err.message);
        });
    }
    setLoader(false);
  };

  //fetchPodExpertProfile
  const fetchPodExpertProfile = async () => {
    setLoader(true);
    try {
      if (!id) {
        setLoader(false);
        return; 
      }
      const response = await Api.getPodExpertById(id);
      if (response.status === 200) {
        const data = response.data.data;
        setForm({
          ...form,
          name: data.name || '',
          description: data.description || '',
          id: data?.id || '',
          image: data.image || '',
          status: data.isActive ? 1 : 0
        });
        setPreview(data.image || ProfilePic);
      } else {
        console.error('Failed to fetch pod data', response);
      }
    } catch (error) {
      console.error('Failed to fetch pod data', error);
    } finally {
      setLoader(false);
    }
  };

  const fetchPodData = async () => {
    setLoader(true);
    try {
      let searchParam = searchTerm.trim();
      switch (selectedPodType.value) {
        case 3:
          {
            const response = await Api.getExpertMeditationsList(
              currentPage,
              selectedPerPage?.value,
              searchParam,
              sortBy,
              sortOrder,
              id
            );
            if (response.status === 200) {
              setPodList(response?.data?.data);
              setCurrentPage(currentPage);
              setTotalCount(response?.data?.meta?.totalRecords);
              setLoader(false);
            } else {
              console.error('Failed to fetch pod data', response.data.data);
            }
          }
          break;
        case 4:
          {
            const response = await Api.getExpertSoundsList(
              currentPage,
              selectedPerPage?.value,
              searchParam,
              sortBy,
              sortOrder,
              id
            );
            if (response.status === 200) {
              setPodList(response?.data?.data);
              setCurrentPage(currentPage);
              setTotalCount(response?.data?.meta?.totalRecords);
              setLoader(false);
            } else {
              console.error('Failed to fetch pod data', response.data.data);
            }
            console.log('sounds');
          }
          break;
        case 5:
          {
            console.log('shoorah pods');
            const response = await Api.getExpertShoorahPodsList(
              currentPage,
              selectedPerPage?.value,
              searchParam,
              sortBy,
              sortOrder,
              id
            );
            if (response.status === 200) {
              const temp = response?.data?.data?.length
                ? response?.data?.data.map((ele) => {
                    return {
                      ...ele,
                      meditationName: ele?.podName
                    };
                  })
                : [];
              setPodList(temp);
              setCurrentPage(currentPage);
              setTotalCount(response?.data?.meta?.totalRecords);
              setLoader(false);
            } else {
              console.error('Failed to fetch pod data', response.data.data);
            }
          }
          break;
        case 11:
          {
            console.log('breathwork');
            const response = await Api.getExpertBreathworkList(
              currentPage,
              selectedPerPage?.value,
              searchParam,
              sortBy,
              sortOrder,
              id
            );
            if (response.status === 200) {
              const temp = response?.data?.data?.length
                ? response?.data?.data.map((ele) => {
                    return {
                      ...ele,
                      meditationName: ele?.breathworkName
                      // rating: ele?.rating
                    };
                  })
                : [];
              setPodList(temp);
              setCurrentPage(currentPage);
              setTotalCount(response?.data?.meta?.totalRecords);
              setLoader(false);
            } else {
              console.error('Failed to fetch pod data', response.data.data);
            }
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Failed to fetch pod data', error);
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    setError((prevState) => ({
      ...prevState,
      [e.target.name]: ''
    }));
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handlePerPage = (perPage) => {
    setSelectedPerPage(perPage);
    handlePagination(1, perPage.value, searchTerm, filterQuery, sortBy, sortOrder);
  };

  const handlePagination = (pageNumber, pageSize, searchKey, query, sortBy, sortOrder) => {};

  const refreshTable = () => {
    fetchPodData();
  };

  const handleSortBy = (sort) => {};

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Partnership | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div className="mt-6 px-3">
        <form onSubmit={handleAddUserSubmit}>
          <div className="flex-wrap lg:flex px-4 py-10 rounded-[10px] bg-white dark:bg-shoorah-darkBgTabColor dark:text-white gap-4">
            <div className="lg:mr-10 mb-4">
              <input
                onChange={onSelectFile}
                className="hidden"
                ref={imageRef}
                type="file"
                accept=".jpg, .jpeg, .png"
              />
              <div
                className="relative m-auto w-[200px] rounded-[50%] cursor-pointer"
                onClick={() => imageRef.current.click()}
              >
                <LazyLoadImageProp
                  imageSrc={preview || ProfilePic}
                  className="border border-gray-300 w-[200px] h-[200px] rounded-[50%] m-auto"
                />
                <div className="absolute bottom-0 right-[25px] bg-gray-200 p-2 rounded-[50%]">
                  <CameraIcon className="w-[20px]" />
                </div>
              </div>
              {/* {!valid?.isValid && <span style={{ color: "red", fontSize: '14px' }}>{valid?.errors?.image}</span>} */}
            </div>
            <div className="space-y-6 m-auto lg:m-0 w-full lg:w-[430px]">
              <CommonInput
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                label="Full Name"
                error={error.name}
                isRequired
              />
              {!valid?.isValid && (
                <span style={{ color: 'red', fontSize: '14px' }}>{valid?.errors?.name}</span>
              )}
              <CommonTextarea
                rows={4}
                name="description"
                id="description"
                value={form.description}
                onChange={handleChange}
                disabled={isView}
                label="Description"
                isLengthValidate
              />
              {/* {!valid?.isValid && <span style={{ color: "red", fontSize: '14px' }}>{valid?.errors?.description}</span>} */}
              {id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Account Status
                  </label>
                  <fieldset className="mt-4">
                    <div className="flex space-x-4">
                      {STATUS.map((status, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            id={status.name}
                            name="status"
                            type="radio"
                            value={status.value}
                            onChange={(e) => setForm({ ...form, status: parseInt(e.target.value) })}
                            checked={status.value === form.status}
                            className="h-5 w-5 border-gray-300 text-shoorah-primary focus:ring-shoorah-primary cursor-pointer"
                          />
                          <label
                            htmlFor={status.name}
                            className="ml-3 block text-sm font-medium text-gray-700 dark:text-white cursor-pointer"
                          >
                            {status.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
              <div className="text-right flex justify-end gap-x-2 mt-12">
                <SecondaryButton btnText="Cancel" btnType="button" />
                <PrimaryButton btnText="Submit" btnType="submit" />
              </div>
            </div>
          </div>
        </form>
      </div>
      {id && (
        <div className="mt-6 px-3">
          <div className="sm:flex justify-between">
            <div className="flex">
              <div className="hidden lg:flex mr-3 self-center">
                <span className="self-center text-sm mr-2 dark:text-white">Per page:</span>
                <div className="w-[80px]">
                  <SelectMenu
                    menuList={PER_PAGE}
                    showLabel={false}
                    defaultSelected={selectedPerPage}
                    setSelectedMenu={handlePerPage}
                  />
                </div>
              </div>
              <div className="self-center">
                <SearchInput
                  id="searchKey"
                  name="searchKey"
                  type="text"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by user name"
                />
              </div>
            </div>
            <div className="flex sm:justify-end gap-4 mt-4">
              <div>
                <SelectMenu
                  menuList={POD_TYPES}
                  defaultSelected={selectedPodType}
                  label=""
                  isRequired={false}
                  setSelectedMenu={(data) => {
                    setSelectedPodType(data);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            {console.log('podList', podList)}
            {podList?.length > 0 && (
              <Table
                columns={columns}
                data={podList}
                name={'pods_table'}
                bottomBorder={totalCount > selectedPerPage.value}
                setSortBy={handleSortBy}
                // refreshTable={refreshTable}
                loader={loader}
                isdetail={false}
              />
            )}
          </div>
        </div>
      )}
      <div>
        {podList?.length > 0 && id && !loader ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={selectedPerPage?.value}
            onPageChange={(page) =>
              handlePagination(
                page,
                selectedPerPage?.value,
                searchTerm,
                filterQuery,
                sortBy,
                sortOrder
              )
            }
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
};

export default AddPOD;

import { useEffect, useRef, useState } from 'react';

import { getLocalStorageItem, useOutsideClick } from '../../../utils/helper';
import { JOB_ROLES, PEAP_CONTENT, PER_PAGE } from '../../../utils/constants';
import { Helmet } from 'react-helmet';
import Complainant from './Complaint';
import Peapapproval from './Approvals';
import { Api } from '../../../api';
import Loader from '../../../component/common/Loader';
import Insights from './insights';

import { SPECIALIST_ROLE } from '../../../utils/constants';
import Messaging from './Messaging';
import PendingSpecialist from './pendingSpecialist';
import ActiveSpecialist from './activeSpecialist';

function Specialist() {
  const wrapperRef = useRef(null);
  const [companyList, setCompanyList] = useState([]);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState(SPECIALIST_ROLE);
  const [loader, setLoader] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState('');
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [job, setJob] = useState(JOB_ROLES[0].name);
  const [selectedPlatform, setSelectedPlatform] = useState(1);
  const [accountType, setaccountType] = useState(1);
  const [tab, setTab] = useState(1);
  const [selectedContentType, setSelectedContentType] = useState(1);
  const [filterCriteria, setFilterCriteria] = useState({
    accountType: '',
    accountStatus: '',
    loginPlatform: ''
  });

  const [addUserStates, setAddUserStates] = useState({
    lastName: '',
    firstName: '',
    email: '',
    accountType: accountType,
    category: '',
    platform: selectedPlatform,
    specialsationCategory: '',
    phone: '',
    Address: '',
    year_of_practise: null,
    aggred_hour_rate: null,
    public_hour_rate: null,
    address: ''
  });
  //////////
  const [category, setCategory] = useState('');
  const [specialisationCategory, setSpecialisationCategory] = useState('');

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSpecialisationCategory('');
    const { name, value } = e.target;
    setAddUserStates((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSpecialisationCategory = (e) => {
    if (e) {
      setSpecialisationCategory(e);
      const { name } = e;
      setAddUserStates((prevState) => ({ ...prevState, [name]: e }));
    }
  };
  /////////////
  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setAddUserStates({ ...addUserStates, [name]: value });
  };

  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const filteredJobs =
      query && query === ''
        ? SPECIALIST_ROLE
        : SPECIALIST_ROLE?.filter((job) => {
            return job.name.toLowerCase().includes(query.toLowerCase());
          });

    setJobs(filteredJobs);
  }, [query]);

  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date());
    }, 100000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, selectedPerPage.value, '');
  }, []);
  const fetchUsers = (pageNumber, pageSize, userId) => {
    setLoader(true);
    Api.getSpecialistData(pageNumber, pageSize, userId)
      .then((response) => {
        setLoader(false);
        if (response?.data?.meta?.code === 1) {
          setUsersList(response?.data?.data);
          setCurrentPage(pageNumber);
          setTotalCount(response?.data?.meta?.totalRecords);
        } else {
          setUsersList([]);
          setTotalCount(0);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.error('API call error: ', error);
      });
  };

  const handlePagination = (pageNumber, pageSize, userId) => {
    fetchUsers(pageNumber, pageSize, userId);
  };

  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handlePause = (user) => {
    console.log(`Pause clicked for ${user.name}`);
  };
  const handleDeactivate = (user) => {
    console.log(`Deactivate clicked for ${user.name}`);
  };
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  return (
    <div className="relative">
      {loader && <Loader />}
      <Helmet>
        <meta charSet="utf-8" />
        <title>Specialist Shoorah Admin</title>
      </Helmet>
      {/* <Breadcrumb pageList={pages} /> */}
      {/* Add user Pop up */}
      <div className="block pl-6 pt-12 text-xl font-medium text-gray-800 dark:text-white md:text-3xl">
        PEAP Management
      </div>
      <div className="pl-6 pt-8 text-gray-400">{formattedDate}</div>

      <div className="rounded-b-[10px] bg-shoorah-ggg pl-0 lg:pl-4 dark:bg-shoorah-darkBgColor dark:text-white">
        <div className="overflow-auto custom-scrollbar">
          <div className="w-full dark:border-shoorah-darkBgColor">
            <div className="w-full border-b-2 border-gray-200">
              <nav className="-mb-px flex space-x-8 pl-3 overflow-x-auto" aria-label="Tabs">
                {PEAP_CONTENT.map((tab) => (
                  <div
                    key={tab.name}
                    onClick={() => {
                      setSelectedContentType(tab.value);
                    }}
                    className={classNames(
                      selectedContentType === tab.value
                        ? 'text-gray border-shoorah-secondary dark:text-white'
                        : 'border-transparent text-gray-500 opacity-50 hover:cursor-pointer hover:border-gray-100 hover:text-gray-700',
                      'whitespace-nowrap border-b-2 px-2 py-2 text-sm font-medium dark:border-shoorah-darkBgColor'
                    )}
                  >
                    {tab.name}
                  </div>
                ))}
              </nav>
            </div>
            {selectedContentType === 1 && <ActiveSpecialist />}

            {selectedContentType === 2 && <PendingSpecialist />}
            {selectedContentType === 3 && <Insights />}
            {selectedContentType === 4 && <Complainant />}
            {selectedContentType === 5 && <Messaging />}
            {selectedContentType === 6 && <Peapapproval />}
          </div>
        </div>

        <div></div>
      </div>
    </div>
  );
}

export default Specialist;

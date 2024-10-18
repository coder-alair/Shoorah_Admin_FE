import { useEffect, useRef, useState } from 'react';
import { useOutsideClick } from '../../../utils/helper';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from '../../../utils/constants';
import { Helmet } from 'react-helmet';
import Table from '../../../component/common/Table';
import Pagination from '../../../component/common/Pagination/Pagination';
import { Description, Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';

const columns = [
  {
    title: 'User Emial Address',
    key: 'email',
    type: 'text',
    align: 'left',
    darkText: false
  },
  {
    title: 'Complaint',
    key: 'complaint',
    type: 'text3',
    align: 'left',
    setPopup: 'setShowPopup',
    showPopup: 'showPopup',
    longText: true,
    darkText: true
  },
  {
    title: 'Complaint Againt',
    key: 'name',
    type: 'text',
    align: 'left',
    darkText: false
  },
  {
    title: 'Date',
    key: 'date',
    type: 'date',
    align: 'left',
    darkText: false
  },
  {
    title: 'Resolved?',
    key: 'status',
    type: 'checkBox',
    align: 'center',
    darkText: false
  }
];

const initialComplaintsData = [
  {
    email: 'esthercooper@shoorah.io',
    complaint: "I'm appaled at the way...",
    name: 'Dr. Esther Cooper',
    date: '24 April, 2024',
    checked: true,
    id: 1
  },
  {
    email: 'esthercooper@shoorah.io',
    complaint: "I'm appaled at the way... ",
    name: 'Dr. Esther Cooper',
    date: '24 April, 2024',
    checked: false,
    id: 2
  },
  {
    email: 'esthercooper@shoorah.io',
    complaint:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
      '\n\n' +
      "Lorem Ipsum has been the industry's standard dummy. Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n\nLorem Ipsum has been the industry's standard dummy. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
    name: 'Dr. Esther Cooper',
    date: '24 April, 2024',
    checked: true,
    id: 3
  },
  {
    email: 'esthercooper@shoorah.io',
    complaint: "I'm appaled at the way...",
    name: 'Dr. Esther Cooper',
    date: '24 April, 2024',
    checked: true,
    id: 4
  },
  {
    email: 'esthercooper@shoorah.io',
    complaint: "I'm appaled at the way...",
    name: 'Dr. Esther Cooper',
    date: '24 April, 2024',
    checked: false,
    id: 5
  },
  {
    email: 'esthercooper@shoorah.io',
    complaint: "I'm appaled at the way...",
    name: 'Dr. Esther Cooper',
    date: '24 April, 2024',
    checked: true,
    id: 6
  }
];

function Complaint() {
  const [activeTab, setActiveTab] = useState('All');
  const wrapperRef = useRef(null);
  const [complainsList, setComplaintsList] = useState(initialComplaintsData);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tab, setTab] = useState(1);
  const [openComplaintModal, setOpenComplaintModal] = useState(false);

  const handleComplaintClick = () => {
    setOpenComplaintModal(true);
  };

  useOutsideClick(wrapperRef, () => {
    if (showFilterModal) setShowFilterModal(!showFilterModal);
  });

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const filterComplaints = () => {
    let filteredComplaints = initialComplaintsData;
    if (activeTab === 'Resolved') {
      filteredComplaints = initialComplaintsData.filter((item) => item.checked);
    } else if (activeTab === 'Unresolved') {
      filteredComplaints = initialComplaintsData.filter((item) => !item.checked);
    }
    setComplaintsList(filteredComplaints);
    setTotalCount(filteredComplaints.length);
  };

  useEffect(() => {
    filterComplaints();
  }, [activeTab]);

  const resolvedCount = initialComplaintsData.filter((item) => item.checked).length;
  const unresolvedCount = initialComplaintsData.filter((item) => !item.status).length;
  const today = new Date();

  return (
    <div className="relative">
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&family=Ubuntu&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <meta charSet="utf-8" />
        <title>Specialist Shoorah Admin</title>
      </Helmet>

      {openComplaintModal ? (
        <Dialog
          open={openComplaintModal}
          onClose={() => {
            setOpenComplaintModal(false);
          }}
          className="relative z-50"
        >
          <DialogPanel>
            <div
              className="fixed inset-0 z-40 flex w-screen items-center justify-center bg-black/25"
              style={{ fontSize: '1.20em' }}
            >
              <div
                className="w-[95vw] overflow-hidden border border-[#F1F2F4] bg-white pt-0 shadow-md dark:border-none dark:bg-shoorah-darkBgColor dark:text-white lg:w-[50vw]"
                style={{ borderRadius: '30px' }}
              >
                <div className="items-left mb-2 mt-8 flex w-full gap-[1rem] px-8">
                  <div
                    className={
                      tab === 1
                        ? `items-left ease flex w-full cursor-pointer justify-between px-6 py-1 font-medium duration-1000`
                        : `flex w-full cursor-pointer items-center justify-between py-3 font-medium`
                    }
                  >
                    <DialogTitle>
                      <div className="hover:shoorah-primary items-center border-none text-2xl font-medium text-black focus:outline-none">
                        Complaint {'#' + initialComplaintsData[3].id}
                      </div>
                    </DialogTitle>
                  </div>
                </div>
                <div className="relative left-[55px] top-[-10px] flex text-sm text-gray-400">
                  {today.getDate()} {today.toLocaleString('default', { month: 'long' })}{' '}
                  {today.getFullYear()}
                </div>
                <div>
                  <div className="px-4">
                    <div className="justify-center gap-5">
                      <div className="mt-3 flex w-full flex-col justify-between">
                        <label
                          className="text-md relative left-[45px] my-1 block flex font-medium text-gray-400 dark:text-white"
                          htmlFor="company_name"
                        >
                          User Email:
                          <div className="relative left-[25px] flex">
                            <span className={`text-md text-gray-700`}>
                              {initialComplaintsData[3].email}
                            </span>
                          </div>
                        </label>
                      </div>
                      <div className="mt-5 flex w-full flex-col justify-between">
                        <label
                          className="text-md relative left-[45px] my-1 block flex font-medium text-gray-400 dark:text-white"
                          htmlFor="company_name"
                        >
                          Date Raised:
                          <div className="relative left-[17px] flex">
                            <span className={`text-gray-700`}>{initialComplaintsData[3].date}</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-center gap-5 pt-5">
                      <div className="flex w-full flex-col">
                        <label
                          htmlFor="company"
                          className="text-md relative left-[45px] my-1 block flex font-medium text-gray-400 dark:text-white"
                        >
                          Complainant:
                        </label>
                        <div>
                          <p
                            className={`relative left-[170px] top-[-35px] flex w-3/4 whitespace-pre-line font-medium text-gray-700`}
                            style={{ whiteSpace: 'pre-line' }}
                          >
                            {initialComplaintsData[2].complaint}
                          </p>
                        </div>
                        <div className="w-full overflow-hidden rounded-[3rem] border bg-transparent px-1 pr-4 text-[#666666] dark:border-none dark:bg-shoorah-darkBgTabColor dark:text-white"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-medium mb-4 flex justify-center pb-5 pt-8">
                    <button
                      onClick={() => {
                        console.log('Called');
                        setOpenComplaintModal(false);
                      }}
                      className="mt-4 bg-shoorah-secondary px-16 py-2 text-center text-white"
                      style={{ borderRadius: '50px' }}
                    >
                      Respond Via Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      ) : null}

      <div className="rounded-b-[10px] bg-[#f3f4f7] pl-4 dark:bg-shoorah-darkBgTabColor dark:text-white">
        <div className="">
          <nav
            className="-mb-px flex cursor-pointer space-x-8 pt-[3rem] text-gray-400"
            aria-label="Tabs"
          >
            <div
              onClick={() => setActiveTab('All')}
              className={classNames(
                activeTab === 'All' ? 'border-shoorah-secondary text-black dark:text-white' : ''
              )}
            >
              All({initialComplaintsData.length})
            </div>
            <div
              onClick={() => setActiveTab('Resolved')}
              className={classNames(
                activeTab === 'Resolved'
                  ? 'border-shoorah-secondary text-black dark:text-white'
                  : ''
              )}
            >
              Resolved ({resolvedCount})
            </div>
            <div
              onClick={() => setActiveTab('Unresolved')}
              className={classNames(
                activeTab === 'Unresolved'
                  ? 'border-shoorah-secondary text-black dark:text-white'
                  : ''
              )}
            >
              Unresolved ({unresolvedCount})
            </div>
            {tab.name}
          </nav>
        </div>
      </div>
      <div className="mt-4 px-3">
        <Table
          columns={columns}
          data={complainsList}
          name={'complaints_table'}
          bottomBorder={totalCount > DEFAULT_PAGE_SIZE}
          onNameClick={handleComplaintClick}
        />
      </div>
      <div>
        {complainsList?.length >= 10 ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Complaint;

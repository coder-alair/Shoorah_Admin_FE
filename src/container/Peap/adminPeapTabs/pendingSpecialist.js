import { useEffect, useRef, useState } from 'react';

import { EXPERT_PROFILE_STATUS, PER_PAGE } from '../../../utils/constants';
import Table from '../../../component/common/Table';
import Pagination from '../../../component/common/Pagination/Pagination';
import PeapProfileDailog from './peapProfileDialog';

import { Api } from '../../../api';
import { id, tr } from 'date-fns/locale';
import { errorToast } from '../../../utils/helper';
import toast from 'react-hot-toast';
import { set } from 'date-fns';
import ConfirmPopup from '../../../component/common/modals/ConfirmPopup';

function PendingSpecialist(params) {
  //state constants

  const dummyUsers = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      sessions: 10,
      dateJoined: '2021-01-01',
      status: EXPERT_PROFILE_STATUS.find((x) => x.value === 3).name,
      clients: 5,
      complaints: 0,
      rating: 4.5,
      price: '$100',
      identity: 'Verified',
      dbs: 'Clear',
      unreadMessages: 2,
      actions: 'Pause'
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      sessions: 8,
      dateJoined: '2021-02-15',
      status: EXPERT_PROFILE_STATUS.find((x) => x.value === 2).name,
      clients: 3,
      complaints: 1,
      rating: 4.0,
      price: '$80',
      identity: 'Verified',
      dbs: 'Clear',
      unreadMessages: 5,
      actions: 'Deactivate'
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      sessions: 8,
      dateJoined: '2021-02-15',
      status: EXPERT_PROFILE_STATUS.find((x) => x.value === 0).name,
      clients: 3,
      complaints: 1,
      rating: 4.0,
      price: '$80',
      identity: 'Verified',
      dbs: 'Clear',
      unreadMessages: 5,
      actions: 'Deactivate'
    }
  ];
  const [usersList, setUsersList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPerPage, setSelectedPerPage] = useState(PER_PAGE[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [payload, setPayload] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [selectedExpertId, setSelectedExpertId] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNameClick = (expertId) => {
    setSelectedExpertId(expertId); // Set the selected expert ID
    setIsDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  //const functions
  const handlePagination = (pageNumber, pageSize, userId) => {
    // fetchUsers(pageNumber, pageSize, userId);
    fetchExperts(pageNumber, pageSize);
  };
  //handle dropdown actions in table
  // const handleDropdownChange = (value, rowData) => {
  //   // Handle the change event here
  //   console.log('Selected value:', value);
  //   const expertId = rowData?.id;
  //   const payload = {
  //     expertId,
  //     profileAction: value
  //   };
  //   console.log('Payload:', payload);
  //   switch (value + '') {
  //     case '3':
  //       console.log('Invite to interview');
  //       setOpenConfirmModal(true);
  //       setPayload(payload);
  //       // Api.inviteToInterview(payload).then(handleApiResponse);
  //       break;
  //     case '1':
  //       Api.inviteToInterview(payload).then(handleApiResponse);
  //       console.log('Approve');
  //       break;
  //     case '2':
  //       Api.inviteToInterview(payload).then(handleApiResponse);
  //       console.log('Decline');
  //       break;
  //     case '4':
  //       Api.inviteToInterview();
  //       console.log('Join Interview');

  //     default:
  //       break;
  //   }
  // };

  console.log('dsdafd');

  const handleDropdownChange = (value, rowData) => {
    const expertId = rowData?.id;
    console.log('🚀 ~ handleDropdownChange ~ expertId:', expertId);

    setSelectedExpertId(expertId);
    const payload = {
      expertId,
      profileAction: value
    };

    // Define the confirmation messages
    const confirmationMessages = {
      3: `Are you sure you want to invite this expert?`,
      1: `Are you sure you want to approve this expert?`,
      2: `Are you sure you want to decline this expert?`,
      4: `Are you sure you want to join the interview?`
    };

    switch (value + '') {
      case '3':
      case '1':
      case '2':
      case '4':
        setConfirmationMessage(confirmationMessages[value]);
        setOpenConfirmModal(true);
        setPayload(payload);
        break;

      default:
        break;
    }
  };

  // const handleDropdownChange = (value, expertId) => {
  //   let apiCall;
  //   switch (value) {
  //     case '1': // Invite to interview
  //       apiCall = Api.inviteToInterview(expertId);
  //       break;
  //     case '2': // Approve
  //       apiCall = Api.inviteToInterview(expertId);
  //       break;
  //     case '3': // Decline
  //       apiCall = Api.inviteToInterview(expertId);
  //       break;
  //     case '4': // Join Interview
  //       apiCall = Api.inviteToInterview(expertId);
  //       break;
  //     default:
  //       return;
  //   }
  //   apiCall.then(response => {
  //     if (response?.data?.meta?.code === 1) {
  //       console.log(`${value} action performed successfully`);
  //       fetchExperts(currentPage, selectedPerPage);
  //     } else {
  //       console.error(`Failed to perform ${value} action`);
  //     }
  //   });
  // }

  const handleApiResponse = (response) => {
    console.log('hello');

    try {
      if (response?.data?.meta?.code === 1) {
        fetchExperts(currentPage, selectedPerPage.value);
        console.log('selectedPerPage.value', selectedPerPage.value);
      } else {
        const message = response?.data?.meta?.message;
        console.log('🚀 ~ handleApiResponse ~ message:', message);
        // errorToast(message);
      }
    } catch (error) {
      errorToast(error)
    }
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      type: 'text3',
      align: 'left',
      setPopup: '11',
      showPopup: 'showPopup',
      longText: true,
      darkText: true
    },

    {
      title: 'Email',
      key: 'email',
      type: 'text',
      align: 'left',
      style: {
        opacity: 'opacity-100',
        align: 'text-left'
      }
    },

    {
      title: 'Date Joined',
      key: 'dateJoined',
      type: 'date',
      align: 'left'
    },
    {
      title: 'Status',
      type: 'status',
      key: 'status',
      style: {
        align: 'text-center',
        textColor: 'text-black',
        opacity: 'opacity-100'
      }
    },

    {
      title: 'Actions',
      type: 'dropdown',
      align: 'center'
    }
    // {
    //   title: 'Interview Date',
    //   type: 'text',
    //   align: 'center'
    // }
  ];

  useEffect(() => {
    fetchExperts(currentPage, selectedPerPage.value);
  }, [currentPage, selectedPerPage.value]);

  const fetchExperts = (pageNumber, pageSize) => {
    setLoader(true);
    Api.getPeapExpertList(pageNumber, pageSize)
      .then((response) => {
        console.log('🚀 ~ .then ~ response:');
        setLoader(false);
        if (response?.data?.meta?.code === 1) {
          const transformedUsers = response.data.data.map((user) => {
            const currentStatus = EXPERT_PROFILE_STATUS.find(
              (x) => x.value === user.profile_status
            );
            console.log('userL:::::', user._id);

            return {
              id: user._id, // Keep the expert ID
              name: (
                <span
                  onClick={() => handleNameClick(user._id)} // Set expert ID on click
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {user.userDetails.name}
                </span>
              ),
              email: user.userDetails.email,
              sessions: 0,
              dateJoined: new Date(user.userDetails.createdAt).toLocaleDateString(),
              status: currentStatus.name
            };
          });
          setUsersList(transformedUsers);
          setCurrentPage(pageNumber);
          setTotalCount(response.data.meta.totalRecords);
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

  return (
    <div>
      <div className="px-3">
        <div className="flex justify-center"></div>

        <div className="mt-2">
          <div className="pt-3">
            <Table
              columns={columns}
              data={usersList}
              name={'users_table'}
              bottomBorder={totalCount > selectedPerPage?.value}
              refreshTable={() => handlePagination(currentPage, selectedPerPage?.value, '')}
              loader={loader}
              handleDropdownChange={handleDropdownChange}
              // onNameClick={handleNameClick}
              options={[
                { value: 3, label: 'Invite to interview' },
                { value: 1, label: 'Approve' },
                { value: 2, label: 'Decline' }
                // { value: , label: 'Join Interview' }
              ]}
            />
            {isDialogOpen && (
              <PeapProfileDailog onClose={handleCloseDialog} expertId={selectedExpertId} />
            )}
          </div>
          <div></div>
        </div>
      </div>
      <div>
        {/* {usersList?.length >= 10 ? ( */}
        {totalCount > selectedPerPage?.value ? (
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={selectedPerPage?.value}
            onPageChange={(page) => handlePagination(page, selectedPerPage?.value, '')}
          />
        ) : (
          <span />
        )}
      </div>
      {openConfirmModal && (
        <ConfirmPopup
          open={openConfirmModal}
          setOpen={setOpenConfirmModal}
          message={confirmationMessage}
          setAccepted={() => {
            Api.inviteToInterview(payload).then(handleApiResponse);
            setOpenConfirmModal(false); // Close modal after action
          }}
          handleNo={() => {
            setOpenConfirmModal(false);
          }}
        />
      )}
    </div>
  );
}

export default PendingSpecialist;

import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { CompanyApi } from '../../../../api/companyApi';
import { errorToast, successToast } from '../../../../utils/helper';

const EmployeePraiseModal = ({ open, setOpen, department, companyId }) => {
  const cancelButtonRef = useRef(null);

  const [userList, setuserList] = useState([]);
  const [deptList, setDeptList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setmessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getEmployeesData = () => {
    CompanyApi.getB2BUsers()
      .then((res) => {
        if (res?.data?.meta?.code === 1) {
          const tempArr = [];
          const localDepartment = [];

          res?.data?.data?.forEach((data) => tempArr.push({ label: data.email, value: data.id }));

          department?.forEach((data) => localDepartment.push({ label: data, value: data }));

          setuserList(tempArr);
          setDeptList(localDepartment);
        } else {
          errorToast('Something went wrong');
        }
      })
      .catch((err) => errorToast('Something went wrong'));
  };

  const getFilterData = () => {
    CompanyApi.getFilterData(companyId)
      .then((res) => {
        const department = res.data.departments;

        const formattedDept = department?.map((data) => {
          return {
            label: data,
            value: data
          };
        });

        setDeptList([...formattedDept]);
      })
      .catch((err) => {
        // setLoader(false);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getEmployeesData();
      await getFilterData();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    if ((employees.length <= 0 && departments.length <= 0) || !title || !message) {
      return errorToast('All Fields are mandatory.');
    }

    const tempArr = [];
    const tempDept = [];

    employees.forEach((data) => tempArr.push(data.value));
    departments.forEach((data) => tempDept.push(data.value));

    CompanyApi.sendPraiseToUsers({
      title,
      message,
      toUserIds: tempArr,
      toDepartments: tempDept
    })
      .then((res) => {
        if (res?.data?.meta?.code === 1) {
          successToast('Notification sent successfully');
          setTitle('');
          setmessage('');
          setEmployees([]);
          setDepartments([]);
          setOpen(false);
        } else {
          errorToast('Something went wrong');
        }
      })
      .catch((err) => errorToast('Something went wrong'));
  };

  return (
    <Transition.Root appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 lg:z-20"
        initialFocus={cancelButtonRef}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white w-full lg:w-[30vw] dark:bg-shoorah-darkBgColor dark:text-white text-left shadow-xl transition-all sm:my-8 ">
                <div className="bg-white dark:bg-shoorah-darkBgColor dark:text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 dark:text-white text-gray-900 mb-4"
                  >
                    Notify Employee
                    <svg
                      onClick={() => setOpen(false)}
                      className="absolute w-6 h-6 right-4 top-4 cursor-pointer"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </Dialog.Title>
                  <div className="sm:flex sm:items-start">
                    <div className="flex flex-col w-full gap-y-4 mt-3">
                      <div className="flex w-full flex-col gap-1">
                        <label className="text-base">Select Employees</label>
                        <Select
                          isLoading={isLoading}
                          onChange={setEmployees}
                          isMulti
                          name="users"
                          options={userList}
                          className="rounded-lg border-none"
                          classNamePrefix="select"
                        />
                      </div>

                      <div className="flex w-full flex-col gap-1">
                        <label className="text-base">Select Department</label>
                        <Select
                          isLoading={isLoading}
                          onChange={setDepartments}
                          isMulti
                          name="users"
                          options={deptList}
                          className="rounded-lg border-none"
                          classNamePrefix="select"
                        />
                      </div>

                      <div className="flex w-full flex-col gap-1">
                        <label className="text-base">Title</label>
                        <input
                          onChange={(e) => setTitle(e.target.value)}
                          value={title}
                          className="w-full py-2 px-2 placeholder:text-gray-500 dark:bg-shoorah-darkBgTabColor dark:text-white dark:border-none   border rounded-md border-gray-400/70"
                          type="text"
                          placeholder="Please Enter the title"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-base">Message</label>
                        <textarea
                          onChange={(e) => setmessage(e.target.value)}
                          value={message}
                          placeholder="Please Enter your message here"
                          className="w-full py-2 px-2 placeholder:text-gray-500 dark:bg-shoorah-darkBgTabColor dark:text-white dark:border-none   border rounded-md border-gray-400/70"
                        />
                      </div>

                      <div className="flex justify-end mt-4 ">
                        <button
                          onClick={handleSubmit}
                          className="bg-shoorah-primary text-white font-semibold cursor-pointer px-4 py-2 rounded-lg"
                        >
                          Send
                        </button>
                      </div>

                      {/* {data.map((value, key) => (
                        <div
                          className="relative mr-2 mb-2 px-4 py-2 rounded-3xl w-fit bg-gray-200 text-sm"
                          key={key}
                        >
                          {value.display_name}
                        </div>
                      ))} */}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

EmployeePraiseModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  data: PropTypes.any
};

export default EmployeePraiseModal;

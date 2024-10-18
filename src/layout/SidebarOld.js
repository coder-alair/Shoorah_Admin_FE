import { Fragment, useEffect, useState, useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import SidebarLogo from '../assets/images/sidebar-logo.svg';
import { cleanLocalStorage, getDeviceToken, getLocalStorageItem } from '../utils/helper';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import Menu from './Menu';
import { Api } from '../api';
import dashboardIcon from '../assets/images/Dashboard.svg';
import subadminIcon from '../assets/images/SubAdmin.svg';
import userIcon from '../assets/images/Users.svg';
import approvalIcon from '../assets/images/verify.svg';
import notiIcon from '../assets/images/Notification.svg';
import cmsIcon from '../assets/images/CMS.svg';
import earningIcon from '../assets/images/Ea5rning.svg';
import reportIcon from '../assets/images/reportIcon.svg';
import bagIcon from '../assets/images/bagIcon.svg';
import keyIcon from '../assets/images/keyIcon.svg';
import companyDashboardIcon from '../assets/images/companyDashboardIcon.svg';
// import draftIcon from '../assets/images/Draft.svg';
import contentIcon from '../assets/images/Content management.svg';
import configIcon from '../assets/images/config.svg';
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';
import { SidebarContext } from '../context/SidebarContext';
import packageJson from '../../package.json';

function SidebarOld() {
  const navigate = useNavigate();
  const { isShow, setShow } = useContext(SidebarContext);
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const [sidebarData, setSidebarData] = useState([]);

  useEffect(() => {
    if (userData?.id) {
      if (userData?.userType === 3) {
        setSidebarData([
          {
            name: 'Dashboard',
            href: `/${userData?.slug}/dashboard`,
            icon: companyDashboardIcon,
            access: true
          },
          {
            name: 'Solutions',
            href: `/${userData?.slug}/solution`,
            icon: keyIcon,
            access: true
          },
          {
            name: 'My Company',
            href: `/${userData?.slug}/myCompany`,
            icon: bagIcon,
            access: true
          },
          {
            name: 'Users',
            href: `/${userData?.slug}/users`,
            icon: userIcon,
            access: true
          },
          {
            name: 'Notification',
            href: `/${userData?.slug}/notification`,
            icon: notiIcon,
            access: true
          },
          {
            name: 'Report',
            href: `/${userData?.slug}/report`,
            icon: reportIcon,
            access: true
          },
          {
            name: 'Badges',
            href: `/${userData?.slug}/badges`,
            icon: subadminIcon,
            access: true
          },
          {
            name: 'Surveys',
            href: `#`,
            icon: approvalIcon,
            access: true
          }
        ]);
      } else {
        setSidebarData([
          {
            name: 'Dashboard',
            href: '/dashboard',
            icon: dashboardIcon,
            access: true
          },
          {
            name: 'Sub Admins',
            href: '/sub-admins',
            icon: subadminIcon,
            access: !userData?.userType
          },
          {
            name: 'B2B',
            href: 'isDropDown',
            icon: contentIcon,
            access: true,
            isDropDown: true,
            subMenu: [
              {
                name: 'Dashboard',
                href: '/B2B-dashboard',
                icon: '',
                access: true,
                show: true
              },
              {
                name: 'Company List',
                href: '/B2B-company-list',
                icon: '',
                access: true,
                show: true
              },
              {
                name: 'Earnings',
                href: '/B2B-earning',
                icon: '',
                access: true,
                show: true
              }
            ]
          },
          { name: 'Users', href: '/users', icon: userIcon, access: true },
          {
            name: 'Content Approval',
            href: '/content-approval',
            icon: approvalIcon,
            access: !userData?.userType
          },
          {
            name: 'Earnings',
            href: '/earning',
            icon: earningIcon,
            access: userData?.moduleAccess?.earning_module_access
          },
          {
            name: 'Content Management',
            href: 'isDropDown',
            icon: contentIcon,
            access: true,
            isDropDown: true,
            subMenu: [
              {
                name: 'Focuses / Affirmation Focuses',
                href: '/content-management/focus',
                icon: '',
                access: true,
                show: true
              },
              {
                name: 'Focus',
                href: '/content-management/focus/add-edit',
                icon: '',
                access: true,
                show: false
              },
              {
                name: 'Focus',
                href: '/content-management/focus/view',
                icon: '',
                access: true,
                show: false
              },
              {
                name: 'Affirmation',
                href: '/content-management/affirmation',
                icon: '',
                access: true,
                show: true
              },
              {
                name: 'Affirmation',
                href: '/content-management/affirmation/add-edit',
                icon: '',
                access: true,
                show: false
              },
              {
                name: 'Affirmation',
                href: '/content-management/affirmation/view',
                icon: '',
                access: true,
                show: false
              },
              {
                name: 'Meditation',
                href: '/content-management/meditation',
                icon: '',
                access: true,
                show: true
              },
              {
                name: 'Meditation',
                href: '/content-management/meditation/add-edit',
                icon: '',
                access: true,
                show: false
              },
              {
                name: 'Sleep Sounds',
                href: '/content-management/sounds',
                icon: '',
                access: true,
                show: true
              },
              {
                name: 'Sleep Sounds',
                href: '/content-management/sounds/add-edit',
                icon: '',
                access: true,
                show: false
              },
              {
                name: 'Shoorah Rituals',
                href: '/content-management/rituals',
                icon: '',
                access: true,
                show: true
              },
              {
                name: 'Shoorah Rituals',
                href: '/content-management/rituals/add-edit',
                icon: '',
                access: true,
                show: false
              },
              // {
              //   name: 'BedTime Stories',
              //   href: '/content-management/bedtime-stories',
              //   icon: '',
              //   access: true,
              //   show: true,
              // },
              // {
              //   name: 'Gratitude',
              //   href: '/content-management/gratitude',
              //   icon: '',
              //   access: true,
              //   show: true,
              // },
              // {
              //   name: 'Gratitude',
              //   href: '/content-management/gratitude/add-edit',
              //   icon: '',
              //   access: true,
              //   show: false,
              // },
              {
                name: 'Shoorah Pods',
                href: '/content-management/shoorah-pods',
                icon: '',
                access: true,
                show: true
              },
              {
                name: 'Shoorah Pods',
                href: '/content-management/shoorah-pods/add-edit',
                icon: '',
                access: true,
                show: false
              },
              {
                name: 'Top Picks',
                href: '/content-management/top-picks',
                icon: '',
                access: true,
                show: false
              },
              {
                name: 'Top Picks',
                href: '/content-management/top-picks/add-edit',
                icon: '',
                access: true,
                show: false
              }
              // {
              //   name: 'Manifestation',
              //   href: '/content-management/manifestation',
              //   icon: '',
              //   access: true,
              //   show: true,
              // },
            ]
          },
          // {
          //   name: 'My Drafts',
          //   href: '/draft',
          //   icon: draftIcon,
          //   access: userData?.userType,
          // },
          {
            name: 'Push Notifications',
            href: '/push-notification',
            icon: notiIcon,
            access: true
          },
          // { name: 'Article', href: '#', icon: articleIcon, access: true },
          { name: 'CMS', href: '/cms', icon: cmsIcon, access: true },
          { name: 'Config', href: '/config', icon: configIcon, access: true }
        ]);
      }
    }
  }, []);

  const handleLogout = async () => {
    if (getDeviceToken()) await Api.logoutUser();
    cleanLocalStorage();
    navigate('/login');
  };

  return (
    <div>
      <Transition.Root show={isShow || false} as={Fragment}>
        <Dialog as="div" className="relative" onClose={() => null}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed lg:block inset-0 lg:inset-full lg:bg-transparent lg:bg-opacity-0" />
          </Transition.Child>
          <div>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="fixed top-0 bottom-0 flex w-[260px] flex-1 flex-col bg-shoorah-sidebarBackground z-40">
                <div className="h-0 flex-1 overflow-y-auto sidebar-container">
                  <div className="flex justify-between w-[260px] flex-shrink-0 fixed top-0 left-0 bg-shoorah-sidebarBackground items-center px-4 h-[87px] border-b border-shoorah-sidebarBorder">
                    <img loading='lazy' className="h-7 w-auto" src={SidebarLogo} alt="Your Company" />
                    <ChevronDoubleLeftIcon
                      onClick={() => setShow(!isShow)}
                      className="w-[30px] ml-auto text-white cursor-pointer rounded-full"
                    />
                  </div>
                  <nav className="space-y-3 mt-[100px] mb-[15px]">
                    {sidebarData?.map((item, index) =>
                      !item?.access ? '' : <Menu key={index} item={item} />
                    )}
                  </nav>
                </div>
                <span className="flex text-shoorah-gray2 py-4 px-6 text-sm">
                  Version: {packageJson.version}
                </span>
                <div className="flex flex-shrink-0 border-t border-shoorah-sidebarBorder p-4">
                  <div
                    className="group block w-full flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-shoorah-primary to-shoorah-secondary p-3 rounded-[50%]">
                        <ArrowRightOnRectangleIcon className="w-[20px] text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-white">Logout</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default SidebarOld;

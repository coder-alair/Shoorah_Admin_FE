import { useEffect, useState, useContext, useCallback } from 'react';
import { Switch } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import SidebarLogo from '../assets/images/new-shoorah-logo.svg';
import {
  cleanLocalStorage,
  errorToast,
  getDeviceToken,
  getLocalStorageItem
} from '../utils/helper';
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
import contentIcon from '../assets/images/Contentmanagement.svg';
import partnerIcon from '../assets/images/partner.svg';
import { SURVEY_CONSTANT } from '../core/web.constants';

import configIcon from '../assets/images/config.svg';
import { SidebarContext } from '../context/SidebarContext';

import activedashboardIcon from '../assets/images/ActiveDashboard.svg';
import activesubadminIcon from '../assets/images/ActiveSubAdmin.svg';
import activeuserIcon from '../assets/images/ActiveUsers.svg';
import activeapprovalIcon from '../assets/images/ActiveVerify.svg';
import activenotiIcon from '../assets/images/ActiveNotification.svg';
import activecmsIcon from '../assets/images/ActiveCMS.svg';
import activeearningIcon from '../assets/images/ActiveEa5rning.svg';
import activereportIcon from '../assets/images/ActivereportIcon.svg';
import activebagIcon from '../assets/images/ActivebagIcon.svg';
import activekeyIcon from '../assets/images/ActivekeyIcon.svg';
import activecompanyDashboardIcon from '../assets/images/ActivecompanyDashboardIcon.svg';
import activeconfigIcon from '../assets/images/Activeconfig.svg';
import activecontentIcon from '../assets/images/ActiveContentmanagement.svg';
import { useLocation } from 'react-router-dom';
import { CompanyApi } from '../api/companyApi';

function Sidebar() {
  const navigate = useNavigate();
  const { isDarkModeEnabled, setIsDarkModeEnabled } = useContext(SidebarContext);
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const [sidebarData, setSidebarData] = useState([]);
  const [subsData, setSubsData] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndexAlt, setActiveIndexAlt] = useState(0);
  const [openedSubMenuIndex, setOpenedSubMenuIndex] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (userData?.id) {
      if (userData?.userType === 3) {
        setSidebarData([
          {
            name: 'Dashboard',
            href: `/${userData?.slug}/dashboard`,
            icon: companyDashboardIcon,
            activeIcon: activecompanyDashboardIcon,
            access: true
          },

          {
            name: SURVEY_CONSTANT.SURVEY_SIDEBAR_NAME,
            href: `/${userData?.slug}/pulse-survey`,
            icon: approvalIcon,
            activeIcon: activeapprovalIcon,
            access: true
          },
          {
            name: 'Content Approval',
            href: `/${userData?.slug}/content-approval`,
            icon: approvalIcon,
            activeIcon: activeapprovalIcon,
            access: true
          },
          {
            name: 'Sub Admins',
            href: `/${userData?.slug}/sub-admins`,
            icon: subadminIcon,
            activeIcon: activesubadminIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'Solutions',
            href: `/${userData?.slug}/solution`,
            icon: keyIcon,
            activeIcon: activekeyIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'My Company',
            href: `/${userData?.slug}/myCompany`,
            icon: bagIcon,
            activeIcon: activebagIcon,
            access: true
          },

          {
            name: 'Users',
            href: `/${userData?.slug}/users`,
            icon: userIcon,
            activeIcon: activeuserIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'Notification',
            href: `/${userData?.slug}/notification`,
            icon: notiIcon,
            activeIcon: activenotiIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'Report',
            href: `/${userData?.slug}/report`,
            icon: reportIcon,
            activeIcon: activereportIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'Badges',
            href: `/${userData?.slug}/badges`,
            icon: subadminIcon,
            activeIcon: activesubadminIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'Integrations',
            href: `/${userData?.slug}/integrations`,
            icon: contentIcon,
            activeIcon: activecontentIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          }
        ]);
      } else if (userData?.userType === 4) {
        setSidebarData([
          {
            name: 'Dashboard',
            href: `/${userData?.slug}/dashboard`,
            icon: companyDashboardIcon,
            activeIcon: activecompanyDashboardIcon,
            access: true
          },

          {
            name: SURVEY_CONSTANT.SURVEY_SIDEBAR_NAME,
            href: `/${userData?.slug}/pulse-survey`,
            icon: approvalIcon,
            activeIcon: activeapprovalIcon,
            access: true
          },
          {
            name: 'Solutions',
            href: `/${userData?.slug}/solution`,
            icon: keyIcon,
            activeIcon: activekeyIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'My Company',
            href: `/${userData?.slug}/myCompany`,
            icon: bagIcon,
            activeIcon: activebagIcon,
            access: true
          },

          {
            name: 'Users',
            href: `/${userData?.slug}/users`,
            icon: userIcon,
            activeIcon: activeuserIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'Notification',
            href: `/${userData?.slug}/notification`,
            icon: notiIcon,
            activeIcon: activenotiIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'Report',
            href: `/${userData?.slug}/report`,
            icon: reportIcon,
            activeIcon: activereportIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'Badges',
            href: `/${userData?.slug}/badges`,
            icon: subadminIcon,
            activeIcon: activesubadminIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          },
          {
            name: 'Integrations',
            href: `/${userData?.slug}/integrations`,
            icon: contentIcon,
            activeIcon: activecontentIcon,
            access: true,
            remove: subsData?.account !== 'Expired' ? false : true
          }
        ]);
      } else if (userData?.userType === 5) {
        setSidebarData([
          {
            name: 'Dashboard',
            href: `/partner-dashboard`,
            icon: companyDashboardIcon,
            activeIcon: activecompanyDashboardIcon,
            access: true
          },
          {
            name: 'My Account',
            href: `/partner-account`,
            icon: userIcon,
            activeIcon: activeuserIcon,
            access: true
          },
          {
            name: 'Earnings',
            href: `/partner-earning`,
            icon: earningIcon,
            activeIcon: activeearningIcon,
            access: true
          },
          {
            name: 'Introduce Companies',
            href: `/introduce`,
            icon: contentIcon,
            activeIcon: activecontentIcon,
            access: true
          },
          {
            name: 'Notifications',
            href: `/partner-notification`,
            icon: notiIcon,
            activeIcon: activenotiIcon,
            access: true
          },
          {
            name: 'Legals',
            href: `/partner-legals`,
            icon: cmsIcon,
            activeIcon: activecmsIcon,
            access: true
          },
          {
            name: 'Assets',
            href: `/partner-assets`,
            icon: cmsIcon,
            activeIcon: activecmsIcon,
            access: true
          }
        ]);
      } else if (userData?.userType === 6) {
        setSidebarData([
          {
            name: 'Dashboard',
            href: `/expert-dashboard`,
            icon: companyDashboardIcon,
            activeIcon: activecompanyDashboardIcon,
            access: true,
            isDisabled: userData?.expertApprove === 'false'
          },
          {
            name: 'Schedule',
            href: `/#`,
            icon: userIcon,
            activeIcon: activeuserIcon,
            access: true,
            isDisabled: userData?.expertApprove === 'false'
          },
          {
            name: 'Clients',
            href: `/expert-clients/my-client`,
            icon: earningIcon,
            activeIcon: activeearningIcon,
            access: true,
            isDisabled: userData?.expertApprove === 'false'
          },
          {
            name: 'Notifications',
            href: `/#`,
            icon: notiIcon,
            activeIcon: activenotiIcon,
            access: true,
            isDisabled: userData?.expertApprove === 'false'
          },
          {
            name: 'Me',
            href: `/expert-me`,
            icon: cmsIcon,
            activeIcon: activecmsIcon,
            access: true
          },
          {
            name: 'Payments',
            href: `/#`,
            icon: cmsIcon,
            activeIcon: activecmsIcon,
            access: true,
            isDisabled: userData?.expertApprove === 'false'
          }
        ]);
      } else if (userData?.userType === 1) {
        setSidebarData([
          {
            name: 'Dashboard',
            href: '/dashboard',
            icon: dashboardIcon,
            activeIcon: activedashboardIcon,
            access: true
          },
          {
            name: 'Pod Experts',
            href: `/podExperts`,
            icon: companyDashboardIcon,
            activeIcon: activecompanyDashboardIcon,
            access: true
          },
          {
            name: 'Peap',
            href: '/peap-management',
            icon: dashboardIcon,
            activeIcon: activedashboardIcon,
            access: true
          },
          {
            name: SURVEY_CONSTANT.SURVEY_SIDEBAR_NAME,
            href: `/pulse-survey`,
            icon: approvalIcon,
            activeIcon: activeapprovalIcon,
            access: true
          },
          {
            name: 'B2B',
            href: 'isDropDown',
            icon: contentIcon,
            activeIcon: activecontentIcon,
            access: true,
            isDropDown: true,
            subMenu: [
              {
                name: 'Dashboard',
                href: '/B2B-dashboard',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Company List',
                href: '/B2B-company-list',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Earnings',
                href: '/B2B-earning',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              }
            ]
          },
          {
            name: 'Partnership',
            href: 'isDropDown',
            icon: partnerIcon,
            activeIcon: activecontentIcon,
            access: true,
            isDropDown: true,
            subMenu: [
              {
                name: 'Partner List',
                href: '/partners',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Partner Introduced',
                href: '/partner-introduced',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              }
            ]
          },
          {
            name: 'Users',
            href: '/users',
            icon: userIcon,
            activeIcon: activeuserIcon,
            access: true
          },
          {
            name: 'Earnings',
            href: '/earning',
            icon: earningIcon,
            activeIcon: activeearningIcon,
            access: userData?.moduleAccess?.earning_module_access
          },
          {
            name: 'Management',
            href: 'isDropDown',
            icon: contentIcon,
            activeIcon: activecontentIcon,
            access: true,
            isDropDown: true,
            subMenu: [
              {
                name: 'Focuses / Affirmation Focuses',
                href: '/content-management/focus',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Focus',
                href: '/content-management/focus/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Focus',
                href: '/content-management/focus/view',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Affirmation',
                href: '/content-management/affirmation',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Affirmation',
                href: '/content-management/affirmation/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Affirmation',
                href: '/content-management/affirmation/view',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Meditation',
                href: '/content-management/meditation',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Meditation',
                href: '/content-management/meditation/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Sleep Sounds',
                href: '/content-management/sounds',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Sleep Sounds',
                href: '/content-management/sounds/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Shoorah Rituals',
                href: '/content-management/rituals',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Shoorah Rituals',
                href: '/content-management/rituals/add-edit',
                icon: '',
                activeIcon: '',
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
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Shoorah Pods',
                href: '/content-management/shoorah-pods/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Top Picks',
                href: '/content-management/top-picks',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Top Picks',
                href: '/content-management/top-picks/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              // {
              //   name: 'Manifestation',
              //   href: '/content-management/manifestation',
              //   icon: '',
              //   access: true,
              //   show: true,
              // },
              {
                name: 'Vision Ideas',
                href: '/content-management/vision-ideas',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Vision Ideas',
                href: '/content-management/vision-ideas/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Breathworks',
                href: '/content-management/breathwork',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              }
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
            activeIcon: activenotiIcon,
            access: true
          },
          // { name: 'Article', href: '#', icon: articleIcon, access: true },
          {
            name: 'CMS',
            href: '/cms',
            icon: cmsIcon,
            activeIcon: activecmsIcon,
            access: true
          },
          {
            name: 'Config',
            href: '/config',
            icon: configIcon,
            activeIcon: activeconfigIcon,
            access: true
          },
          {
            name: 'App Issues & Feedback',
            href: 'isDropDown',
            icon: cmsIcon,
            activeIcon: activecontentIcon,
            access: true,
            isDropDown: true,
            subMenu: [
              {
                name: 'App Issues',
                href: '/app-issues',
                icon: cmsIcon,
                activeIcon: activecmsIcon,
                access: !userData?.userType,
                show: true
              },
              {
                name: 'Feedback',
                href: '/app-feedbacks',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              }
            ]
          }
        ]);
      } else {
        setSidebarData([
          {
            name: 'Dashboard',
            href: '/dashboard',
            icon: dashboardIcon,
            activeIcon: activedashboardIcon,
            access: true
          },
          {
            name: 'Pod Experts',
            href: `/podExperts`,
            icon: companyDashboardIcon,
            activeIcon: activecompanyDashboardIcon,
            access: true
          },
          {
            name: 'Peap',
            href: '/peap-management',
            icon: dashboardIcon,
            activeIcon: activedashboardIcon,
            access: true
          },
          {
            name: SURVEY_CONSTANT.SURVEY_SIDEBAR_NAME,
            href: `/pulse-survey`,
            icon: approvalIcon,
            activeIcon: activeapprovalIcon,
            access: true
          },
          {
            name: 'Sub Admins',
            href: '/sub-admins',
            icon: subadminIcon,
            activeIcon: activesubadminIcon,
            access: !userData?.userType
          },
          {
            name: 'B2B',
            href: 'isDropDown',
            icon: contentIcon,
            activeIcon: activecontentIcon,
            access: true,
            isDropDown: true,
            subMenu: [
              {
                name: 'Dashboard',
                href: '/B2B-dashboard',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Company List',
                href: '/B2B-company-list',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Earnings',
                href: '/B2B-earning',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              }
            ]
          },
          {
            name: 'Partnership',
            href: 'isDropDown',
            icon: partnerIcon,
            activeIcon: activecontentIcon,
            access: true,
            isDropDown: true,
            subMenu: [
              {
                name: 'Partner List',
                href: '/partners',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Partner Introduced',
                href: '/partner-introduced',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              }
            ]
          },
          {
            name: 'Users',
            href: '/users',
            icon: userIcon,
            activeIcon: activeuserIcon,
            access: true
          },
          {
            name: 'Content Approval',
            href: '/content-approval',
            icon: approvalIcon,
            activeIcon: activeapprovalIcon,
            access: !userData?.userType
          },
          {
            name: 'Earnings',
            href: '/earning',
            icon: earningIcon,
            activeIcon: activeearningIcon,
            access: userData?.moduleAccess?.earning_module_access
          },
          {
            name: 'Management',
            href: 'isDropDown',
            icon: contentIcon,
            activeIcon: activecontentIcon,
            access: true,
            isDropDown: true,
            subMenu: [
              {
                name: 'Focuses / Affirmation Focuses',
                href: '/content-management/focus',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Focus',
                href: '/content-management/focus/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Focus',
                href: '/content-management/focus/view',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Affirmation',
                href: '/content-management/affirmation',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Affirmation',
                href: '/content-management/affirmation/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Affirmation',
                href: '/content-management/affirmation/view',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Meditation',
                href: '/content-management/meditation',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Meditation',
                href: '/content-management/meditation/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Sleep Sounds',
                href: '/content-management/sounds',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Sleep Sounds',
                href: '/content-management/sounds/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Shoorah Rituals',
                href: '/content-management/rituals',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Shoorah Rituals',
                href: '/content-management/rituals/add-edit',
                icon: '',
                activeIcon: '',
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
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Shoorah Pods',
                href: '/content-management/shoorah-pods/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Top Picks',
                href: '/content-management/top-picks',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Top Picks',
                href: '/content-management/top-picks/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              // {
              //   name: 'Manifestation',
              //   href: '/content-management/manifestation',
              //   icon: '',
              //   access: true,
              //   show: true,
              // },
              {
                name: 'Vision Ideas',
                href: '/content-management/vision-ideas',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              },
              {
                name: 'Vision Ideas',
                href: '/content-management/vision-ideas/add-edit',
                icon: '',
                activeIcon: '',
                access: true,
                show: false
              },
              {
                name: 'Breathworks',
                href: '/content-management/breathwork',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              }
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
            activeIcon: activenotiIcon,
            access: true
          },
          // { name: 'Article', href: '#', icon: articleIcon, access: true },
          {
            name: 'CMS',
            href: '/cms',
            icon: cmsIcon,
            activeIcon: activecmsIcon,
            access: true
          },
          {
            name: 'Config',
            href: '/config',
            icon: configIcon,
            activeIcon: activeconfigIcon,
            access: true
          },
          {
            name: 'App Issues & Feedback',
            href: 'isDropDown',
            icon: cmsIcon,
            activeIcon: activecontentIcon,
            access: true,
            isDropDown: true,
            subMenu: [
              {
                name: 'App Issues',
                href: '/app-issues',
                icon: cmsIcon,
                activeIcon: activecmsIcon,
                access: !userData?.userType,
                show: true
              },
              {
                name: 'Feedback',
                href: '/app-feedbacks',
                icon: '',
                activeIcon: '',
                access: true,
                show: true
              }
            ]
          }
        ]);
      }
    }
  }, [
    subsData,
    setSubsData,
    userData?.expertApprove,
    userData?.id,
    userData?.moduleAccess?.earning_module_access,
    userData?.slug,
    userData?.userType
  ]);

  useEffect(() => {
    if (sidebarData.length) {
      let index = sidebarData.findIndex((data) => {
        if (data.isDropDown && data.subMenu) {
          return data.subMenu.some((subItem) => location?.pathname?.includes(subItem.href));
        }
        return location?.pathname?.includes(data.href);
      });
      if (index !== -1) {
        for (let i = 0; i <= index; i++) {
          if (sidebarData[i].access) {
            // index--;
          } else {
            index--;
          }
        }
      }
      if (index === -1) {
        setActiveIndexAlt(null);
        setActiveIndex(null);
      } else {
        let adjustedIndex = index;
        if (openedSubMenuIndex !== null && openedSubMenuIndex < index) {
          const visibleSubMenus = sidebarData[openedSubMenuIndex]?.subMenu.filter(
            (subItem) => subItem.show
          );
          adjustedIndex += visibleSubMenus.length + visibleSubMenus.length * 0.12;
        }

        setActiveIndexAlt(adjustedIndex);
      }
    }
  }, [location.pathname, sidebarData, openedSubMenuIndex]);

  const getCompanyPlanData = useCallback(() => {
    CompanyApi.getCompanyStatus(userData.companyId)
      .then((res) => {
        if (res?.data?.meta.code === 1) {
          setSubsData(res?.data?.data);
        } else {
          return errorToast('Something went wrong');
        }
      })
      .catch((err) => {
        return errorToast(err);
      });
  }, [userData?.companyId]);

  useEffect(() => {
    if (userData?.userType === 3 || userData?.userType === 4) {
      getCompanyPlanData();
    }
  }, [getCompanyPlanData, userData?.userType]);

  const handleLogout = async () => {
    if (getDeviceToken()) await Api.logoutUser();
    cleanLocalStorage();
    navigate('/login');
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  console.log(activeIndex, 'activeIndex');
  console.log(activeIndexAlt, 'activeIndexAlt');

  return (
    <div className="flex w-full h-full bg-white dark:bg-shoorah-darkBgTabColor relative z-40  shadow-md rounded-2xl overflow-y-auto flex-1 flex-col">
      <div className="h-0 flex-1 relative overflow-y-auto sidebar-container">
        <div className="flex justify-center w-full  sticky z-50 top-0 left-0 bg-white dark:bg-shoorah-darkBgTabColor  items-center px-4 h-[87px] border-b border-shoorah-gray2">
          <img loading='lazy' className="h-6 w-auto dark:invert" src={SidebarLogo} alt="Your Company" />
        </div>
        <nav className=" mt-4 relative mb-[15px]">
          {
            <div
              style={{
                translate: `0 ${activeIndexAlt * 100}%`
              }}
              className={`w-2 h-12 rounded-r-lg bg-shoorah-primary dark:bg-white origin-bottom translate-y-[${
                activeIndex * 100
              }%]  absolute top-0 left-0 transition-all`}
            ></div>
          }
          {sidebarData?.map((item, index) =>
            !item?.access ? (
              ''
            ) : (
              <Menu
                key={index}
                item={item}
                index={index}
                setActiveIndex={setActiveIndex}
                openedSubMenuIndex={openedSubMenuIndex}
                setOpenedSubMenuIndex={setOpenedSubMenuIndex}
              />
            )
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-y-4 justify-center items-center flex-shrink-0 border-t py-6 border-shoorah-gray2 p-4">
        <div className="group block w-full flex-shrink-0 cursor-pointer">
          <div className="flex items-center">
            <Switch
              checked={isDarkModeEnabled}
              onChange={() => {
                setIsDarkModeEnabled(!isDarkModeEnabled);
              }}
              // disabled={disabled}
              className={classNames(
                isDarkModeEnabled ? '' : '',
                'relative dark:border-white border-shoorah-sidebarBackground inline-flex h-4 w-7 flex-shrink-0 cursor-pointer rounded-full border-2  transition-colors duration-200 ease-in-out focus:outline-none'
              )}
            >
              {/* <span className="sr-only">Use setting</span> */}
              <span
                aria-hidden="true"
                className={classNames(
                  isDarkModeEnabled ? 'translate-x-3' : 'translate-x-0',
                  'pointer-events-none inline-block h-3 w-3 transform rounded-full dark:bg-white bg-shoorah-sidebarBackground shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
            <div className="ml-3">
              <p className="text-sm dark:text-white text-shoorah-sidebarBackground font-semibold">
                Darkmode
              </p>
            </div>
          </div>
        </div>
        <div
          className="group block w-full flex-shrink-0 cursor-pointer"
          onClick={() => {
            handleLogout();
          }}
        >
          <div className="flex items-center">
            <div className="bg-shoorah-sidebarBackground dark:bg-white p-1 rounded-[50%]">
              <ArrowRightOnRectangleIcon className="w-[20px] dark:text-shoorah-sidebarBackground text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm dark:text-white text-shoorah-sidebarBackground font-semibold">
                Logout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

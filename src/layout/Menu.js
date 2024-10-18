import { Fragment, useState, useContext, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import { SidebarContext } from '../context/SidebarContext';
import { getLocalStorageItem } from '../utils/helper';
import { errorToast } from '../utils/helper';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const subMenu = [
  {
    name: 'Focus',
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
    name: 'Gratitude',
    href: '/content-management/gratitude',
    icon: '',
    access: true,
    show: true
  },
  {
    name: 'Gratitude',
    href: '/content-management/gratitude/add-edit',
    icon: '',
    access: true,
    show: false
  },
  {
    name: 'Rituals',
    href: '/content-management/rituals',
    icon: '',
    access: true,
    show: true
  },
  {
    name: 'Rituals',
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
  {
    name: 'Sounds',
    href: '/content-management/sounds',
    icon: '',
    access: true,
    show: true
  },
  {
    name: 'Sounds',
    href: '/content-management/sounds/add-edit',
    icon: '',
    access: true,
    show: false
  },
  {
    name: 'Top Picks',
    href: '/content-management/top-picks',
    icon: '',
    access: true,
    show: true
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
];

const Menu = ({ item, setActiveIndex, index, openedSubMenuIndex, setOpenedSubMenuIndex }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setShow } = useContext(SidebarContext);
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

  const getStatus = () => {
    return !!subMenu?.map((item) => item.href)?.includes(location.pathname);
  };

  const [showSubMenu, setShowSubMenu] = useState(getStatus());

  useEffect(() => {
    setShowSubMenu(openedSubMenuIndex === index);
  }, [openedSubMenuIndex, index]);

  const handleRedirect = (link) => {
    if (item?.isDisabled) {
      return errorToast('Access denied..');
    }
    if (window.innerWidth < 1024) {
      setShow(false);
    }
    if (!item.remove) {
      navigate(link);
    } else {
      navigate(`/${userData?.slug}/myCompany`);
    }
  };

  const toggleSubMenu = () => {
    if (showSubMenu) {
      setOpenedSubMenuIndex(null);
    } else {
      setOpenedSubMenuIndex(index);
    }
  };

  return (
    <>
      <div
        key={item.name}
        onClick={() => {
          if (item.href === 'isDropDown') {
            toggleSubMenu();
          } else {
            handleRedirect(item.href);
            setActiveIndex(index);
          }
        }}
        className={classNames(
          location?.pathname?.includes(item.href)
            ? 'font-semibold text-shoorah-newDashboardBlue dark:text-white cursor-pointer '
            : 'text-shoorah-gray2 dark:text-white/60 cursor-pointer',
          'group outline-none mx-2 flex  items-center py-3 px-2 text-sm font-normal rounded-md'
        )}
      >
        {location?.pathname?.includes(item.href) ? (
          <img
            loading='lazy'
            src={item?.activeIcon}
            alt="sidebar_icon"
            className={`mr-3 ml-2 h-6 w-6 dark:invert  flex-shrink-0 text-white`}
          />
        ) : (
          <img
            loading='lazy'
            src={item?.icon}
            alt="sidebar_icon"
            className={`mr-3 ml-2 h-6 w-6 flex-shrink-0 dark:opacity-60 `}
          />
        )}

        {/* <item.icon className={`mr-3 ml-2 h-6 w-6 flex-shrink-0 text-white`} aria-hidden='true' /> */}
        {item.name}
        {item.isDropDown &&
          (showSubMenu ? (
            <ChevronUpIcon className="w-[20px] ml-2" />
          ) : (
            <ChevronDownIcon className="w-[20px] ml-2" />
          ))}
      </div>
      {item.isDropDown && showSubMenu && (
        <Transition
          show={showSubMenu}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="text-shoorah-newDashboardBlue dark:text-white py-2 space-y-2 px-2 bg-shoorah-offWhite dark:bg-shoorah-darkBgColor">
            {item.subMenu?.map((innerItem, subIndex) => {
              return !innerItem.show ? (
                ''
              ) : (
                <div
                  key={subIndex}
                  onClick={() => handleRedirect(innerItem.href)}
                  className={classNames(
                    location?.pathname?.includes(innerItem.href)
                      ? 'bg-gradient-to-r from-shoorah-primary text-white to-shoorah-secondary cursor-pointer'
                      : 'cursor-pointer text-shoorah-gray2',
                    'pl-[20px] mx-4  group outline-none flex  items-center py-3 px-2 text-sm font-normal rounded-md'
                  )}
                >
                  {innerItem.name}
                </div>
              );
            })}
          </div>
        </Transition>
      )}
    </>
  );
};

Menu.propTypes = {
  item: PropTypes.any,
  setActiveIndex: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  openedSubMenuIndex: PropTypes.number,
  setOpenedSubMenuIndex: PropTypes.func.isRequired,
};

export default Menu;

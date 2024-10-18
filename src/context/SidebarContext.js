import { createContext } from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/helper';
export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isShow, setShow] = useState(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(
    JSON.parse(getLocalStorageItem('selectedTheme')) ? true : false
  );

  if (isDarkModeEnabled) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  setLocalStorageItem('selectedTheme', isDarkModeEnabled);

  return (
    <SidebarContext.Provider value={{ isShow, setShow, isDarkModeEnabled, setIsDarkModeEnabled }}>
      {children}
    </SidebarContext.Provider>
  );
};

SidebarProvider.propTypes = {
  children: PropTypes.any
};

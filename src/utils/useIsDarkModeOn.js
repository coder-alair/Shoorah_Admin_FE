import React, { useEffect, useState } from 'react';

const useIsDarkModeOn = () => {
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    setIsDarkModeEnabled(isDarkModeEnabled);
  }, [document.documentElement.classList.contains('dark')]);

  return isDarkModeEnabled;
};

export default useIsDarkModeOn;

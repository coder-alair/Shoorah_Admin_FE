import React, { useEffect, useState } from 'react';

const useUpdateDatePickerTheme = () => {
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkModeEnabled(true);

      var elements = document.getElementsByClassName('rdrCalendarWrapper');

      for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = '#171D2F';
      }
    } else {
      setIsDarkModeEnabled(false);
    }
  });
  return null;
};

export default useUpdateDatePickerTheme;

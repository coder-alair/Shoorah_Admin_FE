import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CONTENT_TYPE, CURRENCY } from './constants';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { DEADOMAINS } from './dea-domains';
import Male from '../assets/images/Male.svg';
import Female from '../assets/images/Female.svg';
import NonBinary from '../assets/images/Non Binary.svg';
import InterSex from '../assets/images/Intersex.svg';
import Trans from '../assets/images/Transgender.svg';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const MaxCharlimit = 100;
export const MaxCharlimitLongText = 1000;
export const getLocalStorageItem = (key) => localStorage.getItem(key);
export const setLocalStorageItem = (key, value) => localStorage.setItem(key, value);
export const removeLocalStorageItem = (key) => localStorage.removeItem(key);
export const cleanLocalStorage = () => localStorage.clear();
export const getJWTToken = () => 'Bearer ' + localStorage.getItem('token');
export const getDeviceToken = () => localStorage.getItem('deviceToken');
export const getUserType = (type) => {
  switch (type) {
    case 0:
      return 'Super Admin';
    // break;
    case 1:
      return 'Sub Admin';
    // break;
    case 3:
      return 'Company Admin';
    // break;
    case 4:
      return 'Company Sub Admin';
    // break;
    case 5:
      return 'Partner';

    case 6:
      return 'Expert';
    // break;

    default:
      return 'N/A';
    // break;
  }
};
// type === 0 ? "Super Admin" : type === 1 ? "Sub Admin" : "Company Admin";
export const getFocusType = (type) => (type === 1 ? 'Main' : 'Affirmation');
export const getMeditationType = (type) => (type === 1 ? 'Video' : 'Audio');

export const getAccountType = (type) =>
  type === 0
    ? 'In Trial'
    : type === 1
    ? 'Not Subscribed'
    : type === 2
    ? 'Subscribed'
    : type === 3
    ? 'Expired'
    : 'N/A';

export const getContentApprovalStatus = (type) => {
  return (
    <p
      className={`inline-flex m-0 rounded-full ${
        type === 1 ? 'bg-green-100' : type === 2 ? 'bg-red-100' : 'bg-orange-100'
      } px-4 py-[6px] text-sm leading-5 capitalize ${
        type === 1 ? 'text-green-400' : type === 2 ? 'text-red-400' : 'text-orange-400'
      }`}
    >
      {type === 1 ? 'Active' : type === 2 ? 'Rejected' : 'Draft'}
    </p>
  );
};

export const getSentToUser = (type) =>
  type === 1
    ? 'All'
    : type === 2
    ? 'In Trial'
    : type === 3
    ? 'Subscribed'
    : type === 4
    ? 'Custom User'
    : type === 5
    ? 'Expired'
    : type === 6
    ? 'Not Subscribed'
    : 'N/A';

export const getContentType = (type) => {
  let returnValue = '';
  CONTENT_TYPE?.forEach((item) => {
    if (item?.value === parseInt(type)) {
      returnValue = item.name;
    }
  });
  return returnValue ? returnValue : 'N/A';
};

export const getMultiBadge = (dataObject) => {
  const keys = Object.keys(dataObject);
  const badgeData = keys.map((key, index) => (
    <p
      key={index}
      className={`inline-flex ${index % 2 === 0 ? 'm-0' : 'mt-2'} rounded-full w-fit bg-${
        COLORS[index]
      }-100 ${`text-${COLORS[index]}-500`} px-3 text-md leading-5 capitalize font-extrabold tracking-normal`}
    >
      {`${key}: ${dataObject[key]}`}
    </p>
  ));

  const badgeColumns = [];
  for (let i = 0; i < badgeData.length; i += 2) {
    badgeColumns.push(
      <div key={i} className="flex flex-col mr-2">
        {badgeData[i]}
        {badgeData[i + 1] && badgeData[i + 1]}
      </div>
    );
  }

  return <div className="flex">{badgeColumns}</div>;
};

const COLORS = ['blue', 'cyan', 'red', 'green'];

export const errorToast = (msg, toastId = '') =>
  toast.error(msg, {
    duration: 2500,
    id: toastId
  });

export const successToast = (msg, duration = 2000) =>
  toast.success(msg, {
    duration
  });

export const informativeToast = (msg, duration = 3000) =>
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-2">
          <div className="flex items-start">
            <div className="self-center">
              <InformationCircleIcon className="w-[24px] text-shoorah-secondary" />
            </div>
            <div className="ml-3 self-center">
              <p className="mt-1 text-gray-500">{msg}</p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration
    }
  );

export const useOutsideClick = (ref, callback) => {
  const handleClick = useCallback(
    (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    },
    [ref, callback]
  );

  useEffect(() => {
    const handleClickOutside = (e) => handleClick(e);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handleClick]);
};

export const capitalize = (value) => {
  let lowerCase = value?.toLowerCase();
  return lowerCase.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
};

export const getFilterKey = (value) => {
  let key = value?.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1);
  let returnKey = key?.toString()?.replaceAll(',', ' ');
  return capitalize(returnKey);
};

export const isSuperAdmin = () => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  return userData?.userType === 0;
};
export const isSubAdmin = () => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  return userData?.userType === 1;
};

export const isSuperAndSubAdmin = () => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  return userData?.userType === 0 || userData?.userType === 1;
};
export const isCopanySuperAdmin = () => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  return userData?.userType === 3;
};
export const isCopanySubAdmin = () => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  return userData?.userType === 4;
};
export const isCopanySuperOrSubAdmin = () => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  return userData?.userType === 3 || userData?.userType === 4;
};

export const isPartner = () => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  return userData?.userType === 5;
};

export const DeadDomainEmail = (email) => {
  const emailDomain = '@' + email.split('@')[1];
  return DEADOMAINS.includes(emailDomain);
};

export const ValueToPercentage = (value, max) => {
  return (value * 100) / max;
};

export const IsLastIndex = (j, length) => {
  return j === length - 1;
};

export const getGender = (type, flag) => {
  switch (type) {
    case 1:
      return flag ? Male : 'Male';
    case 2:
      return flag ? Female : 'Female';
    case 3:
      return flag ? NonBinary : 'Nonbinary';
    case 4:
      return flag ? InterSex : 'Intersex';
    case 5:
      return flag ? Trans : 'Transgender';
    default:
      return 'Not Preferred';
  }
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export const getFileType = (value) => {
  const fileExtension = value?.name?.split('.');
  const finalType = `${value?.type?.split('/')[0]}/${fileExtension[fileExtension?.length - 1]}`;
  return finalType;
};

export const jsonToCsv = (data) => {
  if (!data || data.length === 0) {
    return '';
  }
  const header = Object.keys(data[0]).join(',');
  const rows = data.map((item) => Object.values(item).join(','));
  return `${header}\n${rows.join('\n')}`;
};

export const convertToIndianDate = (date) => {
  if (!date || date === 'N/A') {
    return 'N/A';
  }
  const newDate = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  };
  const indianDate = newDate.toLocaleDateString('en-IN', options);
  return indianDate;
};

export const convertCodeToType = (code) => {
  let type;
  if (code === 0) {
    type = 'In Trial';
  } else if (code === 1) {
    type = 'Not Subscribed';
  } else if (code === 2) {
    type = 'Subscribed';
  } else if (code === 3) {
    type = 'Expired';
  }
  return type;
};

export const convertCodeToPlatform = (code) => {
  let type;
  if (code === 0) {
    type = 'Email';
  } else if (code === 1) {
    type = 'Apple';
  } else if (code === 2) {
    type = 'Gmail';
  } else if (code === 3) {
    type = 'Facebook';
  }
  return type;
};

export const convertCodeToUserType = (code) => {
  let type;
  if (code === 0) {
    type = 'Super Admin';
  } else if (code === 1) {
    type = 'Sub Admin';
  } else if (code === 2) {
    type = 'User';
  } else if (code === 3) {
    type = 'Company Admin';
  } else if (code === 4) {
    type = 'Company Sub Admin';
  } else if (code === 5) {
    type = 'Shoorah Partner';
  }
  return type;
};

export const convertCodeToStatus = (code) => {
  let type;
  if (code === 0) {
    type = 'Inactive';
  } else if (code === 1) {
    type = 'Active';
  }
  return type;
};

export const convertCodeToPurchasedDevice = (code) => {
  let type;
  if (code === 0) {
    type = 'Email';
  } else if (code === 1) {
    type = 'Gmail';
  } else if (code === 2) {
    type = 'Apple';
  } else if (code === 3) {
    type = 'Facebook';
  }
  return type;
};

export const addMonthOnDate = (date, len) => {
  let data = new Date(date);
  var newDate = new Date(data.setMonth(data.getMonth() + parseInt(len)));
  return newDate;
};
export const minusMonthOnDate = (date, len) => {
  let data = new Date(date);
  var newDate = new Date(data.setMonth(data.getMonth() - parseInt(len)));
  return newDate;
};
export const minusDayOnDate = (date, len) => {
  let data = new Date(date);
  var newDate = new Date(data.setDate(data.getDate() - parseInt(len)));
  return newDate;
};

export const monthDiff = (d1, d2) => {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

export const currentDateWithFormat = (date) => {
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  return yyyy + '-' + mm + '-' + dd;
};

// export const getCurrentTime=()=>{
//   const dateTime = new Date();
//   dateTime.setHours(12);
//   dateTime.setMinutes(0);
// }
export const capitalizeFirstLetter = (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : null;
};

export const getCurrencyData = (data) => {
  const data1 = CURRENCY.filter((e) => e.value === data);
  if (data1.length > 0) {
    return data1[0].name;
  } else {
    return '';
  }
};

export const getCurrencyIcon = (data) => {
  const data1 = CURRENCY.filter((e) => e.value === data);
  if (data1.length > 0) {
    return data1[0].icon;
  } else {
    return '';
  }
};

export const dateFormat = (date) => {
  if (date) {
    let date1 = new Date(date);
    let year = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(date1);
    let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date1);
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date1);
    return `${month} ${day},${year}`;
  } else {
    return date;
  }
};

export const downloadOWBMHReportToCSV = (data, fileName) => {
  let graphData = [];
  data.label.forEach((e, i) => {
    let obj = { date: e };
    data.series.forEach((a) => {
      obj[a.name] = `${Math.floor(a.data[i])} %`;
      obj[`${a.name}User`] = a.usersVoted[i];
    });
    graphData.push(obj);
  });
  const header = Object.keys(graphData[0]).join(',');
  const rows = graphData.map((item) => Object.values(item).join(','));
  const csvContent = `${header}\n${rows.join('\n')}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName || 'data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadOWBMHReportToPDF = (data, fileName) => {
  let graphData = [];
  data.label.forEach((e, i) => {
    let obj = { date: e };
    data.series.forEach((a) => {
      obj[a.name] = `${Math.floor(a.data[i])} %`;
      obj[`${a.name}User`] = a.usersVoted[i];
    });
    graphData.push(obj);
  });
  if (graphData.length === 0) {
    return;
  }
  // Create a new jsPDF instance
  const doc = new jsPDF('l');
  autoTable(doc, { html: '' });
  // Define the columns for the table
  const columns = Object.keys(graphData[0]);
  // Set the starting point for the table
  const chunkSize = 50; // Adjust this based on your data size
  // Function to add a chunk of data to the PDF
  const addDataChunkToPDF = (start, end) => {
    const chunk = graphData.slice(start, end);
    if (chunk.length > 0) {
      const data = chunk.map((row) => columns.map((e) => row[e])); // Modify this according to your data
      // Define table options with cell borders and text alignment
      const tableOptions = {
        startY: start === 0 ? 20 : 10, // Starting position from top
        head: [columns], // Table header
        body: data, // Table data
        theme: 'grid', // Apply grid theme for borders
        styles: {
          fontSize: 10,
          cellPadding: 2,
          halign: 'center', // Horizontal text alignment (centered)
          valign: 'middle' // Vertical text alignment (middle)
        }
      };
      // Generate the table in the PDF
      doc.autoTable(tableOptions);
      // Add a new page if needed
      if (end < graphData.length) {
        doc.addPage();
      }
    }
  };

  // Process data in chunks
  for (let i = 0; i < graphData.length; i += chunkSize) {
    const start = i;
    const end = Math.min(i + chunkSize, graphData.length);
    addDataChunkToPDF(start, end);
  }
  // Save the PDF with a filename
  doc.save(fileName);
};

export const convertLargeTextToPDF = (text, fileName) => {
  const doc = new jsPDF();
  const lineHeight = 12; // Adjust this based on your font size and style
  let cursorY = 10; // Initial Y position
  const margins = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10
  };
  const textLines = doc.splitTextToSize(
    text,
    doc.internal.pageSize.getWidth() - margins.left - margins.right
  );
  for (let i = 0; i < textLines.length; i++) {
    if (cursorY + lineHeight > 280) {
      doc.addPage(); // Create a new page if the content exceeds the page height
      cursorY = margins.top;
    }
    doc.text(margins.left, cursorY, textLines[i]);
    cursorY += lineHeight;
  }
  // Save or display the PDF
  doc.save(fileName);
};

export const downloadSingleRadialReportToCSV = (data, fileName, moodName) => {
  const header = data.label.join(',');
  const rows = [data.series.join(',')];
  const csvContent = `${moodName}\n${header}\n${rows.join('\n')}`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName || 'data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadSingleRadialReportToPDF = (data, fileName, moodName) => {
  let graphData = [];
  let obj = {
    [data.label[0]]: data.series[0],
    [data.label[1]]: data.series[1],
    [data.label[2]]: data.series[2]
  };
  graphData.push(obj);
  // Create a new jsPDF instance
  const doc = new jsPDF('l');
  doc.setFontSize(20);
  doc.text(moodName + ' Graph Data', 20, 20);
  autoTable(doc, { html: '' });
  // Define the columns for the table
  const columns = Object.keys(graphData[0]);
  // Set the starting point for the table
  const chunkSize = 50; // Adjust this based on your data size
  // Function to add a chunk of data to the PDF
  const addDataChunkToPDF = (start, end) => {
    const chunk = graphData.slice(start, end);
    if (chunk.length > 0) {
      const data = chunk.map((row) => columns.map((e) => row[e])); // Modify this according to your data
      // Define table options with cell borders and text alignment
      const tableOptions = {
        startY: start === 0 ? 30 : 10, // Starting position from top
        head: [columns], // Table header
        body: data, // Table data
        theme: 'grid', // Apply grid theme for borders
        styles: {
          fontSize: 10,
          cellPadding: 2,
          halign: 'center', // Horizontal text alignment (centered)
          valign: 'middle' // Vertical text alignment (middle)
        }
      };
      // Generate the table in the PDF
      doc.autoTable(tableOptions);
      // Add a new page if needed
      if (end < graphData.length) {
        doc.addPage();
      }
    }
  };

  // Process data in chunks
  for (let i = 0; i < graphData.length; i += chunkSize) {
    const start = i;
    const end = Math.min(i + chunkSize, graphData.length);
    addDataChunkToPDF(start, end);
  }
  // Save the PDF with a filename
  doc.save(fileName);
};

export const surveyNavigate = (pathName, navigate) => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const isCompanyAdmin = Boolean(userData?.companyId);
  const url = !isCompanyAdmin ? pathName : '/' + userData?.slug + pathName;
  navigate(url);
};

export const getPathForSurvey = (pathName) => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  const isCompanyAdmin = Boolean(userData?.companyId);
  return !isCompanyAdmin ? pathName : '/' + userData?.slug + pathName;
};

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const getKeyByValueFromArrayObj = (array, value) => {
  return array?.find((obj) => obj?.value === value)?.name;
};

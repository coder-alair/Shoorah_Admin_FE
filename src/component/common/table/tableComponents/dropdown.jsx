import React from 'react';

const TypeDropdown = ({ data, column, handleDropdownChange, options }) => {
  const handleChange = (value) => {
  
    const selectedOption = options.find((option) => option.value == value);
 
    handleDropdownChange(selectedOption.value,data);
  };
  return (
    <div className="w-[150px] h-[25px] relative">
      {' '}
      {/* Set a fixed width */}
      <div className="relative w-full h-full">
        {/* {JSON.stringify(data)}
        {JSON.stringify(column)}
        {JSON.stringify(options)} */}
        <select
          className={`appearance-none w-full h-full py-1 px-4 rounded-full bg-white text-black ${
            column.style?.opacity || ''
          } ${column.style?.align || ''} ${
            column.style?.textColor || ''
          } text-sm font-normal font-['Work Sans']`}
          value={data?.selectedOption}
          onChange={(e) => handleChange(e.target.value)}
          defaultValue="0"
        >
          <option key={0} value="0" className="bg-white text-black">
            action
          </option>
          {options.map((option) => (
            <option key={option.value + ""} value={option.value} className="bg-white text-black">
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TypeDropdown;

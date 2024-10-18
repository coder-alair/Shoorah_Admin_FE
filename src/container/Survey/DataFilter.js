import { useEffect, useState } from 'react';
import { isSuperAdmin } from '../../utils/helper';

export default function DataFilter({ title = 'Filter By:', onChange, only2Options, selected }) {
  const [type, setType] = useState(only2Options ? 'B2B' : 'All');

  useEffect(() => {
    if (onChange) onChange(type);
  }, [type]);

  useEffect(() => {
    selected &&
      setTimeout(() => {
        setType(selected);
      }, 0);
  }, [selected]);

  const isAllActive = type === 'All';
  const isB2CActive = type === 'B2C';
  const isB2BActive = type === 'B2B';
  const itemClass = 'px-2 rounded cursor-pointer shadow-sm ';

  if (!isSuperAdmin) return <></>;

  return (
    <div className="flex flex-col md:flex-row  gap-2 items-center">
      <div className="text-sm font-medium dark:text-white">{title}</div>
      <div className="flex gap-2 text-sm">
        {!only2Options && (
          <div
            onClick={() => setType('All')}
            className={
              itemClass + (isAllActive ? ' text-white bg-shoorah-secondary ' : ' bg-white ')
            }
          >
            All
          </div>
        )}
        <div
          onClick={() => setType('B2B')}
          className={itemClass + (isB2BActive ? ' text-white bg-shoorah-secondary' : ' bg-white ')}
        >
          B2B
        </div>
        <div
          onClick={() => setType('B2C')}
          className={itemClass + (isB2CActive ? ' text-white bg-shoorah-secondary' : ' bg-white ')}
        >
          B2C
        </div>
      </div>
    </div>
  );
}

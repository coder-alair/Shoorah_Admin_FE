import Notebook from '../../../assets/images/Notebook.svg';

import React from 'react';

const columns = [
  {
    title: 'Name:',
    key: 'profile1',
    sortable: false,
    type: 'profile1',
    align: 'left',
    notes: true
  },
  {
    title: 'Note status:',
    key: 'request',
    type: 'Notebutton',
    align: 'center',
    notes: true
  },
  {
    title: 'Last Session:',
    key: 'date',
    type: 'Notedate',
    align: 'center',
    notes: true
  },
  {
    title: '',
    key: 'sendpush',
    type: 'viewneditpush',
    align: 'center',
    notes: true
  },
  {
    title: '',
    key: 'Viewnotes',
    type: 'Notepush',
    align: 'right',
    notes: true
  }
];

const Myclients = [
  {
    name: 'Daniel James',
    email: 'daniel@halestudio.com',
    date: '17 November 2023',
    id: 1,
    status: 'Notes Done'
  },
  {
    name: 'Jane Mcalistter',
    email: 'jane@halestudio.com',
    date: '17 November 2023',
    id: 2,
    status: 'Add Notes',
    resend: 'Resend in 10 days'
  },
  {
    name: 'Mandy Johnson',
    email: 'mandy@halestudio.com',
    date: '17 November 2023',
    id: 3,
    status: 'Notes Done'
  },
  {
    name: 'Elly Spitch',
    email: 'elly@halestudio.com',
    date: '17 November 2023',
    id: 4,
    status: 'Notes Done'
  },
  {
    name: 'Hanna Zafron',
    email: 'hanna@halestudio.com',
    date: '17 November 2023',
    id: 5,
    status: 'Notes Done'
  },
  {
    name: 'Elly Spitch',
    email: 'elly@halestudio.com',
    date: '17 November 2023',
    id: 6,
    status: 'Notes Done'
  }
];

const Peapclient = () => {
  return (
    <>
      <div className="block pb-10 pt-10 pl-[80px] font-serif ">
        <h1 className="text-3xl font-medium mb-2">My Clients</h1>
        <p className="mb-6 font-light">Here you can find all of your clients!</p>
      </div>
      <div className=" flex justify-center bg-gray w-full font-serif">
        <div className="bg-white w-[95%] rounded-[30px]">
          <div className=" p-6">
            <div className="">
              <table className="min-w-full bg-white  overflow-hidden border-separate border-spacing-0">
                <thead className=" bg-white">
                  <tr
                    className="  bg-white  text-3xl py-19"
                    style={{
                      height: '90px',
                      width: '500px'
                    }}
                  >
                    {columns.map((col, index) => (
                      <th
                        key={index}
                        className={` font-medium   tracking-tight  text-[1.5rem] py-2 px-4 text-left   ${
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {col.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Myclients.map((row, rowIndex) => (
                    <tr key={row.id} className="border-t">
                      {columns.map((col, colIndex) => (
                        <td
                          key={colIndex}
                          className={`pb-[6px] font-medium py-2 px-2 ${
                            col.align === 'center'
                              ? 'text-center'
                              : col.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                          }
                      ${rowIndex % 2 !== 0 ? 'bg-[#e5eaf9]' : ''}
                      ${
                        rowIndex % 2 !== 0 && colIndex === columns.length
                          ? 'rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl'
                          : ''
                      }
                      ${rowIndex === 0 && colIndex === columns.length - 1 ? 'rounded-tr-xl' : ''}
                      ${rowIndex === Myclients.length - 1 && colIndex === 0 ? ' rounded-bl-xl' : ''}
                      ${
                        rowIndex === Myclients.length - 1 && colIndex === columns.length - 1
                          ? ' rounded-tr-xl rounded-br-xl text-xs'
                          : ''
                      }
                      ${rowIndex % 2 !== 0 && colIndex === 0 ? ' rounded-tl-xl  rounded-bl-xl' : ''}
                      ${
                        rowIndex % 2 !== 0 && colIndex === columns.length - 1
                          ? ' rounded-tr-xl rounded-br-xl'
                          : ''
                      }`}
                        >
                          {col.key === 'profile1' ? (
                            <div className=" ml-1">
                              <div className=" text-[16px] leading-none">{row.name}</div>
                              <div className=" pt-1 pb-4 text-[10px] tracking-tighter leading-none text-gray-500">
                                {row.email}
                              </div>
                            </div>
                          ) : col.key === 'request' ? (
                            <button
                              className={`py-[3px] px-5  tracking-tight  rounded-xl ${
                                row.status === 'Add Notes'
                                  ? 'bg-red-500 pl-6 pr-6 text-white'
                                  : 'bg-[#B6C0F3]  text-white'
                              }`}
                            >
                              {row.status}
                            </button>
                          ) : col.key === 'date' ? (
                            row.date
                          ) : col.key === 'Viewnotes' ? (
                            <div className="flex justify-center">
                              <img className="mr-5 w-[25px]" loading='lazy' src={Notebook} alt="notebook" />
                              <button className="text-black underline leading-none pr-1 tracking-tight ">
                                View & edit notes
                              </button>
                            </div>
                          ) : col.key === 'sendpush' ? (
                            row.resend ? (
                              <span className="text-gray-400 ">{row.resend}</span>
                            ) : (
                              <button className="text-black underline leading-none tracking-tight">
                                Send push to book session
                              </button>
                            )
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Peapclient;

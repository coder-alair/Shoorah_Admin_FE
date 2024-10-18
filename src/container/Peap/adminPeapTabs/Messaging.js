import React, { useState, useEffect } from 'react';
import newSearch from '../../../assets/images/newSearch.svg';
import Sendpaperplane from '../../../assets/images/Sendpaperplane.svg';
import Attachment from '../../../assets/images/Attachment.svg';
import { PlayIcon } from '@heroicons/react/24/outline';

const Messaging = () => {
  const initialChats = [
    {
      name: 'Dr. Millie Hale',
      lastMessage: 'Hi there, I have some concerns...',
      messages: [
        {
          text: "Hi Dr. Smith, welcome to Shoorah! I see you've completed your profile and uploaded your DBS and ID checks...",
          time: '09:35am',
          sender: 'me'
        },
        {
          text: 'Hey Lorri, Im glad the verification process went smoothly. Actually, could you please help me update the "Specialisation" section on my profile?',
          time: '09:57am',
          sender: 'them'
        }
      ]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    }
  ];

  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : initialChats;
  });
  const [activeChat, setActiveChat] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatHidden, setIsChatHidden] = useState(true);

  const calculateUnreadCounts = (chats) => {
    return chats.map((chat) => ({ ...chat, unreadCount: chat.messages.length }));
  };

  useEffect(() => {
    const savedUnreadCounts = localStorage.getItem('unreadCounts');
    if (savedUnreadCounts) {
      const unreadCounts = JSON.parse(savedUnreadCounts);
      const newChats = chats.map((chat, index) => ({
        ...chat,
        unreadCount: unreadCounts[index] || chat.unreadCount
      }));
      setChats(newChats);
    } else {
      setChats(calculateUnreadCounts(chats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
    const unreadCounts = chats.map((chat) => chat.unreadCount);
    localStorage.setItem('unreadCounts', JSON.stringify(unreadCounts));
  }, [chats]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newChats = [...chats];
      newChats[activeChat].messages.push({
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'me'
      });
      newChats[activeChat].lastMessage = messageText;
      // newChats[activeChat].unreadCount = newChats[activeChat].messages.length; // Update unread count
      setChats(newChats);
      setMessageText('');
    }
  };

  const handleChatClick = (index) => {
    const newChats = [...chats];
    newChats[index].unreadCount = 0; // Reset unread count when chat is opened
    setChats(newChats);
    setActiveChat(index);
    setIsChatHidden(false);
  };

  const handleCleanLocalStorage = () => {
    localStorage.removeItem('chats');
    localStorage.removeItem('unreadCounts');
    setChats(calculateUnreadCounts(initialChats)); // Reset chats to initial state with calculated unread counts
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row border-gray-300 md:h-[69vh]  overflow-y-hidden rounded-2xl mt-10 ml-5 mr-6 border-2">
      {/* First Part */}
      <div
        className={`flex-col flex-grow h-[45.5rem] ${
          isChatHidden ? 'flex' : 'hidden'
        } md:flex bg-gray-200 border-gray-300 w-auto min-w-[280px] lg:w-[45%] lg:min-w-[10%]`}
      >
        <div className="flex col-span-1 p-7 w-full justify-center items-center border rounded-2xl min-h-[7.5rem]">
          <div className="col-span-10 flex w-[100%] h-11 justify-center items-center  bg-white rounded-2xl border-2 border-gray-300">
            <img className=" col-span-2 w-[24px] h-[24px]" loading='lazy' src={newSearch} alt="seachicon" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="  font-normal text-base w-[80%] h-full rounded-2xl  mt-5  mb-5 pl-4 focus:outline-none "
            />
          </div>
        </div>
        {/* flex-grow  */}
        <ul className="grid grid-cols-1 w-full overflow-y-auto no-scrollbar">
          {filteredChats.map((chat, index) => (
            <li
              key={index}
              onClick={() => handleChatClick(chats.indexOf(chat))}
              className={`flex pl-2 py-5 pr-2 cursor-pointer ${
                chats.indexOf(chat) === activeChat
                  ? 'w-full bg-shoorah-secondary bg-opacity-15 border-l-[3px] border-shoorah-secondary'
                  : ''
              }`}
            >
              <div className=" ml-3 flex w-full flex-row pl-2  items-center align-middle justify-center  max-h-[10rem] ">
                <div className="w-[55px] h-[55px] flex overflow-hidden rounded-full mr-2 min-w-[55px]">
                  <img loading='lazy' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHORVLY3-9bljdur2Lmf-bFufXufDUrwF92g&s" />
                </div>

                <div className=" grid grid-cols-1 w-full pl-1 mr-[8px] max-h-[55px]">
                  <div className="flex flex-col w-full justify-around">
                    <div className="flex text-sm gap-x-8 justify-between items-center w-70 font-semibold">
                      <span className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                        {chat.name}
                      </span>
                      <span className="text-xs w-10 font-medium flex justify-end">{'14:00'}</span>
                    </div>
                    <span className="text-xs text-black font-medium">Therapist</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xs w-[80%]  max-h-[14px]  pb-5 pt-1  text-shoorah-gray4 truncate">
                      {chat.lastMessage}
                    </div>

                    <div className="flex pt-1 align-bottom">
                      <div
                        className={`text-sm ml-5 flex w-4 h-4 ${
                          chat.unreadCount <= 0 ? 'opacity-0' : ''
                        }  items-center justify-center rounded-full  text-white bg-shoorah-secondary `}
                      >
                        {chat.unreadCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Second Part */}
      <div
        className={` flex-col min-w-[65%] ${
          isChatHidden ? 'hidden' : 'flex'
        } md:flex w-full overflow-hidden   justify-between rounded-none sm:rounded-tr-xl   rounded-br-xl`}
      >
        <div className="pl-4 flex h-[9.5rem] bg-gray-300 items-center rounded-none sm:rounded-tr-xl cursor-pointer text-black">
          <div className={`block md:hidden`} onClick={() => setIsChatHidden(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex w-[55px] h-[55px] rounded-full ml-6 mr-8 overflow-hidden">
            <img loading='lazy' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHORVLY3-9bljdur2Lmf-bFufXufDUrwF92g&s" />
          </div>
          <div>
            <div className="font-medium text-xl tracking-wide">{chats[activeChat].name}</div>
            <div className="text-sm font-medium leading-none text-black">Therapist</div>
          </div>
        </div>

        <div className=" overflow-hidden flex  flex-col w-full h-[39rem] border-gray-400  bg-gray-100  ">
          <div className="max-w-full overflow-y-auto flex flex-col  bg-gray-100">
            <div className="flex-grow overflow-y-auto no-scrollbar">
              {chats[activeChat].messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.sender === 'me' ? 'text-right pt-3 z-0 pr-0' : 'z-0 pt-4 '
                  }`}
                >
                  <div
                    className={`inline-block p-2  ${
                      message.sender === 'me'
                        ? 'mr-8 ml-24 w-auto rounded-2xl  max-w-[32rem] h-full bg-shoorah-secondary bg-opacity-15  text-shoorah-gray4'
                        : 'ml-8 w-auto rounded-2xl mr-24 max-w-[32rem] h-full bg-shoorah-secondary text-white '
                    }`}
                  >
                    <div className="text-sm flex flex-col gap-3">
                      <div
                        className={`flex flex-col text-start mt-2 mb-2 ml-5 mr-5 justify-center whitespace-pre-line`}
                      >
                        <span>{message.text}</span>
                        <div
                          className={`text-sm ${
                            message.sender === 'me' ? 'text-end' : 'text-start'
                          } tracking-tighter leading-none mt-3`}
                        >
                          {message.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" z-10 w-full h-[6rem] bg-gray-300    flex relative items-center   justify-evenly   rounded-br-lg   pr-10 pl-10    ">
          <div className="bg-gray-200 border border-gray-300  flex min-h-12 w-full items-center   justify-evenly   rounded-full ">
            <button
              onClick={handleCleanLocalStorage}
              className=" flex items-center  bg-shoorah-secondary justify-center min-w-8 min-h-8 relative left-2  text-white rounded-full overflow-hidden"
            >
              <img src={Attachment} loading='lazy'/>
            </button>

            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex z-10 w-full pl-4 max-h-8 border-none focus:outline-none ml-3 mr-3 sm:ml-3 sm:mr-3 resize-none translate-y-1 bg-transparent"
            />

            <button
              onClick={handleSendMessage}
              className="flex items-center justify-center min-w-8 min-h-8 text-white relative right-2 bg-shoorah-secondary rounded-full overflow-hidden"
            >
              <img src={Sendpaperplane} loading='lazy'/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;

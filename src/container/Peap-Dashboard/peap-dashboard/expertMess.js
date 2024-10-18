import React, { useState, useEffect } from 'react';
import newSearch from '../../../assets/images/newSearch.svg';
import Sendpaperplane from '../../../assets/images/Sendpaperplane.svg';
import Attachment from '../../../assets/images/Attachment.svg';

const Expertmess = () => {
  const initialChats = [
    {
      name: 'Millie Hale',
      lastMessage: 'Hi there, I have some concerns...',
      messages: [
        {
          text: "Hi Dr. Smith, welcome to Shoorah! I see you've completed your profile and uploaded your DBS and ID checks...",
          time: '09:35am',
          sender: 'them'
        },
        {
          text: 'Hey Lorri, Im glad the verification process went smoothly. Actually, could you please help me update the "Specialisation" section on my profile?',
          time: '09:57am',
          sender: 'them'
        }
      ]
    },
    {
      name: 'John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'Dr. John Doe',
      lastMessage: 'Can we reschedule our meeting?',
      messages: [{ text: 'Can we reschedule our meeting?', time: '10:00am', sender: 'them' }]
    },
    {
      name: 'John Doe',
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
    <div className="    pl-5 pr-5 bg-gray pt-8 font-serif  ">
      <div className=" relative top-[-10px]">
        <h1 className="text-3xl  ">My Messages</h1>
        <p className="text-gray-900 mt-4 ">
          Your Shoorah Conversations: Access All Your Messages in One Place.
        </p>
        <div className="flex justify-end  relative top-[-1rem] ">
          <button className=" bg-[#4a56db] py-3 px-4   text-white w-[180px] h-[37px] rounded-xl tracking-tighter leading-none justify-center  text-xs ">
            + New Chat
          </button>
        </div>
      </div>

      <div className="  flex flex-col sm:grid sm:grid-cols-12 border-gray-300 w-full rounded-2xl  mt-0     border-2 overflow-hidden  font-serif">
        <div className=" flex flex-col col-span-4 w-full  h-[52.5rem] rounded-none sm:rounded-l-xl  bg-gray-200 border-gray-300  ">
          <div className=" flex  h-[13rem] w-full  justify-center items-center  rounded-2xl  ">
            <div className="flex w-[80%] pl-5 pr-5   h-12  justify-center items-center  bg-white rounded-2xl border-2 border-gray-300   ">
              <img className="w-[15px] h-[15px]" loading='lazy' src={newSearch} alt="seachicon" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="  font-light text-md w-[90%]   h-10 rounded-2xl  mt-5  mb-5 p-4  focus:outline-none "
              />
            </div>
          </div>
          <ul className="  flex flex-col overflow-y-auto  xl:overflow-x-hidden ">
            {filteredChats.map((chat, index) => (
              <li
                key={index}
                onClick={() => handleChatClick(chats.indexOf(chat))}
                className={` flex pl-0 pt-5 pb-6 pr-4 cursor-pointer ${
                  chats.indexOf(chat) === activeChat ? 'w-full bg-[#B6C0F3] bg-opacity-35 ' : ''
                }`}
              >
                <div className=" ml-3 flex w-full flex-row pl-3  items-center align-middle justify-center  max-h-[10rem] ">
                  <div className="grid grid-cols-1 justify-center items-center align-middle      lg:w-[5.5rem] lg:h-[4rem]         md:w-[4.95rem] md:h-[3.8rem]       xl:w-[5.15rem]   xl:h-[4.1rem] rounded-full mr-2 bg-[#4a56db]">
                    {/* Image goes here */}
                  </div>

                  <div className=" grid grid-cols-1 w-full pl-1 ">
                    <div className="flex w-full">
                      <div className="flex flex-col text-sm  justify-between  w-[80%]  ">
                        {chat.name} <div className="text-sm text-black">Therapist</div>
                      </div>
                      <div className="text-sm text-gray-500 flex  justify-end">{'14:00'}</div>
                    </div>
                    <div className="flex  ">
                      <p className="text-sm w-[80%]  max-h-[14px]  pb-5 pt-3  text-gray-400 truncate">
                        {chat.lastMessage}...
                      </p>

                      <div className="flex pt-2 align-bottom">
                        {chat.unreadCount > 0 && (
                          <div className="  text-sm  font-sans ml-5 flex w-6 h-6 items-center justify-center rounded-full  text-white bg-[#4a56db] ">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className=" flex flex-col col-span-8 overflow-hidden w-full h-[52.5rem]   justify-between rounded-none sm:rounded-tr-xl rounded-br-xl  ">
          <div className=" pl-4 flex   h-40    bg-gray-300  items-center rounded-none sm:rounded-tr-xl  text-black">
            <div className="flex justify-center items-center text-white text-5xl   bg-[#4a56db] w-[60px]   h-[60px]  rounded-full  ml-10 mr-10 font-sans">
              <p>{chats[activeChat].name[0]} </p>
            </div>
            <div>
              <div className="font-medium text-2xl tracking-wide">{chats[activeChat].name}</div>
              <div className="text-sm leading-none text-black">Therapist</div>
            </div>
          </div>

          <div className=" overflow-hidden flex  flex-col w-full border-gray-400  ">
            <div className=" w-full h-[47rem]  flex flex-col  bg-gray-100">
              <div className="flex-grow overflow-y-auto">
                {chats[activeChat].messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.sender === 'me' ? 'text-right pt-4  z-0 pr-4' : 'z-0 pt-4 '
                    }`}
                  >
                    <div
                      className={`inline-block p-2  ${
                        message.sender === 'me'
                          ? 'mr-2    w-auto rounded-2xl  max-w-[450px] bg-[#4a56db]     text-white  '
                          : ' ml-4 w-auto rounded-2xl  max-w-[450px] bg-[#e5eaf9] text-gray-400'
                      }`}
                    >
                      <div className="text-sm flex flex-col gap-3">
                        <div
                          className={` flex flex-col  mt-2 mb-2 ml-5 mr-5 $ {
                                    message.sender === 'me' 
                                    ? 'text-end'
                                    : 'text-start
                                  }`}
                        >
                          {message.text}
                          <div className=" mt-5"> {message.time}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className=" z-10 w-full h-[8rem] bg-gray-300    flex relative items-center   justify-evenly   rounded-br-xl p-5  ">
            <div className="  bg-gray-100   py-2 border border-gray-300  flex  w-full h-[5rem] items-center   justify-evenly   rounded-2xl ">
              <button
                onClick={handleCleanLocalStorage}
                className=" flex items-center  bg-[#4a56db]   justify-center w-11  h-9   text-white rounded-full  ml-6"
              >
                <img loading='lazy' src="https://img.freepik.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg" />
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="  pl-8 bg-gray-100  flex z-10 w-full h-16 p-2 border-none focus:outline-none"
              />

              <button
                onClick={handleSendMessage}
                className="flex items-center justify-center w-11 h-9 text-white  bg-[#4a56db] rounded-full mr-2 mr-5"
              >
                <img loading='lazy' src={Sendpaperplane} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expertmess;

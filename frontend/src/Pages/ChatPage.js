import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  // use axios to fetch chat data from backend, then render it on frontend in this component
  const fetchChats = async () => {
    // this api comes from what we created in server.js in backend
    const { data } = await axios.get('/api/chat');

    // console.log(data);
    setChats(data);
  };

  // useEffect to run when the component is rendered for the first time
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
};

export default ChatPage;

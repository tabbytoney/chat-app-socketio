import React, { useState } from 'react';

import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/Misc/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
  // get user state from context in ChatState

  const { user } = ChatState();
  // to update the chat list
  const [fetchAgain, setFetchAgain] = useState();
  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box
        display='flex'
        // change alignment of the chat placement here
        justifyContent='center'
        width='100%'
        h='91.5vh'
        p='10px'
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;

// The below was used inside the component when we were doing dummy data
// const [chats, setChats] = useState([]);
// // use axios to fetch chat data from backend, then render it on frontend in this component
// const fetchChats = async () => {
//   // this api comes from what we created in server.js in backend
//   const { data } = await axios.get('/api/chat');

//   // console.log(data);
//   setChats(data);
// };

// // useEffect to run when the component is rendered for the first time
// useEffect(() => {
//   fetchChats();
// }, []);

// return (
//   <div>
//     {chats.map((chat) => (
//       <div key={chat._id}>{chat.chatName}</div>
//     ))}
//   </div>
// );

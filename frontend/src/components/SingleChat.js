import {
  IconButton,
  Spinner,
  useToast,
  Box,
  Text,
  Input,
  FormControl,
} from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import { getSender, getSenderFull } from '../config/ChatLogics';
import { useState, useEffect } from 'react';
import axios from 'axios';

import ProfileModal from './Misc/ProfileModal';
import ScrollableChat from './ScrollableChat';
// import Lottie from 'react-lottie';
// import animationData from '../animations/typing.json';

import io from 'socket.io-client';
import UpdateGroupChatModal from './Misc/UpdateGroupChatModel';
import { ChatState } from '../Context/ChatProvider';

// socketio thing
const ENDPOINT = 'http://localhost:3000'; // "https://talk-a-tive.herokuapp.com"; -> After deployment
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  // const [typing, setTyping] = useState(false);
  // const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const { user, selectedChat, setSelectedChat } = ChatState();

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      //  socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage('');
        // send message with the post api
        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        console.log(data);
        // 'new message' matches a 'new message' on a socket thing in server.js
        socket.emit('new message', data);

        // add this new message to the array of all the messages
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Error occured!',
          description: 'Failed to send the message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // if (!socketConnected) return;

    // if (!typing) {
    //   setTyping(true);
    //   socket.emit('typing', selectedChat._id);
    // }
    // let lastTypingTime = new Date().getTime();
    // let timerLength = 3000;
    // setTimeout(() => {
    //   let timeNow = new Date().getTime();
    //   let timeDiff = timeNow - lastTypingTime;
    //   if (timeDiff >= timerLength && typing) {
    //     socket.emit('stop typing', selectedChat._id);
    //     setTyping(false);
    //   }
    // }, timerLength);
  };

  // get all messages
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      // search for all messages from a particular chat
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log(data);
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error occured!',
        description: 'Failed to load the messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  // socketio useEffect, this useEffect has to go before other useEffects
  useEffect(() => {
    // starts socketio
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    // socket.on('typing', () => setIsTyping(true));
    // socket.on('stop typing', () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    // see messages real time with the below line. Compare current chat to  most recent chats, see if they're different and need to be updated
    selectedChatCompare = selectedChat;
    // rerun and update this when the chat changes
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // if (!notification.includes(newMessageRecieved)) {
        //   setNotification([newMessageRecieved, ...notification]);
        //   setFetchAgain(!fetchAgain);
        // }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work sans'
            display='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
            color='orange.900'
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<MdArrowBack size='20px' />}
              bgColor='beige'
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display='flex'
            flexDir='column'
            justifyContent='flex-end'
            p={3}
            bg='orange.100'
            w='100%'
            h='100%'
            borderRadius='lg'
            overflowY='hidden'
          >
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
                color='orange.900'
              />
            ) : (
              // Displaying the messages
              <Box
                className='messages'
                display='flex'
                flex-direction='column'
                overflowY='scroll'
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id='first-name'
              isRequired
              mt={3}
            >
              <Input
                variant='filled'
                bgColor='beige'
                borderRadius='lg'
                borderWidth='1px'
                borderColor='orange.200'
                placeholder='Enter a message...'
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          h='100%'
        >
          <Text fontSize='3xl' pb={3} fontFamily='Work sans' color='orange.900'>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

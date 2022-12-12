// import './styles.css';
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
// import { useEffect, useState } from 'react';
// import axios from 'axios';

import ProfileModal from './Misc/ProfileModal';
// import ScrollableChat from './ScrollableChat';
// import Lottie from 'react-lottie';
// import animationData from '../animations/typing.json';

// import io from 'socket.io-client';
import UpdateGroupChatModal from './Misc/UpdateGroupChatModel';
import { ChatState } from '../Context/ChatProvider';
// const ENDPOINT = 'http://localhost:3000'; // "https://talk-a-tive.herokuapp.com"; -> After deployment
// let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

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
            Messages here
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

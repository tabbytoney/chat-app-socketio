import { Avatar, Tooltip, Box } from '@chakra-ui/react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        //   mapping through all the messages. m = current messge, i = index
        messages.map((m, i) => (
          <Box display='flex' key={m._id}>
            {/* profile pic only shows for last message, for when mulitple messages are sent */}
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                <Avatar
                  mt='7px'
                  mr={-8}
                  size='sm'
                  cursor='pointer'
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <Box
              backgroundColor={`${
                m.sender._id === user._id ? 'orange.400' : 'orange.200'
              }`}
              ml='40px'
              mt='10px'
              borderRadius='20px'
              p={'5px 15px'}
              maxW='90%'
              //   style={{
              //     backgroundColor: `${
              //       m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'
              //     }`,
              //     marginLeft: isSameSenderMargin(messages, m, i, user._id),
              //     marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              //     borderRadius: '20px',
              //     padding: '5px 15px',
              //     maxWidth: '75%',
              //   }}
            >
              {/* Render the message content */}
              {m.content}
            </Box>
          </Box>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

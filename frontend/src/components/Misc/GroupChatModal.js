import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  // add these users to our selected users
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: 'User already added!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
    // changes this state - add these users to our selected users
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    // search for users
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // searching for users with axios
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to load search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const handleDelete = (delUser) => {
    // delete the selected user by its id
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  // create the chat
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: 'Please fill all the feilds',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // using the api to create a new group
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      // change state by adding new chat to the list of existing chats (aka data here)
      setChats([data, ...chats]);
      onClose();
      toast({
        title: 'New Group Chat Created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } catch (error) {
      toast({
        title: 'Failed to Create the Chat!',
        description: error.response.data,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent bgColor='beige'>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
            color='orange.900'
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center'>
            <FormControl>
              <Input
                placeholder='Chat Name'
                mb={3}
                // Changes group chat name chat as we update it
                onChange={(e) => setGroupChatName(e.target.value)}
                borderColor='orange.300'
                focusBorderColor='orange.500'
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add Users'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                borderColor='orange.300'
                focusBorderColor='orange.500'
              />
            </FormControl>
            <Box width='100%' display='flex' flexWrap='wrap'>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {/* if loading, show loading text. If not, show search results by mapping through array of users 
            slice - only show 4 search results at a time */}
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  // add to our selected users array
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme='orange'>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;

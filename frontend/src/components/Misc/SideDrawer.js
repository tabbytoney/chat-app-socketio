import { useState } from 'react';
import {
  Box,
  Button,
  Tooltip,
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { MdSearch, MdDoorbell, MdKeyboardArrowDown } from 'react-icons/md';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // import user state from ChatState provider
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        // need JWT token of the logged in user
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      //  how to search for the user, search for user
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      // change the state - state is updated with the received data
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      // search for chats for that user id
      const { data } = await axios.post('/api/chat', { userId }, config);

      // if the chat already exists in the ChatState, then it'll just update the list with setChats
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      // close the side drawer after clicking on a chat
      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        bg='beige'
        w='100%'
        px='10px'
        py='5px'
        // p='5px 10px 5px 10px'
      >
        <Tooltip label='Search users to chat' hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen} color='orange.900'>
            <Icon as={MdSearch} boxSize='20px' />
            <Text
              display={{ base: 'none', md: 'flex' }}
              px={1}
              fontFamily='Work sans'
              fontSize='xl'
              fontWeight='normal'
            >
              Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize='2xl' fontFamily='Work sans' color='orange.900'>
          T's Chat App
        </Text>
        <Box>
          <Menu>
            <MenuButton mr={0} mt={2}>
              <Icon as={MdDoorbell} boxSize='30px' mb={1}></Icon>
            </MenuButton>
            {/* For notifications */}
            {/* <MenuList></MenuList> */}
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<MdKeyboardArrowDown size={25} />}
              bgColor='beige'
              mt={-6}
              pr={-2}
            >
              <Avatar
                size='sm'
                cursor='pointer'
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bgColor='beige'>
          <DrawerHeader borderBottomWidth='1px' color='orange.900'>
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                borderColor='orange.300'
                focusBorderColor='orange.500'
              />
              <Button colorScheme='orange' onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {/* render the search results */}
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <Spinner ml='auto' display='flex' color='orange.900' />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

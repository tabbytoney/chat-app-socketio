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
} from '@chakra-ui/react';
import {
  MdSearch,
  MdMenu,
  MdDoorbell,
  MdKeyboardArrowDown,
} from 'react-icons/md';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  // import user state from ChatState provider
  const { user } = ChatState();

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
          <Button variant='ghost' color='orange.900'>
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
              <ProfileModal>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
    </>
  );
};

export default SideDrawer;

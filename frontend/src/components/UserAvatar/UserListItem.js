import React from 'react';
import { Box, Avatar, Text } from '@chakra-ui/react';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor='pointer'
      bg='orange.100'
      _hover={{
        background: 'orange.200',
        color: 'orange.900',
      }}
      w='100%'
      display='flex'
      alignItems='center'
      color='orange.900'
      px={3}
      py={2}
      mb={2}
      borderRadius='lg'
    >
      <Avatar
        mr={2}
        size='sm'
        cursor='pointer'
        name={user.name}
        src={user.pic}
      />
      <Box fontFamily='Work sans' fontWeight='semibold'>
        <Text>{user.name}</Text>
        <Text fontSize='xs'>
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;

import { MdClose } from 'react-icons/md';
import { Badge, Icon } from '@chakra-ui/react';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius='lg'
      m={1}
      mb={2}
      variant='solid'
      fontSize={12}
      colorScheme='orange'
      cursor='pointer'
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <Icon as={MdClose} pl={1} color='white' boxSize={4} pt={1.5} />
    </Badge>
  );
};

export default UserBadgeItem;

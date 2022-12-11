import { useDisclosure, IconButton, Box } from '@chakra-ui/react';
import React from 'react';
import { MdRemoveRedEye } from 'react-icons/md';

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {/* If children provided, display that */}
      {children ? (
        <Box onClick={onOpen}>{children}</Box>
      ) : (
        <IconButton
          display={{ base: 'flex' }}
          icon={<MdRemoveRedEye />}
          onClick={onOpen}
        />
      )}
    </>
  );
};

export default ProfileModal;

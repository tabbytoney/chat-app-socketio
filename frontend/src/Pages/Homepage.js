import React from 'react';
import {
  Container,
  Box,
  Text,
  Tabs,
  Tab,
  TabPanel,
  TabPanels,
  TabList,
} from '@chakra-ui/react';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';

const Homepage = () => {
  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        p={3}
        bg='white'
        w='100%'
        m='40px 0 15px 0'
        borderRadius='lg'
        borderWidth='1px'
      >
        <Text
          textAlign='center'
          fontSize='4xl'
          fontWeight='bold'
          fontFamily='work sans'
          color='orange.700'
        >
          T's Chat App
        </Text>
      </Box>
      <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px'>
        <Tabs variant='soft-rounded' colorScheme='orange'>
          <TabList mb='1em'>
            <Tab color='orange.900' width='50%'>
              Login
            </Tab>
            <Tab color='orange.900' width='50%'>
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;

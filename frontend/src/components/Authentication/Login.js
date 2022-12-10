import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please fill in both fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          // try Content-type if this has a problem
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/user/login',
        {
          email,
          password,
        },
        config
      );
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      // add data to local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      // if registration is successful, push the user to the chats page
      history.push('/chats');
    } catch (error) {
      toast({
        title: 'Error occurred',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };
  return (
    <VStack>
      {/*  Email */}
      <FormControl id='email' isRequired>
        <FormLabel color='orange.900'>Email</FormLabel>
        <Input
          placeholder='Enter Your Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      {/* Password */}
      <FormControl id='password' isRequired>
        <FormLabel color='orange.900'>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Enter Your Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width='4.5rem'>
            <Button
              h='1.75rem'
              size='sm'
              color='orange.900'
              backgroundColor='orange.100'
              onClick={handleClick}
            >
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme='orange'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant='solid'
        colorScheme='red'
        width='100%'
        onClick={() => {
          setEmail('guest@example.com');
          setPassword('12345');
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;

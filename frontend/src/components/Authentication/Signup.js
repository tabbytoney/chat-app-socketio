import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const history = useHistory();

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: 'Please select an image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app-socketio');
      data.append('cloud_name', 'dvgyppwpm');
      fetch('https://api.cloudinary.com/v1_1/dvgyppwpm/image/upload', {
        method: 'post',
        body: data,
      })
        // whatever response we get, we're going to convert into json
        .then((res) => res.json())
        // then we'll take that json and set our pic state
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please select a jpeg or png image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: 'Please fill out all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: 'Passwords do not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    // if info is all there and passwords match, store in the db
    try {
      const config = {
        headers: {
          // try Content-type if this has a problem
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/user',
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      toast({
        title: 'Registration successful',
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
    <VStack spacing='5px'>
      {/*  Name */}
      <FormControl id='first-name' isRequired>
        <FormLabel color='orange.900'>Name</FormLabel>
        <Input
          placeholder='Enter Your Name'
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      {/*  Email */}
      <FormControl id='email' isRequired>
        <FormLabel color='orange.900'>Email</FormLabel>
        <Input
          placeholder='Enter Your Email'
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
      {/* Confirm password */}
      <FormControl id='confirm-password' isRequired>
        <FormLabel color='orange.900'>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Confirm Your Password'
            onChange={(e) => setConfirmpassword(e.target.value)}
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
      {/*  Pic */}
      <FormControl id='pic'>
        <FormLabel color='orange.900'>Upload Your Picture</FormLabel>
        <Input
          color='orange.200'
          type='file'
          p={1.5}
          accept='image/*'
          //   will just accept the first image if they upload multiple
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme='orange'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;

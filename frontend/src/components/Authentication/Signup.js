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

const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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
      // setloading to false
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

  const submitHandler = () => {};

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

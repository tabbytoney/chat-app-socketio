const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

// async handler is from express-async-handler package
const registerUser = asyncHandler(async (req, res) => {
  // this info actually comes from the front end
  const { name, email, password, pic } = req.body;

  // check if any are undefined
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please Enter Required Fields');
  }

  // check if user already exists in the db - we are querying the db
  // User is the model we created. findOne() is a mongofb thing
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists!');
  }

  // if doesnt exist, create this user. create() makes a new one
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  // if user is successfully created, get the user info back to validate it's there
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      // after a new user is register, create and send a JWT token
      token: generateToken(user._id),
    });
    // it ^ fails and user isn't created:
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // checks if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
    // if the password doesnt match or user doesnt exist
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = { registerUser, authUser };

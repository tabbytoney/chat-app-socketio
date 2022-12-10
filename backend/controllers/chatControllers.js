const asyncHandler = require('express-async-handler');
const { chats } = require('../data/data');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// creating or fetching 1-1 chat
const accessChat = asyncHandler(async (req, res) => {
  // need current logged in user id to create chat
  const { userId } = req.body;

  if (!userId) {
    console.log('UserId param not sent with request');
    return res.sendStatus(400);
  }

  // the fields inside the find() are from the chatModel
  // $and is like && for mongo
  let isChat = await Chat.find({
    isGroupChat: false,
    // should match chatModel > users [{}] - the elements inside that object, the user id should equal the current logged in user
    // or the other user in the chat
    // $eq = equals
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      // or should match the other user sent in the chat
      { users: { $elemMatch: { $eq: req.userId } } },
    ],
    // if both the users are found, populate the users array (the user array in the chatModel), minus the password
  })
    .populate('users', '-password')
    .populate('latestMessage');

  // from chatModel > latestMessage > messageModel > sender
  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  });

  if (isChat.length > 0) {
    // send first result (there should only be one chat)
    res.send(isChat[0]);
    // if no chat exists, create one
  } else {
    let chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    // query and store new chat in the db
    try {
      const createdChat = await Chat.create(chatData);
      // return the chat to the user
      // camel case maybe problem
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  // check which user is logged in, query for all their chats
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }

  // simple version, just returns all chats for the currently logged in user:
  //  try {
  //     Chat.find({
  //       users: { $elemMatch: { $eq: req.user._id } },
  //     }).then((result) => res.send(result));
  //   } catch (error) {}
  // });
});

const createGroupChat = asyncHandler(async (req, res) => {
  // take a bunch of users from the body, take the name of the group chat
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please fill out all fields' });
  }

  // will come as a string from the front end, will be parsed into an object and sent to backend
  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send('More than two users are required for a group chat.');
  }

  // add the users
  users.push(req.user);

  // Create the group chat
  // Note: group admin will be the user creating the group
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    // add/get info from db
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', 'password');
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      // for clarity, doesnt' need :chatname
      chatName: chatName,
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', 'password');

  if (!updatedChat) {
    res.status(404);
    throw new Error('Chat not found!');
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      // adds to list of users already in the group
      $push: { users: userId },
    },
    // return the new chat with updated list of users
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', 'password');

  if (!added) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      // adds to list of users already in the group
      $pull: { users: userId },
    },
    // return the new chat with updated list of users
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', 'password');

  if (!removed) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};

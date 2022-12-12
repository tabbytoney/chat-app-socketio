const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

// Get all messages from a chat
const allMessages = asyncHandler(async (req, res) => {
  try {
    // find all messages by its chatId
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat');
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Create new message
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log('Invalid data passed into request');
    return res.sendStatus(400);
  }

  // this is from the messageModel fields
  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    // Note: dont need this in new version of mongoose - we are populating a particular instance of Message, so we need execPopulate(mongoose thing)
    message = await message.populate('sender', 'name pic');
    // populate everything in chat objext
    message = await message.populate('chat');
    // populate each of the users (fields from User model)
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });

    // find that chat by its id and update it with the most recent (latest) message
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };

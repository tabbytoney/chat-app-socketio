const express = require('express');
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require('../controllers/chatControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// for accessing the chat or creating the chat
// protect means if the user isnt logged in, they cant access this route
router.route('/').post(protect, accessChat);
// get all chats for the logged in user
router.route('/').get(protect, fetchChats);
// for creating a group chat
router.route('/group').post(protect, createGroupChat);
// for renaming group chat
router.route('/rename').put(protect, renameGroup);
// remove a user from group or leave groupe
router.route('/groupremove').put(protect, removeFromGroup);
// add someone to the group
router.route('/groupadd').put(protect, addToGroup);

module.exports = router;

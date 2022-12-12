const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  allMessages,
} = require('../controllers/messageControllers');

const router = express.Router();

// all messages
router.route('/').post(protect, sendMessage);

// all messages in a particular chat
router.route('/:chatId').get(protect, allMessages);
module.exports = router;

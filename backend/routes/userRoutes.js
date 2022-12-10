// all the routes related to the user
const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
} = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

// can do just router.get, but do it like this to chain multiple requests
// the below route is after the /api/user part
// router.route('/login').get(()=> {}).post()

// the .get part is how to search for users
// the protect only needed if excluding current user from the list of searched users
router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login', authUser);

// the below are also called controllers

module.exports = router;

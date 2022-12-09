// all the routes related to the user
const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/userControllers');

// can do just router.get, but do it like this to chain multiple requests
// the below route is after the /api/user part
// router.route('/login').get(()=> {}).post()

router.route('/').post(registerUser);
router.post('/login', authUser);

module.exports = router;

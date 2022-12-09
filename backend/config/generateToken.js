// jsonwebtoken JWT helps us auth the user in our backend.

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // sign creates a new token, it'll make it with that particular id
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;

const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// routes
app.get('/', (req, res) => {
  res.send('API is running successfully');
});

// creates an api endpoint to display the data from data.js (aka 'chats')
app.get('/api/chat', (req, res) => {
  res.send(chats);
});

// get and display just one chat info by its id
// :id is a variable.
// can pase in localhost:3000/api/chat/234ro23ufn2fese2q3w3 to get that one
app.get('/api/chat/:id', (req, res) => {
  // console.log(req.params.id);
  // params is where the info is that we want in all the info from that api
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

const PORT = process.env.PORT || 3000;

app.listen(3000, console.log(`Server started on port ${PORT}`));

// to start server first time, in terminal: sudo node backend/server.js

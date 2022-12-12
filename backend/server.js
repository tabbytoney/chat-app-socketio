const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();
connectDB();
const app = express();

// created these apis

// have to tell server to accept json from frontend (user info we get in userControllers.js)
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('API is running successfully');
});

// user auth apis
// app.use
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// error handling, errorMiddleware.js
// if the request doesnt match any of the above, it'll trigger this not found and error handlers
app.use(notFound);
app.use(errorHandler);

// creates an api endpoint to display the data from data.js (aka 'chats') dummy data
// app.get('/api/chat', (req, res) => {
//   res.send(chats);
// });

// // get and display just one chat info by its id
// // :id is a variable.
// // can pase in localhost:3000/api/chat/234ro23ufn2fese2q3w3 to get that one
// app.get('/api/chat/:id', (req, res) => {
//   // console.log(req.params.id);
//   // params is where the info is that we want in all the info from that api
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   res.send(singleChat);
// });

const PORT = process.env.PORT || 3000;

// socket io needs the 'const server' part
const server = app.listen(
  3000,
  console.log(`Server started on port ${PORT}`.yellow.bold)
);

// CORS for FE app address to prevent cross origin errors
const io = require('socket.io')(server, {
  // will close the connection if zero activity in 60 second
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3001',
  },
});
//create a connection, each user needs their own connection (aka room)s
io.on('connection', (socket) => {
  console.log('Connected to socket.io');
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  // gets room id from the frontend
  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined room: ' + room);
  });
  // socket.on('typing', (room) => socket.in(room).emit('typing'));
  // socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log('chat.users not defined');
    // in group chat, send message to each user (but not the person who sent it)
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit('message recieved', newMessageRecieved);
    });
  });

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});

// to start server first time, in terminal: sudo node backend/server.js

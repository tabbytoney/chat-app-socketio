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

app.listen(3000, console.log(`Server started on port ${PORT}`.yellow.bold));

// to start server first time, in terminal: sudo node backend/server.js

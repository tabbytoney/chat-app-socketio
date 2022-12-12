export const getSender = (loggedUser, users) => {
  // if currently logged in user is the first in the users array, return the next name
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

// get full info of senders, not just the name
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

import { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const ChatContext = createContext();

// here the children is going to be all of our app, we wrap around everything in index.js
const ChatProvider = ({ children }) => {
  // example of user state
  // Normally this would only be available inside the component it was created in.
  // But inside this context, this is available everywhere in our app - we add it to the value in the ChatContext.Prover
  const [user, setUser] = useState();

  const history = useHistory();

  // when we login, we store user info locally
  useEffect(() => {
    // fetch our local storage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // will store this inside our setUser state
    setUser(userInfo);
    // check if the user is not logged in, redirect to login place
    if (!userInfo) {
      history.push('/');
    }
    // [history] = when history changes, this will run again
  }, [history]);
  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

// makes this accessible throughout the app.
// Inside of this will be all of our state

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

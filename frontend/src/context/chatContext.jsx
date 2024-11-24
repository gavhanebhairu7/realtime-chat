import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { getAllMessagesForChats } from "../API/chat";

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [allMessages, setAllMessages] = useState({});

  useEffect(() => {
    //get all messages in one go while loading chats
    async function all_messages() {
      setLoading(true);
      const server_response = await getAllMessagesForChats();
      if (server_response.success) {
        // console.log("server response data", server_response.data);
        setAllMessages({ ...server_response.data });
      }
      setLoading(false);
    }
    all_messages();
    //get all chats here only
    // when selectedChat changes implement the logic to chage messages here only, another useEffect
  }, []);

  useEffect(() => {
    if (!selectedChat) {
      return;
    }
    //if selected chat is valid
    // setMessages(allMessages);
    console.log("all messages:", allMessages);
    console.log("setting message again");
    setMessages(allMessages[selectedChat._id]);
  }, [selectedChat, setSelectedChat, allMessages, setAllMessages]);

  //when selected chat chaged change the messages here only

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        loading,
        setLoading,
        messages,
        setMessages,
        selectedChat,
        setSelectedChat,
        contacts,
        setContacts,
        allMessages,
        setAllMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext };
export default ChatProvider;

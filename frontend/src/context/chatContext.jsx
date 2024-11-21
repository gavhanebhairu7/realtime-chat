import { createContext, useState } from "react";

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [contacts, setContacts] = useState([]);

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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext };
export default ChatProvider;

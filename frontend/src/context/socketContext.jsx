import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { UserContext } from "./userContext";
import { ChatContext } from "./chatContext";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useContext(UserContext);
  const { allMessages, setAllMessages } = useContext(ChatContext);
  useEffect(() => {
    if (!user || !user._id) return; // Ensure user is valid before connecting

    console.log("connecting socket");
    const newSocket = io("http://localhost:4001/", {
      withCredentials: true,
      query: { userId: user._id },
    });
    setSocket(newSocket);

    newSocket.on("getonline", (users) => {
      console.log(users);
      setOnlineUsers(users);
    });

    //append message to corresponding chat
    newSocket.on("notify-message", (message) => {
      const { chat_id } = message;
      console.log("message received");

      setAllMessages((prev) => ({
        ...prev, // Keep the previous state intact
        [chat_id]: prev[chat_id]
          ? [...prev[chat_id], message.message]
          : [message.message],
      }));

      console.log("all messages", allMessages);
    });

    // Cleanup on unmount or when user changes
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext };
export default SocketProvider;

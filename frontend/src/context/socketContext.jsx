import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { UserContext } from "./userContext";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useContext(UserContext);

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

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserProvider from "./context/UserContext.jsx";
import ChatProvider from "./context/chatContext.jsx";
import SocketProvider from "./context/socketContext.jsx";

createRoot(document.getElementById("root")).render(
  <ChatProvider>
    <UserProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </UserProvider>
  </ChatProvider>
);

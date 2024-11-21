import React, { useContext, useEffect, useState } from "react";
import Search from "./Search";
import User from "./User";
import { UserContext } from "../context/userContext";
import { getAllChats, getAllmessages } from "../API/chat";
import { ChatContext } from "../context/chatContext";

import Message from "./Message";
import NewChat from "./NewChat";
function Exporer({ setContactVisible }) {
  const { setError } = useContext(UserContext);
  const {
    chats,
    setChats,
    messages,
    setMessages,
    setLoading,
    selectedChat,
    setSelectedChat,
  } = useContext(ChatContext);

  const [chatVisible, setVisible] = useState(false);

  useEffect(() => {
    async function getChats() {
      setLoading(true);
      const server_response = await getAllChats();
      if (server_response.success) {
        setChats(server_response.data);
        setLoading(false);
        console.log("chats fetched");
      } else {
        setLoading(false);
        setError("chats could not be fetched !");
      }
    }
    getChats();
  }, []);

  useEffect(() => {
    //set loading true
    async function getMessages() {
      setLoading(true);
      const server_response = await getAllmessages(selectedChat._id);
      if (server_response.success) {
        setMessages(server_response.data);
        setLoading(false);
      } else {
        setLoading(false);
        setError("message could not be fetched");
      }
    }
    if (!selectedChat) {
      return;
    }
    getMessages();
  }, [selectedChat, selectedChat]);
  return (
    <div className="w-[30%] text-white bg-black px-5 overflow-scroll relative">
      <div className="sticky top-0 bg-black z-20 py-2 mt-0">
        <div className="text-3xl font-bold flex justify-start pl-4">Chats</div>
        <Search />
        <hr />
      </div>
      {chats.map((chat, index) => (
        <User key={index} chat={{ ...chat, status: true }} />
      ))}

      {/* start chat floating button */}
      <div className="sticky bottom-4 z-20 flex justify-end pr-4">
        <button
          onClick={() => setVisible(true)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* New Chat Popup */}
      <NewChat chatVisible={chatVisible} setVisible={setVisible} />
    </div>
  );
}

export default Exporer;

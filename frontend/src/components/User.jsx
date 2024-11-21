import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/chatContext";
import { UserContext } from "../context/userContext";
import { SocketContext } from "../context/socketContext";

function User(props) {
  const { user } = useContext(UserContext);
  const { onlineUsers } = useContext(SocketContext);
  const { selectedChat, setSelectedChat } = useContext(ChatContext);
  const [status, setStatus] = useState(false);
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    if (props.chat.chat_type === "group") return;
    const chatId =
      props.chat.participants[0]._id === user._id
        ? props.chat.participants[1]._id
        : props.chat.participants[0]._id;
    setChatId(chatId);
  }, [props.chat, user]);

  useEffect(() => {
    if (chatId && onlineUsers) {
      console.log(onlineUsers, chatId);
      setStatus(onlineUsers.includes(chatId)); // Update status based on onlineUsers list
    }
  }, [onlineUsers, chatId]);

  function handleClick() {
    setSelectedChat(props.chat);
  }

  return (
    <div
      className={`flex justify-left items-center py-2 hover:bg-gray-800 duration-700 hover:cursor-pointer w-[100%] ${
        selectedChat && selectedChat._id === props.chat._id ? "bg-gray-900" : ""
      }`}
      onClick={handleClick}
    >
      <div
        className={status ? "avatar online" : "avatar offline"} // Use `status` directly to mark online/offline
      >
        <div className="w-14 rounded-full">
          <img
            src={
              props.chat.chat_type === "group"
                ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxV4MxPN7FpFp8OmDqt9XPB8UvBwIB0Vy82g&s"
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdUGxIPkRa7JrVkRgwjtDcQiqEKn5ZNlKcQg&s"
            }
            alt="avatar"
          />
        </div>
      </div>

      <div className="px-5">
        {props.chat.chat_type === "group" ? (
          <h1 className="font-bold">{props.chat.chat_name}</h1>
        ) : (
          <h1>
            {props.chat.participants[0]._id === user._id
              ? props.chat.participants[1].user_name
              : props.chat.participants[0].user_name}
          </h1>
        )}
        <span className="text-gray-600">
          {props.chat.participants[0]._id === user._id
            ? props.chat.participants[1].phone_number
            : props.chat.participants[0].phone_number}
        </span>
      </div>
    </div>
  );
}

export default User;

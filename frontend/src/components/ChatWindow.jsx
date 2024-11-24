import React, { useContext, useEffect, useState } from "react";
import User from "./User";
import Message from "./Message";
import { IoSend } from "react-icons/io5";
import { UserContext } from "../context/userContext";
import { ChatContext } from "../context/chatContext";
import { sendMessage } from "../API/chat";
import { formatDate } from "../utils/helperFunctions.js";
import { SocketContext } from "../context/socketContext.jsx";
function ChatWindow() {
  const { user, setError } = useContext(UserContext);
  const { messages, selectedChat } = useContext(ChatContext);
  const { onlineUsers } = useContext(SocketContext);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState(false);
  useEffect(() => {
    if (selectedChat.chat_type === "group") return;
    //get user_id
    const user_id =
      selectedChat?.participants[0]?._id === user?._id
        ? selectedChat?.participants[1]?._id
        : selectedChat?.participants[0]?._id;
    if (onlineUsers.includes(user_id)) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [onlineUsers, selectedChat]);
  function handleSubmit(e) {
    e.preventDefault();
    async function sendMessageAsync(message) {
      const server_response = await sendMessage(selectedChat._id, draft);
      if (server_response.success) {
        console.log("message sent successfully", server_response.data);
      } else {
        setError("couldn't send a message");
      }
    }
    sendMessageAsync();
    setDraft("");
  }
  return (
    <>
      {!selectedChat ? (
        <div className="w-[65%] bg-slate-950 text-white bg-black h-screen flex flex-col justify-center items-center">
          <>No conversation, select a one or start a new</>
        </div>
      ) : (
        <div className="w-[65%] bg-slate-950 text-white bg-black h-screen flex flex-col">
          {/* Profile panel */}

          <div className="sticky top-0 z-10 bg-gray-900">
            <div className="flex justify-left items-center py-2 hover:bg-gray-800 duration-700 hover:cursor-pointer w-[100%] pl-2">
              <div className={`avatar ${status ? "online" : "offline"}`}>
                <div className="w-16 rounded-full">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
              {selectedChat && (
                <div className="px-5">
                  {selectedChat?.chat_type === "group" ? (
                    <h1>{selectedChat?.chat_name}</h1>
                  ) : (
                    <>
                      <h1 className="font-bold">
                        {selectedChat?.participants[0]?._id === user?._id
                          ? selectedChat?.participants[1]?.user_name
                          : selectedChat?.participants[0]?.user_name}
                      </h1>
                      <span className="text-gray-400">
                        {status ? "online" : "offline"}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Message window */}
          <div className="flex-1 overflow-y-auto p-5">
            {messages.length > 0 ? (
              <>
                {messages.map((message, index) =>
                  message.sender._id === user._id ? (
                    <Message
                      key={index}
                      sent={true}
                      msg={message.message_body}
                      time={message.created_at}
                      sender={message.sender}
                    />
                  ) : (
                    <Message
                      key={index}
                      sent={false}
                      msg={message.message_body}
                      time={message.created_at}
                      sender={message.sender}
                    />
                  )
                )}
              </>
            ) : (
              <div className="text-center flex flex-col justify-center h-[100%]">
                <div>say Hii !</div>
              </div>
            )}
          </div>

          {/* Sender box */}
          <form
            className="flex space-x-4 p-4 bg-slate-900"
            onSubmit={handleSubmit}
          >
            <div className="w-[80%]">
              <input
                type="text"
                placeholder="Type here"
                className="input outline-none focus:outline-none w-[100%] bg-gray-600"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-18 h-18 flex justify-center items-center"
            >
              <IoSend className="text-3xl" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatWindow;

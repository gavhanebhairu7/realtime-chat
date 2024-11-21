import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/chatContext";
import { createChat, getAllChats, getAllContact } from "../API/chat";
import { UserContext } from "../context/userContext";

function NewChat({ chatVisible, setVisible }) {
  const [chatType, setChatType] = useState("personal"); // "personal" or "group"
  const [selectedContact, setSelectedContact] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  const { contacts, setContacts, chats, setChats } = useContext(ChatContext);
  function handleSubmit(e) {
    e.preventDefault();
    (async () => {
      let server_response;
      if (chatType === "personal") {
        server_response = await createChat(
          "personal",
          chatType,
          selectedContact
        );
      } else {
        server_response = await createChat(groupName, chatType, groupMembers);
      }
      if (server_response.success) {
        server_response = await getAllChats();
        setChats(server_response.data);
      }
    })();

    resetForm();
  }

  useEffect(() => {
    (async () => {
      const server_response = await getAllContact();
      if (server_response.success) {
        console.log("contacts fetched");
        setContacts(server_response.data);
      } else {
        setMessage("something went wrong");
      }
    })();
  }, []);

  function resetForm() {
    console.log(setVisible);
    setChatType("personal");
    setSelectedContact("");
    setGroupName("");
    setGroupMembers([]);
    setVisible((prev) => !prev);
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 ${
        chatVisible ? "visible" : "invisible"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-6 w-[90%] sm:w-[450px] bg-gray-800 rounded-lg shadow-lg"
      >
        <h2 className="text-white text-2xl font-semibold mb-4">
          Start New Chat
        </h2>

        {/* Chat Type Selection */}
        <div className="mb-4">
          <label className="text-white mb-2 block text-lg font-medium">
            Chat Type
          </label>
          <select
            value={chatType}
            onChange={(e) => setChatType(e.target.value)}
            className="bg-gray-700 text-white rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="personal">Personal</option>
            <option value="group">Group</option>
          </select>
        </div>

        {/* Personal Chat */}
        {chatType === "personal" && (
          <div className="mb-4">
            <label className="text-white mb-2 block text-lg font-medium">
              Select Contact
            </label>
            <select
              value={selectedContact}
              onChange={(e) => setSelectedContact([e.target.value])}
              className="bg-gray-700 text-white rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Choose a contact
              </option>
              {contacts.map((contact, index) => (
                <option key={index} value={contact._id}>
                  {contact.user_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Group Chat */}
        {chatType === "group" && (
          <>
            <div className="mb-4">
              <label className="text-white mb-2 block text-lg font-medium">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-gray-700 text-white rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter group name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-white mb-2 block text-lg font-medium">
                Add Members
              </label>
              <select
                multiple
                value={groupMembers}
                onChange={(e) =>
                  setGroupMembers(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                className="bg-gray-700 text-white rounded-lg p-3 w-full outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {contacts.map((contact) => (
                  <option key={contact._id} value={contact._id}>
                    {" "}
                    {/* Use _id as value */}
                    {contact.user_name} {/* Display user_name */}
                  </option>
                ))}
              </select>

              <small className="text-gray-400">
                Hold down <strong>Ctrl</strong> (or <strong>Cmd</strong>) to
                select multiple contacts.
              </small>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
            onClick={resetForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
          >
            Start Chat
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewChat;

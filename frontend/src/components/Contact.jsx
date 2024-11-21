import React, { useContext, useState } from "react";
import { createContact, getAllContact } from "../API/chat";
import { UserContext } from "../context/userContext";
import { ChatContext } from "../context/chatContext";
import { IoEllipseSharp } from "react-icons/io5";

function Contact({ contactVisible, setContactVisible }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { setError, setMessage } = useContext(UserContext);
  const { setContacts } = useContext(ChatContext);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    (async () => {
      let server_response = await createContact(phoneNumber);
      if (server_response.success) {
        console.log(server_response.data);
        server_response = await getAllContact();
        if (server_response.success) {
          setContacts(server_response.data);
        } else {
          setError("something went wrong");
        }
        setLoading(false);
        setMessage("contact created successfully");
      } else {
        setLoading(false);
        setError("could not create a contact");
      }
    })();
    setPhoneNumber(""); // Reset input
    setContactVisible(false); // Close popup
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
        contactVisible ? "visible" : "invisible"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-between p-6 w-[90%] sm:w-[400px] bg-gray-800 rounded-lg shadow-lg"
      >
        <h2 className="text-white text-2xl font-semibold mb-4">Add Contact</h2>
        <input
          className="bg-gray-700 text-white placeholder-gray-400 rounded-lg p-3 mb-4 text-lg outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <div className="flex justify-between">
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
            onClick={() => setContactVisible(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default Contact;

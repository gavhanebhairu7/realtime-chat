import axios from "axios";

export const getAllChats = async () => {
  try {
    const messages = await axios.get(
      `http://localhost:4001/api/v1/chat/chats`,
      {
        withCredentials: true,
      }
    );
    return messages.data;
  } catch (err) {
    return {
      success: false,
      error: "cannot send request",
    };
  }
};

export const getAllMessagesForChats = async () => {
  try {
    const messages = await axios.get(
      `http://localhost:4001/api/v1/message/messages/all`,
      {
        withCredentials: true,
      }
    );
    return messages.data;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "cannot send request",
    };
  }
};

export const getAllmessages = async (chat_id) => {
  try {
    const messages = await axios.get(
      `http://localhost:4001/api/v1/message/messages/${chat_id}`,
      {
        withCredentials: true,
      }
    );
    return messages.data;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "cannot send request",
    };
  }
};

export const sendMessage = async (chat_id, message_body) => {
  try {
    const server_response = await axios.post(
      `http://localhost:4001/api/v1/message/message/${chat_id}`,
      { message_body },
      { withCredentials: true }
    );
    return server_response.data;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "cannot send request",
    };
  }
};

export const createContact = async (phone_number) => {
  try {
    const server_response = await axios.post(
      "http://localhost:4001/api/v1/contact/contacts",
      { phone_number },
      { withCredentials: true }
    );
    return server_response.data;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "cannot send request",
    };
  }
};

export const getAllContact = async () => {
  try {
    const server_response = await axios.get(
      "http://localhost:4001/api/v1/contact/contacts",
      { withCredentials: true }
    );
    return server_response.data;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "cannot send request",
    };
  }
};

export const createChat = async (chat_name, chat_type, participants) => {
  try {
    const server_response = await axios.post(
      "http://localhost:4001/api/v1/chat/newchat",
      { chat_name, chat_type, participants },
      { withCredentials: true }
    );
    return server_response.data;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "cannot send request",
    };
  }
};

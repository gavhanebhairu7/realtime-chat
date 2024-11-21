import axios from "axios";

export const fetchUser = async function () {
  //call
  try {
    const server_response = await axios.get(
      "http://localhost:4001/api/v1/user/fetch",
      { withCredentials: true }
    );
    console.log(server_response);
    return server_response.data;
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: "failed to authenticate",
    };
  }
};

export const registerUser = async function (user_name, phone_number, password) {
  try {
    const data = { user_name, password, phone_number };
    const server_response = await axios.post(
      "http://localhost:4001/api/v1/user/register",
      data,
      { withCredentials: true }
    );
    console.log(server_response);
    return server_response.data;
  } catch (err) {
    console.log(err);
    return {
      success: "false",
      error: "failed to send request",
    };
  }
};

export const loginUser = async function (phone_number, password) {
  try {
    const data = { password, phone_number };
    const server_response = await axios.post(
      "http://localhost:4001/api/v1/user/login",
      data,
      { withCredentials: true }
    );
    if (server_response?.data?.data?.success) {
      return server_response?.data?.data;
    } else {
      return server_response?.data?.data;
    }
    console.log(server_response);
    return server_response;
  } catch (err) {
    console.log(err);
    return {
      success: "false",
      error: "failed to send request",
    };
  }
};

export const logoutUser = async function () {
  try {
    const server_response = await axios.post(
      "http://localhost:4001/api/v1/user/logout",
      { withCredentials: true }
    );
    if (server_response?.data?.data?.success) {
      return server_response?.data;
    } else {
      return server_response?.data;
    }
  } catch (err) {
    console.log(err);
    return {
      success: "false",
      error: "failed to send request",
    };
  }
};

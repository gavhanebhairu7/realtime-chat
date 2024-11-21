import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { registerUser } from "../API/authentication";

function Signup() {
  const { setLoading, setMessage, setError, user, setUser, setAuthenticated } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function handleClick(e) {
    e.preventDefault();
    //call backend api to post data on backend
    setLoading(true);
    const server_response = await registerUser(username, phoneNumber, password);
    setLoading(false);
    const temp_user = { ...user };
    const data = server_response.data;
    console.log("server response: ", data);
    if (data) {
      temp_user.phoneNumber = data.phone_number;
      temp_user._id = data._id;
      temp_user.userName = data.user_name;
      await setUser(temp_user);
      await setMessage(server_response.message);
      await setAuthenticated(true);
      navigate("/chat");
    } else {
      setError(server_response.error);
    }
  }
  return (
    <div className="flex flex-col justify-center gap-y-4 items-center w-[100%] h-screen">
      <form className="lg:w-[30%] flex flex-col items-center justify-center gap-y-4 border border-cyan p-10">
        <div className="text-2xl font-bold">Signup Form</div>
        <label htmlFor="phonenumber" className="w-[100%]">
          <div className="text-xl">username</div>
          <input
            className="outline-none focus:outline-none p-2 w-[90%] bg-gray-200"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="enter username like bhairav_123"
          />
        </label>
        <label htmlFor="username" className="w-[100%]">
          <div className="text-xl">phone number</div>
          <input
            className="outline-none focus:outline-none p-2 w-[90%] bg-gray-200"
            type="text"
            value={phoneNumber}
            placeholder="enter phone..."
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </label>
        <label htmlFor="password" className="w-[100%]">
          <div className="text-xl">password</div>
          <input
            type="password"
            className="outline-none focus:outline-none p-2 w-[90%] bg-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button onClick={handleClick} className="btn btn-primary">
          Sign Up
        </button>
        <div
          className="hover:underline hover:cursor-pointer text-blue-700"
          onClick={() => navigate("/login")}
        >
          already have an account ? login here
        </div>
      </form>
    </div>
  );
}

export default Signup;

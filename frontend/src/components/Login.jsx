import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { loginUser } from "../API/authentication.js";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner.jsx";
function Login() {
  const { user } = useContext(UserContext);
  const { setUser, setError, setMessage, setLoading, setAuthenticated } =
    useContext(UserContext);
  const navigate = useNavigate();
  async function handleClick(e) {
    e.preventDefault();
    //call backend api to post data on backend
    setLoading(true);
    const data = await loginUser(phoneNumber, password);
    setLoading(false);
    console.log("data", data);
    const temp_user = { ...user };
    if (data.phone_number && data._id) {
      temp_user.phoneNumber = data?.phone_number;
      temp_user._id = data?._id;
      await setUser(temp_user);
      await setMessage("user login successful !");
      await setAuthenticated(true);
      navigate("/chat");
    } else {
      setError("failed to login user");
    }
  }

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex flex-col justify-center gap-y-4 items-center w-[100%] h-screen">
      <form className="lg:w-[30%] flex flex-col items-center justify-center gap-y-4 border border-cyan p-10">
        <div className="text-2xl font-bold">Login Form</div>
        <label htmlFor="password" className="w-[100%]">
          <div className="text-xl">phone number</div>
          <input
            className="outline-none focus:outline-none p-2 w-[90%] bg-gray-200"
            type="text"
            value={phoneNumber}
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
          Login
        </button>
        <div
          className="hover:underline hover:cursor-pointer text-blue-700"
          onClick={() => navigate("/signup")}
        >
          don't have an account ? create here
        </div>
      </form>
      <Toaster position="top-right" />
    </div>
  );
}

export default Login;

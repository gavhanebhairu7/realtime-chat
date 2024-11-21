import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Exporer from "./components/Exporer";
import ChatWindow from "./components/ChatWindow";
import LeftPanel from "./components/LeftPanel";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { UserContext } from "./context/UserContext";
import { toast, Toaster } from "react-hot-toast";
import Spinner from "./components/Spinner";
import { fetchUser, registerUser } from "./API/authentication";

function App() {
  const { error, message, setError, setMessage, user, setUser, loading } =
    useContext(UserContext);
  useEffect(() => {
    if (message) {
      toast.success(message);
      setMessage(null);
    }
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [message, error, setError, setMessage]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <BrowserRouter>
          <Routes className="flex h-screen">
            <Route path="/login" element={<Login />}>
              Login
            </Route>
            <Route path="/signup" element={<Signup />}>
              Sign up
            </Route>
            <Route path="/chat" element={<Home />}></Route>
            <Route path="/" element={<Login />}></Route>
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      )}
    </>
  );
}

export default App;

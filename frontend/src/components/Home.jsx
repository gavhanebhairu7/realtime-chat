import React, { useContext, useEffect, useState } from "react";
import Exporer from "./Exporer";
import ChatWindow from "./ChatWindow";
import LeftPanel from "./LeftPanel";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../API/authentication";
import Contact from "./contact";
import NewChat from "./NewChat";
export default function Home() {
  const {
    message,
    error,
    setError,
    setMessage,
    authenticated,
    setAuthenticated,
    setLoading,
    user,
    setUser,
  } = useContext(UserContext);

  const [contactVisible, setContactVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function authenticate() {
      //call backend api to post data on backend
      setLoading(true);
      const server_response = await fetchUser();
      const temp_user = { ...user };
      if (!server_response.success) {
        setError("login first");
        setLoading(false);
        navigate("/login");
        return;
      }
      const data = server_response.data;
      console.log("server response: ", data);
      if (data) {
        temp_user.phoneNumber = data.phone_number;
        temp_user._id = data._id;
        temp_user.userName = data.user_name;
        await setUser(temp_user);
        await setMessage("authentication success !");
        await setAuthenticated(true);
        console.log("authenticated");
      } else {
        setError(server_response.error);
      }
      setLoading(false);
    }
    if (authenticated) {
      return;
    }
    authenticate();
  }, []);
  return (
    <div className="flex h-screen">
      <LeftPanel setContactVisible={setContactVisible} />
      <Exporer />
      <ChatWindow />
      <Contact
        contactVisible={contactVisible}
        setContactVisible={setContactVisible}
      />
    </div>
  );
}

import React, { useContext } from "react";
import { LuLogOut } from "react-icons/lu";
import { UserContext } from "../context/UserContext";
import { logoutUser } from "../API/authentication";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChatContext } from "../context/chatContext";
function Logout() {
  const { setLoading, setMessage, setError, setAuthenticated, setUser } =
    useContext(UserContext);

  const { setMessages, setSelectedChat, setChats } = useContext(ChatContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    setLoading(false);
    const server_response = await logoutUser();
    setLoading(false);
    if (server_response && server_response.success) {
      await setMessage(server_response.message);
      await setAuthenticated(false);
      setMessage([]);
      setChats([]);
      setSelectedChat(null);
      setUser({});
      navigate("/login");
    } else {
      setError("failed to logout");
    }
  };
  return (
    <div
      className="text-2xl text-white font-bold hover:bg-gray-500 w-12 h-12 rounded-full flex justify-center items-center hover:cursor-pointer"
      onClick={handleLogout}
    >
      <LuLogOut />
    </div>
  );
}

export default Logout;

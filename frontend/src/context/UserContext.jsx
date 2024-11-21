import { createContext, useState, useTransition } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const [user, setUser] = useState({});

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        error,
        message,
        setError,
        setMessage,
        setLoading,
        loading,
        authenticated,
        setAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

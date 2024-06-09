import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { doSignOut } from "../firebase/auth";

const Logout = () => {
  const [loggedOut, setLoggedOut] = React.useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await doSignOut();
        console.log("User signed out");
        setLoggedOut(true);
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    };

    handleLogout();
  }, []);

  if (loggedOut) {
    return <Navigate to="/login" />;
  }

  return <div>Logging out...</div>;
};

export default Logout;

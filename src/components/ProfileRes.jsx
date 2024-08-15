import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { database, storage } from "../firebase/firebase";
import { ref as dbRef, get } from "firebase/database";
import { ref as storageRef, getDownloadURL } from "firebase/storage";

const ProfileRes = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [verification, setVerification] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [onlineStatus, setOnlineStatus] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const emailQuery = queryParams.get("email");

  useEffect(() => {
    if (emailQuery) {
      searchUserByEmail(emailQuery);
    }
  }, );

  const searchUserByEmail = async (email) => {
    try {
      // Assuming your database structure allows for email search
      const usersRef = dbRef(database, `users`);
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const users = snapshot.val();
        for (let uid in users) {
          if (users[uid].email === email) {
            getUserData(uid);
            getProfilePictureUrl(uid);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getUserData = async (uid) => {
    try {
      const userRef = dbRef(database, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setEmail(data.email || "");
        setRole(data.role || "");
        setVerification(data.verification || "");
        setSubscriptionStatus(data.subscription_status || "");
        setOnlineStatus(data.login_status || "");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getProfilePictureUrl = async (uid) => {
    try {
      const url = await getDownloadURL(
        storageRef(storage, `profile_pictures/${uid}`)
      );
      setPreviewImage(url);
    } catch (error) {
      console.error("Error fetching profile picture URL:", error);
    }
  };

  return (
    <div className="py-20 bg-brown-50 min-h-screen flex justify-center items-center">
    
        <div className="text-gray-600 space-y-5 p-4 px-10 shadow-xl rounded-xl bg-white border-4 border-double border-brown-100 w-4/5">
          <div className="bg-brown-400 rounded-r-full border-brown-50 border-2 shadow-sm shadow-brown-500 mt-4">
            <h1 className="text-3xl font-bold text-white p-1 ml-2">PROFILE</h1>
          </div>
          <div className="grid text-wrap m-2">
            <h2 className="text-xl font-bold mb-2">Account Information</h2>

            <p className="text-md bg-gray-100 font-semibold">Email:</p>
            <p className="text-md mb-1">{email}</p>
            <p className="text-md bg-gray-100 font-semibold">Role:</p>
            <p className="text-md mb-1">{role}</p>
            <p className="text-md bg-gray-100 font-semibold">Verification:</p>
            <p className="text-md mb-1">{verification}</p>
            <p className="text-md bg-gray-100 font-semibold">
              Subscription Status:
            </p>
            <p className="text-md mb-1">{subscriptionStatus}</p>
            <p className="text-md bg-gray-100 font-semibold">User is:</p>
            <p className="text-md mb-1">{onlineStatus}</p>
          </div>

          <hr className="clearfix w-100" />
          <br />
          <div className="grid items-center justify-start mb-2">
            <img
              className="shadow-md shadow-brown-100 border-4 border-double border-gray-600 rounded-md object-cover mb-4 lg:mb-0 lg:mr-4 lg:h-64 md:h-40 sm:h-32 xs:h-24"
              src={
                previewImage || "/default-profile-picture.png"
              }
              alt="Profile Picture"
            />
          </div>

          <hr className="clearfix w-100" />
        </div>
    </div>
  );
};

export default ProfileRes;

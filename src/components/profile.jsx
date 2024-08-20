import React, { useState, useEffect } from "react";
import { auth, storage, database } from "../firebase/firebase";
import {
  onAuthStateChanged,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { ref as dbRef, get, update } from "firebase/database";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [verification, setVerification] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [onlineStatus, setOnlineStatus] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        getUserData(currentUser.uid);
        getProfilePictureUrl(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

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

  const handleProfilePictureChange = (event) => {
    if (event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) return;

    const storageReference = storageRef(
      storage,
      `profile_pictures/${user.uid}`
    );
    try {
      await uploadBytes(storageReference, profilePicture);
      const downloadURL = await getDownloadURL(storageReference);
      await updateProfile(user, { photoURL: downloadURL });
      await updateDatabaseProfilePicture(downloadURL);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const updateDatabaseProfilePicture = async (downloadURL) => {
    const userRef = dbRef(database, `users/${user.uid}`);
    await update(userRef, { profilePicture: downloadURL });
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleUpdatePassword = async () => {
    if (password && newPassword === confirmPassword) {
      try {
        await updatePassword(user, newPassword);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        alert("Password updated successfully!");
      } catch (error) {
        console.error("Error updating password:", error);
        alert("Error updating password. Please try again.");
      }
    } else {
      alert("Please enter valid passwords.");
    }
  };

  return (
    <div className="py-20 bg-brown-50 min-h-screen flex justify-center items-center">
      {user ? (
        <div className="text-gray-600 space-y-5 p-4 px-10 shadow-xl rounded-xl bg-white border-4 border-double border-brown-100 w-4/5">
          <div className="bg-brown-400 rounded-r-full border-brown-50 border-2 shadow-sm shadow-brown-500 mt-4">
            <h1 className="text-3xl font-bold text-white p-1 ml-2">PROFILE</h1>
          </div>
          <div className="m-2">
            <h2 className="text-xl font-bold mb-2">Account Information</h2>

            <p className="text-md bg-gray-100 font-semibold">Email:</p>
            <p className="text-md mb-1 break-words">{email}</p>
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
                previewImage || user.photoURL || "/default-profile-picture.png"
              }
              alt="Profile Picture"
            />

            <input
              type="file"
              onChange={handleProfilePictureChange}
              className="border-4 border-double border-gray-600 rounded-md my-2"
            />
            <button
              className="hover:bg-brown-600 w-40 h-10 rounded-lg bg-brown-500 text-white text-sm  border-2 border-brown-700 mb-4 lg:mb-0"
              onClick={uploadProfilePicture}
            >
              Upload Profile Picture
            </button>
          </div>

          <hr className="clearfix w-100" />

          <h2 className="text-2xl font-semibold mt-6 mb-2">Change Password</h2>
          <div className="mb-4">
            <label className="block mb-1">Current Password:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">New Password:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Confirm Password:</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <button
            className="hover:bg-brown-600 w-40 h-10 rounded-lg bg-brown-500 text-white text-sm  border-2 border-brown-700"
            onClick={handleUpdatePassword}
          >
            Update Password
          </button>
        </div>
      ) : (
        <p className="text-center text-xl">You are not logged in.</p>
      )}
    </div>
  );
}

export default UserProfile;

import { useState, useEffect } from "react";
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
  const [rating, setRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
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
        setRating(data.rating || 0);
        setTotalRatings(data.totalRatings || 0);
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
    <div className="py-[6rem] min-h-screen bg-brown-50 px-2">
      {user ? (
        <div className="text-gray-600 space-y-5 px-3 md:px-6 max-w-[1100px] mx-auto shadow-xl rounded-xl bg-white border-4 border-double border-brown-100">
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
            {/* <p className="text-md bg-gray-100 font-semibold">
              Subscription Status:
            </p>
            <p className="text-md mb-1">{subscriptionStatus}</p> */}
            <p className="text-md bg-gray-100 font-semibold">User is:</p>
            <p className="text-md mb-1">{onlineStatus}</p>
            <p className="text-md bg-gray-100 font-semibold">Rating:</p>
            <div className="pt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    <svg
                      className={`w-6 h-6 ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                ))}
              </div>
              <div className="text-gray-600">
                ({rating?.toFixed(1) || 0} / 5) from {totalRatings || 0} ratings
              </div>
            </div>
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
              className="block hover:bg-brown-600 w-40 h-10 rounded-lg bg-brown-500 text-white text-sm  border-2 border-brown-700 mb-4 lg:mb-0"
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
            className="block hover:bg-brown-600 w-40 h-10 rounded-lg bg-brown-500 text-white text-sm  border-2 border-brown-700"
            onClick={handleUpdatePassword}
          >
            Update Password
          </button>
          <br />
        </div>
      ) : (
        <p className="text-center text-xl">You are not logged in.</p>
      )}
    </div>
  );
}

export default UserProfile;

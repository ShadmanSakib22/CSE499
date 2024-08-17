import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDatabase, ref, get, child } from "firebase/database";

const ProfileRes = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dbRef = ref(getDatabase());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailQuery = params.get("email");
    if (emailQuery) {
      handleSearch(emailQuery);
    }
  }, [location]);

  const handleSearch = async (query) => {
    if (query.trim()) {
      try {
        const snapshot = await get(child(dbRef, `users`));
        if (snapshot.exists()) {
          const users = snapshot.val();
          const user = Object.values(users).find(
            (u) => u.email === query.trim()
          );
          if (user) {
            setUserData(user);
            setError(null);
          } else {
            setUserData(null);
            setError("No User found with this Email.");
          }
        } else {
          setUserData(null);
          setError("No User found with this Email.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to retrieve data.");
      }
    }
  };

  return (
    <div className="py-20 bg-brown-50 min-h-screen flex justify-center items-center">
      <div className="text-gray-600 space-y-5 p-4 px-10 shadow-xl rounded-xl bg-white border-4 border-double border-brown-100 w-4/5">
        {/*Search User*/}
        <div className="my-[30px]">
          <div className="relative w-full max-w-xl bg-white rounded-full">
            <input
              placeholder="e.g. example@email.com"
              className="rounded-full w-full h-12 bg-transparent py-2 pl-8 pr-32 outline-none border-2 border-gray-100 shadow-md hover:outline-none focus:ring-brown-200 focus:border-brown-200"
              type="text"
              name="query"
              id="query"
              value={location.search.split("=")[1] || ""}
              onChange={(e) => navigate(`/profile-res?email=${e.target.value}`)}
            />
            <button
              type="submit"
              className="absolute inline-flex items-center h-12 px-4 py-2 text-sm text-white transition duration-150 ease-in-out rounded-full outline-none right-0 top-0 bg-brown-600 sm:px-6 sm:text-base sm:font-medium hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
              onClick={(e) => handleSearch(location.search.split("=")[1])}
            >
              <svg
                className="-ml-0.5 sm:-ml-1 mr-2 w-4 h-4 sm:h-5 sm:w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>
          </div>
        </div>
        <div className="bg-brown-400 rounded-r-full border-brown-50 border-2 shadow-sm shadow-brown-500 mt-4">
          <h1 className="text-3xl font-bold text-white p-1 ml-2">PROFILE</h1>
        </div>
        {userData ? (
          <div className="grid text-wrap m-2">
            <h2 className="text-xl font-bold mb-2">Account Information</h2>
            <p className="text-md bg-gray-100 font-semibold">Email:</p>
            <p className="text-md mb-1">{userData.email}</p>
            <p className="text-md bg-gray-100 font-semibold">Role:</p>
            <p className="text-md mb-1">{userData.role}</p>
            <p className="text-md bg-gray-100 font-semibold">Verification:</p>
            <p className="text-md mb-1">{userData.verification}</p>
            <p className="text-md bg-gray-100 font-semibold">
              Subscription Status:
            </p>
            <p className="text-md mb-1">{userData.subscription_status}</p>
            <p className="text-md bg-gray-100 font-semibold">User is:</p>
            <p className="text-md mb-1">{userData.login_status}</p>
            <hr className="clearfix w-100" />
            <br />
            <div className="grid items-center justify-start mb-2">
              <img
                className="shadow-md shadow-brown-100 border-4 border-double border-gray-600 rounded-md object-cover mb-4 lg:mb-0 lg:mr-4 lg:h-64 md:h-40 sm:h-32 xs:h-24"
                src={userData.profilePicture || "/default-profile-picture.png"}
                alt="Profile Picture"
              />
            </div>
            <hr className="clearfix w-100" />
          </div>
        ) : (
          <p className="text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileRes;

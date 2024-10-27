import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  query,
  orderByChild,
  equalTo,
  onValue,
  update,
} from "firebase/database";

const ProfileRes = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
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
          // Find user and include their uid
          const userEntries = Object.entries(users);
          const userEntry = userEntries.find(
            ([_, u]) => u.email === query.trim()
          );

          if (userEntry) {
            const [uid, userData] = userEntry;
            setUserData({ ...userData, uid }); // Include uid in userData
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

  useEffect(() => {
    if (userData) {
      const database = getDatabase();
      const ticketsRef = ref(database, "tickets");
      const userTicketsQuery = query(
        ticketsRef,
        orderByChild("username"),
        equalTo(userData.email)
      );

      onValue(userTicketsQuery, (snapshot) => {
        const tickets = [];
        snapshot.forEach((childSnapshot) => {
          tickets.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setUserTickets(tickets);
      });
    }
  }, [userData]);

  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUid(user.uid);
      }
    });
  }, []);

  // Add this state to track if current user has rated
  const [currentUserUid, setCurrentUserUid] = useState(null);

  // Add this function to check if user has already rated
  const checkUserRating = async (raterUid, targetUid) => {
    const database = getDatabase();
    const ratingRef = ref(database, `userRatings/${targetUid}/${raterUid}`);
    const snapshot = await get(ratingRef);
    return snapshot.exists() ? snapshot.val() : null;
  };

  const handleRating = async (newRating) => {
    if (userData && currentUserUid) {
      const database = getDatabase();
      const userRef = ref(database, `users/${userData.uid}`);
      const ratingRef = ref(
        database,
        `userRatings/${userData.uid}/${currentUserUid}`
      );

      const previousRating = await checkUserRating(
        currentUserUid,
        userData.uid
      );
      const currentRating = userData.rating || 0;
      const currentTotalRatings = userData.totalRatings || 0;

      let updatedRating;
      let updatedTotalRatings = currentTotalRatings;

      if (previousRating) {
        // Update existing rating
        const ratingSum = currentRating * currentTotalRatings;
        updatedRating =
          (ratingSum - previousRating + newRating) / currentTotalRatings;
      } else {
        // New rating
        updatedRating =
          (currentRating * currentTotalRatings + newRating) /
          (currentTotalRatings + 1);
        updatedTotalRatings = currentTotalRatings + 1;
      }

      await update(userRef, {
        rating: updatedRating,
        totalRatings: updatedTotalRatings,
      });

      await set(ratingRef, newRating);

      setUserData((prev) => ({
        ...prev,
        rating: updatedRating,
        totalRatings: updatedTotalRatings,
      }));
    }
  };

  return (
    <div className="py-[6rem] min-h-screen bg-brown-50 px-2">
      <div className="text-gray-600 space-y-5 px-3 md:px-6 max-w-[1100px] mx-auto shadow-xl rounded-xl bg-white border-4 border-double border-brown-100">
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
          <div className="m-2">
            <h2 className="text-xl font-bold mb-2">Account Information</h2>
            <p className="text-md bg-gray-100 font-semibold">Email:</p>
            <p className="text-md mb-1 break-words">{userData.email}</p>
            <p className="text-md bg-gray-100 font-semibold">Role:</p>
            <p className="text-md mb-1">{userData.role}</p>
            <p className="text-md bg-gray-100 font-semibold">Verification:</p>
            <p className="text-md mb-1">{userData.verification}</p>
            {/* <p className="text-md bg-gray-100 font-semibold">
              Subscription Status:
            </p>
            <p className="text-md mb-1">{userData.subscription_status}</p> */}
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
      {/* Review 5 stars */}
      {userData && (
        <div className="flex flex-col items-center justify-center gap-4 my-[5rem]">
          <h2 className="text-xl font-bold mb-2">User Rating</h2>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="focus:outline-none"
              >
                <svg
                  className={`w-8 h-8 ${
                    star <= (userData.rating || 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <div className="text-gray-600 ml-2">
            ({userData.rating?.toFixed(1) || 0} / 5) from{" "}
            {userData.totalRatings || 0} ratings
          </div>
        </div>
      )}
      {/* Display user's tickets */}
      <div className="block bg-white rounded-lg shadow-md p-4 my-8 md:my-12 w-[95%] md:w-4/5 mx-auto">
        <h1 className="font-bold text-gray-800 text-base md:text-lg lg:text-2xl p-4">
          Open <span className="text-brown-600">Tickets</span>:
        </h1>
        <div className="">
          {userTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border rounded-md p-4 mb-4 transition-all duration-300 ease-in-out"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <details className="cursor-pointer">
                    <summary className="font-semibold text-lg">
                      {ticket.issue}
                    </summary>
                    <div className="mt-2 pl-4 py-2 border-l-2">
                      <p className="text-gray-700">{ticket.description}</p>
                    </div>
                  </details>
                </div>
                <div className="text-left md:text-right text-nowrap border-l-2 border-brown-600 pl-4">
                  <p>
                    <span className="font-semibold">Budget:</span> $
                    {ticket.budget}
                  </p>
                  <p>
                    <span className="font-semibold">Timezone:</span> EST{" "}
                    {ticket.timezone}
                  </p>
                  <p>
                    <span className="font-semibold">OS:</span>{" "}
                    {ticket.operatingsys}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileRes;

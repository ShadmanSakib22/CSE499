import { useCallback, useEffect, useState } from "react";
import Talk from "talkjs";
import { Session, Inbox } from "@talkjs/react";
import { auth, database } from "../firebase/firebase";
import { ref, get, child } from "firebase/database";

function Chat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      if (auth.currentUser) {
        const userRef = ref(database, `users/${auth.currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setCurrentUser(snapshot.val());
        }
      }
    };
    loadUserData();
  }, []);

  const findUserByEmail = async (email) => {
    if (!email) {
      setSearchStatus("Please enter an email address");
      return;
    }

    try {
      const snapshot = await get(child(ref(database), "users"));
      if (snapshot.exists()) {
        const users = snapshot.val();
        const foundUser = Object.entries(users).find(
          ([_, userData]) => userData.email === email
        );

        if (foundUser) {
          const [uid, userData] = foundUser;
          setOtherUser({
            uid,
            ...userData,
          });
          setSearchStatus("User found!");
        } else {
          setSearchStatus("No user found with this email");
        }
      }
    } catch (error) {
      setSearchStatus("Error searching for user");
      console.error("Search error:", error);
    }
  };

  const syncUser = useCallback(() => {
    if (!currentUser) return null;
    return new Talk.User({
      id: auth.currentUser.uid,
      name: currentUser.email.split("@")[0],
      email: currentUser.email,
      photoUrl:
        currentUser.profilePicture || "https://talkjs.com/new-web/avatar-7.jpg",
      role: currentUser.role,
    });
  }, [currentUser]);

  const syncConversation = useCallback(
    (session) => {
      if (!otherUser) return null;

      const conversation = session.getOrCreateConversation(
        Talk.oneOnOneId(auth.currentUser.uid, otherUser.uid)
      );

      const other = new Talk.User({
        id: otherUser.uid,
        name: otherUser.email.split("@")[0],
        email: otherUser.email,
        photoUrl:
          otherUser.profilePicture || "https://talkjs.com/new-web/avatar-8.jpg",
        role: otherUser.role,
      });

      conversation.setParticipant(session.me);
      conversation.setParticipant(other);

      return conversation;
    },
    [otherUser]
  );

  return (
    <div className="mx-auto py-[6rem] px-2 md:px-4 min-h-screen  flex flex-wrap justify-center items-center bg-brown-50">
      <div className="mb-3 ">
        <input
          type="email"
          placeholder="Search user by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="p-2 border border-gray-400 rounded mr-2"
        />
        <button
          onClick={() => findUserByEmail(searchEmail)}
          className="px-4 py-2 bg-brown-500 text-white rounded hover:bg-brown-600"
        >
          Start Chat
        </button>
        {searchStatus && (
          <p className="mt-2 text-sm text-gray-600">{searchStatus}</p>
        )}
      </div>

      {currentUser && (
        <Session appId="tIsLrmex" syncUser={syncUser}>
          <Inbox
            syncConversation={syncConversation}
            style={{ width: "100%", height: "500px" }}
            showLoadingScreen={true}
            loadingScreen={() => <div>Connecting to chat...</div>}
          />
        </Session>
      )}
    </div>
  );
}

export default Chat;

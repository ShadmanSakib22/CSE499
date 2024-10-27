import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebase/firebase";
import { ref, set, onChildAdded } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import Filter from "bad-words"; // Import the bad-words package

const PubChannel = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/profile-res?email=${query}`);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.email);

        const fetchChat = ref(database, "messages/");
        onChildAdded(fetchChat, (snapshot) => {
          const messageData = snapshot.val();

          setMessages((prevMessages) => {
            const messageExists = prevMessages.some(
              (msg) => msg.timestamp === messageData.timestamp
            );

            if (!messageExists) {
              const updatedMessages = [...prevMessages, messageData];

              // Limit the messages array to the last 50 messages
              if (updatedMessages.length > 50) {
                updatedMessages.shift(); // Remove the oldest message
              }
              return updatedMessages;
            }

            return prevMessages;
          });

          scrollToBottom();
        });
      }
    });
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && username) {
      const filter = new Filter(); // Create a new Filter instance
      const cleanMessage = filter.clean(messageInput); // Filter the input

      const timestamp = Date.now();
      const message = {
        username,
        message: cleanMessage,
        timestamp,
      };

      const messageRef = ref(database, `messages/${timestamp}`);
      set(messageRef, message);
      setMessageInput("");
    }
  };

  const scrollToBottom = () => {
    const bottomElement = document.getElementById("bottom");
    if (bottomElement) {
      bottomElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="py-[6rem] px-2 md:px-4 max-w-[1100px] mx-auto min-h-screen">
      {username ? (
        <div>
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-2xl font-semibold">
              Clients🔗Technicians - Public Chatroom
            </h2>
          </div>

          <div className="w-full">
            <h6 className="text-lg mb-4">
              Hello,{" "}
              <span
                id="userWelcomeMessage"
                className="font-semibold break-words"
              >
                {username}
              </span>{" "}
              - Welcome to the public chatroom!
              <div className="text-sm text-gray-500 mt-2 italic">
                Keep the community safe by avoiding profanities in the chat and
                reporting any issues/misconduct. ~ Refer to our Policies Page.
              </div>
            </h6>

            {/*Search User*/}
            <div className="my-[30px]">
              <div className="relative w-full max-w-xl bg-white rounded-full">
                <input
                  placeholder="e.g. example@email.com"
                  className="rounded-full w-full h-12 bg-transparent py-2 pl-8 pr-32 outline-none border-2 border-gray-100 shadow-md hover:outline-none focus:ring-brown-200 focus:border-brown-200"
                  type="text"
                  name="query"
                  id="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute inline-flex items-center h-12 px-4 py-2 text-sm text-white transition duration-150 ease-in-out rounded-full outline-none right-0 top-0 bg-brown-600 sm:px-6 sm:text-base sm:font-medium hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
                  onClick={handleSearch}
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

            <div className="flex flex-wrap">
              <div className="w-full">
                <div
                  id="chat"
                  className="overflow-y-scroll h-[30rem] bg-gray-50 p-4 rounded-md border-4 border-double border-gray-200 mb-4"
                >
                  <ul id="messages" className="list-none p-2">
                    {messages.map((msg, index) => (
                      <li
                        key={index}
                        className={`rounded-2xl p-2 my-2 ${
                          username === msg.username
                            ? "bg-amber-50"
                            : "bg-brown-50"
                        }`}
                      >
                        <span
                          className={`font-bold ${
                            username === msg.username
                              ? "text-green-400 break-words"
                              : "text-brown-900 break-words"
                          }`}
                        >
                          [{formatTimestamp(msg.timestamp)}] {msg.username}:
                        </span>
                        <p className="mt-1 text-black">{msg.message}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <form
                  id="message-form"
                  className="flex items-center gap-2"
                  onSubmit={handleSendMessage}
                >
                  <input
                    id="message-input"
                    type="text"
                    className="flex-grow border-2 p-2 rounded"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <div id="bottom"></div>
                  <button
                    id="message-btn"
                    type="submit"
                    className="bg-brown-500 text-white px-4 py-2 rounded hover:bg-brown-800"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-[15rem] text-center text-xl">You are not logged in.</p>
      )}
    </div>
  );
};

export default PubChannel;

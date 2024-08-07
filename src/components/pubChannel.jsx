import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase/firebase";
import { ref, set, onChildAdded } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import Filter from "bad-words"; // Import the bad-words package

const PubChannel = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("");

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
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
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
    <div className="py-20 container mx-auto">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold">
          Clients🔗Technicians - Public Chatroom
        </h2>
      </div>

      <div className="w-full">
        <h6 className="text-lg mb-4">
          Hello,{" "}
          <span id="userWelcomeMessage" className="font-semibold">
            {username}
          </span>{" "}
          - Welcome to the public chatroom!
          <div className="text-sm text-gray-500 mt-2 italic">
            Keep the community safe by avoiding profanities in the chat and
            reporting any issues/misconduct. ~ Refer to our Policies Page.
          </div>
        </h6>

        {/*Search User*/}

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
                    className={`rounded-2xl p-2 my-2 inline-block ${
                      username === msg.username ? "bg-amber-50 text-right" : "bg-brown-50"
                    }`}
                    
                  >
                    <span
                      className={`font-bold ${
                        username === msg.username
                          ? "text-green-400"
                          : "text-brown-900"
                      }`}
                    >
                      [{formatTimestamp(msg.timestamp)}] {msg.username}:
                    </span>
                    <span className="ml-2 text-black">{msg.message}</span>
                    
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
  );
};

export default PubChannel;

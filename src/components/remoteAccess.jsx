import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, Divider } from "keep-react";
import { ArrowElbowUpRight, Password, Rss } from "phosphor-react";
import { nanoid } from "nanoid";
import featureImage from "../assets/feature.svg";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebase";
import { ref as dbRef, get } from "firebase/database";

export default function Remote_access() {
  const navigate = useNavigate();
  const [room, setRoom] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [user, setUser] = useState(null);
  const sessionTimerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
        getUserData(currentUser.uid);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current);
      }
    };
  }, []);

  const getUserData = async (uid) => {
    try {
      const userRef = dbRef(database, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSubscriptionStatus(data.subscription_status || "Free");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const create = async () => {
    const roomID = await nanoid(7);
    sessionStorage.setItem("hasRefreshed", "false");
    navigate(`/remote-access/_session_/${roomID}`);

    if (subscriptionStatus === "Free") {
      sessionTimerRef.current = setTimeout(() => {
        navigate("/remote-access");
        alert(
          "Free session expired. Please upgrade to continue or start a new session."
        );
      }, 30 * 60 * 1000); // 30 minutes
    }
  };

  const joinRoom = () => {
    if (room.trim() === "") return;
    sessionStorage.setItem("hasRefreshed", "false");
    navigate(`/remote-access/_session_/${room.trim()}`);

    if (subscriptionStatus === "Free") {
      sessionTimerRef.current = setTimeout(() => {
        navigate("/remote-access");
        alert(
          "Free session expired. Please upgrade to continue or start a new session."
        );
      }, 30 * 60 * 1000); // 30 minutes
    }
  };

  return (
    <>
      <div className="py-[5rem] min-h-screen grid items-center overflow-hidden">
        {isLoggedIn ? (
          <div className="flex min-h-screen">
            <div className="flex flex-col md:flex-row w-screen">
              <div className="basis-4/6 bg-white rounded-xl p-10">
                <div className="text-sm font-semibold text-blue-400 mb-4">
                  Current Plan: {subscriptionStatus}
                  {subscriptionStatus === "Free" && (
                    <span className="ml-2 text-yellow-600 font-medium">
                      (30 minutes session limit)
                    </span>
                  )}
                </div>
                <div className="space-y-4 mt-5 px-1 py-4">
                  <h5 className="text-2xl font-semibold text-brown-900">
                    Connect, Collaborate, Control: Anytime, Anywhere.
                  </h5>
                </div>
                <div className="space-y-4 px-1 py-4">
                  <p className="text-lg mb-4">
                    Connecting You Anywhere: Video Calls and Remote Desktop
                    Access for Unified Collaboration
                  </p>
                </div>
                <div className="w-fit px-2 py-1 mt-3 flex flex-col sm:flex-row gap-5">
                  <Button
                    size="sm"
                    className="bg-brown-700 hover:bg-brown-600 p-2"
                    onClick={create}
                  >
                    <ArrowElbowUpRight size={15} className="mr-1.5" />
                    New Session
                  </Button>
                  <form className="flex justify-evenly items-center gap-2">
                    <fieldset className="relative max-w-md">
                      <Input
                        placeholder="Enter Room Code"
                        className=""
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                      />
                    </fieldset>
                    <Button
                      size="sm"
                      className="px-3 bg-brown-700 hover:bg-brown-600"
                      onClick={joinRoom}
                    >
                      join
                    </Button>
                  </form>
                </div>
                <Divider className="mt-5" size="md" color="secondary" />
                <p className="text-body-4 mt-1">
                  <a
                    className="text-blue-500 hover:text-blue-700"
                    href="/about"
                  >
                    Learn
                  </a>{" "}
                  more about us.
                </p>
              </div>
              <div className="flex basis-2/6 justify-center items-center">
                <div className="rounded-xl">
                  <img
                    src={featureImage}
                    className="rounded-t-xl"
                    alt="image"
                    width={600}
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-xl">You are not logged in.</p>
        )}
      </div>
    </>
  );
}

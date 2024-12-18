// src/components/Subscribe.jsx
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebase";
import { ref, update } from "firebase/database";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Subscription = () => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.email);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get("status");
    const sessionId = queryParams.get("session_id"); // Add this line

    if (status === "success" && sessionId) {
      // Check for both status and sessionId
      handleSubscriptionSuccess();
      window.history.replaceState({}, "", "/subscription");
    }
  }, []);

  const handleSubscriptionSuccess = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      try {
        const updates = {
          subscription_status: "Paid",
          subscriptionDate: Date.now(),
        };
        await update(userRef, updates);
        setSubscriptionSuccess(true);
        setTimeout(() => setSubscriptionSuccess(false), 5000);
      } catch (error) {
        console.error("Error updating subscription status:", error);
      }
    }
  };

  const handleSubscription = async () => {
    const stripe = await stripePromise;

    const response = await fetch(
      "https://cse-499.vercel.app/create-subscription",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
        }),
      }
    );

    const session = await response.json();

    if (session.id) {
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    }
  };

  return (
    <div className="pt-[5rem] py-20 bg-brown-50 min-h-screen flex justify-center items-center">
      {isLoggedIn ? (
        <div className="text-gray-600 space-y-5 p-4 px-10 shadow-xl rounded-xl bg-white border-4 border-double border-brown-100 w-full md:w-4/5">
          <div className="bg-brown-400 rounded-r-full border-brown-50 border-2 shadow-sm shadow-brown-500 mt-4">
            <h1 className="text-3xl font-bold text-white p-1 ml-2">
              Subscribe
            </h1>
          </div>
          <br />
          <div className="text-lg my-4 py-2 px-6 bg-brown-100 rounded-xl">
            Logged in as,{" "}
            <span id="userWelcomeMessage" className="font-semibold break-words">
              {username}
            </span>
          </div>
          {subscriptionSuccess && (
            <div className="text-green-600 bg-green-100 p-4 rounded-md mb-4">
              Subscription activated successfully!
            </div>
          )}
          <div className="py-2">
            <div className="relative max-w-7xl mx-auto">
              <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
                <div className="flex-1 px-6 py-8 lg:p-12 bg-brown-800">
                  <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                    Premium Early Access!
                  </h3>
                  <p className="mt-6 text-base text-gray-50 sm:text-lg">
                    Subscribe to the Techsolutions Premium Package to recieve
                    Specialized Support.
                  </p>
                  <div className="mt-8">
                    <div className="flex items-center">
                      <div className="flex-1 border-t-2 border-gray-200"></div>
                    </div>
                    <ul
                      role="list"
                      className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5"
                    >
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-white">
                          Get Unlimited Remote Time
                        </p>
                      </li>
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-white">
                          Early Access to New Updates
                        </p>
                      </li>
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-white">
                          Enhanced Profile Settings
                        </p>
                      </li>
                      <li className="flex items-start lg:col-span-1">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-white">
                          and Many More... (coming soon)
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="py-8 px-6 text-center lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12 bg-brown-700">
                  <p className="text-lg leading-6 font-medium text-white">
                    Become an Early Adopter!
                  </p>
                  <div className="mt-4 flex items-center justify-center text-5xl font-extrabold text-white">
                    <span>$9.99</span>
                    <span className="ml-3 text-xl font-medium text-gray-50">
                      USD
                    </span>
                  </div>
                  <div className="mt-6">
                    <div className="rounded-md shadow">
                      <button
                        onClick={handleSubscription}
                        className="flex w-full items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brown-500 hover:bg-brown-600"
                      >
                        Buy now
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm mt-3">
                      100% money back guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-xl">You are not logged in.</p>
      )}
    </div>
  );
};

export default Subscription;

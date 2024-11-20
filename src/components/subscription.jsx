import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Subscription = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

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
    <div className="min-h-screen pt-[8rem]">
      {isLoggedIn ? (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Premium Subscription</h2>
          <div className="mb-4">
            <h3 className="text-xl mb-2">$30/month</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Priority Support</li>
              <li>Unlimited Tickets</li>
              <li>24/7 Access</li>
            </ul>
          </div>
          <button
            onClick={handleSubscription}
            className="w-full p-2 bg-brown-500 text-white rounded"
          >
            Subscribe Now
          </button>
        </div>
      ) : (
        <p className="text-center text-xl">Please log in to subscribe.</p>
      )}
    </div>
  );
};

export default Subscription;

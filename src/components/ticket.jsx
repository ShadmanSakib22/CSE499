import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebase";
import {
  ref,
  push,
  onValue,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const TicketForm = () => {
  const [username, setUsername] = useState("");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [timezone, setTimezone] = useState("");
  const [operatingsys, setOperatingsys] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Prevent double submission
  const [userTickets, setUserTickets] = useState([]);

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
    const payment = queryParams.get("payment");
    const sessionId = queryParams.get("session_id");

    // Use sessionId as unique submission identifier
    const submissionKey = `submitted_${sessionId}`;
    const isAlreadySubmitted = sessionStorage.getItem(submissionKey);

    if (payment === "success" && sessionId && !isAlreadySubmitted) {
      handleFormSubmit(sessionId);
      // Mark this specific session as submitted
      sessionStorage.setItem(submissionKey, "true");
    }
  }, []);

  const handlePayment = async () => {
    const stripe = await stripePromise;

    // Store form data temporarily in localStorage, including username
    localStorage.setItem("username", username);
    localStorage.setItem("issue", issue);
    localStorage.setItem("description", description);
    localStorage.setItem("budget", budget);
    localStorage.setItem("timezone", timezone);
    localStorage.setItem("operatingsys", operatingsys);

    const response = await fetch(
      "http://localhost:4242/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          issue,
          description,
          budget,
          timezone,
          operatingsys,
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
    } else {
      console.error("Failed to create Stripe session.");
    }
  };

  const handleFormSubmit = async (sessionId) => {
    const ticketRef = ref(database, "tickets");

    // Get stored form data
    const storedData = {
      username: localStorage.getItem("username"),
      issue: localStorage.getItem("issue"),
      description: localStorage.getItem("description"),
      budget: localStorage.getItem("budget"),
      timezone: localStorage.getItem("timezone"),
      operatingsys: localStorage.getItem("operatingsys"),
    };

    // Validate all fields exist
    if (!Object.values(storedData).every((value) => value)) {
      console.log("Missing required fields");
      return;
    }

    try {
      await push(ticketRef, {
        ...storedData,
        sessionId,
        timestamp: Date.now(),
      });

      // Clear storage and update UI
      localStorage.clear();
      setPaymentSuccess(true);
      setHasSubmitted(true);
      window.history.replaceState({}, "", "/ticket");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // Add this useEffect to fetch user's tickets
  useEffect(() => {
    if (username) {
      const ticketsRef = ref(database, "tickets");
      const userTicketsQuery = query(
        ticketsRef,
        orderByChild("username"),
        equalTo(username)
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
  }, [username]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brown-50">
      {isLoggedIn ? (
        <div className="w-full ">
          <div className="mx-auto p-4 max-w-md bg-white rounded-lg shadow-md">
            <form className="space-y-4">
              <input
                type="text"
                value={username}
                disabled
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Issue"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={operatingsys}
                onChange={(e) => setOperatingsys(e.target.value)}
                placeholder="Operating System"
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                className="w-full p-2 border rounded"
              ></textarea>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Budget in USD"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="GMT Timezone"
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="button"
                onClick={handlePayment}
                className="w-full p-2 bg-brown-500 text-white rounded"
              >
                Submit ($0.50 USD)
              </button>
            </form>
          </div>
          <hr />
          <div className="block bg-white rounded-lg shadow-md p-4 mt-8 md:mt-12 w-4/5 mx-auto">
            <h1 className="font-bold text-gray-800 text-base md:text-lg lg:text-2xl p-4">
              Your Open <span className="text-brown-600">Tickets</span>:
            </h1>
            <div className="overflow-y-auto max-h-96">
              {userTickets.map((ticket) => (
                <div key={ticket.id} className="border-b p-4">
                  <h3 className="font-semibold">{ticket.issue}</h3>
                  <p>{ticket.description}</p>
                  <p>Budget: ${ticket.budget}</p>
                  <p>Timezone: {ticket.timezone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-xl">Your are not logged in.</p>
      )}

      {paymentSuccess && (
        <div className="mt-4 text-brown-600">
          <p>Your ticket has been submitted successfully!</p>
        </div>
      )}
    </div>
  );
};

export default TicketForm;

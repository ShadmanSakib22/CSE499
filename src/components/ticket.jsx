import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebase";
import { ref, push } from "firebase/database";

const TicketForm = () => {
  const [username, setUsername] = useState("");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPaid) {
      const ticketRef = ref(database, "tickets");
      await push(ticketRef, {
        username,
        issue,
        description,
        budget,
        timestamp: Date.now(),
      });
      // Reset form fields after submission
      setIssue("");
      setDescription("");
      setBudget("");
      setIsPaid(false);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:8000/php/checkout.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total_amount: 0.5,
          currency: "USD",
          tran_id: "REF123",
          success_url: "http://localhost:5173/success",
          fail_url: "http://localhost:5173/fail",
          cancel_url: "http://localhost:5173/cancel",
          shipping_method: "No",
          product_name: "Ticket Submission Fee",
          product_category: "Service",
          product_profile: "general",
        }),
      });

      const text = await response.text();
      console.log("Raw response:", text);

      const data = JSON.parse(text);

      if (data.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        console.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brown-50">
      <div className="mx-auto p-4 max-w-md bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={handlePayment}
            className="w-full p-2 bg-light-green-400 text-white rounded"
          >
            Pay $0.50 Fee
          </button>
          <button
            type="submit"
            disabled={!isPaid || !issue || !description || !budget}
            className="w-full p-2 bg-brown-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;

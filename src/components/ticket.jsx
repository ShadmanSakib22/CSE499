import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebase";
import { ref, push } from "firebase/database";

const TicketForm = () => {
  const [username, setUsername] = useState("");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [timezone, setTimezone] = useState("");
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
        timezone,
        timestamp: Date.now(),
      });
      // Reset form fields after submission
      setIssue("");
      setDescription("");
      setBudget("");
      setTimezone("");
      setIsPaid(false);
    }
  };

  const handlePayment = async () => {
    /*if the payment is made*/
    setIsPaid(true);
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
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="Your Timezone"
            className="w-full p-2 border rounded"
            required
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
            disabled={!isPaid || !issue || !description || !budget || !timezone}
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

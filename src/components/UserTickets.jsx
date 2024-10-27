import React from "react";

const UserTickets = ({ userTickets, handleDeleteTicket }) => {
  return (
    <div className="block bg-white rounded-lg shadow-md p-4 my-8 md:my-12 w-[95%] md:w-4/5 mx-auto">
      <h1 className="font-bold text-gray-800 text-base md:text-lg lg:text-2xl p-4">
        My Open <span className="text-brown-600">Tickets</span>:
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
                <button
                  onClick={() => handleDeleteTicket(ticket.id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTickets;

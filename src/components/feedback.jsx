// src/components/Feedback.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiscussionEmbed } from "disqus-react";

const Feedback = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/profile-res?email=${query}`);
    }
  };

  const disqusShortname = import.meta.env.VITE_DISQUS_SHORTNAME;
  const disqusConfig = {
    url: "https://cse-499.vercel.app/feedback",
    identifier: "techsol-feedback", // unique identifier
    title: "Feedback", // post title
  };

  return (
    <div className="py-[6rem] px-2 md:px-4 max-w-[1100px] mx-auto min-h-screen">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold">
          Clients🔗Technicians - Feedback
        </h2>
      </div>

      <div className="w-full">
        <h6 className="text-lg mb-4">
          Feel free to express your feedback here or view the community
          sentiments about our Service!
          <div className="text-sm text-gray-500 mt-2 italic">
            Note, you will need to join disqus to comment.
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

        {/*Feedback*/}
        <div className="flex flex-wrap">
          <div className="w-full">
            <div
              id="feedback-disqus"
              className="overflow-y-scroll h-[30rem] bg-gray-50 p-4 rounded-md border-4 border-double border-gray-200 mb-4"
            >
              <h4 className="text-xl text-blue-gray-800 pb-2 font-semibold text-center">
                TechSolutions has helped you{" "}
                <span className="text-brown-700">Find work/Get work done</span>{" "}
                Efficiently.
              </h4>
              <DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

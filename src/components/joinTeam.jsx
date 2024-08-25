// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const joinTeam = () => {
  return (
    <div className="w-full p-10  grid grid-cols-1 md:grid-cols-12 gap-8 bg-gradient-to-b from-gray-50 to-brown-100 pt-[5rem]">
      <div className="md:col-span-6 relative flex flex-col items-center">
        <img
          src="hiring.svg"
          alt="Hiring"
          className="w-full shadow-md rounded-t-lg"
        />
        <div className="p-4 md:p-6 bg-white text-black text-left rounded-b-lg">
          <h2 className="text-2xl font-bold mb-4">
            Join the Ranks of TechSolutions Technicians
          </h2>
          <p className="text-gray-600 text-left font-bold mb-2">
            Why TechSolutions?
          </p>
          <ul className="list-disc list-inside text-gray-600 text-left mb-4">
            <li>
              Supportive environment: Collaborate with experienced
              professionals.
            </li>
            <li>Opportunities to reach new clients.</li>
            <li>Fast response from system administrators.</li>
            <li>Easy Payment Enforcement.</li>
          </ul>
          <p className="text-gray-600 mb-4 text-left">
            The minimum requirements for this position include a strong grasp of
            your field of expertise and a relatively powerful system.
          </p>
          <p className="text-gray-600 text-left font-bold mb-2">
            Ready to apply?
          </p>
          <p className="text-gray-600 text-left">
            Submit an application through the provided form with Correct
            Information. Please provide a brief description of your field of
            expertise and your system information.
          </p>
        </div>
      </div>

      <div className="md:col-span-6 flex flex-col justify-between">
        <div className="bg-white p-8 rounded-lg shadow-md ">
          <h2 className="text-2xl font-bold mb-4">
            Technician Application Form
          </h2>
          <form>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="first-name"
              >
                First Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="first-name"
                type="text"
                placeholder="First Name"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="last-name"
              >
                Last Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="last-name"
                type="text"
                placeholder="Last Name"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="message"
                rows="4"
                placeholder="Include Your Expertise & System Information"
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="hover:bg-brown-600 w-40 h-10 rounded-lg bg-black text-white text-sm  border-2 border-black"
                type="button"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <p className="text-gray-700 flex items-center justify-center mb-3">
            <strong>For business queries, please connect through:</strong>
          </p>

          <div className="text-gray-700 mb-3">
            <div className="flex justify-center border-2">
              <EnvelopeIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <b>Email:</b>
            </div>
            <span className="text-sm">support@example.com</span>
          </div>

          <div className="text-gray-700 mb-3">
            <div className="flex justify-center border-2">
              <PhoneIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <b>Phone:</b>
            </div>
            <span className="text-sm">+123 456 7890</span>
          </div>

          <div className="text-gray-700 mb-3">
            <div className="flex justify-center border-2">
              <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <b>Address:</b>
            </div>
            <span className="text-sm">1234 Street Name, City, Country</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default joinTeam;

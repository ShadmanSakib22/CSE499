import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-2">
        <div className="w-full p-12 order-2 lg:order-1">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl underline decoration-8 decoration-blue-400">
            About Us:
          </h2>
          <div className="text-gray-600 text-lg mt-2">
            <br />
            <p>
              Tired of confusing interfaces and long wait times for remote tech
              help? At TechSolutions, we understand the frustration. That's why
              we created a platform that streamlines remote assistance, making
              it easier than ever for clients to connect with skilled
              technicians.
            </p>
            <div className="block lg:hidden mt-4">
              <img
                src="about.png"
                alt="About Us Image"
                className="object-cover"
              />
            </div>
            <br />
            <p>
              Our user-friendly interface facilitates clear communication and
              secure remote access, so you can get the help you need quickly and
              efficiently.
            </p>
            <br />
            <p>
              We build connections! Expand your network as a Technician, reach
              new clients, and elevate your career by applying for Technician
              role here at TechSolutions.
            </p>
          </div>
          <div className="mt-8">
            <Link to="/join-team">
              <a className="text-blue-500 hover:text-blue-600 font-medium">
                To Learn more <span className="ml-2">&#8594;</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="mt-12 md:mt-0 hidden lg:block order-1 lg:order-2">
          <img src="about.png" alt="About Us Image" className="object-cover" />
        </div>
      </div>
    </div>
  );
};

export default About;

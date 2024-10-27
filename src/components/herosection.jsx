import { BackgroundBeams } from "./background-beams";
import { Button } from "@material-tailwind/react";
import bgimg from "../assets/remote-access.jpg";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [text] = useTypewriter({
    words: [
      "Click on Services for a Detailed Overview.",
      "Click on Sign-In to Access Chatrooms.",
      "Please Consider Subscribing to get our Best Services.",
    ],
    loop: 3,
  });

  return (
    <div
      className="flex items-center justify-center bg-cover bg-center h-[45rem] w-full"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <div className="flex flex-col items-center justify-center h-full w-full bg-black bg-opacity-70 px-4 lg:px-8 ">
        <div className="max-w-[1300px]">
          <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center tracking-tight text-white">
            <span className="text-green-100">Tech-Solutions:</span> Community
            Driven{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-400 from-blue-100">
              Remote
            </span>{" "}
            Assistance.
          </h1>
          <p className="text-base sm:text-1xl md:text-2xl  font-normal text-gray-200 text-center max-w-2xl mx-auto">
            Here at TechSolutions, we facilitate the meeting between Clients and
            Adept Technicians.
          </p>
          <br></br>
          <div className="typewriter text-base sm:text-lg md:text-xl font-semibold text-light-green-100 text-center max-w-2xl mx-auto">
            <span>{text}</span>
            <Cursor />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-8 z-10">
          <Link to="/login">
            <Button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm hover:bg-green-200">
              Sign-In
            </Button>
          </Link>
          <Link to="/services">
            <Button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm hover:bg-blue-200">
              Services
            </Button>
          </Link>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
};

export default HeroSection;

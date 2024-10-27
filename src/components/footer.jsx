import discord from "../assets/discord.svg";
import twitter from "../assets/twitter.svg";
import instagram from "../assets/instagram.svg";
import telegram from "../assets/telegram.svg";
import facebook from "../assets/facebook.svg";

const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discord,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];

const Footer = () => {
  return (
    <div className="bg-gradient-to-tr from-gray-900 to-brown-900 border-t-4 border-brown-200 border-double py-2 px-4">
      <div className="grid grid-cols-1 items-center justify-center">
        <ul className="flex gap-3 p-1 w-full  justify-center mx-auto bg-black opacity-40 rounded-xl border-2 ">
          {socials.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer" // Added rel attribute for security
              className="flex items-center justify-center w-10 h-10 bg-n-7 rounded-md transition-colors hover:bg-brown-200"
            >
              <img src={item.iconUrl} width={16} height={16} alt={item.title} />
            </a>
          ))}
        </ul>

        <p className="text-gray-400 text-center mt-2  opacity-75">
          <a href="#" className="hover:underline px-1">
            © {new Date().getFullYear()}. All rights reserved
          </a>
          {" | "}
          <a href="#" className="hover:underline px-1">
            Changelog
          </a>
        </p>
      </div>
    </div>
  );
};
export default Footer;

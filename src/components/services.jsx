import Advertise from "./advertise.jsx";

const Services = () => {
  return (
    <>
      {" "}
      <Advertise />
      <section
        id="Services"
        className="mx-auto px-4 space-y-6 bg-gradient-to-b from-brown-50 to-gray-50 py-[6rem]"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl underline decoration-8 decoration-blue-300">
            Services
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            We aim to provide secure and dependable services for your needs.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {ServicesData.map((feature, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-md hover:border-brown-300 hover:scale-105 bg-gradient-to-t from-brown-50 to-white border-4 border-brown-100 border-double select-none p-2 "
            >
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <img
                  src={feature.imageSrc}
                  alt={feature.title}
                  className="h-12 w-12"
                />
                <div className="space-y-2">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

const ServicesData = [
  {
    title: "Video Calling",
    description: "Ability to Join or Start a Video call",
    imageSrc: "video-call.svg",
  },
  {
    title: "Screen Share",
    description: "Ability to Share your Screen",
    imageSrc: "screenshare.svg",
  },
  {
    title: "Inbox",
    description: "Direct Messaging Capabilities",
    imageSrc: "inbox.svg",
  },
  {
    title: "Chatrooms",
    description: "Public Chatrooms to Connect with Peers & Technicians",
    imageSrc: "chatroom.svg",
  },
  {
    title: "Forums",
    description: "Subreddit to Share Experiences",
    imageSrc: "forum.svg",
  },
  {
    title: "Remote Access Tool",
    description: "Our very own Secure Remote Access tool",
    imageSrc: "remote.svg",
  },
];

export default Services;

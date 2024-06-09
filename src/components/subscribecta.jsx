import React from "react";

const SubscribeCTA = () => {
  return (
    <section className="bg-white py-10 shadow-2xl shadow-black border-y-2">
      <div className="container relative mx-auto max-w-5xl">
        <div className="rounded-md shadow-lg border-black border-8 border-double bg-gray-50">
          <div className="flex w-full flex-wrap items-center justify-between gap-4 px-8 py-10 sm:px-16 lg:flex-nowrap">
            <div className="lg:max-w-xl">
              <h2 className="block w-full font-bold text-2xl leading-[1.1]">
                Subscribe to Connect with Our Best Technicians
              </h2>
              <p className="mt-4 font-medium leading-relaxed tracking-wide text-gray-700">
                Receive quick responses and get the best technical support from
                our experts.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button
                className="hover:bg-gray-400 w-40 h-10 rounded-lg  text-black border-2 border-black text-sm"
                type="button"
              >
                Learn More
              </button>
              <button
                className="hover:bg-brown-700 w-40 h-10 rounded-lg bg-black text-white text-sm border-2 border-black"
                type="button"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeCTA;

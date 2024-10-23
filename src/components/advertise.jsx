const Advertise = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="w-full h-96 bg-cover bg-no-repeat relative"
        style={{ backgroundImage: "url('remote-conn-img.webp')" }}
      >
        <div className="absolute inset-0 bg-blue-gray-800 opacity-80 flex items-center justify-center p-4">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Harness the power of Remote Access
            </h1>
            <p className="text-lg md:text-xl">
              Access your device from anywhere.
              <br />
              If your device can support a Browser, we can support your
              Connection!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertise;

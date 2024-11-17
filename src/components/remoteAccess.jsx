import { useNavigate } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, Divider } from "keep-react";
import { ArrowElbowUpRight, Password, Rss } from "phosphor-react";
import { nanoid } from "nanoid";
import featureImage from "../assets/feature.svg";
export default function Remote_access() {
  console.log("remote access");

  const navigate = useNavigate(); // useNavigate hook
  const [room, setRoom] = useState("");
  const create = async () => {
    const roomID = await nanoid(7);

    sessionStorage.setItem("hasRefreshed", "false");

    navigate(`/remote-access/_session_/${roomID}`);
  };

  const joinRoom = () => {
    if (room.trim() === "") return;
    sessionStorage.setItem("hasRefreshed", "false");
    navigate(`/remote-access/_session_/${room.trim()}`);
  };

  // useEffect(() => {
  //   const hasRefreshed = sessionStorage.getItem("hasRefreshed");

  //   if (hasRefreshed === "false") {
  //     console.log("done");
  //     sessionStorage.setItem("hasRefreshed", "true");
  //     window.location.reload(); //trigger a refresh so that it should turn of the camera
  //   }
  // }, []);

  return (
    <>
      <div className="py-[5rem]">
        <div className="flex min-h-screen  ">
          {/* main body part  */}

          <div className=" flex flex-col md:flex-row w-screen  ">
            {/* this is the left part */}
            <div className="basis-4/6 bg-white rounded-xl p-10">
              {/* this is moto  */}

              <div className="space-y-4 mt-5 px-1 py-4 ">
                <h5 className="text-2xl font-semibold text-brown-900">
                  Connect, Collaborate, Control: Anytime, Anywhere.
                </h5>
              </div>
              {/* this is the descriptive moto  */}

              <div className="space-y-4  px-1 py-4  ">
                <p className="text-lg mb-4">
                  Connecting You Anywhere: Video Calls and Remote Desktop Access
                  for Unified Collaboration
                </p>
              </div>

              {/* this is the join session part  */}

              <div className="w-fit px-2 py-1 mt-3 flex flex-col sm:flex-row gap-5">
                <Button
                  size="sm"
                  className="bg-brown-700 hover:bg-brown-600 p-2"
                  onClick={create}
                >
                  <ArrowElbowUpRight size={15} className="mr-1.5" />
                  New Session
                </Button>

                <form className="flex justify-evenly items-center gap-2 ">
                  {/* <fieldset className="relative max-w-md">
                  <Input placeholder="Enter Email" className="ps-11" />
                </fieldset> */}

                  <fieldset className="relative max-w-md">
                    <Input
                      placeholder="Enter Room Code"
                      className=""
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                    />
                  </fieldset>

                  <Button
                    size="sm"
                    className=" px-3 bg-brown-700 hover:bg-brown-600 "
                    onClick={joinRoom}
                  >
                    join
                  </Button>
                </form>
              </div>

              <Divider className="mt-5" size="md" color="secondary" />

              <p className="text-body-4 mt-1">
                <a className="text-blue-500 hover:text-blue-700" href="/about">
                  Learn
                </a>{" "}
                more about us.
              </p>
            </div>
            {/* this is right part */}

            <div className="flex basis-2/6 justify-center  items-center ">
              {/* carousel part  */}

              <div className="rounded-xl ">
                <img
                  src={featureImage}
                  className="rounded-t-xl"
                  alt="image"
                  width={600}
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

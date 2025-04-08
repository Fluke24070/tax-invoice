import React from "react";
import { useNavigate } from "react-router-dom";
import TQ from "../assets/image/TQ.png";
const Enter = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyan-100 flex flex-col items-center justify-start">
      <div className="w-full bg-cyan-300 h-16 flex items-center justify-end px-4 space-x-2">
        <div className="w-20 h-6 bg-blue-200 rounded"></div>
        <div className="w-20 h-6 bg-blue-200 rounded"></div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center bg-blue-100 py-16">
        <div className="bg-blue-200 rounded-lg shadow-md p-8 flex items-center justify-between w-[80%] max-w-5xl">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-bold">
              Tax invoice website to <br /> reduce human error by <br /> using QR code
            </h2>
            <button
              onClick={() => navigate("/signin")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            >
              REGISTER
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            >
              LOGIN
            </button>
          </div>
          <img
        src={TQ}
        style={{
          width: "100px", height: "100px", cursor: "pointer",
          transition: "opacity 0.3s", margin: "20px"
        }}
      />
        </div>
      </div>

      <div className="w-full bg-cyan-300 h-16" />
    </div>
  );
};

export default Enter;
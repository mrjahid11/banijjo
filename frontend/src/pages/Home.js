import React from "react";

const Home = () => {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Fullscreen Image */}
      <img
        src="/first-leap.jpeg"
        alt="First Leap"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // ensures the image covers the whole screen
        }}
      />

      {/* Text Overlay */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontSize: "3rem",
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "2px 2px 10px rgba(0,0,0,0.8)", // makes text readable
        }}
      >
        Empowering Traders Worldwide
      </div>
    </div>
  );
};

export default Home;

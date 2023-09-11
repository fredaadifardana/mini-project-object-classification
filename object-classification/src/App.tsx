import "./App.css";
import React from "react";
import Webcam from "react-webcam";
function App() {
  const videoOption = {
    width: 720,
    height: 480,
    facingMode: "enviroment",
  };
  return (
    <>
      <p>Object Classification</p>
      <button></button>
      <Webcam audio={false} videoConstraints={videoOption}></Webcam>
    </>
  );
}

export default App;

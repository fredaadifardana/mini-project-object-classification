import "./App.css";
import React from "react";
import Webcam from "react-webcam";
function App() {
  return (
    <>
      <p>Object Classification</p>
      <Webcam audio={false}></Webcam>
    </>
  );
}

export default App;

import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "./App.css";
import { useState, useEffect, useRef } from "react";

function App() {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const videoRef = useRef<Webcam | null>(null);
  const [objectName, setObjectName] = useState("");
  const [objectScore, setObjectScore] = useState("");

  async function loadModel() {
    try {
      const dataset = await cocoSsd.load();
      setModel(dataset);
      console.log("dataset benar...");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  async function predict() {
    if (model && videoRef.current && videoRef.current.video) {
      const detection = await model.detect(videoRef.current.video);
      if (detection.length > 0) {
        detection.map((result, i) => {
          // console.log(result.score);
          // console.log(result.class);
          setObjectName(result.class);
          setObjectScore(result.score);
        });
      }
    } else {
      console.log("Model belum dimuat atau video belum tersedia");
    }
  }

  const videoOption = {
    width: 720,
    height: 480,
    facingMode: "enviroment",
  };

  console.log(model);

  return (
    <div className="">
      <h1>Object Dettection</h1>
      <Webcam
        id="videoSource"
        audio={false}
        videoConstraints={videoOption}
        mirrored={true}
        ref={videoRef}
      />
      <h3>{objectName ? objectName.toString() : ""}</h3>
      <h3>{objectScore ? objectScore.toString() : ""}</h3>
      <button onClick={() => predict()}>TEBAK OBJECT</button>
    </div>
  );
}

export default App;

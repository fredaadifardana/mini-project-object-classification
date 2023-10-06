import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";

function App() {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const videoRef = useRef<Webcam | null>(null);
  const [objectName, setObjectName] = useState("");
  const [objectScore, setObjectScore] = useState("");
  const [statusData, setStatusData] = useState("");
  const [imgUrl, setImgUrl] = useState<string | null | undefined>(
    "../src/assets/error_image.jpg"
  );
  const [xMin, setXMin] = useState(0);
  const [yMin, setYMin] = useState(0);
  const [xMax, setXMax] = useState(0);
  const [yMax, setYMax] = useState(0);

  // memuat dataset ketika web diakses
  async function loadModel() {
    try {
      const dataset = await cocoSsd.load();
      setModel(dataset);
      // console.log(model);
      console.log("Dataset Siap");
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
      //   if (detection.length > 0) {
      //     detection.map((result, i) => {
      //       setObjectName(result.class);
      //       setObjectScore(result.score);
      //     });
      //     capture();
      //   }
      // } else {
      //   console.log("Model belum dimuat atau video belum tersedia");
      if (detection.length > 0) {
        setYMin(detection[0].bbox[0]);
        setXMin(detection[0].bbox[1]);
        setYMax(detection[0].bbox[2]);
        setXMax(detection[0].bbox[3]);
        setObjectName(detection[0].class);
        setObjectScore(detection[0].score.toString());
        setStatusData("Terdeteksi");

        capture();
      } else {
        setYMin(0);
        setXMin(0);
        setYMax(0);
        setXMax(0);
        setStatusData("Tidak Terdeteksi");
        setObjectName("-");
        setObjectScore("-");
        setImgUrl("../src/assets/error_image.jpg");
      }
    }
  }

  const videoOption = {
    width: 720,
    height: 480,
    facingMode: "enviroment",
  };

  const capture = React.useCallback(() => {
    const imageSrc = videoRef.current?.getScreenshot();
    setImgUrl(imageSrc);
  }, [videoRef]);

  const rectStyle = {
    border: `${yMin === 0 ? "" : "6px solid blue"}`,
    position: "absolute",
    width: `${yMax}px`,
    height: `${xMax}px`,
    top: `${xMin}px`,
    left: `${yMin}px`,
  };

  return (
    <div className="container">
      <div className="container-content">
        <div className="container-video">
          <h2>Object Dettection</h2>
          <Webcam
            id="videoSource"
            audio={false}
            videoConstraints={videoOption}
            mirrored={true}
            ref={videoRef}
            screenshotFormat="image/jpeg"
            // height={480}
            // width={720}
          />
          <button onClick={() => predict()} className="button-tebak-object">
            Tebak Object
          </button>
        </div>
        <div className="container-history">
          <h2>Hasil Dettection</h2>
          <div className="container-showImg">
            <div style={rectStyle}></div>
            <img
              src={imgUrl}
              alt="Gambar Screenshot"
              height={480}
              width={720}
            />
          </div>
          <h3>Status: {statusData}</h3>
          <h3>Nama Object: {objectName ? objectName.toString() : ""}</h3>
          <h3>Akurasi: {objectScore ? objectScore.toString() : ""}</h3>
        </div>
      </div>
    </div>
  );
}

export default App;

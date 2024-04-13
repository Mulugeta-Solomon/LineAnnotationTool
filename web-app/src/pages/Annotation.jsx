import { useState } from "react";
import testImage1 from "../images/00030043.png";
// import { ImageWithLines } from "../components/ImageWithLines";
import Welcome from "../pages/Welcome"
// import testImage2 from "../images/00030210.png";
// import React from "react";

function AnnotationTool() {
  // State variables for edge and environment annotations
  const [edgeAnnotation, setEdgeAnnotation] = useState("");
  // const [environmentAnnotation, setEnvironmentAnnotation] = useState("");
  const [isIndoor, setIsIndoor] = useState(true);

  // Function to handle edge annotation changes
  const handleEdgeChange = (event) => {
    setEdgeAnnotation(event.target.value);
  };

  // Function to handle environment annotation changes

  const handleToggle = () => {
    setIsIndoor(!isIndoor);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Annotation and Image Area (80% height) */}
      <div className="annotation-and-image w-screen flex flex-grow">
        {/* Annotation Setters (40% width) */}
        <div className="annotation-area w-2/5 p-4 mx-4 my-4">
          <div className="mb-4">
            <h2 className="text-2xl py-3 font-semibold text-center">
              Edge Annotation
            </h2>
            <div className="flex flex-col mx-5 py-2">
              <label
                className={`text-xl fast-change my-1 px-1 py-1 border border-red-800 rounded ${
                  edgeAnnotation === "horizontalUpperEdge" ? "bg-red-400" : ""
                }`}
              >
                <input
                  type="radio"
                  value="horizontalUpperEdge"
                  checked={edgeAnnotation === "horizontalUpperEdge"}
                  onChange={handleEdgeChange}
                  className="h-5 w-5"
                />
                <span className="px-2"> Horizontal Upper Edge </span>
              </label>
              <label
                className={`text-xl fast-change my-1 px-1 py-1 border border-green-800 rounded ${
                  edgeAnnotation === "wallEdge" ? "bg-green-400" : ""
                }`}
              >
                <input
                  type="radio"
                  value="wallEdge"
                  checked={edgeAnnotation === "wallEdge"}
                  onChange={handleEdgeChange}
                  className="h-5 w-5"
                />
                <span className="px-2"> Wall Edge </span>
              </label>
              <label
                className={`text-xl fast-change my-1 px-1 py-1 border border-blue-800 rounded ${
                  edgeAnnotation === "horizontalLowerEdge" ? "bg-blue-400" : ""
                }`}
              >
                <input
                  type="radio"
                  value="horizontalLowerEdge"
                  checked={edgeAnnotation === "horizontalLowerEdge"}
                  onChange={handleEdgeChange}
                  className="h-5 w-5"
                />
                <span className="px-2">Horizontal Lower Edge</span>
              </label>
              <label
                className={`text-xl fast-change my-1 px-1 py-1 border border-yellow-800 rounded ${
                  edgeAnnotation === "doorEdge" ? "bg-yellow-400" : ""
                }`}
              >
                <input
                  type="radio"
                  value="doorEdge"
                  checked={edgeAnnotation === "doorEdge"}
                  onChange={handleEdgeChange}
                  className="h-5 w-5"
                />
                <span className="px-2">Door Edge</span>
              </label>
              <label
                className={`text-xl fast-change my-1 px-1 py-1 border border-magenta-800 rounded ${
                  edgeAnnotation === "windowEdge" ? "bg-magenta-400" : ""
                }`}
              >
                <input
                  type="radio"
                  value="windowEdge"
                  checked={edgeAnnotation === "windowEdge"}
                  onChange={handleEdgeChange}
                  className="h-5 w-5"
                />
                <span className="px-2">Window Edge</span>
              </label>
              <label
                className={`text-xl fast-change my-1 px-1 py-1 border border-gray-800 rounded ${
                  edgeAnnotation === "miscellaneousObjects" ? "bg-gray-400" : ""
                }`}
              >
                <input
                  type="radio"
                  value="miscellaneousObjects"
                  checked={edgeAnnotation === "miscellaneousObjects"}
                  onChange={handleEdgeChange}
                  className="h-5 w-5"
                />
                <span className="px-2">Miscellaneous Objects</span>
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-2xl py-2 font-semibold text-center">
              Environment Annotation
            </h2>
            <div className="flex flex-col mx-5 my-3">
              <button
                onClick={handleToggle}
                className={`text-xl toggle-button ${
                  isIndoor ? "indoor" : "outdoor"
                }`}
              >
                {isIndoor ? "Indoor" : "Outdoor"}
              </button>
            </div>
          </div>
        </div>

        {/* Image Area (60% width) */}
        <div className="image-area w-3/5 border-2 mx-2 my-2 border-teal-700">
          {/* Image will be displayed here */}
          <div className="h-full flex items-center justify-center">
            {/* <img src={testImage1} alt="Image" className="img-contain" /> */}
            <Welcome
              src={testImage1}
              lines={[
                {
                  points: [
                    164.16184997558594, 26.80635643005371, 169.25286865234375,
                    119.97126770019531,
                  ],
                  color: "red",
                },
                { points: [50, 50, 100, 100], color: "blue" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Button Holder (Footer - 50% width, 20% height) */}

      <div className="buttons-area w-full h-1/5 flex flex-row items-center justify-around">
        <div className="line-buttons w-2/5 flex justify-center  space-x-24">
          <button className="px-4 py-2 bg-gray-500 text-white rounded">
            Previous Line
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded">
            Next Line
          </button>
        </div>
        <div className="action-buttons w-3/5 flex justify-center space-x-24">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Next Image
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnotationTool;

import { useState, useEffect } from "react";
// import { ImageWithLines } from "../components/ImageWithLines";
import LinedImage from "./LinedImage";

const annotationMap = {
  miscellaneousObjects: 6,
  windowEdge: 5,
  doorEdge: 4,
  horizontalLowerEdge: 3,
  wallEdge: 2,
  horizontalUpperEdge: 1,
  notAnnotated: 0,
};
function AnnotationTool() {
  const [edgeAnnotation, setEdgeAnnotation] = useState(null);
  const [isIndoor, setIsIndoor] = useState(true);
  const [currentImageURL, setCurrentImageURL] = useState(null);
  const [currentImageAnnotations, setCurrentImageAnnotations] = useState(null);
  const [currentImageEdgePositives, setCurrentImageEdgePositives] =
    useState(null);
  const [currentImageJunctions, setCurrentImageJunctions] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const image_data = await fetch(import.meta.env.VITE_IMAGE_DATA_API);
      const json_image_data = await image_data.json();
      // console.log(json_image_data.junctions);
      // console.log(json_image_data._id);
      // console.log(json_image_data.filename);
      // console.log(json_image_data.line_annotations);
      // console.log(json_image_data.edges_positive);

      const annotations = json_image_data.line_annotations;
      const junctions = json_image_data.junctions;
      const filename = json_image_data.filename;
      const edge_positive = json_image_data.edges_positive;

      setImageFileName(filename);
      setCurrentImageJunctions(junctions);
      setCurrentImageEdgePositives(edge_positive);
      setCurrentImageAnnotations(annotations);

      const response = await fetch(
        `${import.meta.env.VITE_IMAGE_API}${filename}`
      );
      // console.log(response);
      const image = await response.blob();

      // console.log(image);

      setCurrentImageURL(URL.createObjectURL(image));

      // make post to change status

      try {
        const data = {
          data: [filename],
        };
        await fetch(import.meta.env.VITE_ALTER_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.log("Somethings went wrong when updating picture status");
      }

      setIsLoading(false);
    })();
  }, []);

  const handleEdgeChange = (event) => {
    setEdgeAnnotation(event.target.value);
    let prevAnnotations = currentImageAnnotations;
    prevAnnotations[currentLine] = annotationMap[event.target.value];
    setCurrentImageAnnotations(prevAnnotations);
  };

  const handleToggle = () => {
    setIsIndoor(!isIndoor);
  };

  const handleNextLine = () => {
    console.log();
    if (currentImageAnnotations[currentLine] == 0) {
      alert("YOU MUST ANNOTATE CURRENT LINE BEFORE MOVING ON TO THE NEXT.");
    } else {
      setCurrentLine((currentLine + 1) % currentImageEdgePositives.length);
      setEdgeAnnotation(null);
    }
  };

  const handlePreviousLine = () => {
    setCurrentLine(
      (currentLine - 1 + currentImageEdgePositives.length) %
        currentImageEdgePositives.length
    );
    setEdgeAnnotation(null);
  };

  const allLinesAreAnnotated = async () => {
    for (let i = 0; i < currentImageAnnotations.length; i++) {
      if (currentImageAnnotations[i] == 0) {
        return false;
      }
    }
    return true;
  };
  const handleSave = async () => {
    if (await allLinesAreAnnotated()) {
      try {
        setIsLoading(true);

        try {
          const data = {
            filename: imageFileName,
            annotations: currentImageAnnotations
          };
          await fetch(import.meta.env.VITE_UPLOAD_API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        } catch (error) {
          console.log("Somethings went wrong when updating picture status");
        }
        const image_data = await fetch(import.meta.env.VITE_IMAGE_DATA_API);
        const json_image_data = await image_data.json();

        const annotations = json_image_data.line_annotations;
        const junctions = json_image_data.junctions;
        const filename = json_image_data.filename;
        const edge_positive = json_image_data.edges_positive;

        setImageFileName(filename);
        setCurrentImageJunctions(junctions);
        setCurrentImageEdgePositives(edge_positive);
        setCurrentImageAnnotations(annotations);

        const response = await fetch(
          `${import.meta.env.VITE_IMAGE_API}${filename}`
        );
        const image = await response.blob();

        setCurrentImageURL(URL.createObjectURL(image));

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching image data:", error);
      }
    } else {
      alert("You must annotate all lines before saving.");
    }
  };

  return (
    <div className="flex flex-col h-screen pb-2">
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
                className={`text-xl fast-change my-1 px-1 py-1 border border-orange-800 rounded ${
                  edgeAnnotation === "miscellaneousObjects"
                    ? "bg-orange-600"
                    : ""
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
          {isLoading && (
            <div className="spinner-overlay">
              <div className="spinner"></div>
            </div>
          )}
          {/* Image will be displayed here */}
          <div className="h-full flex items-center justify-center">
            <LinedImage
              src={currentImageURL}
              imageJunctions={currentImageJunctions}
              imageEdgePositives={currentImageEdgePositives}
              currentLine={currentLine}
              currentAnnotations={currentImageAnnotations}
            />
          </div>
        </div>
      </div>

      {/* Button Holder (Footer - 50% width, 20% height) */}

      <div className="buttons-area w-full  flex flex-row items-center justify-around">
        <div className="line-buttons w-2/5 flex justify-center  space-x-24">
          <button
            onClick={handlePreviousLine}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Previous Line
          </button>
          <button
            onClick={handleNextLine}
            className="px-4 py-2 bg-yellow-600 text-white rounded"
          >
            Next Line
          </button>
        </div>
        <div className="action-buttons w-3/5 flex justify-center space-x-24">
          <button
            onClick={handleSave}
            className="px-7 py-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnotationTool;

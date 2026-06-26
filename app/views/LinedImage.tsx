"use client";
import { useEffect, useMemo } from "react";
import { Stage, Layer, Image, Circle } from "react-konva";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/lib/store";
import EdgeLine from "../components/EdgeLine";
import DashLine from "../components/DashLine";
import { updateDimensions } from "@/lib/features/image/imageSlice";
import { toast } from "react-toastify";

const LinedImage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const img = useMemo(() => new window.Image(), []);
  const {
    currentImageAnnotations,
    currentImageEdgePositives,
    currentImageJunctions,
    currentLine,
  } = useAppSelector((state) => state.annotationReducer.value);

  const { dimensions } = useAppSelector((state) => state.imageReducer);
  const storedImageURL = localStorage.getItem("currentImageURL");

  useEffect(() => {
    img.src = storedImageURL || "";
    img.onload = () => {
      dispatch(updateDimensions({ width: img.width, height: img.height }));
    };
  }, [storedImageURL, dispatch, img]);

  if (!currentImageEdgePositives) {
    return null;
  }

  return (
    <Stage width={dimensions.width} height={dimensions.height}>
      <Layer>
        {img && (
          <Image
            alt="Image To be Annotated"
            image={img}
            width={dimensions.width}
            height={dimensions.height}
          />
        )}
        {currentImageJunctions &&
          currentImageEdgePositives &&
          currentImageEdgePositives.map((line: number[], index: number) => {
            const x1 = currentImageJunctions[line[0]][0];
            const y1 = currentImageJunctions[line[0]][1];
            const x2 = currentImageJunctions[line[1]][0];
            const y2 = currentImageJunctions[line[1]][1];

            const annotation = currentImageAnnotations[index];
            const points = [x1, y1, x2, y2];
            let selectedLine = null;

            switch (annotation) {
              case 0:
                selectedLine = <DashLine points={points} key={index} />;
                break;
              case 1:
                selectedLine = (
                  <EdgeLine
                    points={points}
                    color={"rgb(185, 28, 28)"}
                    key={index}
                  />
                );
                break;
              case 2:
                selectedLine = (
                  <EdgeLine
                    points={points}
                    color={"rgb(74,222, 128)"}
                    key={index}
                  />
                );
                break;
              case 3:
                selectedLine = (
                  <EdgeLine
                    points={points}
                    color={"rgb(96,165,250)"}
                    key={index}
                  />
                );
                break;
              case 4:
                selectedLine = (
                  <EdgeLine
                    points={points}
                    color={"rgb(250, 204, 21)"}
                    key={index}
                  />
                );
                break;
              case 5:
                selectedLine = (
                  <EdgeLine
                    points={points}
                    color={"rgb(255, 77, 255)"}
                    key={index}
                  />
                );
                break;
              case 6:
                selectedLine = (
                  <EdgeLine
                    points={points}
                    color={"rgb(234, 88, 12)"}
                    key={index}
                  />
                );
                break;
              default:
                selectedLine = null;
                toast.error("Unknown annotation");
            }
            return selectedLine;
          })}
        {currentImageJunctions && (
          <>
            <Circle
              x={
                currentImageJunctions[
                  currentImageEdgePositives[currentLine][0]
                ][0]
              }
              y={
                currentImageJunctions[
                  currentImageEdgePositives[currentLine][0]
                ][1]
              }
              radius={4}
              fill="blue"
            />
            <Circle
              x={
                currentImageJunctions[
                  currentImageEdgePositives[currentLine][1]
                ][0]
              }
              y={
                currentImageJunctions[
                  currentImageEdgePositives[currentLine][1]
                ][1]
              }
              radius={4}
              fill="blue"
            />
          </>
        )}
      </Layer>
    </Stage>
  );
};

export default LinedImage;

import { useEffect, useState } from "react";
import { Stage, Layer, Image ,Circle} from "react-konva";
import DashedLine from "../components/DashedLine";
import DELine from "../components/DELine";
import HLELine from "../components/HLELine";
import HUELine from "../components/HUELine";
import MOLine from "../components/MOLine";
import WallELine from "../components/WallELine";
import WindowELine from "../components/WindowELine";

function LinedImage({
  src,
  imageJunctions,
  imageEdgePositives,
  currentLine,
  currentAnnotations,
}) {
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setImage(img);
      setDimensions({ width: img.width, height: img.height });
    };
  }, [src]);

  if (!imageEdgePositives) {
    return null;
  }

  return (
    <div className="img-contain">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {image && (
            <Image
              image={image}
              width={dimensions.width}
              height={dimensions.height}
            />
          )}
          {imageEdgePositives.map((line, index) => {
            const x1 = imageJunctions[line[0]][0];
            const y1 = imageJunctions[line[0]][1];
            const x2 = imageJunctions[line[1]][0];
            const y2 = imageJunctions[line[1]][1];
            const annotation = currentAnnotations[index];
            const points = [x1, y1, x2, y2];
            let selectedLine = null;
            switch (annotation) {
              case 0:
                selectedLine = <DashedLine points={points} key={index} />;
                break;
              case 1:
                selectedLine = <HUELine points={points} key={index} />;
                break;
              case 2:
                selectedLine = <WallELine points={points} key={index} />;
                break;
              case 3:
                selectedLine = <HLELine points={points} key={index} />;
                break;
              case 4:
                selectedLine = <DELine points={points} key={index} />;
                break;
              case 5:
                selectedLine = <WindowELine points={points} key={index} />;
                break;
              case 6:
                selectedLine = <MOLine points={points} key={index} />;
                break;
              default:
                selectedLine = null;
                console.log("Unknown annotation");
            }
            // const firstPointX =
            //   imageJunctions[imageEdgePositives[currentLine][0]][0];
            // const firstPointY =
            //   imageJunctions[imageEdgePositives[currentLine][0]][1];
            // const secondPointX =
            //   imageJunctions[imageEdgePositives[currentLine][1]][1];
            // const secondPointY =
            //   imageJunctions[imageEdgePositives[currentLine][1]][1];

            // console.log(firstPointX);
            // console.log(firstPointY);
            // console.log(secondPointX);
            // console.log(secondPointY);
            return selectedLine;
          })}
          <Circle x={imageJunctions[imageEdgePositives[currentLine][0]][0]} y={imageJunctions[imageEdgePositives[currentLine][0]][1]} radius={4} fill="blue" />
          <Circle x={imageJunctions[imageEdgePositives[currentLine][1]][0]} y={imageJunctions[imageEdgePositives[currentLine][1]][1]} radius={4} fill="blue" />
        </Layer>
      </Stage>
    </div>
  );
}

export default LinedImage;

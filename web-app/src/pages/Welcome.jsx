import { useEffect, useState } from "react";
import { Stage, Layer, Line, Image } from "react-konva";

function Welcome({ src ,lines,color="red"}) {
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
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke={line.color}
              strokeWidth={3}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

  // [164.16184997558594, 26.80635643005371,169.25286865234375, 119.97126770019531]

export default Welcome;

import  { useRef, useEffect, useState } from "react";

function ImageWithLines({ src, lines }) {
  const canvasRef = useRef(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [lineColor, setLineColor] = useState("black");

const drawLine = (context, line, color) => {
  context.beginPath();
  context.moveTo(line[0].x, line[0].y);
  context.lineTo(line[1].x, line[1].y);
  context.strokeStyle = color;
  context.stroke();
};

  const handleButtonClick = () => {
    setCurrentLineIndex((prevIndex) => prevIndex + 1);
    // Change color here. This is just an example. You can set it to any valid color.
    setLineColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const image = new Image();
    image.src = src;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, image.width, image.height);

      if (lines[currentLineIndex]) {
        drawLine(context, lines[currentLineIndex], lineColor);
      }
    };
  }, [src, lines, currentLineIndex, lineColor]);

  return (
    <div>
      <canvas ref={canvasRef} />
      <button onClick={handleButtonClick}>Next Line</button>
    </div>
  );
}

import { Line } from "react-konva";

const DashedLine = ({ points }) => (
  <Line
    points={points}
    // stroke="rgb(88, 88, 88)"
    stroke={"red"}
    strokeWidth={1.5}
    dash={[10, 5]} 
  />
);

export default DashedLine;

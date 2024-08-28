import { Line } from "react-konva";
import { LineProps } from "@/types";

const EdgeLine: React.FC<LineProps> = ({ points ,color}) => {
  return <Line points={points} stroke={color} strokeWidth={3} />;
};

export default EdgeLine;

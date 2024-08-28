import { Line } from "react-konva";
import { DashLineProps } from "@/types";

const DashLine: React.FC<DashLineProps> = ({ points }) => (
  <Line points={points} stroke={"red"} strokeWidth={1.5} dash={[10, 5]} />
);

export default DashLine;

export interface LineProps {
  points: number[];
  color: string;
}
export interface DashLineProps {
  points: number[];
}

export interface annotationValue {
  isIndoor: boolean;
  isLoading: boolean;

  currentLine: number;

  imageFileName: string | null;
  currentImageURL: string | null;
  currentEdgeAnnotation: string | null;

  currentImageAnnotations: number[];
  currentImageJunctions: number[][] | null;
  currentImageEdgePositives: number[][];
}

export interface imageValue {
  image: HTMLImageElement | null;
  dimensions: Dimensions;
}
export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

"use client";
import React from "react";
import { useAppSelector, AppDispatch } from "@/lib/store";
import { useDispatch } from "react-redux";
import {
  updateCurrentEdgeAnnotation,
  updateCurrentImageAnnotationAtIndex,
} from "@/lib/features/annotation/annotationSlice";
const annotationMap: { [key: string]: number } = {
  miscellaneousObjects: 6,
  windowEdge: 5,
  doorEdge: 4,
  horizontalLowerEdge: 3,
  wallEdge: 2,
  horizontalUpperEdge: 1,
  notAnnotated: 0,
};

const EdgeAnnotatorContainer = () => {
  const { currentEdgeAnnotation, currentLine } = useAppSelector(
    (state) => state.annotationReducer.value
  );
  const dispatch = useDispatch<AppDispatch>();
  const handleEdgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateCurrentEdgeAnnotation(event.target.value));
    dispatch(
      updateCurrentImageAnnotationAtIndex({
        index: currentLine,
        value: annotationMap[event.target.value],
      })
    );
  };

  return (
    <div className="flex flex-col mx-5 py-2">
      <label
        className={`text-xl fast-change my-1 px-1 py-1 border rounded border-red-700 custom-radio-button ${
          currentEdgeAnnotation === "horizontalUpperEdge"
            ? "bg-red-500 glow-red three-d"
            : ""
        }`}
      >
        <input
          type="radio"
          value="horizontalUpperEdge"
          checked={currentEdgeAnnotation === "horizontalUpperEdge"}
          onChange={handleEdgeChange}
          className="h-5 w-5"
        />
        <span className="px-2"> Horizontal Upper Edge </span>
      </label>
      <label
        className={`text-xl fast-change my-1 px-1 py-1 border border-green-800 rounded custom-radio-button ${
          currentEdgeAnnotation === "wallEdge"
            ? "bg-green-400 glow-green three-d"
            : ""
        }`}
      >
        <input
          type="radio"
          value="wallEdge"
          checked={currentEdgeAnnotation === "wallEdge"}
          onChange={handleEdgeChange}
          className="h-5 w-5"
        />
        <span className="px-2"> Wall Edge </span>
      </label>
      <label
        className={`text-xl fast-change my-1 px-1 py-1 border border-blue-800 rounded custom-radio-button ${
          currentEdgeAnnotation === "horizontalLowerEdge"
            ? "bg-blue-400 glow-blue three-d"
            : ""
        }`}
      >
        <input
          type="radio"
          value="horizontalLowerEdge"
          checked={currentEdgeAnnotation === "horizontalLowerEdge"}
          onChange={handleEdgeChange}
          className="h-5 w-5 rounded-3xl"
        />
        <span className="px-2">Horizontal Lower Edge</span>
      </label>

      <label
        className={`text-xl fast-change my-1 px-1 py-1 border border-yellow-800 rounded custom-radio-button ${
          currentEdgeAnnotation === "doorEdge"
            ? "bg-yellow-400 glow-yellow three-d"
            : ""
        }`}
      >
        <input
          type="radio"
          value="doorEdge"
          checked={currentEdgeAnnotation === "doorEdge"}
          onChange={handleEdgeChange}
          className="h-5 w-5"
        />
        <span className="px-2">Door Edge</span>
      </label>

      <label
        className={`text-xl fast-change my-1 px-1 py-1 border border-magenta-500 rounded custom-radio-button ${
          currentEdgeAnnotation === "windowEdge"
            ? "bg-magenta-400 glow-magenta  three-d"
            : ""
        }`}
      >
        <input
          type="radio"
          value="windowEdge"
          checked={currentEdgeAnnotation === "windowEdge"}
          onChange={handleEdgeChange}
          className="h-5 w-5"
        />
        <span className="px-2">Window Edge</span>
      </label>
      <label
        className={`text-xl fast-change my-1 px-1 py-1 border border-orange-800 rounded custom-radio-button ${
          currentEdgeAnnotation === "miscellaneousObjects"
            ? "bg-orange-500 glow-orange three-d"
            : ""
        }`}
      >
        <input
          type="radio"
          value="miscellaneousObjects"
          checked={currentEdgeAnnotation === "miscellaneousObjects"}
          onChange={handleEdgeChange}
          className="h-5 w-5"
        />
        <span className="px-2">Miscellaneous Object Edge</span>
      </label>
    </div>
  );
};

export default EdgeAnnotatorContainer;

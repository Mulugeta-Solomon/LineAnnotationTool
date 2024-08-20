"use client";
import React from "react";
import { useDispatch } from "react-redux";
import {
  updateCurrentEdgeAnnotation,
  updateCurrentLine,
} from "@/lib/features/annotation/annotationSlice";
import { useAppSelector, AppDispatch } from "@/lib/store";
import { toast, Bounce } from "react-toastify";

const NextButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentImageAnnotations, currentImageEdgePositives, currentLine } =
    useAppSelector((state) => state.annotationReducer.value);
  const handleNextLine = () => {
    if (currentImageAnnotations) {
      if (currentImageAnnotations[currentLine] == 0) {
        toast.warn(
          "You must annotate current line before moving on to the next.",
          {
            position: "top-center",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          }
        );
      } else {
        dispatch(
          updateCurrentLine(
            (currentLine + 1) % currentImageEdgePositives.length
          )
        );
        dispatch(updateCurrentEdgeAnnotation(null));
      }
    }
  };
  return (
    <button
      onClick={handleNextLine}
      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-800 text-white rounded"
    >
      Next Line
    </button>
  );
};

export default NextButton;

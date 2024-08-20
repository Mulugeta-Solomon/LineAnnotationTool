"use client";
import React from "react";
import { useDispatch } from "react-redux";
import {
  updateCurrentEdgeAnnotation,
  updateCurrentLine,
} from "@/lib/features/annotation/annotationSlice";
import { useAppSelector, AppDispatch } from "@/lib/store";
import { toast, Bounce } from "react-toastify";

const PreviousButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentImageAnnotations, currentImageEdgePositives, currentLine } =
    useAppSelector((state) => state.annotationReducer.value);
  const handlePreviousLine = () => {
    if (currentImageAnnotations[currentLine] == 0) {
      toast.warn(
        "You must annotate current line before going back to the previous.",
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
          (currentLine - 1 + currentImageEdgePositives.length) %
            currentImageEdgePositives.length
        )
      );
      dispatch(updateCurrentEdgeAnnotation(null));
    }
  };
  return (
    <button
      onClick={handlePreviousLine}
      className="px-4 py-2 bg-gray-500 hover:bg-gray-800 text-white rounded"
    >
      Previous Line
    </button>
  );
};

export default PreviousButton;

"use client";
import React, { useEffect } from "react";
import { useAppSelector, AppDispatch } from "@/lib/store";
import { useDispatch } from "react-redux";
import {
  updateCurrentImageAnnotations,
  updateCurrentImageEdgePositives,
  updateCurrentImageJunctions,
  updateCurrentImageURL,
  updateImageFileName,
  updateIsLoading,
} from "@/lib/features/annotation/annotationSlice";
import Navbar from "../components/Navbar";
import DemoLinedImage from "./DemoLinedImage";

const DemoImageArea = () => {
  const { isLoading } = useAppSelector(
    (state) => state.annotationReducer.value
  );

  const dispatch = useDispatch<AppDispatch>();
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
      dispatch(updateIsLoading(true));
      const randomValue = Math.floor(Math.random() * 2);
      let image;
      if (randomValue === 0) {
        image = "00030043";
      } else {
        image = "00030077";
      }

      try {
        const response = await fetch(`/${image}.json`);
        if (!response.ok) throw new Error("Network response was not ok");

        const json_image_data = await response.json();

        const junctions = json_image_data.junctions;
        const filename: string = json_image_data.filename;
        const edge_positives = json_image_data.edges_positive;
        const annotations = Array.from(
          { length: edge_positives.length },
          () => 0
        );

        await delay(2000);
        const currentImageURL = `/${image}.png`;

        dispatch(updateImageFileName(filename));
        dispatch(updateCurrentImageJunctions(junctions));
        dispatch(updateCurrentImageEdgePositives(edge_positives));
        dispatch(updateCurrentImageAnnotations(annotations));
        dispatch(updateCurrentImageURL(currentImageURL));

        localStorage.setItem("currentImageURL", currentImageURL);
      } catch (error) {
        console.error("Failed to fetch image data:", error);
      } finally {
        dispatch(updateIsLoading(false));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="order-1 sm:order-2 w-3/5 h-full py-10 flex flex-col justify-center items-center relative">
      <Navbar />
      <div className="flex flex-col justify-center items-center w-full h-full relative">
        {isLoading && (
          <div className="absolute inset-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="spinner"></div>
          </div>
        )}
        <DemoLinedImage />
      </div>
    </div>
  );
};

export default DemoImageArea;

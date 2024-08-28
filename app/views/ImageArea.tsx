"use client";
import LinedImage from "./DemoLinedImage";
import { useChangeImageStatusMutation } from "@/lib/services/images";
import React from "react";
import { useEffect } from "react";
import { AppDispatch, useAppSelector } from "@/lib/store";
import {
  updateCurrentImageAnnotations,
  updateCurrentImageEdgePositives,
  updateCurrentImageJunctions,
  updateCurrentImageURL,
  updateImageFileName,
  updateIsLoading,
} from "@/lib/features/annotation/annotationSlice";
import { imageAPI } from "@/lib/services/images";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const ImageArea = () => {
  const { isLoading } = useAppSelector(
    (state) => state.annotationReducer.value
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      dispatch(updateIsLoading(true));

      const image_data = await dispatch(
        imageAPI.endpoints.getImageData.initiate("")
      );
      if (!image_data.isSuccess || image_data.isError) {
        throw Error("Invalid response from server");
      }

      const json_image_data = await image_data.data;

      const annotations = json_image_data.line_annotations;
      const junctions = json_image_data.junctions;
      const filename: string = json_image_data.filename;
      const edge_positives = json_image_data.edges_positive;

      dispatch(updateImageFileName(filename));
      dispatch(updateCurrentImageJunctions(junctions));
      dispatch(updateCurrentImageEdgePositives(edge_positives));
      dispatch(updateCurrentImageAnnotations(annotations));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/image/${filename}`
      );

      if (!response.ok) {
        throw Error("Invalid response from server");
      }
      const image = await response.blob();
      const currentImageURL = URL.createObjectURL(image);
      localStorage.setItem("currentImageURL", currentImageURL);

      dispatch(updateCurrentImageURL(currentImageURL));

      try {
        // TODO : Fix RTK query 
        // await changeImageStatus(filename);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/alter`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: filename,
            }),
          }
        );

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        toast.error("Somethings went wrong when updating picture status");
      }

      dispatch(updateIsLoading(false));
    })();
  }, []);

  return (
    //TODO: Adjust order for smaller screens
    <div className="w-3/5 h-full py-10 flex flex-col justify-center items-center relative">
      <div className="flex flex-col justify-center items-center w-full h-full relative">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <ReloadIcon className="h-10 w-10 animate-spin" />{" "}
          </div>
        ) : (
          <LinedImage />
        )}
      </div>
    </div>
  );
};

export default ImageArea;

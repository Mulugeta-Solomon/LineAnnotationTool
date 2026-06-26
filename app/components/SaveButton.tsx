"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { updateIsLoading } from "@/lib/features/annotation/annotationSlice";
import { useAppSelector, AppDispatch } from "@/lib/store";
import { toast, Bounce } from "react-toastify";
import { useUploadImageDataMutation } from "@/lib/services/images";

const SaveButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isIndoor, imageFileName, currentImageAnnotations } = useAppSelector(
    (state) => state.annotationReducer.value
  );
  const [uploadImageData, { status }] = useUploadImageDataMutation();

  const allLinesAreAnnotated = async () => {
    for (let i = 0; i < currentImageAnnotations.length; i++) {
      if (currentImageAnnotations[i] == 0) {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    const allAnnotated = await allLinesAreAnnotated();
    if (allAnnotated) {
      dispatch(updateIsLoading(true));
      try {
        const data = {
          filename: imageFileName,
          annotations: currentImageAnnotations,
          image_annotation: isIndoor,
        };
        const response = await uploadImageData(JSON.stringify(data));

        dispatch(updateIsLoading(false));
        toast.success("Successfully uploaded annotated data.");
        router.push("/save");
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Error saving image data:" + error.message);
        } else {
          toast.error("Error saving image data:");
        }
      }
    } else {
      toast.warn("You must annotate all lines before saving.", {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };
  return (
    <button
      onClick={handleSave}
      className="px-4 py-3 bg-green-500 hover:bg-green-800 text-white rounded"
    >
      Save
    </button>
  );
};

export default SaveButton;

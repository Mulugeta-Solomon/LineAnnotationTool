"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { updateIsLoading } from "@/lib/features/annotation/annotationSlice";
import { useAppSelector, AppDispatch } from "@/lib/store";
import { toast, Bounce } from "react-toastify";
import { useRouter } from "next/navigation";
const DemoSaveButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()
  const { currentImageAnnotations } = useAppSelector(
    (state) => state.annotationReducer.value
  );

  const allLinesAreAnnotated = async () => {
    for (let i = 0; i < currentImageAnnotations.length; i++) {
      if (currentImageAnnotations[i] == 0) {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    const check = await allLinesAreAnnotated();
    if (check) {
      dispatch(updateIsLoading(true));
      setTimeout(() => {
        dispatch(updateIsLoading(false));
      }, 2000);
      toast.success("Successfully uploaded annotated data.");
      router.push("/save")
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
      className="px-8 py-3 bg-green-500 hover:bg-green-800 text-white rounded"
    >
      Save
    </button>
  );
};

export default DemoSaveButton;

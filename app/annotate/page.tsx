"use client";
import React, { useEffect, useRef } from "react";
import { toast, Bounce } from "react-toastify";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import ImageArea from "../views/ImageArea";
import AnnotationArea from "../views/AnnotationArea";

import PreviousButton from "../components/PreviousButton";
import NextButton from "../components/NextButton";
import SaveButton from "../components/SaveButton";

const Page = () => {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const warningShownRef = useRef(false);

  useEffect(() => {
    if (session) {
      const { role } = session.user;

      if (role !== "annotator" && !warningShownRef.current) {
        toast.error(
          "Access Denied:You aren't in the list of trusted annotators.",
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
        warningShownRef.current = true;
        redirect("/login");
      }
    }
  }, [session]);

  return (
    <>
      <div className="hidden md:flex flex-col h-screen pb-2">
        {/* Annotation Area  */}
        <div className="w-screen flex ">
          <AnnotationArea />
          <ImageArea />
        </div>

        {/* Buttons Container */}
        <div className="buttons-area w-full  flex flex-row items-center justify-around">
          <div className="line-buttons w-2/5 flex justify-center  space-x-24">
            <PreviousButton />
            <NextButton />
          </div>

          <div className="action-buttons w-3/5 flex justify-center space-x-24">
            <SaveButton />
          </div>
        </div>
      </div>
      <div className="flex md:hidden items-center justify-center h-screen">
        <p className="text-center text-lg">
          Please use a larger screens for a better experience.
        </p>
      </div>
    </>
  );
};

export default Page;

import PreviousButton from "../components/PreviousButton";
import DemoSaveButton from "../components/DemoSaveButton";
import NextButton from "../components/NextButton";
import DemoImageArea from "../views/DemoImageArea";
import AnnotationArea from "../views/AnnotationArea";

const Page = async () => {
  return (
    <>
      <div className="hidden md:flex flex-col h-screen pb-2">
        {/* Annotation Area  */}
        <div className="w-screen flex ">
          <AnnotationArea />
          <DemoImageArea />
        </div>

        {/* Buttons Container */}
        <div className="buttons-area w-full  flex flex-row items-center justify-around">
          <div className="line-buttons w-2/5 flex justify-center  space-x-24">
            <PreviousButton />
            <NextButton />
          </div>

          <div className="action-buttons w-3/5 flex justify-center space-x-24">
            <DemoSaveButton />
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

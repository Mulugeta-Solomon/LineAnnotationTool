import Navbar from "../components/Navbar";
import EdgeAnnotatorContainer from "../containers/EdgeAnnotatorContainer";
import EnvironmentAnnotatorContainer from "../containers/EnvironmentAnnotatorContainer";

const AnnotationArea = () => {
  return (
    //TODO:  Adjust order for smaller screens
    <div className="w-2/5 p-4 mx-4 my-4">
      <div className="mt-3 mb-1">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl pt-3 font-semibold text-center">
            Edge Annotation
          </h2>
          <Navbar />
        </div>
        <EdgeAnnotatorContainer />
      </div>

      <div>
        <h2 className="text-2xl py-2 font-semibold text-center">
          Environment Annotation
        </h2>
        <EnvironmentAnnotatorContainer />
      </div>
    </div>
  );
};

export default AnnotationArea;

import PreviousButton from "../components/PreviousButton";
import NextButton from "../components/NextButton";
import SaveButton from "../components/SaveButton";

const ButtonsContainer = () => {
  return (
    <div className="buttons-area w-full  flex flex-row items-center justify-around">
      <div className="line-buttons w-2/5 flex justify-center  space-x-24">
        <PreviousButton />

        <NextButton />
      </div>

      <div className="action-buttons w-3/5 flex justify-center space-x-24">
        <SaveButton />
      </div>
    </div>
  );
};

export default ButtonsContainer;

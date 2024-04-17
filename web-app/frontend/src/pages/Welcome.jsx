import { Link } from "react-router-dom";
import Rule from "../components/Rule";

function Welcome() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="container px-4 py-4 flex flex-col md:flex-row items-center justify-center">
        <h1 className="text-6xl font-bold text-gray-600 mx-36 ">Welcome !</h1>
        {/* Hero Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 my-4">
            Code of Conduct
          </h2>
          <Rule
            inputText={"Select the type of annotation for each line."}
          ></Rule>
          <Rule inputText={"Please try to be as accurate as possible."}></Rule>
          <Rule
            inputText={
              "You can not go to next image until you finish the current."
            }
          ></Rule>
          <Rule
            inputText={
              "You can not go to next line until you annotate the current line."
            }
          ></Rule>

          <Link to="/annotation">
            <button className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4  rounded">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

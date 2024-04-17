import { Link } from "react-router-dom";
import Rule from "../components/Rule";

function SavePage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="container px-4 py-4 flex flex-col md:flex-row items-center justify-center">
        <h1 className="text-6xl font-bold text-gray-600 mx-36 ">Thank You!</h1>
        {/* Hero Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 my-4">
            Code of Conduct
          </h2>
          <Rule
            inputText={"You can move on to the next image or you can stop here for today ."} 
          ></Rule>

          <Link to="/">
            <button className="bg-blue-500 mr-4 hover:bg-blue-800 text-white font-bold py-2 px-4  rounded">
              Enough for today
            </button>
          </Link>
          <Link to="/annotation">
            <button className="bg-blue-500 ml-4 hover:bg-blue-800 text-white font-bold py-2 px-4  rounded">
              One more !
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SavePage;

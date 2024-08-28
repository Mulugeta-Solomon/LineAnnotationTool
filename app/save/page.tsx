import Link from "next/link";
const page = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="w-full my-16 lg:w-1/2 flex justify-center items-center">
        <h1 className="text-6xl lg:text-7xl font-bold justify-self-auto text-gray-600">
          Thank You !
        </h1>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center items-center flex-col lg:h-screen">
        <div className="flex items-center">
          <h2 className="text-4xl font-bold text-gray-600 my-12">
            Code of Conduct
          </h2>
          <Link href="https://telegra.ph/RoboLine-Annotator-Code-of-Conduct-08-17">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="ml-4 size-8 text-blue-900 font-bold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </Link>
        </div>
        <div className="flex my-10 w-full justify-center px-20">
          <Link href="/annotate">
            <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 mx-8 rounded-3xl">
              One More 💪
            </button>
          </Link>
          <Link href="/">
            <button className="bg-blue-600 hover:bg-blue-400 text-white font-bold py-4 px-6 mx-8 rounded-3xl">
              Enough for Today
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
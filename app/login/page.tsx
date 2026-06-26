import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import GoogleSignInButton from "../components/GoogleSignInButton";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

const Login: React.FC = async () => {
  const session = await getServerSession(options);

  if (session) {
    const { role } = session.user;
    if (role === "annotator") {
      redirect("/annotate");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full flex items-center justify-center">
        <Image
          src="https://dododoyo.github.io/image/next-auth/logg.svg"
          alt="Loin Image"
          className="hidden lg:block lg:w-1/2 m-30 p-28"
          width={20}
          height={20}
        />

        <div className="w-full lg:w-1/2 md:w-1/2 sm:w-3/5 px-8 py-12 mx-20 rounded-lg">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
            Welcome Back,
          </h2>

          <GoogleSignInButton />
          <div className="flex my-10 w-full justify-center px-10">
            <Link href="/demo">
              <button className="bg-green-600 hover:bg-green-500 text-md text-white font-bold py-3 px-5 mx-3 rounded-3xl">
                Try Demo
              </button>
            </Link>
            <Link href="/">
              <button className="bg-blue-600 hover:bg-blue-500 text-md text-white font-bold py-3 px-7 mx-5 rounded-3xl">
                Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

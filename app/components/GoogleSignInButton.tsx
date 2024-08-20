"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";

const GoogleSignInButton = () => {
  const logInWithGoogle = () => {
    try {
      signIn("google", {
        callbackUrl: "/annotate",
      });
    } catch (error) {}
  };

  return (
    <button
      onClick={logInWithGoogle}
      className="border border-gray-300 font-medium py-4 px-8 rounded-xl flex items-center justify-center w-full hover:bg-blue-50 focus:outline-none focus:ring-2 mt-6"
    >
      <div className="h-5 w-5 mr-2">
        <Image
          src="https://w7.pngwing.com/pngs/344/344/png-transparent-google-logo-google-logo-g-suite-google-text-logo-symbol-thumbnail.png"
          alt="Google logo"
          width={20}
          height={20}
        />
      </div>
      <span className="font-semibold">Sign In with Google</span>
    </button>
  );
};

export default GoogleSignInButton;

import Link from "next/link";
import React from "react";
import { Separator } from "@radix-ui/react-separator";
import ThemeToggle from "./theme/ThemeSelector";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-background flex flex-col mb-6 pt-1">
      <div className="flex items-center justify-end px-5 py-1">
        <Link href="/">
          <div className="flex items-center gap-1 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Home
          </div>
        </Link>
        <Link href="/annotate">
          <div className="flex items-center gap-1 mr-4 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
            Annotate
          </div>
        </Link>
        <div className="flex items-center justify-end gap-3">
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
      <Separator />
    </nav>
  );
}

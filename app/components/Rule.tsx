import React from "react";
const Rule: React.FC<{ inputText: string }> = ({ inputText }) => {
  return (
    <p className="text-gray-800 text-xl text-left leading-loose my-1 mx-8">{inputText}</p>
  );
};

export default Rule;

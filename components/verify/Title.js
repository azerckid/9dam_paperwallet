import React from "react";

const Title = ({ title, subTitle }) => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-800 text-center">{title}</h1>
      <p className="text-[#6B7280]">{subTitle}</p>
    </div>
  );
};

export default Title;

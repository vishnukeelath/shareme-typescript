import React from "react";
import { ColorRing, Circles } from "react-loader-spinner";

type Props = {
  message?: string | undefined;
};

const Spinner = ({ message = "" }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {/* <Circles color="#00BFFF" height={50} width={200} /> */}
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />

      <p className="text-lg text-center px-2 ">{message}</p>
    </div>
  );
};

export default Spinner;

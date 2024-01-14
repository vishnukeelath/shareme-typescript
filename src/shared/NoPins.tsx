import React from "react";

// type Props = {}

const NoPins = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <img src="/src/assets/no-pins.svg" alt="no-pins" className="mt-6" />
      <h2 className="mt-4 ml-4 font-semibold">No Pins Available</h2>
    </div>
  );
};

export default NoPins;

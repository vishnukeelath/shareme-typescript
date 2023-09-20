import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Card = ({ children }: Props) => {
  return (
    <div className="border border-solid bg-white border-inherit rounded-md p-5 inline-block w-full h-screen">
      {children}
    </div>
  );
};

export default Card;

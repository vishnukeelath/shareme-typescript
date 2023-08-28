import { User } from "@/shared/types";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

type Props = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  user: User | undefined;
};

const Navbar = ({ searchTerm, setSearchTerm, user }: Props) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-background-50 border-none outline-none shadow-sm focus-within:shadow-md">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          // onBlur={() => navigate("/")}
          className="p-2 w-full bg-background-50 outline-none"
        ></input>
      </div>
      <div className="flex gap-3">
        <Link to={`user-profile/${user?.uid}`} className="hidden md:block">
          <img
            src={user.photoURL}
            alt="user"
            className="w-14 h-12 rounded-lg shadow-sm"
          />
        </Link>
        <Link
          to="create-pin"
          className="bg-primary-200 text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center shadow-sm"
        >
          <IoMdAdd fontSize={25} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

import { User } from "@/shared/types";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { BiHomeAlt } from "react-icons/bi";
import logo from "@/assets/logo.png";
import { categories } from "@/utils/data";

const isNotActiveStyle =
  "flex items-center px-5 gap-3 h-[40px] text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center px-5 gap-3 bg-primary-100 h-[40px] font-semibold border-r-2 border-primary-300 transition-all duration-200 ease-in-out capitalize";

type Props = {
  user: User | undefined;
  setToggleSidebar?: (value: boolean) => void;
};

const Sidebar = ({ user, setToggleSidebar }: Props) => {
  console.log("user details in sidebar-", user);
  const handleCloseSidebar = () => {
    if (setToggleSidebar) setToggleSidebar(false);
  };

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-[210px] scrollbar-hide">
      <div className="flex flex-col w-full items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-[190px] items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>

        {/* Sidebar Items */}
        <div className="flex flex-col gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSidebar}
          >
            <BiHomeAlt fontSize={25} />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-lg">
            Discover Categories
          </h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img
                src={category.image}
                className="w-8 h-8 rounded-full shadow-sm"
                alt="category"
              />
              {category.name}
            </NavLink>
          ))}
        </div>

        {/* User Logo & Name */}
        {user && (
          <Link
            to={`user-profile/${user.uid}`}
            className=" flex my-9 mb-3 gap-2 p-2 w-full items-center justify-center bg-white rounded-lg shadow-lg mx-3"
            onClick={handleCloseSidebar}
          >
            <img
              src={user.photoURL}
              className="w-10 h-10 rounded-full"
              alt="user-profile"
            />
            <p>{user.displayName}</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

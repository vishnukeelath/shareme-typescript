import { User } from "@/shared/types";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";
import { BiHomeAlt } from "react-icons/bi";
import { adminNavigationConfig } from "@/utils/data";

const isNotActiveStyle =
  "flex items-center px-5 gap-3 h-[40px] text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center px-5 gap-3 bg-primary-100 h-[40px] font-semibold border-r-2 border-primary-300 transition-all duration-200 ease-in-out capitalize";

type Props = {
  user: User | undefined;
  setToggleSidebar?: (value: boolean) => void;
};

const AdminSidebar = ({ user, setToggleSidebar }: Props) => {
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
        <div className="flex flex-col gap-4 w-[190px]">
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
          {adminNavigationConfig.map((page) => (
            <NavLink
              to={`/admin-panel/list/${page.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSidebar}
              key={page.name}
            >
              {/* <img
                src={category.image}
                className="w-8 h-8 rounded-full shadow-sm"
                alt="category"
              /> */}
              {page.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

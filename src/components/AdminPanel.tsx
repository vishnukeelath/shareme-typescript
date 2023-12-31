import { User } from "@/shared/types";
import { fetchUser } from "@/utils/fetchUser";
import React, { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import logo from "@/assets/logo.png";
import { HiMenu } from "react-icons/hi";
import { RiCloseCircleFill } from "react-icons/ri";
import UserProfile from "./UserProfile";
import AdminImageList from "./AdminImageList";
import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";

type Props = {};

const AdminPanel = (props: Props) => {
  const navigate = useNavigate();
  const [toggleSidebar, setToggleSidebar] = useState<Boolean>(false);
  const [user, setUser] = useState<User>();
  const scrollRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const userInfo: User = fetchUser();
  console.log("userInfo - ", userInfo);

  useEffect(() => {
    setUser({
      displayName: userInfo.displayName,
      email: userInfo.email,
      photoURL: userInfo.photoURL,
      uid: userInfo.uid,
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row font-montserrat flex-col h-screen transaction-height duration-75 ease-out">
      {/* Sidebar-Desktop */}
      <div className="hidden md:flex h-screen flex-initial">
        <AdminSidebar user={user && user} />
      </div>
      {/* Sidebar-Mobile */}
      <div className="flex md:hidden flex-row">
        <div className="p-3 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={35}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link
            to={`/user-profile/${user?.uid}`}
            // onClick={() =>
            //   navigate(`/user-profile/${user?.uid}`, { replace: true })
            // }
          >
            <img
              src={user?.photoURL}
              alt="logo"
              className="w-14 rounded-full"
            />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <RiCloseCircleFill
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <AdminSidebar
              user={user && user}
              setToggleSidebar={setToggleSidebar}
            />
          </div>
        )}
      </div>
      <div
        className="pb-2 flex-1 h-auto overflow-y-scroll scrollbar-hide xl:scrollbar-default relative"
        ref={scrollRef}
      >
        <div className="px-2 md:px-5 relative">
          <div className="bg-gray-50 relative">
            <AdminNavbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              user={user}
            />
          </div>
        </div>
        <Routes>
          <Route
            path="/list/pins"
            element={<AdminImageList user={user && user} />}
          />
          {/* <Route path="/user-profile/:userId" element={<UserProfile />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;

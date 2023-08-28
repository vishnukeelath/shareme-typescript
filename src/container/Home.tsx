import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { User } from "@/shared/types";
import { fetchUser } from "@/utils/fetchUser";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { RiCloseCircleFill } from "react-icons/ri";
import logo from "@/assets/logo.png";
import Pins from "@/container/Pins";
import UserProfile from "@/components/UserProfile";
import { firebaseAuth } from "@/config/firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { grandAdminRole } from "@/config/adminfirebase";

type Props = {};

const Home = (props: Props) => {
  const navigate = useNavigate();
  const [toggleSidebar, setToggleSidebar] = useState<Boolean>(false);
  const [user, setUser] = useState<User>();
  const scrollRef = useRef<HTMLInputElement>(null);

  const userInfo: User = fetchUser();
  console.log("userInfo - ", userInfo);

  useEffect(() => {
    setUser({
      displayName: userInfo.displayName,
      email: userInfo.email,
      photoURL: userInfo.photoURL,
      uid: userInfo.uid,
    });

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user for- admin", user);
        // const adminacc = process.env.REACT_APP_ADMIN_EMAILS;
        // console.log("user - admin", adminacc);

        if (
          user.email === "vpk2888@gmail.com" ||
          "vishnuprojectsin@gmail.com"
        ) {
          user
            .getIdTokenResult()
            .then((idTokenResult) => {
              // Confirm the user is an Admin.
              console.log("idTokenResult", idTokenResult);
              if (!!idTokenResult.claims.admin) {
                // Show admin UI.
                console.log("custom claims admin - true");
              } else {
                // Show regular user UI.
                console.log("not admin yet");
                // if (user.uid) grandAdminRole(user.uid);
                // const admin = require("firebase-admin");
                // admin.auth().setCustomUserClaims(user.uid, { admin: true });
                // getAuth().setCustomUserClaims(user.uid, { admin: true });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else console.log("user not admin");
      } else {
        // User is signed out
        // ...
      }
    });

    // const { currentUser } = firebaseAuth;
    // console.log("currentUser in Home", currentUser);
    // if (currentUser) {
    //   currentUser
    //     .getIdTokenResult()
    //     .then((idTokenResult) => {
    //        // Confirm the user is an Admin.
    //      console.log("idTokenResult", idTokenResult);
    //       if (!!idTokenResult.claims.admin) {
    //         // Show admin UI.
    //         console.log("hhhhhh");
    //       } else {
    //         // Show regular user UI.
    //         console.log("nnnnnnn");
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }
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
        <Sidebar user={user && user} />
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
          <Link to={`user-profile/${user?.uid}`}>
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
            <Sidebar user={user && user} setToggleSidebar={setToggleSidebar} />
          </div>
        )}
      </div>
      <div
        className="pb-2 flex-1 h-screen overflow-y-scroll scrollbar-hide xl:scrollbar-default"
        ref={scrollRef}
      >
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;

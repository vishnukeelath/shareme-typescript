import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseAuth, firebaseProvider } from "@/config/firebaseconfig";
import shareVideo from "@/assets/share.mp4";
import logo from "@/assets/logowhite.png";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { fetchUser } from "@/utils/fetchUser";

type Props = {};

const Login = (props: Props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Object>();

  const handleClick = () => [
    signInWithPopup(firebaseAuth, firebaseProvider).then((data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      console.log("user data", data);
      navigate("/", { replace: true });
    }),
  ];

  useEffect(() => {
    const user = fetchUser();

    if (user) navigate("/", { replace: true });
  }, []);

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      {/* Background video */}
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          // type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute flex flex-col justify-center items-center gap-4 top-0 bottom-0 left-0 right-0  bg-blackOverlay">
        {/* Logo */}
        <div className="p-5">
          <img src={logo} alt="logo" width="180px" />
        </div>

        {/* Google Signin */}
        <div className="shadow-2xl">
          <button
            type="button"
            className="bg-mainColor flex justify-center items-center p-3 px-4 rounded-lg cursor-pointer outline-none"
            onClick={handleClick}
            // disabled={renderProps.disabled}
          >
            <FcGoogle className="mr-4 w-[1.6rem] h-[1.6rem]" />
            <p className="mb-[2px] text-textbase font-medium">
              Sign in with Google
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

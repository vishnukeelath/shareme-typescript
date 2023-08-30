import { firebaseAuth, firestore } from "@/config/firebaseconfig";
import { fetchUser } from "@/utils/fetchUser";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Pins } from "@/shared/types";
import MasonryLayout from "./MasonryLayout";
import { ColorRing } from "react-loader-spinner";
import MasonryLayout2 from "./MasonryLayout2";

type Props = {};

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

const UserProfile = (props: Props) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const db = getFirestore();

  const [pins, setPins] = useState<Pins[]>([]);
  console.log("pins state", pins);
  const [isPins, setIsPins] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const currentUserData = fetchUser();
  console.log("userData", currentUserData);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const pinsData = async () => {
    setLoading(true);
    //we are using Web Modular API in Firestore docs to implement API
    const pins = await getDocs(
      query(
        collection(firestore, "pins"),
        where("postedBy.uid", "==", currentUserData.uid)
      )
    );
    console.log("pins data-", pins.docs);
    const pinsData: Pins[] = pins.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Pins[];
    console.log("pins odject-", pinsData);
    if (pinsData.length > 0) {
      setPins(pinsData);
      setIsPins(pinsData.length > 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    pinsData();
  }, []);

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-[370px] 2xl:h-[410px] shadow-lg object-cover"
              src={randomImage}
              alt="banner-pic"
            />
            <img
              className="rounded-full w-30 h-30 -mt-10 shadow-xl object-cover"
              src={
                currentUserData?.photoURL
                  ? currentUserData?.photoURL
                  : undefined
              }
              alt="user-pic"
            />
            <h1 className="text-3xl text-center mt-3">
              {currentUserData?.displayName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              <button
                type="button"
                className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                onClick={logout}
                // disabled={renderProps.disabled}
              >
                <AiOutlineLogout color="red" fontSize={21} />
              </button>
            </div>
          </div>
          {loading && (
            <div className=" flex justify-center w-full items-center">
              <ColorRing
                visible={true}
                height="60"
                width="60"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            </div>
          )}
          {!loading && isPins && (
            <div className="px-2">
              <MasonryLayout2 pins={pins} />
            </div>
          )}
          {!loading && !isPins && (
            <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

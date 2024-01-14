import React, { useEffect, useState } from "react";
import Card from "@/shared/Card";
import { User } from "@/shared/types";
import {
  collection,
  doc,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";
import { Pins } from "@/shared/types";
import { firestore } from "@/config/firebaseconfig";
import { TiTick } from "react-icons/ti";
import { CiCircleCheck } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Circles, ColorRing } from "react-loader-spinner";

const getStatusTag = (status: string) => {
  if (status === "Approved") {
    return (
      <div className="flex flex-row m-auto justify-center px-3 py-1.5 rounded-3xl w-fit bg-tag-green text-tagGreen font-semibold">
        {status}
      </div>
    );
  }
  if (status === "Pending") {
    return (
      <div className="flex flex-row m-auto justify-center px-3 py-1.5 rounded-3xl w-fit bg-tag-warning text-tagWarning font-semibold">
        {status}
      </div>
    );
  }
  if (status === "Rejected") {
    return (
      <div className="flex flex-row m-auto justify-center px-3 py-1.5 rounded-3xl w-fit bg-tag-red text-tagRed font-semibold">
        {status}
      </div>
    );
  }
};

type Props = {
  user: User | undefined;
};

const AdminImageList = ({ user }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [pins, setPins] = useState<Pins[]>([]);
  const [isPins, setIsPins] = useState<boolean>(false);
  const [lastVisibleData, setlastVisibleData] = useState<Object>();
  const [firstVisibleData, setFirstVisibleData] = useState<Object>();

  // const dateNow = Date.now();
  // console.log("date today", dateNow);
  // const currentDate = new Date();
  // const timestamp = currentDate.getTime();
  // console.log("currentDate", currentDate);
  // console.log("timestamp", timestamp);

  const fetchPins = async () => {
    setLoading(true);

    let pins;
    if (firstVisibleData) {
      pins = await getDocs(
        query(
          collection(firestore, "pins"),
          limit(5),
          startAt(firstVisibleData)
        )
      );
    } else {
      pins = await getDocs(query(collection(firestore, "pins"), limit(5)));
    }
    console.log("pins data admin-", pins.docs);
    const lastVisible = pins.docs[pins.docs.length - 1];
    console.log("lastVisible", lastVisible);
    if (lastVisible) setlastVisibleData(lastVisible);
    const firstVisible = pins.docs[0];
    console.log("firstVisible next", firstVisible);
    if (firstVisible) setFirstVisibleData(firstVisible);
    const pinsData: Pins[] = pins.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Pins[];
    console.log("pins object admin-", pinsData);
    if (pinsData.length > 0) {
      setPins(pinsData);
      setIsPins(pinsData.length > 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPins();
  }, []);

  const getNextPage = async () => {
    setLoading(true);

    const pins = await getDocs(
      query(
        collection(firestore, "pins"),
        limit(5),
        startAfter(lastVisibleData)
      )
    );
    const lastVisible = pins.docs[pins.docs.length - 1];
    console.log("lastVisible next", lastVisible);
    if (lastVisible) setlastVisibleData(lastVisible);
    const firstVisible = pins.docs[0];
    console.log("firstVisible next", firstVisible);
    if (firstVisible) setFirstVisibleData(firstVisible);
    const pinsData: Pins[] = pins.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Pins[];
    console.log("pins odject next-", pinsData);
    if (pinsData.length > 0) {
      setPins(pinsData);
      setIsPins(pinsData.length > 0);
    }
    setLoading(false);
  };

  const getPreviousPage = async () => {
    setLoading(true);

    const pins = await getDocs(
      query(
        collection(firestore, "pins"),
        // limit(5),
        endBefore(lastVisibleData),
        limitToLast(5),
        orderBy("createdAt", "desc")
        // endBefore(firstVisibleData)
      )
    );
    const lastVisible = pins.docs[pins.docs.length - 1];
    console.log("lastVisible next", lastVisible);
    if (lastVisible) setlastVisibleData(lastVisible);
    const firstVisible = pins.docs[0];
    console.log("firstVisible next", firstVisible);
    if (firstVisible) setFirstVisibleData(firstVisible);
    const pinsData: Pins[] = pins.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Pins[];
    console.log("pins odject next-", pinsData);
    if (pinsData.length > 0) {
      setPins(pinsData);
      setIsPins(pinsData.length > 0);
    }
    setLoading(false);
  };

  const updatePinData = async (pinId: string) => {
    const updateRef = doc(firestore, "pins", `${pinId}`);
    const updatedData = await updateDoc(updateRef, {
      isApproved: true,
      status: "Approved",
    })
      .then(() => fetchPins())
      .catch((error) => {
        console.log("error while uploading data", error);
      });
    console.log("updatedData", updatedData);
  };

  return (
    <div className="px-2 md:px-5 relative">
      <div className="h-full">
        <Card>
          <div className="flex flex-row justify-between mb-5">
            <h4 className="text-lg font-bold">Pins List</h4>
            <div className="flex flex-row text-primary-400 ">
              <div
                className="w-fit mr-3 p-2 hover:bg-background-50 rounded-full hover:drop-shadow cursor-pointer"
                onClick={getPreviousPage}
              >
                <IoIosArrowBack size={25} />
              </div>
              <div
                className="w-fit mr-3 p-2 hover:bg-background-50 rounded-full hover:drop-shadow cursor-pointer"
                onClick={getNextPage}
              >
                <IoIosArrowForward size={25} />
              </div>

              <div className=""></div>
            </div>
          </div>
          <div className="relative overflow-hidden bg-cover bg-no-repeat">
            <table className="w-full h-auto">
              <thead className="bg-gray-50 border-b border-solid border-neutral-400">
                <tr className="d-flex w-full justify-evenly items-center h-12">
                  <th className="text-sm text-center font-semibold text-gray-500 w-1/4">
                    Pin
                  </th>
                  <th className="text-sm text-center font-semibold text-gray-500 w-1/5">
                    Title
                  </th>
                  <th className="text-sm text-center font-semibold text-gray-500 w-1/5">
                    Uploaded by
                  </th>
                  <th className="text-sm text-center font-semibold text-gray-500 w-1/5">
                    Status
                  </th>
                  <th className="text-sm text-center font-semibold text-gray-500 w-1/5">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isPins &&
                  pins.map((pin, i) => (
                    <tr
                      className="border-b border-solid border-neutral-300"
                      key={i}
                    >
                      <td className="w-1/5 p-2.5 text-center text-sm ">
                        <div
                          className="flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            window.open(`/pin-detail/${pin.id}`, "_blank");
                          }}
                        >
                          {/* ---Image with white background style on hovering--- */}
                          <div className="relative overflow-hidden bg-cover bg-no-repeat">
                            <img
                              src={pin.image}
                              className="w-[100px] h-[100px] object-contain"
                            />
                            <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.7)] opacity-0 transition duration-300 ease-in-out hover:opacity-70"></div>
                          </div>
                          {/* ---Image with gradient style on hovering--- */}
                          {/* <div className="relative overflow-hidden bg-cover bg-no-repeat">
                          <img
                            src={pin.image}
                            className="w-[100px] h-[100px] object-contain"
                          />
                          <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-70"></div>
                        </div> */}
                        </div>
                      </td>
                      <td className="w-1/5 p-2.5 text-gray-500 text-sm font-semibold break-words">
                        {pin.title}
                      </td>
                      <td className="w-1/5 p-2.5 text-center text-sm text-gray-500">
                        {pin.postedBy.displayName} ({pin.postedBy.email})
                      </td>
                      <td className="w-1/5 p-2.5 text-center text-xs text-gray-500">
                        {getStatusTag(pin.status)}
                      </td>
                      <td className="w-1/5 p-2.5 text-center text-sm text-green-600">
                        {pin.status !== "Approved" && (
                          <div
                            className="flex flex-row m-auto justify-center px-4 py-2 rounded-3xl gap-0.5 w-fit cursor-pointer hover:bg-gray-100"
                            onClick={() => updatePinData(pin.id)}
                          >
                            <TiTick size={22} />
                            {/* <CiCircleCheck size={21} /> */}
                            <span className="mt-[2.5px] ">Approve</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {loading && (
              <div className="flex justify-center items-center absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsl(0,0%,98.4%,0.7)] opacity-80">
                <Circles
                  height="40"
                  width="40"
                  color="#ef4444"
                  ariaLabel="circles-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminImageList;

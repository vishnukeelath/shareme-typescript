import React, { useEffect, useState } from "react";
import Card from "@/shared/Card";
import { User } from "@/shared/types";
import {
  collection,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { Pins } from "@/shared/types";
import { firestore } from "@/config/firebaseconfig";

type Props = {
  user: User | undefined;
};

const AdminImageList = ({ user }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pins, setPins] = useState<Pins[]>([]);
  const [isPins, setIsPins] = useState<boolean>(false);
  const [lastVisibleData, setlastVisibleData] = useState<Object>();

  useEffect(() => {
    const fetchPins = async () => {
      setLoading(true);

      const pins = await getDocs(
        query(collection(firestore, "pins"), limit(5))
      );
      console.log("pins data admin-", pins.docs);
      const lastVisible = pins.docs[pins.docs.length - 1];
      console.log("lastVisible", lastVisible);
      setlastVisibleData(lastVisible);
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
    setlastVisibleData(lastVisible);
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
        endBefore(lastVisibleData),
        limitToLast(5)
      )
    );
    const lastVisible = pins.docs[pins.docs.length - 1];
    console.log("lastVisible next", lastVisible);
    setlastVisibleData(lastVisible);
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

  return (
    <div className="px-2 md:px-5 relative">
      <div className="h-full">
        <Card>
          <h4 className="text-base font-bold mb-5">Pins List</h4>
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
                pins.map((pin) => (
                  <tr className="border-b border-solid border-neutral-300">
                    <td className="w-1/5 p-2.5 text-center ">
                      <div className="flex items-center justify-center">
                        <img
                          src={pin.image}
                          className="w-[100px] h-[100px] object-contain"
                        />
                      </div>
                    </td>
                    <td className="w-1/5 p-2.5 text-gray-500 font-semibold break-words">
                      {pin.title}
                    </td>
                    <td className="w-1/5 p-2.5 text-center text-gray-500">
                      {pin.postedBy.displayName}
                    </td>
                    <td className="w-1/5 p-2.5 text-center text-gray-500"></td>
                    <td className="w-1/5 p-2.5 text-center text-gray-500"></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default AdminImageList;

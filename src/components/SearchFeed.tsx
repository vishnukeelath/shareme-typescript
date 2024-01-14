import { firestore } from "@/config/firebaseconfig";
import { Pins } from "@/shared/types";
import {
  QuerySnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

type Props = {
  searchTerm: string;
};
let pageLimit = 14;

const SearchFeed = ({ searchTerm }: Props) => {
  console.log("searchTerm inside", searchTerm);
  const [loading, setLoading] = useState<Boolean>(false);
  const [pins, setPins] = useState<Pins[]>([]);
  console.log("pins in useState", pins);
  const [isPins, setIsPins] = useState<Boolean>(false);
  const [lastVisibleData, setlastVisibleData] = useState<Object>();
  console.log("lastVisible useState", lastVisibleData);
  const [isLastPage, setIsLastPage] = useState<Boolean>(false);
  console.log("isLastPage", isLastPage);

  const fetchPins = async () => {
    setLoading(true);
    let pinsData: QuerySnapshot;
    if (lastVisibleData) {
      console.log("lastVisibleData going to query", lastVisibleData);
      pinsData = await getDocs(
        query(
          collection(firestore, "pins"),
          where("title", ">=", searchTerm),
          where("title", "<=", searchTerm + "\uf8ff"),
          orderBy("title", "desc"),
          startAfter(lastVisibleData),
          limit(pageLimit)
        )
      );
    } else {
      pinsData = await getDocs(
        query(
          collection(firestore, "pins"),
          where("title", "==", searchTerm),
          where("title", ">=", searchTerm),
          where("title", "<=", searchTerm + "\uf8ff"),
          orderBy("title", "desc"),
          limit(pageLimit)
        )
      );
    }
    console.log("pins snapshot", pinsData);

    const lastVisible = pinsData.docs[pinsData.docs.length - 1];
    console.log("lastVisible", lastVisible);
    if (lastVisible) setlastVisibleData(lastVisible);

    console.log("pins data-", pinsData.docs);
    const pinsMutated: Pins[] = pinsData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Pins[];
    console.log("pins odject-", pinsMutated);
    if (pinsMutated.length > 0) {
      if (pins?.length > 0) {
        setPins((presentPins) => [...presentPins, ...pinsMutated]);
      } else {
        setPins(pinsMutated);
      }
      if (!isPins) setIsPins(pinsMutated.length > 0);
      // setPinsRawData(pinsData.docs);
    } else setIsLastPage(true);
    setLoading(false);
  };

  useEffect(() => {
    if (searchTerm) {
      fetchPins();
    }
  }, [searchTerm]);

  if (loading && pins.length === 0)
    return <Spinner message="We are adding new ideas to your feed!" />;

  if (!isPins && searchTerm)
    return <h2 className="text-center">No Pins available</h2>;
  if (!isPins) return <h2>Search for Pins</h2>;

  return (
    <div>
      {isPins && (
        <MasonryLayout
          pins={pins}
          fetchPins={fetchPins}
          loading={loading}
          isLastPage={isLastPage}
        />
      )}
    </div>
  );
};

export default SearchFeed;

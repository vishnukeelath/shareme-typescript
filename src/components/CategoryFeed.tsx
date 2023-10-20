import { firestore } from "@/config/firebaseconfig";
import { Pins } from "@/shared/types";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

type Props = {
  pinsInitial: Pins[];
  lastVisibleDataInitial: Object;
};
let pageLimit = 14;

const CategoryFeed = ({ pinsInitial, lastVisibleDataInitial }: Props) => {
  const { categoryId } = useParams();

  console.log("categoryId", categoryId);
  const [loading, setLoading] = useState<boolean>(false);
  const [pins, setPins] = useState<Pins[]>(pinsInitial);
  console.log("pins in feed", pins);
  const [isPins, setIsPins] = useState<boolean>(false);
  const [lastVisibleData, setlastVisibleData] = useState<Object>(
    lastVisibleDataInitial
  );
  console.log("lastVisibleData", lastVisibleData);
  const [firstVisibleData, setFirstVisibleData] = useState<Object>();
  const [isLastPage, setIsLastPage] = useState<Boolean>(false);
  console.log("isLastPage", isLastPage);

  const fetchPins = async () => {
    setLoading(true);
    if (categoryId) {
      let pinsData: QuerySnapshot;
      console.log("entered if of categoryId");
      //We are using Web Modular API in Firestore docs to implement API --- without loading of images on scroll
      pinsData = await getDocs(
        query(
          collection(firestore, "pins"),
          where("category", "==", categoryId),
          orderBy("createdAt", "desc"),
          limit(pageLimit)
        )
      );

      const lastVisible = pinsData.docs[pinsData.docs.length - 1];
      console.log("lastVisible", lastVisible);
      if (lastVisible) setlastVisibleData(lastVisible);
      const firstVisible = pinsData.docs[0];
      console.log("firstVisible next", firstVisible);
      if (firstVisible) setFirstVisibleData(firstVisible);
      console.log("pins data-", pinsData.docs);
      const pinsMutated: Pins[] = pinsData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Pins[];
      console.log("pins odject-", pinsMutated);
      if (pinsMutated.length > 0) {
        setPins(pinsMutated);
        if (!isPins) setIsPins(pinsMutated.length > 0);
      } else setIsLastPage(true);
      setLoading(false);
    }
  };

  const infinteFetchPins = async () => {
    setLoading(true);
    if (categoryId) {
      let pinsData: QuerySnapshot;
      console.log("entered if of categoryId");
      if (lastVisibleData) {
        console.log("lastVisibleData going to query", lastVisibleData);
        pinsData = await getDocs(
          query(
            collection(firestore, "pins"),
            where("category", "==", categoryId),
            orderBy("createdAt", "desc"),
            startAfter(lastVisibleData),
            limit(pageLimit)
          )
        );
      } else {
        pinsData = await getDocs(
          query(
            collection(firestore, "pins"),
            where("category", "==", categoryId),
            orderBy("createdAt", "desc"),
            limit(pageLimit)
          )
        );
      }

      const lastVisible = pinsData.docs[pinsData.docs.length - 1];
      console.log("lastVisible", lastVisible);
      if (lastVisible) setlastVisibleData(lastVisible);
      const firstVisible = pinsData.docs[0];
      console.log("firstVisible next", firstVisible);
      if (firstVisible) setFirstVisibleData(firstVisible);
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
        // setPins((presentPins) => [...presentPins, ...pinsData]);
        if (!isPins) setIsPins(pinsMutated.length > 0);
      } else setIsLastPage(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId && lastVisibleData) {
      setlastVisibleData({});
    }
    if (categoryId && pins) {
      setPins([]);
    }
    if (categoryId && isLastPage) {
      setIsLastPage(false);
    }
    console.log("fetching data for change in category id");
    fetchPins();
  }, [categoryId]);

  if (loading && pins.length === 0)
    return <Spinner message="We are adding new ideas to your feed!" />;

  if (!isPins) return <h2>No Pins available</h2>;

  return (
    <div>
      {isPins && (
        <MasonryLayout
          pins={pins}
          fetchPins={infinteFetchPins}
          loading={loading}
          isLastPage={isLastPage}
        />
      )}
    </div>
  );
};

export default CategoryFeed;

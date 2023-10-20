import { firestore } from "@/config/firebaseconfig";
import { Pins } from "@/shared/types";
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
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
import { useParams } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

type Props = {};

const Feed = (props: Props) => {
  const { categoryId } = useParams();
  // console.log("categoryId", categoryId);
  const [loading, setLoading] = useState<Boolean>(false);
  const [pins, setPins] = useState<Pins[]>([]);
  console.log("pins in useState", pins);
  const [isPins, setIsPins] = useState<Boolean>(false);
  const [pinsRawData, setPinsRawData] = useState<QuerySnapshot>();
  const [lastVisibleData, setlastVisibleData] = useState<Object>();
  console.log("lastVisible useState", lastVisibleData);
  const [firstVisibleData, setFirstVisibleData] = useState<Object>();

  const fetchPins = async () => {
    if (categoryId) {
      setLoading(true);
      console.log("entered if of categoryId");
      //Get images by scroll
      // const collectionRef = lastVisibleData
      //   ? query(
      //       collection(firestore, "pins"),
      //       limit(13),
      //       startAfter(lastVisibleData),
      //       where("category", "==", categoryId)
      //     )
      //   : query(
      //       collection(firestore, "pins"),
      //       limit(13),
      //       where("category", "==", categoryId)
      //     );

      // const pins = await getDocs(collectionRef);

      let pins;
      if (lastVisibleData) {
        pins = await getDocs(
          query(
            collection(firestore, "pins"),
            where("category", "==", categoryId),
            orderBy("createdAt", "desc"),
            startAfter(lastVisibleData),
            limit(15)
          )
        );
      } else {
        pins = await getDocs(
          query(
            collection(firestore, "pins"),
            where("category", "==", categoryId),
            orderBy("createdAt", "desc"),
            limit(15)
          )
        );
      }
      console.log("pins snapshot", pins);

      //We are using Web Modular API in Firestore docs to implement API --- without loading of images on scroll
      // const pins = await getDocs(
      //   query(
      //     collection(firestore, "pins"),
      //     where("category", "==", categoryId)
      //   )
      // );
      const lastVisible = pins.docs[pins.docs.length - 1];
      console.log("lastVisible", lastVisible);
      if (lastVisible) setlastVisibleData(lastVisible);
      const firstVisible = pins.docs[0];
      console.log("firstVisible next", firstVisible);
      if (firstVisible) setFirstVisibleData(firstVisible);
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
    } else {
      //Get images by scroll
      // const collectionRef = lastVisibleData
      //   ? query(
      //       collection(firestore, "pins"),
      //       limit(13),
      //       startAfter(lastVisibleData)
      //     )
      //   : query(collection(firestore, "pins"), limit(13));

      // const pins = await getDocs(collectionRef);

      setLoading(true);
      let pins;
      if (lastVisibleData) {
        console.log("lastVisibleData going to query", lastVisibleData);
        pins = await getDocs(
          query(
            collection(firestore, "pins"),
            orderBy("createdAt", "desc"),
            startAfter(lastVisibleData),
            limit(14)
          )
        );
      } else {
        pins = await getDocs(
          query(
            collection(firestore, "pins"),
            orderBy("createdAt", "desc"),
            limit(14)
          )
        );
      }
      console.log("pins snapshot", pins);

      // const pins = await getDocs(query(collection(firestore, "pins"))); //without loading of images on scroll

      const lastVisible = pins.docs[pins.docs.length - 1];
      console.log("lastVisible", lastVisible);
      if (lastVisible) setlastVisibleData(lastVisible);
      const firstVisible = pins.docs[0];
      console.log("firstVisible next", firstVisible);
      if (firstVisible) setFirstVisibleData(firstVisible);

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
    }
  };

  const infiniteFetchPins = async () => {
    setLoading(true);

    if (categoryId) {
      console.log("entered if of categoryId");
      //Get images by scroll
      // const collectionRef = lastVisibleData
      //   ? query(
      //       collection(firestore, "pins"),
      //       limit(13),
      //       startAfter(lastVisibleData),
      //       where("category", "==", categoryId)
      //     )
      //   : query(
      //       collection(firestore, "pins"),
      //       limit(13),
      //       where("category", "==", categoryId)
      //     );

      // const pins = await getDocs(collectionRef);

      let pins;
      if (lastVisibleData) {
        pins = await getDocs(
          query(
            collection(firestore, "pins"),
            where("category", "==", categoryId),
            orderBy("createdAt", "desc"),
            startAfter(lastVisibleData),
            limit(15)
          )
        );
      } else {
        pins = await getDocs(
          query(
            collection(firestore, "pins"),
            where("category", "==", categoryId),
            orderBy("createdAt", "desc"),
            limit(15)
          )
        );
      }
      console.log("pins snapshot", pins);

      //We are using Web Modular API in Firestore docs to implement API --- without loading of images on scroll
      // const pins = await getDocs(
      //   query(
      //     collection(firestore, "pins"),
      //     where("category", "==", categoryId)
      //   )
      // );
      const lastVisible = pins.docs[pins.docs.length - 1];
      console.log("lastVisible", lastVisible);
      if (lastVisible) {
        setlastVisibleData(lastVisible);
      }
      const firstVisible = pins.docs[0];
      console.log("firstVisible next", firstVisible);
      if (firstVisible) setFirstVisibleData(firstVisible);
      console.log("pins data-", pins.docs);
      const pinsData: Pins[] = pins.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Pins[];
      console.log("pins odject-", pinsData);
      if (pinsData.length > 0) {
        setPinsRawData(pins);
        setPins((presentPins) => [...presentPins, ...pinsData]);
        setIsPins(pinsData.length > 0);
      }
      setLoading(false);
    } else {
      //Get images by scroll
      // const collectionRef = lastVisibleData
      //   ? query(
      //       collection(firestore, "pins"),
      //       limit(13),
      //       startAfter(lastVisibleData)
      //     )
      //   : query(collection(firestore, "pins"), limit(13));

      // const pins = await getDocs(collectionRef);

      let pins;
      if (lastVisibleData) {
        console.log("lastVisibleData going to query", lastVisibleData);
        pins = await getDocs(
          query(
            collection(firestore, "pins"),
            orderBy("createdAt", "desc"),
            startAfter(lastVisibleData),
            limit(14)
          )
        );
      } else {
        pins = await getDocs(
          query(
            collection(firestore, "pins"),
            orderBy("createdAt", "desc"),
            limit(14)
          )
        );
      }
      console.log("pins snapshot", pins);

      // const pins = await getDocs(query(collection(firestore, "pins"))); //without loading of images on scroll

      // const lastVisible = pins.docs[pins.docs.length - 1];
      // console.log("lastVisible", lastVisible);
      // if (lastVisible) {
      //   setlastVisibleData(lastVisible);
      // }
      // const firstVisible = pins.docs[0];
      // console.log("firstVisible next", firstVisible);
      // if (firstVisible) {
      //   setFirstVisibleData(firstVisible);
      // }

      console.log("pins data-", pins.docs);
      const pinsData: Pins[] = pins.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Pins[];
      console.log("pins odject-", pinsData);
      if (pinsData.length > 0) {
        setPinsRawData(pins);
        setPins((presentPins) => [...presentPins, ...pinsData]);
        setIsPins(pinsData.length > 0);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("fetching data for change in category id");
    fetchPins();
  }, [categoryId]);

  useEffect(() => {
    if (pinsRawData) {
      setlastVisibleData(pinsRawData.docs[pinsRawData.docs.length - 1]);
      setFirstVisibleData(pinsRawData.docs[0]);
    }
  }, [pinsRawData]);

  // useEffect(() => {
  //   if (categoryId) setPins([]);
  // }, []);

  if (loading && pins.length === 0)
    return <Spinner message="We are adding new ideas to your feed!" />;

  if (!isPins) return <h2>No Pins available</h2>;

  return (
    <div>
      {isPins && (
        <MasonryLayout
          pins={pins}
          fetchPins={infiniteFetchPins}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Feed;

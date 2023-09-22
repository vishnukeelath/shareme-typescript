import { firestore } from "@/config/firebaseconfig";
import { Pins } from "@/shared/types";
import {
  collection,
  getDocs,
  limit,
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
  const [loading, setLoading] = useState<boolean>(false);
  const [pins, setPins] = useState<Pins[]>([]);
  console.log("pins in feed", pins);
  const [isPins, setIsPins] = useState<boolean>(false);
  const { categoryId } = useParams();
  const [lastVisibleData, setlastVisibleData] = useState<Object>();
  const [firstVisibleData, setFirstVisibleData] = useState<Object>();

  const fetchPins = async () => {
    setLoading(true);

    if (categoryId) {
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
            limit(5),
            startAfter(lastVisibleData),
            where("category", "==", categoryId)
          )
        );
      } else {
        pins = await getDocs(
          query(
            collection(firestore, "pins"),
            limit(5),
            where("category", "==", categoryId)
          )
        );
      }

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
        pins = await getDocs(
          query(
            collection(firestore, "pins"),
            limit(14),
            startAfter(lastVisibleData)
          )
        );
      } else {
        pins = await getDocs(query(collection(firestore, "pins"), limit(14)));
      }

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
        setPins((presentPins) => [...presentPins, ...pinsData]);
        setIsPins(pinsData.length > 0);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, [categoryId]);

  if (loading && pins.length === 0)
    return <Spinner message="We are adding new ideas to your feed!" />;

  if (!isPins) return <h2>No Pins available</h2>;

  return (
    <div>
      {isPins && (
        <MasonryLayout pins={pins} fetchPins={fetchPins} loading={loading} />
      )}
    </div>
  );
};

export default Feed;

import { firestore } from "@/config/firebaseconfig";
import { Pins } from "@/shared/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

type Props = {};

const Feed = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pins, setPins] = useState<Pins[]>([]);
  const [isPins, setIsPins] = useState<boolean>(false);
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchPins = async () => {
      setLoading(true);

      if (categoryId) {
        //We are using Web Modular API in Firestore docs to implement API
        const pins = await getDocs(
          query(
            collection(firestore, "pins"),
            where("category", "==", categoryId)
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
      } else {
        const pins = await getDocs(query(collection(firestore, "pins")));
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

    fetchPins();
  }, [categoryId]);

  if (loading)
    return <Spinner message="We are adding new ideas to your feed!" />;

  if (!isPins) return <h2>No Pins available</h2>;

  return <div>{isPins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;

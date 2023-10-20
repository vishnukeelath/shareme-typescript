import { Pins } from "@/shared/types";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Spinner from "./Spinner";
import { DocumentSnapshot } from "firebase/firestore";
import useIntersectionObserver from "@/shared/useIntersectionObserver";

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

type Props = {
  pins: Pins[];
  fetchPins: () => void;
  loading: Boolean;
  isLastPage?: Boolean;
};

const MasonryLayout = ({ pins, fetchPins, loading, isLastPage }: Props) => {
  console.log("run MasonryLayout");

  const lastRef = useIntersectionObserver<HTMLDivElement>(() => {
    void fetchPins();
  }, [!isLastPage, !loading]);

  return (
    <>
      <Masonry
        className="flex animate-slide-fwd"
        breakpointCols={breakpointObj}
      >
        {pins?.map((pin, index) => (
          // This is the last image, it will trigger fetching more images
          <div key={pin.id} ref={pins.length - 1 === index ? lastRef : null}>
            <Pin key={pin.id} pin={pin} />
          </div>
        ))}
      </Masonry>
      {loading && <Spinner />}
    </>
  );
};

export default MasonryLayout;

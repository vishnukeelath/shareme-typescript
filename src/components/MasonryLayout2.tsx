import { Pins } from "@/shared/types";
import React, { useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import Pin2 from "./Pin2";
import Spinner from "./Spinner";
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

const MasonryLayout2 = ({ pins, fetchPins, loading, isLastPage }: Props) => {
  const lastRef = useIntersectionObserver<HTMLDivElement>(() => {
    void fetchPins();
  }, [!isLastPage, !loading]);

  return (
    <>
      <Masonry
        className="flex animate-slide-fwd"
        breakpointCols={breakpointObj}
      >
        {/* {pins?.map((pin) => <Pin2 key={pin.id} pin={pin} />)} */}
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

export default MasonryLayout2;

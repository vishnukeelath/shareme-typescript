import { Pins } from "@/shared/types";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import React, { useEffect, useRef } from "react";
import Spinner from "./Spinner";

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
};

const MasonryLayout = ({ pins, fetchPins, loading }: Props) => {
  // Create a ref for the last image element to observe
  const lastImageRef = useRef<HTMLDivElement>(null);

  const observerCallback: IntersectionObserverCallback = (entries) => {
    const [entry] = entries;
    console.log("entry.isIntersecting", entry.isIntersecting);
    if (entry.isIntersecting) {
      console.log("entered entry.isIntersecting");
      fetchPins();
    }
  };

  useEffect(() => {
    console.log("entered here 111", lastImageRef);
    const observer = new window.IntersectionObserver(observerCallback, {
      threshold: 0.5,
    });

    if (lastImageRef.current) {
      console.log("entered here 222", lastImageRef.current);
      observer.observe(lastImageRef.current);
    }

    return () => {
      if (lastImageRef.current) {
        console.log("entered here 333", lastImageRef.current);
        observer.unobserve(lastImageRef.current);
      }
    };
  }, [lastImageRef]);

  return (
    <>
      <Masonry
        className="flex animate-slide-fwd"
        breakpointCols={breakpointObj}
      >
        {pins?.map((pin) => <Pin key={pin.id} pin={pin} />)}
      </Masonry>
      <div ref={lastImageRef}>
        {/* This is the last image, it will trigger fetching more images */}
      </div>
      {loading && <Spinner />}
    </>
  );
};

export default MasonryLayout;

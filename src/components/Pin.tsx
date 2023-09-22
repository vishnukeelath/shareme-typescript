import { Pins } from "@/shared/types";
import { fetchUser } from "@/utils/fetchUser";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import pinBg from "@/assets/img-background.svg";

interface Config {
  rootMargin: string;
  threshold: number;
}

type Props = {
  pin: Pins;
};

const Pin = ({ pin: { image, id, postedBy, destination } }: Props) => {
  const [postHovered, setPostHovered] = useState<boolean>(false);

  const navigate = useNavigate();
  const user = fetchUser();

  const config: Config = {
    rootMargin: "100px 100px 0px 0px",
    threshold: 0,
  };

  useEffect(() => {
    let observer = new window.IntersectionObserver(function (entries, self) {
      //iterate over each entry
      entries.forEach((entry) => {
        //process whether image are intersecting
        if (entry.isIntersecting) {
          //custom function that copies the path to the img from data-src to src
          loadImages(entry.target as HTMLImageElement);
          //image is now in place so stop watching
          self.unobserve(entry.target);
        }
      });
    }, config);

    const imgs = document.querySelectorAll(
      "[data-src]"
    ) as NodeListOf<HTMLImageElement>;
    imgs.forEach((img) => {
      observer.observe(img);
    });

    return () => {
      imgs.forEach((img) => {
        observer.unobserve(img);
      });
    };
  }, []);

  function loadImages(image: HTMLImageElement) {
    image.src = image.dataset.src || "";
  }

  return (
    <div className="m-2 mb-6">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${id}`)}
        className="relative cursor-zoom-in w-auto bg-background-50 hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full"
          alt="user-post"
          // loading="lazy"
          src={pinBg}
          data-src={image}
        />
      </div>
      <Link
        to={`user-profile/${postedBy?.uid}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.photoURL}
          alt="user-profile"
        />
        <p className="font-semibold text-sm capitalize">
          {postedBy?.displayName}
        </p>
      </Link>
    </div>
  );
};

export default Pin;

import { Pins } from "@/shared/types";
import { fetchUser } from "@/utils/fetchUser";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Props = {
  pin: Pins;
};

const Pin2 = ({ pin: { image, id, postedBy, destination } }: Props) => {
  const [postHovered, setPostHovered] = useState<boolean>(false);

  const navigate = useNavigate();
  const user = fetchUser();

  return (
    <div className="m-2 mb-6">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        // onClick={() => navigate(`/pin-detail/${id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full"
          alt="user-post"
          // loading="lazy"
          src={image}
        />
      </div>
      {/* <Link
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
      </Link> */}
    </div>
  );
};

export default Pin2;

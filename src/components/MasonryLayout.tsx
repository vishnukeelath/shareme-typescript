import { Pins } from "@/shared/types";
import Masonry from "react-masonry-css";
import Pin from "./Pin";

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
};

const MasonryLayout = ({ pins, fetchPins }: Props) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
      {pins?.map((pin) => <Pin key={pin.id} pin={pin} fetchPins={fetchPins} />)}
    </Masonry>
  );
};

export default MasonryLayout;

import { Pins } from "@/shared/types";
import Masonry from "react-masonry-css";
import Pin from "./Pin";
import Pin2 from "./Pin2";

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
};

const MasonryLayout2 = ({ pins }: Props) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
      {pins?.map((pin) => <Pin2 key={pin.id} pin={pin} />)}
    </Masonry>
  );
};

export default MasonryLayout2;

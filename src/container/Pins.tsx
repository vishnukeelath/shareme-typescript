import CategoryFeed from "@/components/CategoryFeed";
import CreatePin from "@/components/CreatePin";
import Feed from "@/components/Feed";
import HomeFeed from "@/components/HomeFeed";
import Navbar from "@/components/Navbar";
import PinDetail from "@/components/PinDetail";
import Search from "@/components/Search";
import { User } from "@/shared/types";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

type Props = {
  user: User | undefined;
};

const Pins = ({ user }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="px-2 md:px-5 relative">
      <div className="bg-gray-50 relative">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route
            path="/category/:categoryId"
            element={
              <CategoryFeed pinsInitial={[]} lastVisibleDataInitial={{}} />
            }
          />
          <Route
            path="/pin-detail/:pinId"
            element={<PinDetail user={user} />}
          />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route
            path="/search"
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;

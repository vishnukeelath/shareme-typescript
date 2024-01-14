import React from "react";
import SearchFeed from "./SearchFeed";

type Props = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const Search = ({ searchTerm }: Props) => {
  console.log("searchTerm", searchTerm);
  return <SearchFeed searchTerm={searchTerm} />;
};

export default Search;

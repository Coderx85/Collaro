import React, { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center bg-gray-800 p-2 rounded"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="bg-black text-white p-2 flex-grow rounded-l focus:outline-none"
      />
      <button type="submit" className="bg-white text-black px-4 py-2 rounded-r">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

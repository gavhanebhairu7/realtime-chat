import React from "react";
import { FaSearch } from "react-icons/fa";
function Search() {
  return (
    <div className="px-6 py-3">
      <form>
        <div className="flex items-center space-x-2">
          <label className="border-[1px] flex items-center gap-2 bg-slate-900 rounded-lg w-[80%] bg-black p-3">
            <input
              type="text"
              className="w-[100%]  bg-slate-900 outline-none"
              placeholder="Search"
            />
          </label>
          <button className="p-3 text-2xl hover:bg-gray-500 duration-300 rounded-full">
            <FaSearch />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Search;

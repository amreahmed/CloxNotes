import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6"
import {IoMdClose} from "react-icons/io"

const Search = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-base-300 rounded-md">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={onChange}
          />
          {value && (<IoMdClose className="text-slate-400 text-xl cursor-pointer hover:text-primary mr-3" onClick={onClearSearch} />)}
          <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-primary" onClick={handleSearch} />
    </div>
  );
};

export default Search;
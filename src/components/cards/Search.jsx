import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const Search = ({ value, onChange, handleSearch, onClearSearch, inputClass }) => {
  return (
    <div className={`flex items-center bg-base-300 rounded-md ${inputClass}`}>
      <input
        type="text"
        placeholder="Search Notes"
        className="flex-grow text-xs bg-transparent py-2 px-4 outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <IoMdClose className="text-slate-400 text-xl cursor-pointer hover:text-primary mr-2" onClick={onClearSearch} />
      )}
     
    </div>
  );
};

export default Search;

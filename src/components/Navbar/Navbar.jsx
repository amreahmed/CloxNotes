import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../cards/Search";
import ProfileInfo from "../cards/ProfileInfo";

const Navbar = ({ userInfo, onSearchNote, handelClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const logOut = () => {
    navigate("/login");
    localStorage.clear();
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handelClearSearch();
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearchNote(query);
  };

  return (
    <div>
      <div className="navbar bg-base-200 relative tabular-nums">
        <div className="navbar-start flex-1">
          <a className="btn btn-ghost text-xl">Clox Notes</a>
        </div>
        {userInfo ? (
          <div className="navbar-center absolute left-1/2 transform -translate-x-1/2">
            <Search
              value={searchQuery}
              onChange={handleInputChange}
              onClearSearch={onClearSearch}
              handleSearch={handleSearch}
            />
          </div>
        ) : null}
        <div className="navbar-end flex-none gap-2 flex items-center px-4">
          {userInfo ? (
            <ProfileInfo userInfo={userInfo} onLogout={logOut} />
          ) : (
            <>
              <Link to="/login" className="mr-5 hover:text-primary">
                Login
              </Link>
              <Link to="/signup" className="mr-5 hover:text-primary ">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

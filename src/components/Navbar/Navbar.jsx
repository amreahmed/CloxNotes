import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../cards/Search";
import ProfileInfo from "../cards/ProfileInfo";
import axiosInstance from "../../utils/axiosInstance";
import { AiOutlineLoading3Quarters, AiOutlineSearch } from "react-icons/ai";

const Navbar = ({ onSearchNote, handelClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/auth/user");
        if (response.data && response.data.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
        }
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, [navigate]);

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
          {!showMobileSearch && <a className="btn btn-ghost text-xl">Clox Notes</a>}
          {showMobileSearch && (
            <div className="md:hidden">
              <Search
                value={searchQuery}
                onChange={handleInputChange}
                onClearSearch={onClearSearch}
                handleSearch={handleSearch}
                inputClass="w-full"
              />
            </div>
          )}
        </div>

        {!loading && userInfo && !showMobileSearch && (
          <div className="navbar-center hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <Search
              value={searchQuery}
              onChange={handleInputChange}
              onClearSearch={onClearSearch}
              handleSearch={handleSearch}
              inputClass="w-80 h-10"
            />
          </div>
        )}

        <div className="navbar-end flex-none gap-2 flex items-center px-5 mr-5">
          <AiOutlineSearch
            className="text-2xl md:hidden cursor-pointer flex items-center justify-center hover:text-primary"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          />
          {loading ? (
            <AiOutlineLoading3Quarters className="text-2xl animate-spin" />
          ) : userInfo ? (
            <ProfileInfo userInfo={userInfo} onLogout={logOut} />
          ) : (
            <>
              <Link to="/login" className="mr-5 hover:text-primary">
                Login
              </Link>
              <Link to="/signup" className="mr-5 hover:text-primary">
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

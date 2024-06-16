import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../cards/Search";
import ProfileInfo from "../cards/ProfileInfo";
import axiosInstance from "../../utils/axiosInstance";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Navbar = ({ onSearchNote, handelClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Initially set loading to true
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
        setLoading(false); // Set loading to false after user info is fetched or in case of an error
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
          <a className="btn btn-ghost text-xl">Clox Notes</a>
        </div>
        {!loading && userInfo && (
          <div className="navbar-center absolute left-1/2 transform -translate-x-1/2">
            <Search
              value={searchQuery}
              onChange={handleInputChange}
              onClearSearch={onClearSearch}
              handleSearch={handleSearch}
            />
          </div>
        )}
        <div className="navbar-end flex-none gap-2 flex items-center px-4">
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

import React from 'react'

const ProfileInfo = ({ onLogout, userInfo }) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="flex items-center">
        <div className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="User avatar"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            />
          </div>
        </div>
        <p className="ml-2 text-sm font-medium">{userInfo?.fullName}</p>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52"
      >
        <li key={1}>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li key={2}>
          <a>Settings</a>
        </li>
        <li key={3}>
          <button onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileInfo

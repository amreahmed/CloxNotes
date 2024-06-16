import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { useState } from "react";
import { validateEmail, validatePassword } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
function Signup() {
  const [name, setName] = useState(""); // [1]
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin =async  (e) => {
    e.preventDefault();

    // Clear any previous error
    setError(null);

    if (!name) {
      
      setError("Please enter your name");

      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    // If both validations pass, clear the error
    setError(null);

    // Now you can send the login request to the server
   try {
     const response = await axiosInstance.post("/auth/create-account", {
       fullName: name,
       email: email,
       password: password,
     });

     if (response.data && response.data.accessToken) {
       localStorage.setItem("token", response.data.accessToken);
       navigate("/dashboard");
     }
     
     if(response.data && response.data.message){
       setError(response.data.message)
     }

   } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    
   }


  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded-xl px-7 py-10 bg-base-200">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl bold mb-7">Create an account</h4>
            <label class="input input-bordered flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="w-4 h-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input type="text" class="grow" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)}/>
            </label>
            <label className="input input-bordered flex items-center gap-2 py-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button
              type="submit"
              className="btn-secondary hover:bg-secondary-100"
            >
              Sign Up
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;

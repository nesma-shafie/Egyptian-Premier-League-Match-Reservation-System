import React, { useState } from "react";
import "./LoginSignup.css";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Login() {
  const action = "Login";
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const body = {
        username: username,
        password: password,
      };
      // Make the API request to the delete endpoint using Axios
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        body
      );
      // Check if the request was successful
      if (response.status === 200) {
        console.log("Login successfully!");
        localStorage.setItem("token", response.data.token);

       
          localStorage.setItem("token", response.data.token);
      
          localStorage.setItem("userType", response.data.role);

          navigate("/");
        
          window.location.reload();
        
      } else {
        console.error("Error deleting item:", response.statusText);
        alert("wrong username or password");
      }
    } catch (error) {
      alert("wrong username or password");
    }
  };
  return (
    <div className="loginsignup-container">
      <div className="header">
        <div className="text">
          <h2>{action}</h2>
        </div>
       
      </div>
      <div className="inputs">
        <div className="input">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="input">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>
      {action === "Sign Up" ? null : (
        <div className="forgot-password">Forgot your password?</div>
      )}
      <div className="submit-container">
        <div
          className={username && password ? "submit" : "submit  gray"}
          onClick={handleLogin}
        >
          Sign in
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import classes from "./Navbar.module.css";

const Navbar = ({ links }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic (e.g., clear localStorage)
    localStorage.clear();
    console.log("Logged out");
    // Navigate to home page
    // navigate("/");
    //refresh the page  
    window.location.reload();
    
  };
  return (
    <div className={classes.nav_bar}>
     
      <ul className={classes.navetor_list1}>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.path}>{link.label}</a>
          </li>
        ))}
        {localStorage.getItem("userType") != "guest" &&
        localStorage.getItem("userType") != null ? (
          <li onClick={handleLogout}>Logout</li>
        ) : null}
      </ul>
    </div>
  );
};

export default Navbar;

import React from "react";
import { Link, NavLink } from "react-router-dom";

function NavBar(props) {
  return (
    <>
      <div className="navbar-item">
        <NavLink to="/timer">Timer</NavLink>
      </div>
      <div className="navbar-item">
        <NavLink to="/editor">Editor</NavLink>
      </div>
      <div className="navbar-item">
        <NavLink to="/workout-list">WorkoutList</NavLink>
      </div>
      <div className="navbar-item">
        <NavLink to="/account">Account</NavLink>
      </div>
    </>
  );
}

export default NavBar;

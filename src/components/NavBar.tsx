import React from "react";
import { NavLink } from "react-router-dom";
import Icon from "./Icon";

import "./NavBar.css";

const NavBar: React.FC = () => {
  return (
    <>
      <div className="navbar-item">
        <NavLink to="/timer">
          <Icon.Timer />
        </NavLink>
      </div>
      <div className="navbar-item">
        <NavLink to="/editor">
          <Icon.Settings />
        </NavLink>
      </div>
      <div className="navbar-item">
        <NavLink to="/workout-list">
          <Icon.FormatListBulleted />
        </NavLink>
      </div>
      <div className="navbar-item">
        <NavLink to="/account">
          <Icon.ManageAccounts />
        </NavLink>
      </div>
    </>
  );
};

export default NavBar;

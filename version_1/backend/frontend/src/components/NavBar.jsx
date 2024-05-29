import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { logout } from "../api/api";

export default function NavBar(props) {
  const { currentUser, setCurrentUser, isAnonUser } = useContext(AuthContext);

  console.log("isAnonUser: ", isAnonUser);
  return (
    <div className="nav-bar">
      <button
        onClick={() => {
          props.navigationFunction("TYPING");
        }}
      >
        Type
      </button>
      <button
        onClick={() => {
          props.navigationFunction("OPTIONS_PANEL");
        }}
      >
        Settings
      </button>
      <button>Stats</button>
      {currentUser && !isAnonUser ? (
        <div className="current-user-display">
          {currentUser.username}
          <button
            className="logout-button"
            onClick={() => {
              logout();
              setCurrentUser(null);
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className={"login-and-signup-link"}>
          <Link to={"/login"} className={"login-link"}>
            Log in
          </Link>{" "}
          /{" "}
          <Link to={"/signup"} className={"signin-button"}>
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}

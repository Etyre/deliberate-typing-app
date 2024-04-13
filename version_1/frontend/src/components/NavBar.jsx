import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function NavBar(props) {
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
      <Link to={"/login"}>Login</Link>
    </div>
  );
}

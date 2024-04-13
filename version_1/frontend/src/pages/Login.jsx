import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Login(props) {
  return (
    <div className="sign-up">
      <div>
        <Link to="/">Back to typing</Link>
      </div>
      <br />
      <form>
        email address:
        <br />
        <input type="text" />
        <br />
        password or passphrase:
        <br />
        <input type="text" />
        <br />
        <button>Submit</button>
        <br />
        <Link to="/forgot-password">Forgot your password?</Link>
        <br />
        <Link to="/signup">Sign up</Link>
      </form>
    </div>
  );
}

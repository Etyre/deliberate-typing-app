import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { signUp } from "../api/api";

async function submitForm(e, formData) {
  e.preventDefault();
  const email = formData.emailAddress;
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;

  signUp({ email, password });
}

export default function SignUp(props) {
  const [formData, setFormData] = useState({});

  return (
    <div className="sign-up">
      <div>
        <Link to="/">Back to typing</Link>
      </div>
      <form
        onSubmit={(e) => {
          submitForm(e, formData);
        }}
      >
        email address:
        <br />
        <input
          type="text"
          name="emailAddress"
          value={formData.emailAddress}
          onChange={(e) => {
            setFormData((formData) => ({
              ...formData,
              emailAddress: e.target.value,
            }));
          }}
        />
        <br />
        password or passphrase:
        <br />
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={(e) => {
            setFormData((formData) => ({
              ...formData,
              password: e.target.value,
            }));
          }}
        />
        <br />
        reenter password or passphrase:
        <br />
        <input
          type="text"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) => {
            setFormData((formData) => ({
              ...formData,
              confirmPassword: e.target.value,
            }));
          }}
        />
        <br />
        <button>Submit</button>
        <br />
        <Link to="/login">Already have an account?</Link>
      </form>
    </div>
  );
}

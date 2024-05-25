import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { login } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const [formData, setFormData] = useState({});
  const [loginErrors, setLoginErrors] = useState([]);
  const { setLoggedInUser, loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  async function submitForm(e, formData) {
    e.preventDefault();
    const email = formData.emailAddress;
    const password = formData.password;
    try {
      setLoggedInUser(await login({ email, password }));
    } catch (errors) {
      if (!Array.isArray(errors)) {
        throw errors;
      }
      setLoginErrors(errors);
      return;
    }
    console.log("Login successful");
    navigate("/");
  }

  return (
    <div className="sign-up">
      <div>
        <Link to="/">Back to typing</Link>
      </div>
      <br />
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
        <div className="input-field-error">
          {console.log("loginErrors: ", loginErrors) ||
            loginErrors.find((x) => {
              return x.associatedInputField == "emailAddress";
            })?.errorMessage}
        </div>
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
        <div className="input-field-error">
          {
            loginErrors.find((x) => {
              return x.associatedInputField == "password";
            })?.errorMessage
          }
        </div>
        <button>Submit</button>
        <br />
        <Link to="/forgot-password">Forgot your password?</Link>
        <br />
        <Link to="/signup">Sign up</Link>
      </form>
    </div>
  );
}

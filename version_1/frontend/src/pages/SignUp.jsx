import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { signUp } from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export default function SignUp(props) {
  const [formData, setFormData] = useState({});
  const [signUpErrors, setSignUpErrors] = useState([]);
  const navigate = useNavigate();
  const { setLoggedInUser, loggedInUser } = useContext(AuthContext);

  async function submitForm(e, formData) {
    e.preventDefault();
    const email = formData.emailAddress;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    setSignUpErrors([]);
    try {
      setLoggedInUser(await signUp({ email, password, confirmPassword }));
    } catch (errors) {
      console.log(errors);
      setSignUpErrors(errors);
      return;
    }
    console.log("sign up successful");
    navigate("/");
  }

  return (
    <div className="sign-up">
      <div>
        <Link to="/">Back to typing</Link>
      </div>
      <form
        onSubmit={async (e) => {
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
          {
            signUpErrors.find((x) => {
              return x.associatedInputField == "emailAddress";
            })?.errorMessage
          }
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
        <div className="input-field-error">
          {
            signUpErrors.find((x) => {
              return x.associatedInputField == "confirmPassword";
            })?.errorMessage
          }
        </div>
        <br />
        <button>Submit</button>
        <br />
        <Link to="/login">Already have an account?</Link>
      </form>
    </div>
  );
}

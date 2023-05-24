import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { ReactComponent as VisibilityIcon } from "../assets/svg/visibilityIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";
function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { email, password } = formdata;

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/profile");
        toast("Logged successfully");
      }
    } catch (error) {
      toast.error("Error");
    }
  };
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">welcome back</p>
      </header>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          className="emailInput"
          placeholder="Email"
          id="email"
          value={email}
          onChange={onChange}
        ></input>
        <div className="passwordInputDiv">
          <input
            type={showPassword ? "text" : "password"}
            className="passwordInput"
            placeholder="Password"
            id="password"
            value={password}
            onChange={onChange}
          ></input>
          <span className="showPassword">
            <VisibilityIcon />
          </span>
        </div>
        <Link to="/forgot-password" className="forgotPasswordLink">
          Forgot Password
        </Link>
        <div className="signInBar">
          <p className="signInText">Sign in</p>
          <button className="signInButton">
            <ArrowRightIcon fill="#fff" width="34px" height="34px" />
          </button>
        </div>
      </form>
      <OAuth />

      <Link to="/sign-up" className="registerLink">
        Sign Up Instead
      </Link>
    </div>
  );
}

export default SignIn;

import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { ReactComponent as VisibilityIcon } from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebaseConfig";
import { setDoc, doc, serverTimestamp } from "firebase/firestore/lite";
import OAuth from "../components/OAuth";
function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const navigate = useNavigate();
  const { name, email, password } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      updateProfile(auth.current, {
        displayName: name,
      });
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    toast("Registered successfully");
  };

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">welcome back</p>
      </header>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="nameInput"
          placeholder="Name"
          id="name"
          value={name}
          onChange={onChange}
        ></input>
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

export default SignUp;

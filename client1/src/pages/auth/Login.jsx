import { useState } from "react";
import "../../styles/login.css"
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import FlexCenter from "../../components/FlexCenter";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import FormControl from "@mui/material/FormControl";
import { axiosInstance } from "../../../baseurl.js";
import { useDispatch } from "react-redux";
import {
  setIsLoggedInTrue,
  setIsLoggedInFalse,
  setIsAdminTrue,
  setIsAdminFalse,
} from "../../features/counter/counterSlice.js";

axios.defaults.withCredentials = true;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { from } = location.state || "/";

  const setItemWithExpiry = (key, value, expiryInHours) => {
    const now = new Date();
    const expiry = new Date(now.getTime() + expiryInHours * 60 * 60 * 1000);
    const item = {
      value,
      expiry: expiry.getTime(),
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getCookie = (name) => {
    const cookies = document.cookie.split(";");
    return cookies
      .map((cookie) => {
        const [key, value] = cookie.split("=");
        if (key.trim() === name) {
          return value.trim();
        }
        return undefined;
      })
      .find((value) => value !== undefined);
  };

  const checkCookieAndSetState = () => {
    const isLoggedIn = getCookie("isLoggedIn");
    const isAdmin = getCookie("isAdmin");

    if (isLoggedIn) {
      dispatch(setIsLoggedInTrue());
      // console.log("Login.jsx says Logged In true")
    } else {
      dispatch(setIsLoggedInFalse());
      // console.log("Login.jsx says Logged In false")
    }

    if (isAdmin) {
      // console.log("Login.jsx says Admin true")
      dispatch(setIsAdminTrue());
    } else {
      // console.log("Login.jsx says Admin false")
      dispatch(setIsAdminFalse());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("email: ", email)
      console.log("password: ", password)
      const { data } = await axiosInstance.post(`/api/v1/auth/login`, { email, password });

      if (data?.success) {
        setItemWithExpiry("user", data.user, 24);
        checkCookieAndSetState();
        navigate(from || "/");
        toast.success("User Logged In successfully!");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };


  return (
    <>
      <div className="login-container" >
        <div>
          <div sx={{ display: "flex", flexDirection: "column", marginBottom: "3rem", gap: "5px" }}>
            <h1>Sign In</h1>
            <div>Hi, Welcome back! You've been missed.</div>
          </div>

          <form sx={{ gap: "1rem", display: "flex" }} onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <br />
            <br />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {/* <span className="forgot" onClick={() => setIsPopupOpen(true)}>
              Forgot Password?
            </span> */}
            <br />
            <br />
            <button style={{ marginTop: "2rem", marginBottom: "3rem" }} onClick={handleSubmit}>Sign In</button>
          </form>
          <p className="login-No-Account">
            Don't have an account?&nbsp;
            <span className="registerPage-link" onClick={() => navigate("/register")}>
              Create One
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;

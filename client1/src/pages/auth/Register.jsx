import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlexCenter from "../../components/FlexCenter";
// import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
// import { Box, FormControl, Typography, Button, TextField } from "@mui/material";
import { RiUploadCloud2Line as CloudUploadIcon } from "@remixicon/react";
import { axiosInstance } from "../../../baseurl.js";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
// // import {
// //   setIsLoggedInTrue,
// //   setIsLoggedInFalse,
// //   setIsAdminTrue,
// //   setIsAdminFalse,
// // } from "../../features/counter/counterSlice.js";

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    answer: "",
    pincode: "",
  });
  const [file, setFile] = useState(null);
  const textFieldRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
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


  const setItemWithExpiry = (key, value, expiryInHours) => {
    const now = new Date();
    const expiry = new Date(now.getTime() + expiryInHours * 60 * 60 * 1000);
    const item = {
      value,
      expiry: expiry.getTime(),
    };
    localStorage.setItem(key, JSON.stringify(item));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const readyFormData = new FormData();
      Object.keys(formData).forEach((key) => {
        readyFormData.append(key, formData[key]);
      });
      // readyFormData.append("dateOfBirth", dateOfBirth.format("DD-MM-YYYY"));
      if (file) readyFormData.append("file", file);

      const { data } = await axiosInstance.post(
        `/api/v1/auth/register`,
        readyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success(`${data?.message}`);
        checkCookieAndSetState()
        setItemWithExpiry("user", data.user, 24);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          answer: "",
          pincode: "",
        })
        setIsLoading(false)
        navigate("/");
      }
    } catch (error) {
      console.log(error)
      toast.error('something went wrong');
      setIsLoading(false)
    }
  };

  return (
    <>
      <div>
        <FlexCenter sx={{ display: "flex", flexDirection: "column" }}>
          <h1>
            Create Account
          </h1>
          <p
            style={{
              fontSize: ".85rem",
              color: "var(--subTextColor)",
              fontWeight: "var(--logoFontWeight)",
            }}
          >
            Fill your Information below or register <br /> with your Social Account
          </p>
        </FlexCenter>

        <FlexCenter>
          <div onSubmit={handleSubmit}>
            <form style={{ gap: "1rem", marginTop: "2rem" }}>
              <input type="text" label="name" name="name" value={formData.name} onChange={handleChange} />
              <br />
              <br />
              <input type="email" label="email" name="email" value={formData.email} onChange={handleChange} />
              <br />
              <br />
              <input type="text" label="email" name="password" value={formData.password} onChange={handleChange} />
              <br />
              <br />
              <input type="number" label="phone" name="phone" value={formData.phone} onChange={handleChange} />
              <br />
              <br />
              <textarea maxLength={5} rows={4} type="text" label="address" name="address" value={formData.address} onChange={handleChange} />
              <br />
              <br />
              <input type="number" label="pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
              <br />
              <br />
              <input type="text" label="answer" name="answer" value={formData.answer} onChange={handleChange} />
              <br />
              
              {/* <CloudUploadIcon /> &nbsp; Upload file */}
                <input type="file" onChange={handleFileUpload}/>

                <br /><br />
              <button type="submit">
                Submit
              </button>
            </form>
          </div>
        </FlexCenter>
      </div>
      {isLoading && <Loader />}
    </>
  );
}

export default Register;

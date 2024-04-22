import React, { useState } from "react";
import "./login.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../../components/assets/images/cycle-logo.png";
import calendar from "../../components/assets/images/calendar.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";
function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const [loginData, setLoginData] = useState({
        username: "", // Can be username or email
        password: "",
    });
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();
    // Update state based on form input
    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameError(""); // Reset username error state
        setPasswordError(""); // Reset password error state

        try {
            const response = await axios.post(
                "http://localhost:3001/login",
                loginData
            );

            // Store the token in localStorage
            localStorage.setItem("token", response.data.token);

            console.log(response.data.message);
            navigate("/main"); // Redirect to main page after successful login
        } catch (error) {
            // Generic error handling
            if (error.response) {
                const message = error.response.data.message;
                if (message.includes("Invalid username or email")) {
                    setUsernameError("Username or Email is incorrect");
                } else if (message.includes("Invalid password")) {
                    setPasswordError("Password is incorrect");
                }
            } else {
                console.error("Login error: Server error");
            }
        }
    };

    return (
        <div>
            <div className="flex h-screen bg-gray-100 ">
                <div className="m-auto">
                    <div className="shadow-2xl rounded-2xl overflow-hidden mx-4">
                        <div className="md:flex ">
                            <div className="w-full relative z-50   md:w-[400px] xl:w-[600px] h-[600px] bg-purple-100 rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none rounded-2xl md:rounded-none">
                                <div className=" flex">
                                    <div className=" ml-10 mt-10">
                                        <img
                                            src={logo}
                                            alt="logo"
                                            className="h-32 w-32"
                                        />
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit} className=" ">
                                    <div className="pb-10 pl-10 pr-10 space-y-2">
                                        <div>
                                            <span className="text-4xl font-Bungee font">
                                                Login
                                            </span>
                                            <span className=" text-7xl text-pink-300 animate-pulse">
                                                .
                                            </span>
                                            <span className=" text-7xl text-pink-500 animate-pulse">
                                                .
                                            </span>
                                            <span className=" text-7xl text-pink-700  animate-pulse">
                                                .
                                            </span>
                                        </div>
                                        <div>
                                            <div className="w-full flex flex-col space-y-4">
                                                <div className="space-y-4">
                                                    <TextField
                                                        name="username"
                                                        label="Username or Email"
                                                        className=" font-Comfortaa"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={
                                                            loginData.username
                                                        }
                                                        onChange={handleChange}
                                                        error={!!usernameError}
                                                        helperText={
                                                            usernameError
                                                        }
                                                        InputProps={{
                                                            style: {
                                                                fontFamily:
                                                                    "'Comfortaa', cursive",
                                                            },
                                                        }}
                                                        InputLabelProps={{
                                                            style: {
                                                                fontFamily:
                                                                    "'Comfortaa', cursive",
                                                            },
                                                        }}
                                                        FormHelperTextProps={{
                                                            style: {
                                                                fontFamily:
                                                                    "'Comfortaa', cursive",
                                                            },
                                                        }}
                                                    />

                                                    <TextField
                                                        name="password"
                                                        label="Password"
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        fullWidth
                                                        value={
                                                            loginData.password
                                                        }
                                                        onChange={handleChange}
                                                        error={!!passwordError}
                                                        helperText={
                                                            passwordError
                                                        }
                                                        InputProps={{
                                                            style: {
                                                                fontFamily:
                                                                    "'Comfortaa', cursive",
                                                            },
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={
                                                                            handleClickShowPassword
                                                                        }
                                                                        edge="end">
                                                                        {showPassword ? (
                                                                            <VisibilityOff />
                                                                        ) : (
                                                                            <Visibility />
                                                                        )}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        InputLabelProps={{
                                                            style: {
                                                                fontFamily:
                                                                    "'Comfortaa', cursive",
                                                            },
                                                        }}
                                                        FormHelperTextProps={{
                                                            style: {
                                                                fontFamily:
                                                                    "'Comfortaa', cursive",
                                                            },
                                                        }}
                                                    />
                                                </div>
                                                <div className=" flex justify-center">
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        fullWidth
                                                        sx={{
                                                            backgroundColor:
                                                                "#FB9AD1",
                                                            width: "50%",
                                                            ":hover": {
                                                                backgroundColor:
                                                                    "#e695b0",
                                                            },
                                                        }}>
                                                        Login
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className=" font-Bungee text-xs font mt-14 ">
                                                <span>New to Cyclecare? </span>
                                                <Link to="/register">
                                                    <span className="underline hover:text-blue-500">
                                                        {" "}
                                                        Create an Account
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="w-full md:w-[300px] relative z-50 xl:w-[300px] h-[600px] bg-pink-300 rounded-br-2xl md:rounded-bl-none rounded-2xl md:rounded-none hidden md:block">
                                <div className=" w-full relative">
                                    <div className=" ml-10 mt-24 font-2">
                                        <img
                                            src={calendar}
                                            alt="calendar-logo"
                                            className="h-36 w-36"
                                        />
                                    </div>
                                    <div className="ml-10 my-10 space-y-5">
                                        <p className=" text-4xl font-Bungee font-2 ">
                                            TRACK
                                        </p>
                                        <p className=" text-2xl font-Bungee font-2">
                                            YOUR
                                        </p>
                                        <p className=" text-4xl font-Bungee font-2 animate-pulse">
                                            MENSTRUAL
                                        </p>
                                        <p className=" text-2xl font-Bungee font-2">
                                            CYCLE
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

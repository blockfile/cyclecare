import React, { useState } from "react";
import "./register.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../../components/assets/images/cycle-logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const handleClickShowPasswordConfirm = () =>
        setShowPasswordConfirm(!showPasswordConfirm);
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        age: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setAgeError(""); // Add this line

        const passwordRegex = /^(?=.*[A-Z])[A-Za-z\d@$!%*#?&]{7,15}$/;
        if (!passwordRegex.test(formData.password)) {
            setPasswordError(
                "Password must be 8-16 characters long, start with an uppercase letter, and contain no spaces."
            );
            return; // Stop the form submission
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!"); // Consider using a state to handle this message in the UI as well
            return;
        }
        if (formData.age < 13 || formData.age > 45) {
            setAgeError("Age must be between 13 and 45.");
            return;
        }

        try {
            const { username, email, password, age } = formData;
            await axios.post("http://localhost:3001/register", {
                username,
                email,
                password,
                age,
            });

            alert("Registration successful");
            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response) {
                const { message } = error.response.data;
                if (message.includes("Username already exists")) {
                    setUsernameError("Username already exists.");
                } else if (message.includes("Email already exists")) {
                    setEmailError("Email already exists.");
                } else if (message.includes("Age must be between 13 and 45.")) {
                    setAgeError(message);
                }
            } else {
                alert("An unknown error occurred."); // Consider handling this error in a more user-friendly way
            }
        }
    };

    const [ageError, setAgeError] = useState(""); // Add this line

    return (
        <div className="flex h-screen bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300">
            <div className="m-auto">
                <div className="shadow-2xl rounded-2xl overflow-hidden mx-4 ">
                    <div className="md:flex ">
                        <div className="w-full md:w-[400px] xl:w-[600px] h-[600px] bg-purple-100 rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none rounded-2xl md:rounded-none">
                            <form
                                onSubmit={handleSubmit}
                                className="p-10 space-y-10">
                                <div className="p-10 space-y-10">
                                    <div>
                                        <span className="text-4xl font-EmilysCandy font">
                                            Register
                                        </span>
                                        <span className=" text-7xl text-pink-300 animate-pulse">
                                            .
                                        </span>
                                        <span className=" text-7xl text-pink-500 animate-pulse">
                                            .
                                        </span>
                                        <span className=" text-7xl text-pink-700 animate-pulse">
                                            .
                                        </span>
                                    </div>
                                    <div>
                                        <div className="w-full flex flex-col space-y-4">
                                            <div className="space-y-4">

                                                <TextField
                                                    name="username"
                                                    label="Username"
                                                    variant="outlined"
                                                    fullWidth
                                                    error={!!usernameError} // Boolean conversion; if usernameError has a message, it will evaluate to true
                                                    helperText={usernameError} // Display the error message
                                                    onChange={handleChange}
                                                    value={formData.username}
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
                                                    name="email"
                                                    label="Email Address"
                                                    variant="outlined"
                                                    type="email"
                                                    fullWidth
                                                    error={!!emailError}
                                                    helperText={emailError}
                                                    onChange={handleChange}
                                                    value={formData.email}
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
                                                    name="age"
                                                    label="Age"
                                                    variant="outlined"
                                                    type="number"
                                                    fullWidth
                                                    error={!!ageError}
                                                    helperText={ageError}
                                                    onChange={handleChange}
                                                    value={formData.age}
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
                                                    label="Create Password"
                                                    variant="outlined"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    fullWidth
                                                    error={!!passwordError}
                                                    helperText={passwordError}
                                                    onChange={handleChange}
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
                                                <TextField
                                                    name="confirmPassword" // Added name attribute
                                                    onChange={handleChange} // Added onChange handler
                                                    label="Confirm Password"
                                                    variant="outlined"
                                                    type={
                                                        showPasswordConfirm
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    fullWidth
                                                    InputProps={{
                                                        style: {
                                                            fontFamily:
                                                                "'Comfortaa', cursive",
                                                        },
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={
                                                                        handleClickShowPasswordConfirm
                                                                    }
                                                                    edge="end">
                                                                    {showPasswordConfirm ? (
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
                                                    <span style={{fontFamily: "'Emilys Candy', cursive"}}>Sign Up</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className=" font-Bungee text-1 font mt-5">
                                            <span style={{fontFamily: "'Emilys Candy', cursive"}}>Already a member? </span>
                                            <Link to="/">
                                                <span className=" underline hover:text-blue-500" style={{fontFamily: "'Emilys Candy', cursive"}}>
                                                    {" "}
                                                    Log-in
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="w-full md:w-[300px] relative z-50 xl:w-[300px] h-[600px] bg-pink-200 rounded-br-2xl md:rounded-bl-none rounded-2xl md:rounded-none hidden md:block">
                                <div className=" w-full relative">
                                    <div className=" ml-10 mt-24 font-2">
                                        <img
                                            src={logo}
                                            alt="calendar-logo"
                                            className="h-50 w-50"
                                        />
                                    </div>
                                    <div className="flex items-start justify-center ml-3 mt-[-36px] mb-5 space-y-5">
                                        <p className=" text-4xl font-EmilysCandy animate-pulse text-pink-800">
                                            CycleCare
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
    );
}

export default Register;

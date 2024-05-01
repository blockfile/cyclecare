import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ContactsIcon from "@mui/icons-material/Contacts";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CiCalendarDate } from "react-icons/ci";
function Navbar() {
    const [user, setUser] = useState({ username: "", email: "", avatar: "" });
    const [anchorEl, setAnchorEl] = useState(null);
    const [featuresDropdown, setFeaturesDropdown] = useState(false);
    const [isNavExpanded, setIsNavExpanded] = useState(true);
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const toggleNav = () => {
        if (isLargeScreen) {
            // Prevent toggling in small screens
            setIsNavExpanded(!isNavExpanded);
        }
    };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/user/info",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                setUser(response.data.user);
            } catch (error) {
                console.log("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);
    useEffect(() => {
        setIsNavExpanded(isLargeScreen);
    }, [isLargeScreen]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleFeaturesHover = () => {
        setFeaturesDropdown(true);
    };

    const handleFeaturesLeave = () => {
        setFeaturesDropdown(false);
    };

    return (
        <div className="w-full flex justify-center z-50 absolute">
            <div
                className={`transition-all duration-300 ease-in-out ${
                    isNavExpanded
                        ? "lg:w-3/4 lg:h-20 sm:h-14 "
                        : "lg:w-1/2 h-14 "
                } sm:w-full flex justify-between sm:my-0 bg-red-500  lg:rounded-b-xl font-Comfortaa `}>
                <div className="flex items-center space-x-10 mx-auto">
                    {isNavExpanded ? (
                        <>
                            <div className="ml-56  space-x-10 sm:hidden lg:flex">
                                <div className="text-center cursor-pointer hover:text-red-400">
                                    <HomeIcon /> <p>About</p>
                                </div>
                                <div
                                    className="text-center cursor-pointer hover:text-red-400"
                                    onMouseEnter={handleFeaturesHover}
                                    onMouseLeave={handleFeaturesLeave}>
                                    <StarBorderIcon /> <p>Features</p>
                                    {featuresDropdown && (
                                        <div className="absolute bg-white shadow-md rounded-md">
                                            <Link to="/calendar">
                                                <div className="py-2 px-4 hover:bg-gray-200 cursor-pointer rounded-md bg-red-200 text-black flex">
                                                    <div className=" my-auto">
                                                        <CiCalendarDate
                                                            size={24}
                                                        />
                                                    </div>
                                                    <div className="my-auto mt-1">
                                                        <span className="">
                                                            Calendar
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center cursor-pointer hover:text-red-400">
                                    <LocalHospitalIcon /> <p>Health</p>
                                </div>
                                <div className="text-center cursor-pointer hover:text-red-400">
                                    <ContactsIcon /> <p>Contact Us</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className=" absolute  sm:pl-8  lg:block flex ">
                                <div className=" flex sm:space-x-10 lg:space-x-8 ">
                                    <div>
                                        <HomeIcon className="cursor-pointer hover:text-red-400" />
                                    </div>
                                    <div
                                        onMouseEnter={handleFeaturesHover}
                                        onMouseLeave={handleFeaturesLeave}
                                        className="">
                                        <StarBorderIcon className="cursor-pointer hover:text-red-400" />
                                        {featuresDropdown && (
                                            <div className="absolute bg-white shadow-md  rounded-md">
                                                <Link to="/calendar">
                                                    <div className="py-2 px-4 hover:bg-gray-200 cursor-pointer rounded-md bg-red-200 text-black flex">
                                                        <div className=" my-auto">
                                                            <CiCalendarDate
                                                                size={24}
                                                            />
                                                        </div>

                                                        <div className="my-auto mt-1">
                                                            <span className="">
                                                                Calendar
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        {" "}
                                        <LocalHospitalIcon className="cursor-pointer hover:text-red-400" />
                                    </div>
                                    <div>
                                        {" "}
                                        <ContactsIcon className="cursor-pointer hover:text-red-400" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex relative sm:right-0 sm:mt-2 ">
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleMenuOpen}
                            size="small"
                            sx={{ ml: 24 }}>
                            <Avatar
                                sx={{ width: 32, height: 32 }}
                                src={
                                    user.avatar
                                        ? `data:image/jpeg;base64,${user.avatar}`
                                        : undefined
                                }
                            />
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={toggleNav} size="small">
                        {isNavExpanded ? (
                            <IoIosArrowUp
                                size={30}
                                className="sm:hidden xl:block"
                            />
                        ) : (
                            <IoIosArrowDown
                                size={30}
                                className="xl:block sm:hidden"
                            />
                        )}
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: "visible",
                                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                mt: 1.5,
                                "& .MuiAvatar-root": {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                "&::before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: "background.paper",
                                    transform: "translateY(-50%) rotate(45deg)",
                                    zIndex: 0,
                                },
                            },
                        }}>
                        <MenuItem onClick={handleMenuClose}>
                            <Avatar
                                sx={{ width: 100, height: 100 }}
                                src={
                                    user.avatar
                                        ? `data:image/jpeg;base64,${user.avatar}`
                                        : undefined
                                }
                            />{" "}
                            <Link to="/profile">Profile</Link>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <Settings fontSize="small" /> Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            {" "}
                            {/* Call handleLogout on click */}
                            <Logout fontSize="small" /> Logout
                        </MenuItem>
                    </Menu>

                    <div className="flex items-center space-x-4 mr-4">
                        {/* Account settings and more */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;

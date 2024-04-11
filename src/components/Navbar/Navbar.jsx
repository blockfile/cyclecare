import React, { useState } from "react";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Divider,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ContactsIcon from "@mui/icons-material/Contacts";
import logo from "../assets/images/cycle-logo.png";
import "./Navbar.css";

function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isNavExpanded, setIsNavExpanded] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const toggleNav = () => setIsNavExpanded(!isNavExpanded);

    return (
        <div className="w-full flex justify-center relative">
            <div
                className={`transition-all duration-300 ease-in-out ${
                    isNavExpanded ? "lg:w-3/4 lg:h-20 sm:h-14" : "lg:w-3/4 h-14"
                } sm:w-full flex justify-between sm:my-0 bg-transparent bg-red-300 lg:rounded-b-xl font-Comfortaa`}>
                <div className="flex items-center space-x-10 mx-auto">
                    {isNavExpanded ? (
                        <>
                            <div className="ml-56  space-x-10 sm:hidden lg:flex">
                                <div className="text-center cursor-pointer hover:text-red-400">
                                    {" "}
                                    <HomeIcon className="" /> <p>About</p>
                                </div>
                                <div className="text-center cursor-pointer hover:text-red-400">
                                    <StarBorderIcon /> <p>Features</p>
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
                            <div className="lg:ml-56 sm:hidden lg:block flex space-x-10">
                                <HomeIcon className="cursor-pointer hover:text-red-400" />
                                <StarBorderIcon className="cursor-pointer hover:text-red-400" />
                                <LocalHospitalIcon className="cursor-pointer hover:text-red-400" />
                                <ContactsIcon className="cursor-pointer hover:text-red-400" />
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-center space-x-4 mr-4">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-14 w-14 lg:hidden absolute left-0 ml-20"
                    />
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleMenuOpen}
                            size="small"
                            sx={{ ml: 24 }}>
                            <Avatar sx={{ width: 32, height: 32 }} />
                        </IconButton>
                    </Tooltip>
                    <IconButton onClick={toggleNav} size="small">
                        {isNavExpanded ? (
                            <IoIosArrowUp
                                size={30}
                                className="sm:hidden lg:block"
                            />
                        ) : (
                            <IoIosArrowDown
                                size={30}
                                className="lg:block sm:hidden"
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
                            <Avatar /> Profile
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <Settings fontSize="small" /> Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleMenuClose}>
                            <Logout fontSize="small" /> Logout
                        </MenuItem>
                    </Menu>
                    <div className="lg:hidden flex items-center justify-end p-4">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? (
                                <XIcon className="h-6 w-6" />
                            ) : (
                                <MenuIcon className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center space-x-4 mr-4">
                        {/* Account settings and more */}
                    </div>
                </div>
                <div
                    className={`absolute top-full w-full backdrop-blur-md z-50 ${
                        isMenuOpen ? "flex" : "hidden"
                    } flex-col lg:hidden h-screen text-center transition-all duration-300 ease-in-out`}>
                    <ul className="py-5 space-y-2 font-Bungee text-red-400 mx-14 menu-item-transition">
                        <div className="w-full border-2 border-pink-400 rounded-lg cursor-pointer menu-item">
                            <li className="my-2 flex justify-center">
                                {" "}
                                <HomeIcon />
                                <div className="mt-0.5">
                                    <span className="">About</span>
                                </div>
                            </li>
                        </div>
                        <div className="w-full border-2 border-pink-400 rounded-lg cursor-pointer menu-item">
                            <li className="my-2 flex justify-center">
                                {" "}
                                <StarBorderIcon />
                                <div className="mt-0.5 ">
                                    <span className="">Features</span>
                                </div>
                            </li>
                        </div>
                        <div className="w-full border-2 border-pink-400 rounded-lg cursor-pointer menu-item">
                            <li className="my-2 flex justify-center">
                                {" "}
                                <LocalHospitalIcon />
                                <div className="mt-0.5 justify-center">
                                    <span className="">Health</span>
                                </div>
                            </li>
                        </div>
                        <div className="w-full border-2 border-pink-400 rounded-lg cursor-pointer menu-item">
                            <li className="my-2 flex justify-center">
                                {" "}
                                <ContactsIcon />
                                <div className="mt-0.5">
                                    <span className="">Contact Us</span>
                                </div>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;

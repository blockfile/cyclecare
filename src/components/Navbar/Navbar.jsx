import React, { useState } from "react";
import logo from "../assets/images/cycle-logo.png";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import "./Navbar.css";
import { Link } from "react-router-dom";
function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHealthDropdownOpen, setIsHealthDropdownOpen] = useState(false);
    return (
        <div className="w-full flex justify-center relative">
            <div className="lg:w-3/4 sm:w-full flex justify-between sm:my-0 lg:my-3 bg-transparent hover:bg-pink-300 sm:rounded-none lg:rounded-xl font-Comfortaa menu-item-transition ">
                <img
                    src={logo}
                    alt="logo"
                    className="  xl:block h-14 w-14  lg:h-24 lg:w-24"
                />
                <div className="hidden  lg:flex py-5 my-auto">
                    <ul className="flex space-x-10 mx-5 ">
                        <li className=" cursor-pointer">About</li>
                        <li className=" cursor-pointer">Features</li>
                        <div
                            onMouseEnter={() => setIsHealthDropdownOpen(true)}
                            onMouseLeave={() => setIsHealthDropdownOpen(false)}
                            className="relative cursor-pointer">
                            <li>Health</li>
                            {isHealthDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white shadow-md rounded-md">
                                    <ul className="py-2">
                                        <li className="px-4 py-2 hover:bg-gray-100">
                                            Health Articles
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <li className=" cursor-pointer">Contact Us</li>
                    </ul>
                </div>

                <div className="hidden lg:flex py-5 my-auto">
                    <ul className="flex space-x-10 mx-10">
                        <Link to="/">
                            <li className=" cursor-pointer">Login</li>
                        </Link>
                        <Link to="/register">
                            <li className=" cursor-pointer">Sign Up</li>
                        </Link>
                    </ul>
                </div>

                <div className="lg:hidden  right-0 flex items-center  ">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? (
                            <XIcon className="h-6 w-6" />
                        ) : (
                            <MenuIcon className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            <div
                className={`absolute top-full  w-full backdrop-blur-md z-50   ${
                    isMenuOpen ? "flex" : "hidden"
                } flex-col  lg:hidden h-screen text-center  `}>
                <ul className="py-5 space-y-2 font-Bungee text-red-400 mx-14 menu-item-transition">
                    <div className="w-full border-2 border-pink-400 rounded-lg cursor-pointer  menu-item">
                        <li className="my-2  ">About</li>
                    </div>
                    <div className="w-full border-2 border-pink-400 rounded-lg cursor-pointer  menu-item">
                        <li className="my-2">Features</li>
                    </div>
                    <div className="w-full border-2 border-pink-400 rounded-lg cursor-pointer  menu-item ">
                        <li className="my-2">Health</li>
                    </div>
                    <div className="w-full border-2 border-pink-400 rounded-lg cursor-pointer  menu-item">
                        <li className="my-2">Contact Us</li>
                    </div>
                    <div className="w-full border-2 border-pink-400 rounded-lg cursor-pointer  menu-item">
                        <li className="my-2">Login</li>
                    </div>
                    <div className="w-full border-2 border-pink-500 rounded-lg cursor-pointer  menu-item">
                        <li className="my-2">Sign Up</li>
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default Navbar;

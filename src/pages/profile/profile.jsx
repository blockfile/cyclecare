import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./profile.css";
import Navbar from "../../components/Navbar/Navbar";
import bg from "../../components/assets/videos/bg.mp4";
import Footer from "../../components/Footer/Footer";
import { Avatar, Button } from "@mui/material";

function Profile() {
    const [user, setUser] = useState({ username: "", email: "", avatar: "" });
    const [isHovering, setIsHovering] = useState(false); // State to track hovering
    const fileInputRef = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
    });
    const [errors, setErrors] = useState({});
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
                setFormData({
                    username: response.data.user.username,
                    email: response.data.user.email,
                });
            } catch (error) {
                console.log("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);
    const toggleEditMode = () => {
        setEditMode(!editMode);
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSave = async () => {
        try {
            const response = await axios.put(
                "http://localhost:3001/user/update",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setUser(response.data.user);
            setEditMode(false); // Exit edit mode after save
            console.log("Update successful:", response.data.message);
        } catch (error) {
            console.log("Error updating user data:", error);
            setErrors({ save: "Failed to update profile" }); // Handle errors
        }
    };

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

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("avatar", file);
        try {
            const response = await axios.post(
                "http://localhost:3001/user/upload-avatar",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setUser({ ...user, avatar: response.data.avatar });
        } catch (error) {
            console.log("Error uploading image:", error);
        }
    };

    const triggerFileSelect = () => fileInputRef.current.click();

    return (
        <div className="relative overflow-x-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="object-cover h-full w-full absolute z-0">
                <source src={bg} type="video/mp4" />
            </video>
            <div className="absolute z-5 h-full w-full bg-gradient-to-b from-transparent to-white"></div>
            <Navbar />
            <div className="relative z-10 flex flex-col items-center h-full mt-14 mx-auto text-justify">
                <div className="my-10 space-y-4 bg-red-200 mt-24 px-24 pb-24 pt-10 rounded-xl font-Comfortaa shadow-2xl">
                    <Button
                        onClick={toggleEditMode}
                        sx={{
                            position: "absolute",
                            top: "100px",
                            right: "780px",
                        }}>
                        {editMode ? "Cancel" : "Edit"}
                    </Button>
                    <div
                        className="avatar-container relative"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}>
                        <Avatar
                            sx={{ width: 100, height: 100 }}
                            src={
                                user.avatar
                                    ? `data:image/jpeg;base64,${user.avatar}`
                                    : undefined
                            }
                            onClick={triggerFileSelect}
                        />
                        {isHovering && (
                            <div
                                className="avatar-overlay"
                                onClick={triggerFileSelect}>
                                Change Avatar
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                        />
                    </div>
                    {editMode ? (
                        <>
                            <div className="input-field">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-field">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <Button onClick={handleSave} sx={{ mt: 2 }}>
                                Save
                            </Button>
                        </>
                    ) : (
                        <>
                            <p>
                                <b>Username:</b> {user.username}
                            </p>
                            <p>
                                <b>Email:</b> {user.email}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./profile.css"; // For custom styles
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Avatar, Button } from "@mui/material";

function Profile() {
    const [user, setUser] = useState({ username: "", email: "", avatar: "" });
    const [isHovering, setIsHovering] = useState(false);
    const fileInputRef = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        age: "",
        contact: "",
        lastPeriod: "",
        irregular: "", // This will store "Yes" or "No"
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
                    age: response.data.user.age || "", // Default to empty string if not present
                    contact: response.data.user.contact || "", // Default to empty string if not present
                    lastPeriod: response.data.user.lastPeriod
                        ? new Date(response.data.user.lastPeriod)
                              .toISOString()
                              .substr(0, 10)
                        : "",
                    irregular: response.data.user.irregular || "No", // Fetch "Yes" or "No" from DB
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
            setEditMode(false); // Exit edit mode after saving
            console.log("Update successful:", response.data.message);
        } catch (error) {
            console.log("Error updating user data:", error);
            setErrors({ save: "Failed to update profile" });
        }
    };

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
        <div>
            <Navbar />

            <div className="profile-page">
                <div className="profile-container">
                    <h2 className=" text-3xl">Customize your profile</h2>
                    <div className="avatar-container">
                        <Avatar
                            src={
                                user.avatar
                                    ? `data:image/jpeg;base64,${user.avatar}`
                                    : undefined
                            }
                            className="avatar"
                            onClick={triggerFileSelect}
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: "none" }}
                        />
                    </div>
                    <form className="profile-form">
                        <label>Name</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!editMode}
                        />

                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            disabled={!editMode}
                        />

                        <label>Contact #</label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            disabled={!editMode}
                        />

                        <label>Are you irregular?</label>
                        <div className="irregular-options">
                            <label>
                                <input
                                    type="radio"
                                    name="irregular"
                                    value="Yes"
                                    checked={formData.irregular === "Yes"}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                                Yes
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="irregular"
                                    value="No"
                                    checked={formData.irregular === "No"}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                                No
                            </label>
                        </div>

                        {editMode ? (
                            <Button
                                onClick={handleSave}
                                className="save-button">
                                Save
                            </Button>
                        ) : (
                            <Button
                                onClick={toggleEditMode}
                                className="edit-button">
                                Edit
                            </Button>
                        )}
                    </form>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Profile;

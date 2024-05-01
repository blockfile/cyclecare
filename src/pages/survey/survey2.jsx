import React, { useState } from "react";
import "./survey2.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Survey2() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to save data.");
            return;
        }
        try {
            await axios.post(
                "http://localhost:3001/user/last-menstrual",
                { startDate, endDate },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Menstrual dates saved successfully!");
            navigate("/main");
        } catch (error) {
            console.error("Error saving menstrual dates:", error);
            alert("Failed to save menstrual dates.");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="m-auto">
                <form
                    onSubmit={handleSubmit}
                    className="shadow-2xl rounded-2xl overflow-hidden mx-4 md:flex">
                    <div className="w-full relative z-50 md:w-[400px] xl:w-[600px] h-[500px] bg-purple-100 rounded-2xl">
                        <div className="mx-10 mt-10">
                            <span className="text-5xl font-Comfortaa text-red-400">
                                Enter your last menstrual period dates
                            </span>
                        </div>
                        <div className="mx-10 mt-8">
                            <label>Start Date:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border-2 rounded-lg border-red-400 p-2 w-full"
                            />
                            <label>End Date:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border-2 rounded-lg border-red-400 p-2 w-full"
                            />
                        </div>
                        <button type="submit" className="next-button mt-5">
                            Finish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Survey2;

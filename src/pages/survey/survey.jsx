import React, { useState } from "react";
import "./survey.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Survey() {
    const [cycle, setCycle] = useState("28 days"); // Default cycle

    const navigate = useNavigate(); // Initialize navigate function

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token"); // Retrieve the stored token
        if (!token) {
            alert("No token found, please login first.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:3001/user/cycle",
                { cycle },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                }
            );
            console.log("Cycle saved:", response.data);
            alert("Cycle saved successfully!");
            navigate("/survey2"); // Navigate after successful submission
        } catch (error) {
            console.error("Error saving cycle:", error);
            alert("Failed to save cycle");
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="m-auto">
                <div className="shadow-2xl rounded-2xl overflow-hidden mx-4">
                    <div className="md:flex">
                        <div className="w-full relative z-50 md:w-[400px] xl:w-[600px] h-[600px] bg-purple-100 rounded-tl-2xl md:rounded-bl-2xl md:rounded-tr-none rounded-2xl md:rounded-none">
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col">
                                <div className="mx-10 mt-10">
                                    <span className="text-5xl font-Comfortaa text-red-400">
                                        What is your Menstrual Cycle?
                                    </span>
                                </div>
                                <div className="mx-10 mt-5 space-y-5">
                                    {["21 days", "28 days", "35 days"].map(
                                        (option) => (
                                            <div
                                                key={option}
                                                className="relative border rounded-lg border-red-400 p-2 ">
                                                <label className="block text-xl">
                                                    <input
                                                        type="radio"
                                                        name="cycle"
                                                        value={option}
                                                        className="mr-2"
                                                        onChange={() =>
                                                            setCycle(option)
                                                        }
                                                        checked={
                                                            cycle === option
                                                        }
                                                    />
                                                    {option}
                                                </label>
                                            </div>
                                        )
                                    )}
                                </div>

                                <button type="submit" className="next-button">
                                    Next
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Survey;

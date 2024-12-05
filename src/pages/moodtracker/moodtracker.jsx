import React, { useState, useEffect } from "react";
import {
    FaSmile,
    FaFrown,
    FaMeh,
    FaGrinStars,
    FaSadCry,
    FaAngry,
} from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import "./moodtracker.css"; // Add any custom styles here

function MoodTracker() {
    const [selectedMood, setSelectedMood] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [moodData, setMoodData] = useState({}); // Store mood data for each day

    const moods = [
        { icon: <FaSmile size={40} color="#FFD700" />, label: "Happy", color: "#FFD700" }, // Yellow
        { icon: <FaMeh size={40} color="#A9A9A9" />, label: "Neutral", color: "#A9A9A9" }, // Gray
        { icon: <FaGrinStars size={40} color="#FFC107" />, label: "Excited", color: "#FFC107" }, // Light Orange
        { icon: <FaFrown size={40} color="#87CEEB" />, label: "Sad", color: "#87CEEB" }, // Light Blue
        { icon: <FaSadCry size={40} color="#4169E1" />, label: "Very Sad", color: "#4169E1" }, // Royal Blue
        { icon: <FaAngry size={40} color="#FF4500" />, label: "Angry", color: "#FF4500" } // Red-Orange
      ];

    // Fetch mood data from the backend when the component loads or currentDate changes
    useEffect(() => {
        const fetchMoodData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/user/mood-data",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                if (response.data.moodTracker) {
                    const moodMap = {};
                    response.data.moodTracker.forEach((entry) => {
                        // Ensure dates are formatted consistently (no time part)
                        moodMap[new Date(entry.date).toDateString()] =
                            entry.mood;
                    });
                    setMoodData(moodMap);
                }
            } catch (error) {
                console.error("Error fetching mood data:", error);
            }
        };

        fetchMoodData();
    }, [currentDate]); // Fetch moods when the month changes

    const handleMoodSelect = async (label) => {
        setSelectedMood(label);
        const today = new Date();
        const dateString = today.toDateString();

        try {
            await axios.post(
                "http://localhost:3001/user/save-mood",
                { date: today, mood: label },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setMoodData((prevData) => ({ ...prevData, [dateString]: label }));
        } catch (error) {
            console.error("Error saving mood:", error);
        }
    };

    // Calendar functionality
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const currentMonthName = monthNames[currentDate.getMonth()];

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const goToPreviousMonth = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );

    const goToNextMonth = () =>
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    // Render the days of the calendar
    const renderDayCells = () => {
        const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        ).getDay();

        return Array.from({ length: daysInMonth + firstDayOfMonth }, (_, i) => {
            const day = i - firstDayOfMonth + 1;
            const dateString = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            ).toDateString();

            const moodForDay = moodData[dateString]; // Get mood for this day
            return (
                <div
                    key={i}
                    className={`day ${day > 0 ? "" : "empty"} ${
                        isToday(day) ? "today" : ""
                    }`}
                    style={{
                        backgroundColor: day > 0 ? "white" : "transparent",
                    }}>
                    {day > 0 ? day : ""}
                    {moodForDay && (
                        <div className="mood-icon">
                            {moods.find((m) => m.label === moodForDay)?.icon}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="relative overflow-x-hidden bg-pink-100">
            <Navbar />
            <div className="relative z-10 flex flex-col items-center h-full mt-14 mx-auto text-justify">
                <div className="my-10 space-y-4 bg-pink-200 px-10 py-8 rounded-xl shadow-2xl font-SourGummy text-center">
                    <h2 className="text-3xl font-SourGummy mb-8">Track Your Mood Over Time</h2>
                    <div className="calendar-container">
                        <header className="calendar-header flex justify-between items-center">
                            <FaArrowLeft
                                onClick={goToPreviousMonth}
                                size={25}
                                className="cursor-pointer hover:text-red-500"
                            />
                            <h1 className="font-SourGummy">{`${currentMonthName.toUpperCase()} ${currentDate.getFullYear()}`}</h1>
                            <FaArrowRight
                                onClick={goToNextMonth}
                                size={25}
                                className="cursor-pointer hover:text-red-500"
                            />
                        </header>
                        <div className="calendar-grid">
                            {daysOfWeek.map((day, index) => (
                                <div key={index} className="day-of-week">
                                    {day}
                                </div>
                            ))}
                            {renderDayCells()}
                        </div>
                    </div>
                    {/* Mood Selection Section */}
                    <div className="my-10 space-y-4 bg-pink-200 px-10 py-8 rounded-xl shadow-2xl font-SourGummy text-center">
                        <h2 className="text-3xl font-SourGummy mb-8">
                            How are you feeling today?
                        </h2>
                        <div className="grid grid-cols-3 gap-6 mx-auto">
                            {moods.map((mood, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-full cursor-pointer transition ${
                                        selectedMood === mood.label
                                            ? "bg-red-200"
                                            : "bg-white"
                                    }`}
                                    onClick={() =>
                                        handleMoodSelect(mood.label)
                                    }>
                                    {mood.icon}
                                </div>
                            ))}
                        </div>
                        {selectedMood && (
                            <p className="mt-4">You selected: {selectedMood}</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MoodTracker;

import React, { useState, useEffect } from "react";
import "./App.css";
import { useRoutes } from "react-router-dom";
import Login from "../src/pages/login/login";
import Register from "../src/pages/register/register";
import Main from "../src/pages/main/main";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/profile/profile";
import CalendarMens from "./pages/calendar/calendar";
import Survey from "./pages/survey/survey";
import Survey2 from "./pages/survey/survey2";
import PeriodNotification from "../src/components/notification/notification"; // Import the notification component
import axios from "axios"; // Assuming you're fetching cycleData from an API
import MoodTracker from "./pages/moodtracker/moodtracker";
function App() {
    const [cycleData, setCycleData] = useState(null); // State to hold cycle data

    // Fetch cycle data when the app mounts
    useEffect(() => {
        const fetchCycleData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/user/cycle-data",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                console.log("Cycle Data:", response.data); // Log the response for debugging
                setCycleData(response.data);
            } catch (error) {
                console.error("Failed to fetch cycle data:", error);
            }
        };

        fetchCycleData();
    }, []);

    let element = useRoutes([
        {
            path: "/", // This will match the root path exactly
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },

        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/profile",
                    element: <Profile />,
                },
            ],
        },
        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/survey",
                    element: <Survey />,
                },
            ],
        },
        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/survey2",
                    element: <Survey2 />,
                },
            ],
        },
        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/calendar",
                    element: <CalendarMens />,
                },
            ],
        },
        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/moodtracker",
                    element: <MoodTracker />,
                },
            ],
        },
        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/main",
                    element: <Main />,
                },
            ],
        },
    ]);

    return (
        <div className="App">
            {element}
            {/* Show the Period Notification component */}
            <PeriodNotification cycleData={cycleData} />
        </div>
    );
}

export default App;

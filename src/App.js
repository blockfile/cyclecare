import React from "react";
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
function App() {
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
                    path: "/main",
                    element: <Main />,
                },
            ],
        },
    ]);

    return <div className="App">{element}</div>;
}

export default App;

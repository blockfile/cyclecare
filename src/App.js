import React from "react";
import "./App.css";
import { useRoutes } from "react-router-dom";
import Login from "../src/pages/login/login";
import Register from "../src/pages/register/register";
import Main from "../src/pages/main/main";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/profile/profile";
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
                // You can add more protected routes here
            ],
        },
        // Protected routes wrapper
        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/main",
                    element: <Main />,
                },
                // You can add more protected routes here
            ],
        },
    ]);

    return <div className="App">{element}</div>;
}

export default App;

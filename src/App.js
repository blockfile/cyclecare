import React from "react";
import "./App.css";
import { useRoutes } from "react-router-dom";
import Login from "../src/pages/login/login";
import Register from "../src/pages/register/register";
import Main from "../src/pages/main/main";

function App() {
    let element = useRoutes([
        {
            path: "/", // Use a single path for authentication
            element: <Login />,
        },
        {
            path: "/register", // Use a single path for authentication
            element: <Register />,
        },
        {
            path: "/main",
            element: <Main />,
        },
    ]);
    return <div className="App">{element}</div>;
}

export default App;

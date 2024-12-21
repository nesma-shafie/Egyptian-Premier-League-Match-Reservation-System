import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginSignup/LoginSignup";
import MatchDetails from "./Components/MatchDetails/MatchDetails";

import ViewStadium from "./Components/Stadium/ViewStadium/ViewStadium";
import ViewTickets from "./Components/ViewTickets/ViewTickets";
import DeleteUser from "./Components/User/DeleteUser/DeleteUser";
import UserRequest from "./Components/User/Requests/UserRequest";
import Signup from "./Components/Signup/Signup";
import Home from "./Components/Home/Home.jsx";
import Profile from "./Components/ProfilePage/profile.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import CreateUser from "./Components/createUser/createUser.jsx";

function App() {
    const user = (localStorage.getItem("userType") != undefined) ? localStorage.getItem("userType") : "guest";
    if (!user) {
        user = "guest";
    }
    console.log(localStorage.getItem("userType"));
    let links;
    console.log(user);
    switch (user) {
        case "guest":
            links = [
                { path: "/", label: "Home" },
                { path: "/Signup", label: "Signup" },
                { path: "/Signin", label: "Signin" },
            ];
            break;
        case "USER":
            links = [
                { path: "/", label: "Home" },
                { path: "/Profile", label: "Profile" },
                { path: "/Tickets", label: "Tickets" },
            ];
            break;
        case "EFAManager":
            links = [
                { path: "/", label: "Home" },
                { path: "/ViewStadium", label: "ViewStadium" },
            ];
            break;
        case "SiteAdministrator":
            links = [
                { path: "/", label: "Home" },
                { path: "/UserRequest", label: "User Request" },
                { path: "/DeleteUser", label: "Delete User" },
                { path: "/createUser", label: "Create Manager" },
            ];
            break;
    }
    const navbarConfig = {
        logo: "Premier League Matches",
        links: links,
    };

    return ( <
            div className = "App" >
            <
            BrowserRouter >
            <
            Navbar {...navbarConfig }
            /> <
            Routes >
            <
            Route path = "/"
            element = { < Home userType = { user }
                />} / >
                <
                Route path = "/Signup"
                element = { < Signup / > }
                /> <
                Route path = "/Signin"
                element = { < Login / > }
                /> <
                Route path = "/MatchDetails/:matchid"
                element = { < MatchDetails userType = { user }
                    />} / >
                    <
                    Route path = "/Profile"
                    element = { < Profile / > }
                    /> <
                    Route path = "/ViewStadium"
                    element = { < ViewStadium userType = { user }
                        />} / >
                        <
                        Route path = "/Tickets"
                        element = { < ViewTickets / > }
                        /> <
                        Route path = "/UserRequest"
                        element = { < UserRequest / > }
                        /> <
                        Route path = "/DeleteUser"
                        element = { < DeleteUser / > }
                        /> <
                        Route path = "/createUser"
                        element = { < CreateUser / > }
                        /> < /
                        Routes > <
                        /BrowserRouter> < /
                        div >
                    );
                }

                export default App;
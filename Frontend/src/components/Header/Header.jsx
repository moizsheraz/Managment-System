import React from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Header() {
    const navItems = [
        {
            name: "Home",
            route: "/",
            active : true
        }, 
        {
            name: "Profile",
            route: "/profile",
            active : false
        },
        {
            name: "Login",
            route: "/login",
            active : false
        },
        {
            name: "Logout",
            route: "/logout",
            active : false
        },
        {
            name: "Register",
            route: "/register",
            active : false
        }
    ]
    return (
        <div>
            
        </div>
    )
}
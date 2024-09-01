import React from "react";
import Auth_Form from "../components/Auth/Auth_Form";

export default function Register() {
    return (
        <Auth_Form method="signup" endpoint="/api/register/" />
    )
}
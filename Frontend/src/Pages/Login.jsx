import React from "react";
import Auth_Form from "../components/Auth/Auth_Form";

export default function Login() {
    return (
        <Auth_Form method="login" endpoint="/api/token/obtain/" />
    )
}
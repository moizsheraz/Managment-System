import React, {useState} from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword(){
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit= async(e) => {
        e.preventDefault();

        try {
            const response = api.post("api/password-reset/", {email});
            setMessage("Password reset link has been sent to your email");
            setTimeout(() => {
                navigate("/login");
            }, 5000);
        } catch (error) {
            console.log(error);
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2 text-center">Forgot Password</h2>
            <p className="text-center mb-6">Enter your email to reset your password.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-md shadow-lg hover:bg-blue-600 transition duration-200"
                >
                  Reset Password
                </button>
              </div>
            </form>
            {message && (
              <div className="text-center mt-4 text-green-500">
                {message}
              </div>
            )}
          </div>
        </div>
      );
}
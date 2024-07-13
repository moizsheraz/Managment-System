import React, { useState } from "react";
import api from "../../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../varibales";
import { useDispatch } from "react-redux";
import { setAuth } from "../../features/auth/authSlice";
import Loading from "../Loading";

export default function Auth_Form({ method, endpoint }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const name = method === "signup" ? "Register" : "Login";
  const welcomeMessage = method === "signup" ? "Welcome! Please create an account." : "Welcome back! Please login.";
  const switchLink = method === "signup" ? "/login" : "/register";
  const switchLinkText = method === "signup" ? "Already have an account? Login" : "Don't have an account? Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(endpoint, {
        username,
        password
      });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        if (localStorage.getItem(ACCESS_TOKEN)){
          dispatch(setAuth({
            isAuthenticated: true,
            userData: username
          }))
        }
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">{name}</h2>
        <p className="text-center mb-6">{welcomeMessage}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md shadow-lg hover:bg-blue-600 transition duration-200"
            >
              {name}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to={switchLink} className="text-blue-500 hover:underline">
            {switchLinkText}
          </Link>
          {method === "login" && (
            <div className="mt-4">
              <Link to="/forgot-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

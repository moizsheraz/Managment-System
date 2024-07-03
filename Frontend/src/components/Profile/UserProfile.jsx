import React, { useEffect, useState } from "react";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { logout } from "../../features/auth/authSlice";


export default function UserProfile() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        name: "",
        bio: "",
        phone_number: "",
        address: "",
        gender: "",
        profile_pic: ""
    });
    const { id } = useParams();
    const navigate = useNavigate();
    const loggedInUser = useSelector((state) => state.auth.userData);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        api.get(`/api/profile/${id}/`)
            .then((response) => {
                console.log(response.data);
                setUser(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id, loggedInUser, isAuthenticated]);

    const handleUpdate = () => {
        navigate(`/update-profile/${id}`);
    };

    const handleDelete = () => {
        api.delete("api/delete_profile/")
            .then(() => {
                dispatch(logout());
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
                <img
                    src={`http://127.0.0.1:8000${user.profile_pic}` || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-2 border-gray-300"
                />
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">{user.name}</h1>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-800">About</h2>
                <p className="mt-2 text-gray-600">{user.bio}</p>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">{user.email}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">{user.phone_number}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">{user.address}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Gender</h3>
                    <p className="text-gray-600">{user.gender}</p>
                </div>
            </div>
            {loggedInUser === user.username && (
            <div className="mt-8 flex justify-end space-x-4">
                <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
                >
                    Update Profile
                </button>
                 <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition duration-300"
                >
                    Delete Profile
                </button>
            </div>)}
        </div>
    );
}

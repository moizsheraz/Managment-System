import React, { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import FollowUnFollow from "../Followers/FollowUnFollow";

export default function Users() {
    const [users, setUsers] = useState([]);
    const loggedInUser = useSelector((state) => state.auth.userData);

    useEffect(() => {
        api.get('api/get_profiles/')
            .then((response) => {
                setUsers(response.data);
                // console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    console.log(users)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">User Profiles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center space-x-4">
                            <img
                                src={`http://127.0.0.1:8000${user.profile_pic}` || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-16 h-16 rounded-full border-2 border-gray-300"
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                                <p className="text-sm text-gray-500">@{user.username}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-gray-800">Bio</h3>
                            <p className="text-gray-600">{user.bio || "No bio available"}</p>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-md font-semibold text-gray-800">Email</h4>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                            <div>
                                <h4 className="text-md font-semibold text-gray-800">Phone</h4>
                                <p className="text-gray-600">{user.phone_number}</p>
                            </div>
                            <div>
                                <h4 className="text-md font-semibold text-gray-800">Address</h4>
                                <p className="text-gray-600">{user.address}</p>
                            </div>
                            <div>
                                <h4 className="text-md font-semibold text-gray-800">Gender</h4>
                                <p className="text-gray-600">{user.gender}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <Link
                                to={`/profile/${user.id}`}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
                            >
                                View Profile
                            </Link>
                            {loggedInUser && <div>
                                {loggedInUser && loggedInUser === user.username ? null : <FollowUnFollow userId={user.id} />}
                            </div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
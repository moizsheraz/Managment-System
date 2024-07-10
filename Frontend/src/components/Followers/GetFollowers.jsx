import React, { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function GetFollowers({ userId, onClose }) {
    const [followers, setFollowers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get(`api/followers/${userId}/`)
            .then((response) => {
                console.log(response.data)
                setFollowers(response.data)
            })
            .catch((error) => {
                console.log(error)
            })

        api.get('api/get_users/')
            .then((response) => {
                console.log(response.data);
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error)
            })
    }, [userId])

    const getUsername = (followerId) => {
        const user = users.find((user) => user.id === followerId);
        console.log(user)
        return user ? user : "Unknown User";
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Followers</h2>
                <button
                    onClick={onClose}
                    className="absolute right-96 top-52 w-10 text-3xl m-4 text-gray-600 hover:text-gray-800"
                >
                    &times;
                </button>
                <ul>
                    {followers.map((follower) => {
                        const user = getUsername(follower.follower);
                        return (
                            <li key={follower.id} className="py-2 border-b">
                                {user ? (
                                    <Link
                                        to={`/profile/${user.id}`}
                                        className="text-blue-600 hover:underline"
                                        onClick={onClose}
                                    >
                                        {user.username}
                                    </Link>
                                ) : (
                                    "Unknown User"
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
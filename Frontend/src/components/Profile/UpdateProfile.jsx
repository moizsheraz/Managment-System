import React, { useState, useEffect } from "react";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateProfile() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        name: "",
        bio: "",
        phone_number: "",
        address: "",
        gender: "",
        profile_pic: null
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/api/profile/${id}/`)
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setUser((prevState) => ({
            ...prevState,
            profile_pic: e.target.files[0]
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("email", user.email);
        formData.append("name", user.name);
        formData.append("bio", user.bio);
        formData.append("phone_number", user.phone_number);
        formData.append("address", user.address);
        formData.append("gender", user.gender);
        if (user.profile_pic) {
            formData.append("profile_pic", user.profile_pic);
        }

        try {
            await api.put("/api/update_profile/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate(`/profile/${id}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Profile</h2>
            <form onSubmit={handleUpdate}>
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Bio</label>
                    <textarea
                        name="bio"
                        value={user.bio}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={user.phone_number}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Gender</label>
                    <select
                        name="gender"
                        value={user.gender}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Profile Picture</label>
                    <input
                        type="file"
                        name="profile_pic"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
}

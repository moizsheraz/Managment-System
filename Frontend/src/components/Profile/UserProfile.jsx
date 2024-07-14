import React, { useEffect, useState } from "react";
import api from "../../api";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import FollowUnFollow from "../Followers/FollowUnFollow";
import GetFollowers from "../Followers/GetFollowers";
import Loading from "../Loading";

export default function UserProfile() {
    const [loading, setLoading] = useState(false);
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
    const [showFollowersPopup, setShowFollowersPopup] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const loggedInUser = useSelector((state) => state.auth.userData);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        const getProfile = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/profile/${id}/`);
                setUser(response.data);
            } catch (error) {
                console.error("There was an error fetching the profile!", error);
            } finally {
                setLoading(false);
            }
        }
        getProfile();
    }, [id, loggedInUser, isAuthenticated]);

    const handleUpdate = () => {
        navigate(`/update-profile/${id}`);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete("api/delete_profile/")
                .then(() => {
                    dispatch(logout());
                    navigate("/login");
                })
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleShowFollowers = () => {
        setShowFollowersPopup(true);
    };

    const handleCloseFollowersPopup = () => {
        setShowFollowersPopup(false);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
                <img
                    src={`https://full-stack-social-media-wine.vercel.app${user.profile_pic}` || "https://via.placeholder.com/150"}
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
            {loggedInUser === user.username ? (
                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        onClick={handleShowFollowers}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition duration-300"
                    >
                        Show Followers
                    </button>
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
                </div>
            ) : (

                <div className="mt-8 flex justify-end space-x-4">
                    {loggedInUser ? <FollowUnFollow userId={id} /> : null}
                    <button
                        onClick={handleShowFollowers}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition duration-300"
                    >
                        Show Followers
                    </button>
                </div>
            )}
            {showFollowersPopup && <GetFollowers userId={id} onClose={handleCloseFollowersPopup} />}
        </div>
    );

}
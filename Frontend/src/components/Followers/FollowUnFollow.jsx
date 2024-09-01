import React, { useState, useEffect } from "react";
import api from "../../api";
import { useSelector } from "react-redux";

export default function FollowUnFollow({ userId }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [logeedInuserId, setLogeedInuserId] = useState(null)
    const loggedInUser = useSelector((state) => state.auth.userData);


    useEffect(() => {
        if (loggedInUser) {            
            api.get('api/get_users/')
            .then((response) => {
            response.data.forEach(element => {
                if (element.username === loggedInUser) {
                    setLogeedInuserId(element.id)
                }
            });
        })
        .catch((error) => {
            console.log(error)
        })
    }
    }, [loggedInUser])

    useEffect(() => {
        if (logeedInuserId) {
            // get follwoers of user 
        api.get(`api/followers/${userId}/`)
        .then((response) => {
            const data = response.data;
            data.forEach(element => {
                if (element.follower === logeedInuserId) {
                    setIsFollowing(true)
                }
            });
        })
        .catch((error) => {
            console.log(error)
        })
        }
    }, [userId, logeedInuserId])


    const handleFollow = () => {
        api.post('api/follow/', {following_id: userId})
        .then(() => {
            setIsFollowing(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const handleUnfollow = () => {
        api.delete("api/unfollow/", {data: {following_id:userId}})
        .then(() => {
            setIsFollowing(false)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`px-4 py-2 rounded-lg shadow transition duration-300 ${
                isFollowing ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </button>
    );
}
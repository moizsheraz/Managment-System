import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import api from "../../api";

export default function UpdatePostRoute({ children, component }) {
    const [posts, setPosts] = useState(null);
    const [users, setUsers] = useState(null);
    const loggedInUser = useSelector((state) => state.auth.userData);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch post
                const postResponse = await api.get(`api/get_post/${id}/`);
                setPosts(postResponse.data);

                // Fetch users
                const usersResponse = await api.get('/api/get_users/');
                const userData = {};
                usersResponse.data.forEach(user => {
                    userData[user.id] = user.username;
                });
                setUsers(userData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [id]);

    if (!posts || !users || !loggedInUser) {
        return null; 
    }

    const post_author_id = posts.author;
    const post_author_username = users[post_author_id];

    if (loggedInUser) {
        if (component === "create") {
            return children;
        } 
        else if (component === "update" && post_author_username === loggedInUser) {
            return children;
        } 
        else {
            return <Navigate to="/" />;
        }
    } 
    else {
        return <Navigate to="/login" />;
    }
}

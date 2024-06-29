import React, { useState, useEffect } from "react";
import api from "../api";

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        // fetch posts
        api.get('/api/get_posts/')
            .then((response) => {
                console.log(response.data);
                setPosts(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        // fetch users
        api.get('/api/get_users/')
            .then((response) => {
                const userData = {};
                response.data.forEach(user => {
                    userData[user.id] = user.username;
                });
                setUsers(userData);
            })
            .catch((error) => {
                console.log(error);
            });

        // fetch tags
        api.get("/api/get_tags/")
            .then((response) => {
                const tagsData = {};
                response.data.forEach(post_tag => {
                    tagsData[post_tag.id] = post_tag.tag;
                });
                setTags(tagsData);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Posts</h1>
            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto">
                        <div className="flex items-center mb-4">
                            <img src="https://via.placeholder.com/40" alt="User avatar" className="rounded-full h-12 w-12 mr-4" />
                            <div>
                                <p className="text-lg font-semibold">{users[post.author]} is feeling {tags[post.tag]}</p>
                                <p className="text-sm text-gray-500">{new Date(post.date_posted).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{post.caption}</h2>
                        {post.image ? (
                            <img src={`http://127.0.0.1:8000${post.image}`} alt={post.caption} className="rounded-lg mb-4 w-full object-cover h-96" />
                        ) : null}
                        <div className="mt-4 flex justify-end">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                                Like
                            </button>
                            <button className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200">
                                Comment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

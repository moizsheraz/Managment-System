import React, { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Posts({posts}) {
    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);
    const [menuVisible, setMenuVisible] = useState({});

    const loggedInUser = useSelector((state) => state.auth.userData);

    useEffect(() => {
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

    const handleDelete = async (id) => {
        try {
            await api.delete(`api/delete_post/${id}/`);
            const newPosts = posts.filter(post => post.id !== id);
            setPosts(newPosts);
        } catch (error) {
            console.error("There was an error deleting the post!", error);
        }
    };

    const toggleMenu = (id) => {
        setMenuVisible(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Posts</h1>
            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto relative">
                        <div className="flex items-center mb-4">
                            <img src="https://via.placeholder.com/40" alt="User avatar" className="rounded-full h-12 w-12 mr-4" />
                            <div>
                                <p className="text-lg font-semibold">
                                    <Link to={`/profile/${post.author}`} className="text-blue-500 hover:underline">
                                        {users[post.author]}
                                    </Link> is feeling {tags[post.tag]}
                                </p>
                                <p className="text-sm text-gray-500">{new Date(post.date_posted).toLocaleDateString()}</p>
                            </div>
                            {loggedInUser === users[post.author] && (
                                <div className="ml-auto relative">
                                    <button onClick={() => toggleMenu(post.id)} className="text-black text-2xl hover:text-gray-700">
                                        &#x22EE;
                                    </button>
                                    {menuVisible[post.id] && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border text-center rounded-lg shadow-lg z-10">
                                            <Link to={`/update_post/${post.id}`} className="rounded-md block px-4 mb-1 py-2 text-white hover:bg-blue-700 bg-blue-600">
                                                Update Post
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="rounded-md block w-full text-center px-4 py-2 text-white hover:bg-red-700 bg-red-600"
                                            >
                                                Delete Post
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
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

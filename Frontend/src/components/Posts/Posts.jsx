import React, { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Comment from "./Comment";
import Loading from "../Loading";

export default function Posts({ posts }) {
    const [users, setUsers] = useState({});
    const [userPic, setUserPic] = useState({});
    const [initialPosts, setInitialPosts] = useState(posts);
    const [tags, setTags] = useState({});
    const [menuVisible, setMenuVisible] = useState({});
    const [likedPosts, setLikedPosts] = useState([]);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [selectedPostLikes, setSelectedPostLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const loggedInUser = useSelector((state) => state.auth.userData);

    // Fetch liked posts
    const get_likes = async () => {
        api.get("/api/liked_posts/")
            .then((response) => {
                setLikedPosts(response.data.liked_posts);
                // console.log(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        setLoading(true); 
        const fetchData = async () => {
            try {
                // Fetch users
                const userResponse = await api.get('/api/get_users/');
                const userData = {};
                const userPics = {};
                userResponse.data.forEach(user => {
                    userData[user.id] = user.username;
                    userPics[user.id] = user.profile_pic
                });
                setUsers(userData);
                setUserPic(userPics);

                // Fetch tags
                const tagsResponse = await api.get("/api/get_tags/");
                const tagsData = {};
                tagsResponse.data.forEach(post_tag => {
                    tagsData[post_tag.id] = post_tag.tag;
                });
                setTags(tagsData);

                // Fetch liked posts
                await get_likes();
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [initialPosts]);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await api.delete(`api/delete_post/${id}/`);
            // posts = posts.filter(post => post.id !== id);
        } catch (error) {
            console.error("There was an error deleting the post!", error);
        }
        finally{
            setLoading(false);
        }
    };

    const toggleMenu = (id) => {
        setMenuVisible(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const handleLike = async (postId) => {
        try {
            await api.post(`/api/like/${postId}/`);
            get_likes();
        } catch (error) {
            console.error("There was an error liking the post!", error);
        }
    };

    const handleUnlike = async (postId) => {
        try {
            await api.delete(`/api/unlike/${postId}/`);
            get_likes();
        } catch (error) {
            console.error("There was an error unliking the post!", error);
        }
    };

    const handleShowLikes = (likes) => {
        setSelectedPostLikes(likes);
        setShowLikesModal(true);
    };

    const handleCloseLikes = () => {
        setShowLikesModal(false);
        setSelectedPostLikes([]);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Posts</h1>
            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto relative">
                        <div className="flex items-center mb-4">
                            <img
                                src={`https://full-stack-social-media-wine.vercel.app${userPic[post.author]}`}
                                alt="User avatar"
                                className="rounded-full h-12 w-12 mr-4"
                            />
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
                            <img src={`https://full-stack-social-media-wine.vercel.app${post.image}`} alt={post.caption} className="rounded-lg mb-4 w-full object-cover h-96" />
                        ) : null}
                        {loggedInUser && (
                            <div className="mt-4 flex justify-end">
                                {likedPosts.includes(post.id) ? (
                                    <button
                                        onClick={() => handleUnlike(post.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                                    >
                                        Unlike
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                                    >
                                        Like
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="mt-4">
                            <button
                                onClick={() => handleShowLikes(post.likes)}
                                className="text-blue-500 hover:underline"
                            >
                                {post.likes.length} Likes
                            </button>
                        </div>
                        <Comment postId={post.id} />
                    </div>
                ))}
            </div>

            {showLikesModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Likes</h2>
                        <ul className="space-y-2">
                            {selectedPostLikes.map(userId => (
                                <li key={userId}>
                                    <Link to={`/profile/${userId}`} className="text-blue-500 hover:underline">
                                        {users[userId]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleCloseLikes}
                            className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

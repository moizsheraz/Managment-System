import React, { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../Loading";

export default function Comment({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);
    const loggedInUser = useSelector((state) => state.auth.userData);

    const fetchComment = async () => {
        setLoading(true)
        try {
        const response = await api.get(`/comment/post/${postId}/`);
        setComments(response.data);
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        if (showComments) {
            fetchComment();
        }
    }, [postId, showComments]);

    const handleAddComment = async () => {
        setLoading(true);
        try {
            const response = await api.post(`/comment/post/${postId}/`, { c_text: newComment });
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("There was an error adding the comment!", error);
        }
        finally{
            setLoading(false)
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };
    
    return (
        <div className="mt-4">
            <button
                onClick={toggleComments}
                className="text-blue-500 hover:underline"
            >
                {showComments ? "Hide Comments" : "Show Comments"}
            </button>
            {showComments && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">Comments</h3>
                    {loading ? <Loading/>  : <div className="space-y-4">
                        {comments.map(comment => (
                            <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <Link to={`/profile/${comment.c_auther}`} className="text-blue-500 hover:underline">
                                        {comment.c_auther_username}
                                    </Link>
                                </p>
                                <p>{comment.c_text}</p>
                            </div>
                        ))}
                    </div>}
                    {loggedInUser && (
                        <div className="mt-4">
                            <textarea
                                className="w-full p-2 border rounded-lg"
                                rows="3"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                onClick={handleAddComment} 
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Add Comment
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

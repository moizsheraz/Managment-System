import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Loading";

export default function Post_Form() {
    const [caption, setCaption] = useState("");
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        const fetchTags = async () => {
            setLoading(true);
            try {
                const response = await api.get("api/get_tags/");
                setTags(response.data);
            } catch (error) {
                console.error("There was an error fetching the tags!", error);
            }
            finally{
                setLoading(false);
            }
        };

        const fetchPost = async (e) => {
            setLoading(true);
            if (id) {
                try {
                    const response = await api.get(`api/get_post/${id}/`);
                    const { caption, tag, image } = response.data;
                    setCaption(caption);
                    setSelectedTag(tag);
                    // console.log(selectedTag);
                    // if (image) {
                    //     console.log(image);
                    //     setImage(image);
                    // }

                } catch (error) {
                    console.error("There was an error fetching the post!", error);
                }
                finally{
                    setLoading(false);
                }
            }
        }
        fetchTags();
        fetchPost();
    }, [id])

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("tag", selectedTag);

        if (image) {
            // console.log(image);
            formData.append("image", image);
        }
        try {
            const response = id ? await api.put(`api/update_post/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

                : await api.post("api/create_post/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })

            if (response.status === 201 || response.status === 200) {
                navigate("/")
            }
        }
        catch (error) {
            console.error(`There was an error ${id ? "updating" : "creating"} the post!`, error);
        }
        finally{
            setLoading(false);
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Caption</label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        rows="3"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tag</label>
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="" disabled>Select a tag</option>
                        {tags.map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.tag}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
                    >
                        {id ? "Update Post" : "Create Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}
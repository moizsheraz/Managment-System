import React, {useState, useEffect} from "react";
import UserProfile from "../components/Profile/UserProfile";
import Posts from "../components/Posts/Posts";
import api from "../api";
import { useParams } from "react-router-dom";

export default function Profile(){
    const [posts, setPosts] = useState([]);
    const {id} = useParams();
    useEffect(() => {
        api.get('/api/get_posts/')
        .then((response) => {
            const userPosts = response.data.filter(post => post.author === parseInt(id));
            setPosts(userPosts);
        }).catch((error) => {
            console.log(error);
        });
    }, [])
    return (
        <>
        <UserProfile/>
        <Posts posts={posts}/>
        </>
    )
}
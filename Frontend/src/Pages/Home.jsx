import React, {useEffect, useState} from "react";
import Posts from "../components/Posts/Posts";
import api from "../api";
import { useSelector } from "react-redux";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const loggedInUser = useSelector((state) => state.auth.userData);
    useEffect(() => {
        if (loggedInUser) {
            api.get('api/get_followed_posts/')
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
        } 
        else{
            api.get('/api/get_posts/')
            .then((response) => {
            setPosts(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }
    }, [])
    // console.log(posts)
    return (
        <>
        <Posts posts={posts}/>
        </>
    )
}
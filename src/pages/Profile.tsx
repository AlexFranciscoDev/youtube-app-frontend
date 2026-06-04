import { useState, useEffect } from "react";


type User = {
    id: string,
    username: string,
    email: string,
    image: string,
    createdAt: string
}

// Can display, logged in profile or other profile
export const Profile = () => {
    const token = localStorage.getItem("token");
    const [user, setUser] = useState({});
    
    useEffect(() => {
        getUserData();
    }, [])
    
    // Get user profile data
    const getUserData = async () => {
        const url = "http://localhost:3000/api/user/profile/69c72052149f5d3efb2710ff";
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ?? ''
                }
            });
            const data = await response.json();
            setUser({
                user: data.user.username,
                email: data.user.email,
                image: data.user.image
            });
        } catch(error) {
            console.log(error.message);
        }
    }
    
    return (
        <>
        <h1>This is the profile component</h1>
        <p>{user.username}</p>
        <p>{user.email}</p>
        </>
    )
}
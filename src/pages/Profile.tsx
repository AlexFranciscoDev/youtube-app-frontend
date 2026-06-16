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
    const [user, setUser] = useState<Partial<User>>({});

    useEffect(() => {
        const getUserData = async () => {
            // TODO: RECOGER ID DE PARÁMETROS
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
                    username: data.user.username,
                    email: data.user.email,
                    image: data.user.image
                });
            } catch(error) {
                if (error instanceof Error) console.log(error.message);
            }
        }
        getUserData();
    }, [token])

    return (
        <>
        <h1>This is the profile component</h1>
        <p>{user.username}</p>
        <p>{user.email}</p>
        </>
    )
}
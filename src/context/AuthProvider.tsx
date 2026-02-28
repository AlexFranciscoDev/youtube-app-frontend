import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    
    const login = (name:string , email:string) => {
        setIsLoggedIn(true);
        setUser({
            id: "1",
            name,
            email
        })
    }

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

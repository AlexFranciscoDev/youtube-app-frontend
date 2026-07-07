import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import {useNavigate } from "react-router-dom";

interface AuthProviderProps {
    children: ReactNode;
}   

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem("user");
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        if (parsed._id && !parsed.id) parsed.id = parsed._id;
        return parsed;
    });
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem("token"));

    const login = (rawUser: User & { _id?: string; password?: string }, token: string) => {
        const { password: _, _id, ...rest } = rawUser;
        const safeUser: User = { ...rest, id: _id ?? rest.id };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(safeUser));
        setIsLoggedIn(true);
        setUser(safeUser);
        setToken(token);
    }

    const logout = () => {  
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
        navigate("/login");
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, token}}>
            {children}
        </AuthContext.Provider>
    )
}

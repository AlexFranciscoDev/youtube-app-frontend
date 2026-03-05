import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem("token"));

    const login = (rawUser: User & { password?: string }, token: string) => {
        const { password: _, ...safeUser } = rawUser;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(safeUser));
        setIsLoggedIn(true);
        setUser(safeUser as User);
        setToken(token);
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, token}}>
            {children}
        </AuthContext.Provider>
    )
}

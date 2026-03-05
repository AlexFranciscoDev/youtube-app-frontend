import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    
    const login = (user: User, token: string) => {
        setIsLoggedIn(true);
        setUser(user);
        setToken(token);
    }

    const logout = () => {
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

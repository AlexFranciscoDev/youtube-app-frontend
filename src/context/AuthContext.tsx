import { createContext, useContext } from "react";

// Define user data
export interface User {
    id: string;
    username: string;
    email: string;
    image?: string
}

// Define Context content (the box)
interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null; 
    login: (user: User, token: string) => void;
    logout: () => void; 
    token: string | null;
}

// Define the context (empty box)
// AuthContextType defines what kind of data will be inside
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create hook useAuth() to access the box
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth should be used inside AuthProvider");
    }
    return context
}
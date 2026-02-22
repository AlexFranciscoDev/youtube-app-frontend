import { createContext, useContext } from "react";

// Define user data
interface User {
    id: string;
    name: string;
    email: string;
}

// Define Context content (the box)
interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null; // user data or null if ders no user logged in
    login: (name: string, email: string) => void; // Receives name and email, and returns nothing (void)
    logout: () => void; // No parameters and return nothing
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
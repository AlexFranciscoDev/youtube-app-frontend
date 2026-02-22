import React from 'react';
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
    children?: ReactNode;
}

export const Header = () => {
    const { isLoggedIn, user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-content">
                <h1>Video Organizer</h1>
            </div>
            <nav className="nav">
                { !isLoggedIn ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ):
                (
                    <>
                    <span>Hola, {user?.name}</span>
                    <Link to="/profile">Perfil</Link>
                    <button>
                        Logout
                    </button>
                    </>
                )}
            </nav>
        </header>
    )
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { GlobalUploads } from "../helpers/Global";
import "../assets/css/header.css";

export const Header = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className='header'>
            <div className="layout-container mx-auto flex justify-between items-center p-5">
                <div className="header-content flex flex-col gap-1">
                    <h1 className='text-3xl font-bold'><Link to='/'>Video Organizer</Link></h1>
                    <span>Organize and manage your videos</span>
                </div>

                {/* Desktop nav */}
                <nav className="hidden sm:block">
                    {!isLoggedIn ? (
                        <div className='flex gap-5'>
                            <Link to="/login"><button>Login</button></Link>
                            <Link to="/register"><button>Register</button></Link>
                        </div>
                    ) : (
                        <div className='flex gap-5 items-center'>
                            <Link to="/upload">Add video</Link>
                            <Link to={`/profile/${user?.id}`}>@{user?.username}</Link>
                            <Link to={`/profile/${user?.id}`}>
                                <img src={GlobalUploads.url + "others/" + user?.image} alt="profile_picture" className="w-13 h-13 object-cover rounded-full"/>
                            </Link>
                            <button onClick={logout}>Logout</button>
                        </div>
                    )}
                </nav>

                {/* Hamburger button (mobile only) */}
                <button
                    className="sm:hidden header-hamburger"
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} size="lg" />
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="sm:hidden header-mobile-menu">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" onClick={closeMenu}>Login</Link>
                            <Link to="/register" onClick={closeMenu}>Register</Link>
                        </>
                    ) : (
                        <>
                            <div className="header-mobile-user">
                                <Link to={`/profile/${user?.id}`} onClick={closeMenu}>
                                <img src={GlobalUploads.url + "others/" + user?.image} alt="profile_picture" className="w-12 h-12 object-cover rounded-full"/>
                                <span>@{user?.username}</span>
                                </Link>
                            </div>
                            <Link to="/upload" onClick={closeMenu}>Add video</Link>
                            <Link to={`/profile/${user?.id}`} onClick={closeMenu}>My profile</Link>
                            <button onClick={() => { closeMenu(); logout(); }}>Logout</button>
                        </>
                    )}
                </div>
            )}
        </header>
    )
}

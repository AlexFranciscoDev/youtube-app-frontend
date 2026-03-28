import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GlobalUploads } from "../helpers/Global";

export const Header = () => {
    const { isLoggedIn, user, logout } = useAuth();
    //devuelconsole.log(user.image);

    return (
        <header className='header bg-[var(--background-card)]'>
            <div className=" layout-container mx-auto flex flex-col justify-between items-center p-5 sm:flex-row">
                <div className="header-content flex flex-col gap-2">
                    <h1 className='text-3xl font-bold'>Video Organizer</h1>
                    <span className=''>Organize and manage your videos</span>
                </div>
                <nav className="nav pt-3 md:pt-0">
                    {!isLoggedIn ? (
                        <div className='flex gap-5'>
                            <Link to="/login"><button>Login</button></Link>
                            <Link to="/register"><button>Register</button></Link>
                        </div>
                    ) :
                        (
                            <div className='flex gap-5 justify-center items-center'>
                                {/* <span>Hola,{user?.name}</span> */}
                                <Link to="/profile">Perfil</Link>
                                <span>@{user?.username}</span>
                                <img src={GlobalUploads.url + "others/" + user?.image} alt="profile_picture" className="w-13 h-13 object-cover rounded-full"/>
                                <button onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        )}
                </nav>
            </div>
        </header>
    )
}

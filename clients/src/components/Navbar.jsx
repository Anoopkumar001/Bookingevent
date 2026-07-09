import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                            E
                        </div>

                        <div className="flex flex-col leading-none">
                            <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                                EventBooking
                            </span>

                            <span className="text-[11px] text-gray-500 tracking-[4px] uppercase mt-1">
                                Events & Tickets
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">

                        <Link
                            to="/"
                            className="text-gray-700 hover:text-violet-600 font-medium transition duration-300"
                        >
                            Events
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className="text-gray-700 hover:text-violet-600 font-medium transition duration-300"
                                >
                                    Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-violet-600 font-medium transition duration-300"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold shadow-lg hover:scale-105 transition duration-300"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
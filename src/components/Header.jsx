import { Link } from "react-router-dom";
import {
    RiPulseLine,
    RiStethoscopeLine,
    RiGroupLine,
    RiBookOpenLine,
    RiChat4Line,
    RiLoginBoxLine,
    RiUserLine,
    RiSettings3Line,
    RiLogoutBoxRLine,
    RiAddLine,
    RiHeart3Line
} from "react-icons/ri";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";


export default function Header() {

    const { user, loading, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    console.log({ user })

    return (
        <header className="w-full bg-white shadow-sm border-b border-gray-100 py-3 px-6">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-3 rounded-2xl flex items-center justify-center">
                        <RiPulseLine size={24} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-extrabold text-gray-950 tracking-tight leading-none">
                            MED 24
                        </h1>
                        <span className="text-xs text-gray-500 mt-1 font-medium">
                            Atención médica 24/7
                        </span>
                    </div>
                </div>

                <nav>
                    <ul className="flex items-center gap-3 text-gray-600 font-semibold text-sm">
                        <li>
                            <a href="/" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 transition-colors">
                                <RiPulseLine size={20} />
                                Inicio
                            </a>
                        </li>

                        <li>
                            <a href="/services" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                                <RiStethoscopeLine size={20} />
                                Servicios
                            </a>
                        </li>
                        <li>
                            <a href="/team" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                                <RiGroupLine size={20} />
                                Equipo e Investigación
                            </a>
                        </li>
                        <li>
                            <a href="/guides" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                                <RiBookOpenLine size={20} />
                                Guías Médicas
                            </a>
                        </li>
                        <li>
                            <Link to="/chat" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                                <RiChat4Line size={20} />
                                Chat IA
                            </Link>
                        </li>
                    </ul>
                </nav>
                {loading ? (
                    <div className="h-10 w-10 bg-gray-100 animate-pulse rounded-full"></div>
                ) : (
                    <div className="relative">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200 shadow-md shadow-blue-100 hover:scale-105 hover:border-blue-300 transition-all duration-200 shrink-0 flex items-center justify-center bg-blue-100"
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={`${user.avatar_url}?t=${Date.now()}`}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <RiUserLine size={22} className="text-blue-600" />
                                    )}
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                                        <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <RiSettings3Line size={18} className="text-gray-400" />
                                            Mi cuenta
                                        </Link>
                                        <Link to="/favorites" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                            <RiHeart3Line size={18} className="text-gray-400" />
                                            Mis favoritos
                                        </Link>
                                        {user?.role === "doctor" && (
                                            <Link
                                                to="/create-guide"
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <RiAddLine size={20} className="text-gray-400" />
                                                Crear guía
                                            </Link>
                                        )}
                                        <div className="h-[1px] bg-gray-100 my-1 mx-4"></div>
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                logout();
                                                window.location.href = "/";
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <RiLogoutBoxRLine size={18} />
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-colors"
                                >
                                    <RiLoginBoxLine size={20} />
                                    Iniciar sesión
                                </Link>
                                <Link to="/register" className="flex items-center gap-2.5 px-6 py-3.5 bg-white text-blue-600 border border-blue-600 rounded-2xl text-sm font-bold hover:bg-blue-100 transition-colors">
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
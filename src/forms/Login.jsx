import { RiPulseLine, RiMailLine, RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Login() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false)
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(email, password);
            navigate("/chat");
        } catch (err) {
            console.error(err.message);
            setError(true)
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col items-center justify-center p-4">

            <div className="flex flex-col items-center mb-10 text-center">
                <div className="bg-[#1d4ed8] text-white p-4 rounded-3xl flex items-center justify-center shadow-lg mb-6">
                    <RiPulseLine size={40} />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-950 tracking-tighter mb-2">
                    Iniciar Sesión
                </h1>
                <p className="text-base text-gray-600 font-medium">
                    Accede a tu cuenta de MED 24
                </p>
            </div>

            <div className="w-full max-w-[480px] space-y-6">

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-800">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <RiMailLine size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    setError(false)
                                }} 
                                placeholder="tu@email.com"
                                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-950 placeholder:text-gray-400 focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-800">
                            Contraseña
                        </label>
                        <div className="relative">
                            <RiLockPasswordLine size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="........"
                                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-950 placeholder:text-gray-400 focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] outline-none transition-all font-mono"
                            />
                        </div>
                    </div>
                    {error && (
                        <div className="text-sm text-red-500">
                            Correo o contraseña invalidos
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-4 bg-[#1d4ed8] text-white rounded-2xl text-base font-semibold hover:bg-[#1e40af] transition-colors shadow-sm"
                    >
                        Iniciar sesión
                    </button>
                </form>

                <div className="text-center pt-4">
                    <a href="#" className="text-sm font-semibold text-[#2563eb] hover:underline transition-colors">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    );
}

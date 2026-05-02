import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiMailLine, RiLockPasswordLine, RiUser3Line, RiCheckboxCircleLine } from "react-icons/ri"; // Agregué un icono de éxito
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false); // <--- Nuevo estado

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            await register(email, password);
            setIsRegistered(true); // <--- Activamos el mensaje de éxito
        } catch (err) {
            setError("Error al registrar: " + (err.message || "Inténtalo de nuevo"));
        } finally {
            setLoading(false);
        }
    };

    // Si el registro fue exitoso, mostramos este "View" en lugar del formulario
    if (isRegistered) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] px-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
                    <RiCheckboxCircleLine className="text-6xl text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">¡Casi listo!</h2>
                    <p className="text-gray-600 mb-6">
                        Hemos enviado un enlace de confirmación a <br />
                        <span className="font-semibold text-blue-600">{email}</span>.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para activar tu cuenta.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        Ir al Inicio de Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] px-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Crear cuenta</h2>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... (tus inputs de email, password y confirmPassword se quedan igual) ... */}
                    
                    <div className="relative">
                        <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="relative">
                        <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="relative">
                        <RiUser3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>

                <p className="text-sm text-center mt-4">
                    ¿Ya tienes cuenta?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    >
                        Inicia sesión
                    </span>
                </p>
            </div>
        </div>
    );
}
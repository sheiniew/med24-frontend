import React, { useState, useEffect } from 'react';
import {
    LuHeart, LuArrowLeft, LuBookOpen, LuTrash2, LuX,
    LuActivity, LuInfo, LuHouse, LuCircleAlert, LuShieldCheck
} from "react-icons/lu";
import { Link } from 'react-router-dom';
import ModalGuideDetail from './components/ModalGuideDetail';

const Favorites = () => {
    const [favoriteGuides, setFavoriteGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGuide, setSelectedGuide] = useState(null); // Estado para la modal

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/favorites/details`, {
                credentials: "include"
            });
            const data = await res.json();

            if (res.ok) {
                const normalized = data.map(item => {
                    const guide = item.medical_guides || item;

                    return {
                        ...guide,
                        content: typeof guide.content === "string"
                            ? JSON.parse(guide.content)
                            : (guide.content || {})
                    };
                });
                setFavoriteGuides(normalized);
            }
        } catch (err) {
            console.error("Error al cargar favoritos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const removeFavorite = async (e, guideId) => {
        e.stopPropagation();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/favorites/toggle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ guide_id: guideId })
            });

            if (res.ok) {
                setFavoriteGuides(prev => prev.filter(g => g.id !== guideId));
            }
        } catch (err) {
            console.error("Error al eliminar:", err);
        }
    };

    // Helper para los colores de urgencia (mismos que en Guide.jsx)
    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando tus favoritos...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <LuHeart className="text-red-500 fill-red-500" />
                            Mis Guías Favoritas
                        </h1>
                    </div>
                    <Link to="/guides" className="flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                        <LuArrowLeft size={18} /> Volver
                    </Link>
                </div>

                {/* Lista de Favoritos */}
                <div className="grid gap-4">
                    {favoriteGuides.map(guide => (
                        <div
                            key={guide.id}
                            onClick={() => setSelectedGuide(guide)} // Abre la modal
                            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-blue-200 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                    <LuBookOpen size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{guide.title}</h3>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getUrgencyColor(guide.urgency)}`}>
                                        {guide.urgency}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={(e) => removeFavorite(e, guide.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <LuTrash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* --- MODAL (Copiada de Guide.jsx) --- */}
                {selectedGuide && (
                   <ModalGuideDetail selectedGuide={selectedGuide} setSelectedGuide={setSelectedGuide}/>
                )}
            </div>
        </div>
    );
};

// Reutilizamos el componente Section
function Section({ title, items, icon: Icon, accentColor }) {
    const colors = {
        rose: "bg-rose-100 text-rose-600",
        blue: "bg-blue-100 text-blue-600",
        amber: "bg-amber-100 text-amber-700",
        emerald: "bg-emerald-100 text-emerald-600"
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${colors[accentColor]}`}>
                    <Icon size={20} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            </div>
            <div className="grid gap-3 pl-2">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                        <p className="text-slate-600 text-sm">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorites;
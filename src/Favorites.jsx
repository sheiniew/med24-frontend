import React, { useState, useEffect } from 'react';
import {
    LuHeart, LuArrowLeft, LuBookOpen, LuTrash2, LuX,
    LuActivity, LuInfo, LuHouse, LuCircleAlert, LuShieldCheck, LuSearch
} from "react-icons/lu";
import { Link } from 'react-router-dom';
import ModalGuideDetail from './components/MedicalGuideDetail';
import { getUrgencyColor, getUrgencyText } from './components/Utils';
import { SkeletonFavoriteItem } from './components/Skeleton';
import NavBack from './components/NavBack';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
    const [favoriteGuides, setFavoriteGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const navigate = useNavigate()

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_LOCAL}/doctors/favorites/details`, {
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
            const res = await fetch(`${import.meta.env.VITE_API_LOCAL}/doctors/favorites/toggle`, {
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
                <NavBack/>
            <div className="max-w-5xl mx-auto">
                <div className='mb-5'>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tighter">
                        <LuHeart className="text-black fill-black" />
                        MIS FAVORITOS
                    </h1>
                    <p className="text-slate-500 font-medium">Guías médicas guardadas para acceso rápido</p>
                </div>
                <div className="grid gap-4">
                    {loading ? (
                        <>
                            <SkeletonFavoriteItem />
                            <SkeletonFavoriteItem />
                            <SkeletonFavoriteItem />
                            <SkeletonFavoriteItem />
                        </>
                    ) : favoriteGuides.length > 0 ? (
                        favoriteGuides.map(guide => (
                            <div
                                key={guide.id}
                                onClick={() => navigate(`/guide-detail/${guide.id}`)}
                                className="group bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                                        <LuBookOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {guide.title}
                                        </h3>
                                        <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg ${getUrgencyColor(guide.urgency)}`}>
                                            {getUrgencyText(guide.urgency)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => removeFavorite(e, guide.id)}
                                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                    title="Quitar de favoritos"
                                >
                                    <LuTrash2 size={20} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-16 flex flex-col items-center text-center space-y-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                <LuHeart size={48} strokeWidth={1} />
                            </div>
                            <div className="max-w-xs">
                                <h3 className="text-xl font-black text-slate-900 mb-2">Tu lista está vacía</h3>
                                <p className="text-slate-500 font-medium">
                                    Aún no tienes guías guardadas. Explora nuestro catálogo y presiona el corazón para verlas aquí.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate("/guides")}
                                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all active:scale-95"
                            >
                                <LuSearch size={20} />
                                Explorar Guías
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Favorites;
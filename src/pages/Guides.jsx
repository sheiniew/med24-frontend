import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  LuX, LuActivity, LuShieldCheck, LuChevronRight, LuInfo, LuBookOpen, LuHeart, LuShield, LuStar, LuHouse, LuCircleAlert, LuSearch, LuFilter
} from "react-icons/lu";
import { SkeletonGuidesList } from "../components/Skeleton";
import ModalGuideDetail from '../components/MedicalGuideDetail';
import { getUrgencyColor, getUrgencyText } from "../components/Utils"
import ChatShortcut from '../components/ChatShortcut';

const MedicalGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_LOCAL}/doctors/guides`)
      .then(res => res.json())
      .then(data => {
        const normalized = data.map(g => ({
          ...g,
          content:
            typeof g.content === "string"
              ? JSON.parse(g.content)
              : g.content || {}
        }));

        setGuides(normalized);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`${import.meta.env.VITE_API_LOCAL}/doctors/favorites/ids`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFavorites(data);
        } else if (data && Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
        } else {
          setFavorites([])
        }
      })
      .catch(err => {
        console.log("Error cargando favoritos", err);
        setFavorites([])
      });
  }, []);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || guide.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'all' || guide.urgency === selectedUrgency;

    const matchesFavorites = !showOnlyFavorites || favorites.includes(guide.id);

    return matchesSearch && matchesCategory && matchesUrgency && matchesFavorites;
  });

  const toggleFavorite = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_LOCAL}/doctors/favorites/toggle`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guide_id: id })
      });

      const data = await res.json();

      if (res.ok) {
        setFavorites(prev =>
          data.active ? [...prev, id] : prev.filter(favId => favId !== id)
        );
      }
    } catch (err) {
      console.error("No se pudo guardar el favorito", err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <header className="bg-white border-b border-gray-200 py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
            <LuBookOpen className="text-indigo-600" />
            Biblioteca de Salud
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Protocolos de actuación y guías preventivas redactadas por expertos para tu tranquilidad.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            { t: "Fuentes Médicas", d: "Información verificada por especialistas.", i: <LuShieldCheck size={24} /> },
            { t: "Primeros Auxilios", d: "Guías rápidas para situaciones críticas.", i: <LuCircleAlert size={24} /> },
            { t: "Guardado Local", d: "Accede a tus guías favoritas siempre.", i: <LuBookOpen size={24} /> }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group">
              <div className="text-indigo-600 mb-3 transform group-hover:rotate-12 transition-transform">
                {item.i}
              </div>
              <h3 className="font-bold text-gray-800">{item.t}</h3>
              <p className="text-sm text-gray-500 mt-1 font-medium">{item.d}</p>
            </div>
          ))}
        </div>

        <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 mb-10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                placeholder="Buscar por síntoma o enfermedad..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all font-medium"
              />
            </div>

            <div className="flex flex-wrap md:flex-nowrap gap-3">
              <div className="relative">
                <LuFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  placeholder="Categoría..."
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 font-medium text-sm w-full md:w-44"
                />
              </div>

              <select
                value={selectedUrgency}
                onChange={e => setSelectedUrgency(e.target.value)}
                className="px-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 font-bold text-sm text-gray-600 cursor-pointer"
              >
                <option value="all">Cualquier Urgencia</option>
                <option value="low">Urgencia: Baja</option>
                <option value="medium">Urgencia: Media</option>
                <option value="high">Urgencia: Alta</option>
              </select>

              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border-2 transition-all font-black text-sm active:scale-95 ${showOnlyFavorites
                    ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm shadow-rose-100"
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                  }`}
              >
                <LuHeart className={showOnlyFavorites ? "fill-rose-600" : ""} size={18} />
                <span className="hidden sm:inline">{showOnlyFavorites ? "Favoritos activos" : "Ver favoritos"}</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <SkeletonGuidesList />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map(guide => (
              <div
                key={guide.id}
                className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border ${getUrgencyColor(guide.urgency)}`}>
                      {getUrgencyText(guide.urgency)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(guide.id); }}
                      className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                    >
                      <LuHeart
                        className={`transition-all duration-300 ${favorites.includes(guide.id)
                            ? "text-rose-500 fill-rose-500 scale-125"
                            : "text-gray-300 hover:text-rose-400"
                          }`}
                        size={22}
                      />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 font-medium">
                    {guide.description}
                  </p>

                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black bg-indigo-50 text-indigo-600 uppercase tracking-tighter">
                    {guide.category}
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 border-t border-gray-100">
                  <Link
                    to={`/guide-detail/${guide.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 py-2.5 rounded-xl text-sm font-black hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95"
                  >
                    Leer Guía Completa <LuChevronRight size={18} />
                  </Link>
                </div>
              </div>
            ))}

            {filteredGuides.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <LuSearch size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Sin resultados</h3>
                <p className="text-gray-400 font-medium">No encontramos guías médicas que coincidan con tu búsqueda.</p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory(""); setSelectedUrgency("all"); setShowOnlyFavorites(false); }}
                  className="mt-4 text-indigo-600 font-black hover:underline"
                >
                  Restablecer filtros
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <ChatShortcut />
    </div>
  );
};

export default MedicalGuides;






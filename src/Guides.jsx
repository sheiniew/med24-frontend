import React, { useState, useEffect } from 'react';
import {
  LuX, LuActivity, LuShieldCheck, LuChevronRight, LuInfo, LuBookOpen, LuHeart, LuShield, LuStar, LuHouse, LuCircleAlert
} from "react-icons/lu";
import { SkeletonGuidesList } from "./components/Skeleton";
import ModalGuideDetail from './components/ModalGuideDetail';

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
    fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/guides`)
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

    fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/favorites/ids`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(setFavorites)
      .catch(err => console.log("Error cargando favoritos", err));
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
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/favorites/toggle`, {
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

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyText = (urgency) => {
    switch (urgency) {
      case 'low': return 'Baja';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Guías Médicas</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Consulta guías médicas creadas por profesionales
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-7xl">
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 border px-4 py-2 rounded-xl"
          />

          <input
            placeholder="Buscar categoria..."
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="border px-4 py-2 rounded-xl"
          />

          <select
            value={selectedUrgency}
            onChange={e => setSelectedUrgency(e.target.value)}
            className="border px-4 py-2 rounded-xl"
          >
            <option value="all">Urgencia</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>

          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl border transition-all ${showOnlyFavorites
              ? "bg-red-50 border-red-200 text-red-600 font-bold"
              : "bg-white border-gray-200 text-gray-600"
              }`}
          >
            <LuHeart className={showOnlyFavorites ? "fill-red-600" : ""} />
            {showOnlyFavorites ? "Viendo favoritos" : "Ver favoritos"}
          </button>
        </div>

        {loading ? (
          <SkeletonGuidesList />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map(guide => (
                <div key={guide.id} className="bg-white rounded-xl shadow-sm p-4">
                  <span className={`text-xs px-2 py-1 rounded ${getUrgencyColor(guide.urgency)}`}>
                    {getUrgencyText(guide.urgency)}
                  </span>
                  <h3 className="text-lg font-bold mt-2">{guide.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
                  <p >{guide.category}</p>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setSelectedGuide(guide)}
                      className="text-blue-600"
                    >
                      Ver guía →
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(guide.id); }}>
                      <LuHeart
                        className={`transition-all ${favorites.includes(guide.id)
                          ? "text-red-500 fill-red-500 scale-110"
                          : "text-gray-300 hover:text-red-400"
                          }`}
                        size={22}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* EMPTY */}

            {filteredGuides.length === 0 && (
              <div className="text-center mt-10 text-gray-500">
                No hay guías con esos filtros
              </div>
            )}
          </>
        )}
      </div>

      {selectedGuide && (
        <ModalGuideDetail selectedGuide={selectedGuide} setSelectedGuide={setSelectedGuide} />
      )}
    </div>
  );
};

export default MedicalGuides;






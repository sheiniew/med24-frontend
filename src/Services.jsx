import React, { useState, useMemo } from 'react';
import { LuSearch, LuBot, LuMonitor, LuUserCheck, LuClock, LuShield, LuActivity, LuMicroscope, LuBrain, LuHeart, LuBaby, LuStethoscope, LuLink } from 'react-icons/lu'
import { Link } from 'react-router-dom';
import ChatShortcut from './components/ChatShortcut';

const Services = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todos");

    const categories = ["Todos", "Medicina General", "Especialidades", "Salud Mental", "Diagnóstico"];

    const services = [
        { id: 1, name: "Medicina Interna", category: "Medicina General", desc: "Atención integral del adulto, prevención y tratamiento de enfermedades crónicas.", modality: "Presencial/Virtual", availability: "Inmediata", icon: <LuStethoscope className="text-blue-500" /> },
        { id: 2, name: "Cardiología Avanzada", category: "Especialidades", desc: "Diagnóstico y tratamiento de patologías cardíacas con tecnología de punta.", modality: "Presencial", availability: "24-48 horas", icon: <LuHeart className="text-red-500" /> },
        { id: 3, name: "Pediatría Integral", category: "Medicina General", desc: "Control de crecimiento, desarrollo y vacunación para neonatos y niños.", modality: "Presencial/Virtual", availability: "Inmediata", icon: <LuBaby className="text-orange-400" /> },
        { id: 4, name: "Psicología Clínica", category: "Salud Mental", desc: "Terapia individual y grupal para el manejo de ansiedad, depresión y estrés.", modality: "100% Virtual", availability: "Mismo día", icon: <LuBrain className="text-purple-500" /> },
        { id: 5, name: "Dermatología", category: "Especialidades", desc: "Cuidado de la piel, detección de melanomas y tratamientos estéticos médicos.", modality: "Presencial/Virtual", availability: "3-5 días", icon: <LuActivity className="text-pink-500" /> },
        { id: 6, name: "Laboratorio Clínico", category: "Diagnóstico", desc: "Análisis de sangre, orina y estudios genéticos con resultados rápidos.", modality: "Presencial", availability: "Sin cita", icon: <LuMicroscope className="text-emerald-500" /> },
        { id: 7, name: "Psiquiatría", category: "Salud Mental", desc: "Evaluación médica de salud mental y manejo farmacológico especializado.", modality: "Presencial/Virtual", availability: "7 días", icon: <LuBrain className="text-indigo-600" /> },
        { id: 8, name: "Ginecología", category: "Especialidades", desc: "Salud reproductiva, control prenatal y prevención de cáncer femenino.", modality: "Presencial", availability: "24 horas", icon: <LuActivity className="text-rose-400" /> },
        { id: 9, name: "Nutrición y Dietética", category: "Medicina General", desc: "Planes alimenticios personalizados para diabetes, obesidad y deportistas.", modality: "Virtual", availability: "Mismo día", icon: <LuActivity className="text-green-500" /> },
        { id: 10, name: "Neurología", category: "Especialidades", desc: "Estudio de trastornos del sistema nervioso y tratamiento de migrañas.", modality: "Presencial", availability: "1 semana", icon: <LuActivity className="text-cyan-600" /> },
        { id: 11, name: "Radiología", category: "Diagnóstico", desc: "Rayos X, Tomografías y Resonancias con interpretación inmediata.", modality: "Presencial", availability: "Urgencias 24/7", icon: <LuActivity className="text-slate-500" /> },
        { id: 12, name: "Oftalmología", category: "Especialidades", desc: "Examen visual completo y cirugía correctiva de alta precisión.", modality: "Presencial", availability: "48 horas", icon: <LuActivity className="text-blue-400" /> },
    ];

    const filteredServices = useMemo(() => {
        return services.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = activeCategory === "Todos" || s.category === activeCategory;
            return matchesSearch && matchesCat;
        });
    }, [searchTerm, activeCategory]);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <header className="bg-white border-b border-gray-200 py-10 mb-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Catálogo Médico MED 24</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Explora nuestras especialidades y utiliza nuestra **IA de Orientación** para saber qué médico necesitas.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        { t: "IA 24/7", d: "Orientación médica inmediata sin esperas.", i: <LuBot /> },
                        { t: "Multimodal", d: "Citas virtuales desde casa o presenciales.", i: <LuMonitor /> },
                        { t: "Confianza", d: "Médicos certificados por consejos nacionales.", i: <LuUserCheck /> },
                        { t: "Rapidez", d: "Resultados y citas en tiempo récord.", i: <LuClock /> }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                            <div className="text-blue-600 mb-4 transform group-hover:scale-110 transition-transform">
                                {item.i}
                            </div>
                            <h3 className="font-bold text-gray-800">{item.t}</h3>
                            <p className="text-sm text-gray-500 mt-1">{item.d}</p>
                        </div>
                    ))}
                </div>

                <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="¿Qué especialidad buscas?"
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredServices.length > 0 ? (
                        filteredServices.map(service => (
                            <div key={service.id} className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all flex flex-col overflow-hidden group">
                                <div className="p-6 flex-grow">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-500 mb-3 block">{service.category}</span>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.desc}</p>

                                    <div className="space-y-2">
                                        <div className="flex items-center text-xs text-gray-600">
                                            <LuMonitor className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                            <span>{service.modality}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-600">
                                            <LuClock className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                            <span>{service.availability}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                                    <button className="w-full bg-white border border-blue-600 text-blue-600 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all">
                                        Consultar Detalle
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-400 text-lg">No encontramos servicios que coincidan con tu búsqueda.</p>
                        </div>
                    )}
                </div>
            </main>

            <ChatShortcut/>
        </div>
    );
};

export default Services;
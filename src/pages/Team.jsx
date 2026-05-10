import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiStethoscopeLine,
  RiStarFill,
  RiStarLine,
  RiSearchLine,
  RiMedalLine,
  RiUserHeartLine,
  RiTimerFlashLine,
  RiMapPinLine
} from "react-icons/ri";
import { SkeletonGridCards } from "../components/Skeleton";
import ChatShortcut from "../components/ChatShortcut";

export default function Team() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("Todos");

  const navigate = useNavigate();

  const specialties = ["Todos", "Cardiología", "Pediatría", "Dermatología", "Ginecología", "Medicina General"];

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_LOCAL}/doctors`)
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setFilteredDoctors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = doctors;

    if (activeSpecialty !== "Todos") {
      result = result.filter(doc => doc.specialty === activeSpecialty);
    }

    if (searchTerm) {
      result = result.filter(doc =>
        doc.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(result);
  }, [searchTerm, activeSpecialty, doctors]);

  console.log({ doctors })

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <header className="bg-white border-b border-gray-200 py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
            <RiStethoscopeLine className="text-blue-600" />
            Nuestro Equipo Médico
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Profesionales altamente calificados listos para brindarte la mejor atención personalizada y tecnológica.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { t: "Certificados", d: "Especialistas avalados internacionalmente.", i: <RiMedalLine size={28} /> },
            { t: "Empatía", d: "Atención centrada en el bienestar humano.", i: <RiUserHeartLine size={28} /> },
            { t: "Disponibilidad", d: "Consulta con nuestro agente de IA y expertos cuando sea.", i: <RiTimerFlashLine size={28} /> },
            { t: "Cercanía", d: "Consultorios equipados cerca de ti.", i: <RiMapPinLine size={28} /> }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
              <div className="text-blue-600 mb-4 transform group-hover:scale-110 transition-transform">
                {item.i}
              </div>
              <h3 className="font-bold text-gray-800">{item.t}</h3>
              <p className="text-sm text-gray-500 mt-1 font-medium">{item.d}</p>
            </div>
          ))}
        </div>

        <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-200 mb-10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar médico por nombre o especialidad..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 transition-all font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {specialties.map(spec => (
              <button
                key={spec}
                onClick={() => setActiveSpecialty(spec)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeSpecialty === spec
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <SkeletonGridCards />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => navigate(`/doctors/${doc.id}`)}
                  className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all flex flex-col overflow-hidden group cursor-pointer"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl shadow-blue-100 border-4 border-white bg-slate-100">
                        {doc?.profiles?.avatar_url ? (
                          <img
                            src={`${doc.profiles?.avatar_url}?t=${Date.now()}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-4xl font-semibold">
                            {doc.profiles?.full_name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg">
                        <RiStarFill className="text-yellow-500" size={14} />
                        <span className="text-xs font-black text-yellow-700">
                          {doc.avg_rating ? doc.avg_rating.toFixed(1) : "5.0"}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {doc.profiles?.full_name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-widest font-black text-blue-500 mb-3 block">
                      {doc.specialty}
                    </span>

                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 font-medium">
                      {doc.bio || "Especialista comprometido con la salud y el bienestar de sus pacientes."}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-gray-50">
                      <div className="flex items-center text-xs text-gray-600 font-bold">
                        <RiMedalLine className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{doc.experience || "10+ años de experiencia"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                    <button className="w-full bg-white border-2 border-blue-600 text-blue-600 py-2 rounded-xl text-sm font-black hover:bg-blue-600 hover:text-white transition-all transform active:scale-95">
                      Ver Perfil Médico
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <RiSearchLine size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400 text-lg font-bold">No encontramos médicos en esta categoría.</p>
                <button
                  onClick={() => { setActiveSpecialty("Todos"); setSearchTerm(""); }}
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <ChatShortcut />
    </div>
  );
}
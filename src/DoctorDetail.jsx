import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  RiBookOpenLine,
  RiTimeLine,
  RiShieldCheckLine,
  RiCloseLine,
  RiPulseLine,
  RiStarFill,
  RiMedalLine, RiAwardLine
} from "react-icons/ri";
import { SkeletonDoctorDetail } from "./components/Skeleton";
import { StarRating } from "./components/StarRating";
import { useNavigate } from "react-router-dom";
import NavBack from "./components/NavBack";
import { useAuth } from "./context/AuthContext";

export default function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorRating, setDoctorRating] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate()

  const fetchRating = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/rating/doctor/${id}`);
      const data = await res.json();
      setDoctorRating(data.average || 0);
    } catch (err) {
      console.error("Error cargando rating:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/${id}`).then(res => res.json()).then(setDoctor),
        fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/doctor/${id}`).then(res => res.json()).then(setGuides),
        fetchRating()
      ]);
      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleRate = async (newRating, targetId, type) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          target_id: targetId,
          target_type: type,
          rating: newRating
        })
      });

      if (res.ok) {
        await fetchRating();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error al calificar");
      }
    } catch (err) {
      console.error("Error en la conexión:", err);
    }
  };

  if (loading) return <SkeletonDoctorDetail />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <NavBack />

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50" />
          <div className="relative flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl shadow-blue-100 shrink-0">
              {doctor?.profiles?.full_name?.charAt(0) || "D"}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900">
                  {doctor?.profiles?.full_name}
                </h1>
                <span className="bg-blue-50 text-blue-600 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border border-blue-100">
                  Verificado
                </span>
              </div>

              <p className="text-blue-600 font-bold text-lg mb-4">
                {doctor?.specialty}
              </p>

              <p className="text-slate-500 leading-relaxed font-medium">
                {doctor?.bio || "Especialista dedicado a la salud integral con enfoque en medicina preventiva y nuevas tecnologías."}
              </p>

              <div className="flex items-center mt-6 gap-3">
                <div className="flex items-center gap-1.5 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                  <RiStarFill className="text-amber-500" size={20} />
                  <span className="font-black text-amber-700">{doctorRating.toFixed(1)}</span>
                </div>
                <StarRating
                  rating={doctorRating}
                  interactive={user}
                  setRating={(val) => handleRate(val, id, 'doctor')}
                />
                <span className="text-slate-400 text-sm font-bold ml-2">(Evaluar especialista)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                <RiMedalLine size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Experiencia</p>
                <p className="font-bold text-slate-700">{doctor?.experience || "10+ años"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                <RiAwardLine size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Certificación</p>
                <p className="font-bold text-slate-700">{doctor?.certification || "Consejo Nacional"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
              <RiBookOpenLine size={20} />
            </div>
            Guías de su autoría
          </h2>

          <div className="grid gap-4">
            {guides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => navigate(`/guide-detail/${guide.id}`)}
                className="group border border-slate-100 rounded-[1.5rem] p-5 cursor-pointer hover:border-blue-600 hover:shadow-lg hover:shadow-blue-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden"
              >
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{guide.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium max-w-xs truncate">
                    {guide.description}
                  </p>

                  <div className="flex gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      <RiTimeLine size={14} /> 5 min lectura
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-tighter">
                      <RiShieldCheckLine size={14} /> Verificado
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <RiPulseLine size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, icon }) {
  return (
    <div className="relative pl-4 border-l-4 border-slate-100">
      <h3 className="font-black text-slate-900 mb-4 flex items-center gap-3 uppercase tracking-tight text-sm">
        <span className="p-2 bg-slate-50 rounded-lg">{icon}</span>
        {title}
      </h3>
      <ul className="space-y-3">
        {children.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-600 font-medium leading-relaxed">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
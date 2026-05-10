import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuTrash } from "react-icons/lu";
import DoctorPersonalGuides from "../components/DoctorPersonalGuides";
import { Textarea, Input } from "../components/Utils";
import { LuUser, LuStethoscope, LuShield, LuHeart, LuPhone, LuPlus, LuSave, LuMedal, LuCircleCheck } from "react-icons/lu";
import UploadAvatar from "../components/UploadAvatar";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [doctorData, setDoctorData] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);
  const [view, setView] = useState("profile");
  const [guides, setGuides] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BACKEND}/auth/profile`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setProfile({
          ...data,
          avatar_url: data.avatar_url
            ? `${data.avatar_url}?v=${Date.now()}`
            : null
        });
        setInitialLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BACKEND}/auth/me`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(async (data) => {
        if (data.user?.role === "doctor") {
          setIsDoctor(true);
          setView("doctor");

          const resDoctor = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/me`, {
            credentials: "include",
          });

          const doctor = await resDoctor.json();
          setDoctorData(doctor);

          const resGuides = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/doctor/${doctor.id}`);
          const guidesData = await resGuides.json();

          setGuides(guidesData || []);
          setInitialLoading(false);
        } else {
          setInitialLoading(false);
        }
      });
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleDoctorChange = (e) => {
    setDoctorData({
      ...doctorData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);

    await fetch(`${import.meta.env.VITE_API_BACKEND}/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profile),
    });

    setLoading(false);
  };

  const handleSaveDoctor = async () => {
    await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(doctorData),
    });

    alert("Información médica actualizada");
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10 flex justify-center">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-3xl shadow-sm p-6 flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-sm p-6">
                <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-10 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full opacity-40 -z-0" />

          <UploadAvatar profile={profile} setProfile={setProfile} />

          <div className="text-center md:text-left">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
              {profile.full_name || "Tu Perfil"}
            </h2>
            <p className="text-slate-500 font-medium">{profile.email}</p>
            {isDoctor && (
              <span className="mt-2 inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full border border-green-100">
                <LuCircleCheck size={12} /> Profesional Verificado
              </span>
            )}
          </div>
        </div>

        {isDoctor && (
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-fit">
            <button
              onClick={() => setView("profile")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${view === "profile"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                : "text-slate-500 hover:bg-slate-50"
                }`}
            >
              <LuUser size={18} /> Mi Perfil
            </button>
            <button
              onClick={() => setView("doctor")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${view === "doctor"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                : "text-slate-500 hover:bg-slate-50"
                }`}
            >
              <LuStethoscope size={18} /> Panel Médico
            </button>
          </div>
        )}

        {view === "profile" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <section className="bg-white rounded-[2rem] border border-slate-100 p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2  uppercase tracking-tighter">
                <LuUser className="text-blue-600" /> Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nombre completo" name="full_name" value={profile.full_name || ""} onChange={handleChange} />
                <Input label="Teléfono móvil" name="phone" value={profile.phone || ""} onChange={handleChange} />
                <Input label="Fecha de nacimiento" name="birth_date" type="date" value={profile.birth_date || ""} onChange={handleChange} />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 ml-2">Género</label>
                  <select
                    name="gender"
                    value={profile.gender || ""}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-bold text-slate-600 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] border border-slate-100 p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2  uppercase tracking-tighter">
                <LuHeart className="text-rose-500" /> Historial Clínico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Grupo sanguíneo" name="blood_type" value={profile.blood_type || ""} onChange={handleChange} />
                <Textarea label="Alergias" name="allergies" value={profile.allergies || ""} onChange={handleChange} />
                <Textarea label="Enfermedades crónicas" name="chronic_conditions" value={profile.chronic_conditions || ""} onChange={handleChange} />
                <Textarea label="Medicamentos actuales" name="medications" value={profile.medications || ""} onChange={handleChange} />
              </div>
            </section>

            <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-md shadow-rose-50/50">
              <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2  uppercase tracking-tighter">
                <LuPhone className="text-blue-600" /> Contacto de Emergencia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nombre del contacto" name="emergency_contact_name" value={profile.emergency_contact_name || ""} onChange={handleChange} />
                <Input label="Teléfono de emergencia" name="emergency_contact_phone" value={profile.emergency_contact_phone || ""} onChange={handleChange} />
              </div>
            </section>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                <LuSave size={20} />
                {loading ? "Sincronizando..." : "Actualizar Perfil"}
              </button>
            </div>

            {!isDoctor && (
              <div className="bg-blue-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-semibold">¿Eres profesional de la salud?</h3>
                  <p className="text-blue-200 font-medium">Únete a nuestra red y comparte tus conocimientos médicos.</p>
                </div>
                <button
                  onClick={() => navigate("/become-doctor")}
                  className="bg-white text-blue-900 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all shrink-0"
                >
                  Solicitar Acceso Médico
                </button>
              </div>
            )}
          </div>
        )}

        {isDoctor && view === "doctor" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <section className="bg-white rounded-[2rem] border border-slate-100 p-8">
              <h3 className="text-lg font-semibold text-blue-600 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                <LuMedal /> Credenciales Médicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Especialidad Principal" name="specialty" value={doctorData.specialty || ""} onChange={handleDoctorChange} />
                <Input label="Años de Experiencia" name="experience" value={doctorData.experience || ""} onChange={handleDoctorChange} />
                <Input label="Certificación Médica" name="certification" value={doctorData.certification || ""} onChange={handleDoctorChange} />
                <Input label="Nº de Colegiado" name="colegiado" value={doctorData.colegiado || ""} onChange={handleDoctorChange} />
                <div className="md:col-span-2">
                  <Textarea label="Biografía Profesional" name="bio" value={doctorData.bio || ""} onChange={handleDoctorChange} />
                </div>
              </div>

              <div className="flex gap-4 mt-8 border-t border-slate-50 pt-8">
                <button
                  onClick={handleSaveDoctor}
                  className="bg-white text-black px-6 py-3 rounded-xl font-semibold border transition-all"
                >
                  Guardar Info Médica
                </button>
                <button
                  onClick={() => navigate("/create-guide")}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-50 transition-all"
                >
                  <LuPlus size={20} /> Publicar Nueva Guía
                </button>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] border border-slate-100 p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                  <LuShield size={20} />
                </div>
                Mis Guías Publicadas
              </h3>

              {guides.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-200">
                  <LuStethoscope className="mx-auto text-slate-300 mb-2" size={40} />
                  <p className="text-slate-500 font-bold">Aún no has compartido ninguna guía médica.</p>
                </div>
              ) : (
                <DoctorPersonalGuides guides={guides} setGuides={setGuides} />
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}


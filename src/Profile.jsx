import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuTrash } from "react-icons/lu";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [doctorData, setDoctorData] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);
  const [view, setView] = useState("profile");
  const [guides, setGuides] = useState([]);

  const navigate = useNavigate();

  // 🔹 cargar perfil
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BACKEND}/auth/profile`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
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

  // 🔹 handlers
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

  const handleDeleteGuide = async (id) => {
    const confirmDelete = window.confirm("¿Eliminar esta guía?");
    if (!confirmDelete) return;

    const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/guides/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setGuides(prev => prev.filter(g => g.id !== id));
    } else {
      alert("Error al eliminar guía");
    }
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
          {/* Header skeleton */}
          <div className="bg-white rounded-3xl shadow-sm p-6 flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Content skeleton */}
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
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {profile.full_name?.charAt(0) || "U"}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.full_name || "Tu nombre"}
            </h2>
            <p className="text-gray-500">{profile.email}</p>
          </div>
        </div>

        {/* TOGGLE SOLO PARA DOCTORES */}
        {isDoctor && (
          <div className="flex gap-2">
            <button
              onClick={() => setView("profile")}
              className={`px-4 py-2 rounded-xl ${view === "profile" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
            >
              Perfil
            </button>

            <button
              onClick={() => setView("doctor")}
              className={`px-4 py-2 rounded-xl ${view === "doctor" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
            >
              Panel médico
            </button>
          </div>
        )}

        {/* 👤 PERFIL */}
        {view === "profile" && (
          <>
            {/* INFO PERSONAL */}
            <div className="bg-white rounded-3xl shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Información personal
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Nombre completo" name="full_name" value={profile.full_name || ""} onChange={handleChange} />
                <Input label="Teléfono" name="phone" value={profile.phone || ""} onChange={handleChange} />
                <Input label="Fecha de nacimiento" name="birth_date" type="date" value={profile.birth_date || ""} onChange={handleChange} />

                <select
                  name="gender"
                  value={profile.gender || ""}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3"
                >
                  <option value="">Género</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>

            {/* INFO MÉDICA */}
            <div className="bg-white rounded-3xl shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Información médica
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Grupo sanguíneo" name="blood_type" value={profile.blood_type || ""} onChange={handleChange} />
                <Textarea label="Alergias" name="allergies" value={profile.allergies || ""} onChange={handleChange} />
                <Textarea label="Enfermedades crónicas" name="chronic_conditions" value={profile.chronic_conditions || ""} onChange={handleChange} />
                <Textarea label="Medicamentos actuales" name="medications" value={profile.medications || ""} onChange={handleChange} />
              </div>
            </div>

            {/* EMERGENCIA */}
            <div className="bg-white rounded-3xl shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Contacto de emergencia
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Nombre" name="emergency_contact_name" value={profile.emergency_contact_name || ""} onChange={handleChange} />
                <Input label="Teléfono" name="emergency_contact_phone" value={profile.emergency_contact_phone || ""} onChange={handleChange} />
              </div>
            </div>

            {/* BOTÓN */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold"
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>

            {/* CONVERTIRSE EN MÉDICO */}
            {!isDoctor && (
              <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-semibold">¿Eres médico?</h3>
                <button
                  onClick={() => navigate("/become-doctor")}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl"
                >
                  Convertirme en médico
                </button>
              </div>
            )}
          </>
        )}

        {/* 🩺 PANEL MÉDICO */}
        {isDoctor && view === "doctor" && (
          <div className="space-y-6">

            {/* 🩺 INFO DOCTOR */}
            <div className="bg-white rounded-3xl shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-blue-600">
                Panel de Médico
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Especialidad" name="specialty" value={doctorData.specialty || ""} onChange={handleDoctorChange} />
                <Input label="Experiencia" name="experience" value={doctorData.experience || ""} onChange={handleDoctorChange} />
                <Input label="Certificación" name="certification" value={doctorData.certification || ""} onChange={handleDoctorChange} />
                <Input label="Colegiado" name="colegiado" value={doctorData.colegiado || ""} onChange={handleDoctorChange} />
                <Textarea label="Biografía" name="bio" value={doctorData.bio || ""} onChange={handleDoctorChange} />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveDoctor}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl"
                >
                  Guardar info médica
                </button>

                <button
                  onClick={() => navigate("/create-guide")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Crear guía médica
                </button>
              </div>
            </div>

            {/* 📚 MIS GUÍAS */}
            <div className="bg-white rounded-3xl shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Mis guías médicas
              </h3>

              {guides.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Aún no has creado ninguna guía.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {guides.map((guide) => (
                    <div
                      key={guide.id}
                      className="border rounded-2xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {guide.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {guide.description}
                        </p>

                        <span className="text-xs mt-2 inline-block bg-gray-100 px-2 py-1 rounded">
                          {guide.category}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <button
                          onClick={() => handleDeleteGuide(guide.id)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          <LuTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

/* COMPONENTES */

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input {...props} className="border rounded-xl px-4 py-3" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="col-span-2 flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <textarea {...props} rows={3} className="border rounded-xl px-4 py-3" />
    </div>
  );
}
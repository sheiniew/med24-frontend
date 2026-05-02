import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BecomeDoctor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    specialty: "",
    experience: "",
    certification: "",
    colegiado: "",
    bio: "",
    photo: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/become-doctor`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Ahora eres médico");
      navigate("/profile");
    } else {
      const err = await res.json();
      alert(err.error || "Error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-3xl shadow-md w-full max-w-xl space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Registro como médico
        </h2>

        <Input label="Especialidad" name="specialty" onChange={handleChange} />
        <Input label="Años de experiencia" name="experience" onChange={handleChange} />
        <Input label="Certificación" name="certification" onChange={handleChange} />
        <Input label="Número de colegiado" name="colegiado" onChange={handleChange} />
        
        <Textarea label="Biografía profesional" name="bio" onChange={handleChange} />

        <Input label="Foto (URL)" name="photo" onChange={handleChange} />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-xl"
        >
          Convertirme en médico
        </button>
      </div>
    </div>
  );
}

/* reutiliza tus componentes */
function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input {...props} className="border rounded-xl px-4 py-2" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <textarea {...props} rows={3} className="border rounded-xl px-4 py-2" />
    </div>
  );
}
import { useState } from "react";

export default function CreateGuide() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    urgency: "",
    description: "",
  });

  const [content, setContent] = useState({
    symptoms: [""],
    homeCare: [""],
    whenToSeeDoctor: [""],
    prevention: [""],
  });

  const handleArrayChange = (section, index, value) => {
    const updated = [...content[section]];
    updated[index] = value;

    setContent({
      ...content,
      [section]: updated,
    });
  };

  const addItem = (section) => {
    setContent({
      ...content,
      [section]: [...content[section], ""],
    });
  };

  const removeItem = (section, index) => {
    const updated = content[section].filter((_, i) => i !== index);

    setContent({
      ...content,
      [section]: updated,
    });
  };

  const handleSubmit = async () => {
    const finalData = {
      ...form,
      content,
    };

    console.log(finalData);

    await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/guides`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(finalData),
    });

    alert("Guía creada");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm p-8 space-y-8">

        <h2 className="text-2xl font-bold text-gray-900">
          Crear guía médica
        </h2>

        {/* DATOS GENERALES */}
        <div className="space-y-4">
          <Input label="Título" onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Categoría" onChange={(e) => setForm({ ...form, category: e.target.value })} />

          <select
            onChange={(e) => setForm({ ...form, urgency: e.target.value })}
            className="input"
          >
            <option value="">Urgencia</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>

          <Textarea label="Descripción" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        {/* SECCIONES DINÁMICAS */}
        <DynamicSection
          title="Síntomas"
          section="symptoms"
          content={content}
          onChange={handleArrayChange}
          addItem={addItem}
          removeItem={removeItem}
        />

        <DynamicSection
          title="Cuidados en casa"
          section="homeCare"
          content={content}
          onChange={handleArrayChange}
          addItem={addItem}
          removeItem={removeItem}
        />

        <DynamicSection
          title="Cuándo acudir al médico"
          section="whenToSeeDoctor"
          content={content}
          onChange={handleArrayChange}
          addItem={addItem}
          removeItem={removeItem}
        />

        <DynamicSection
          title="Prevención"
          section="prevention"
          content={content}
          onChange={handleArrayChange}
          addItem={addItem}
          removeItem={removeItem}
        />

        {/* BOTÓN */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700"
          >
            Guardar guía
          </button>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTES */

function DynamicSection({ title, section, content, onChange, addItem, removeItem }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">{title}</h3>

      {content[section].map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => onChange(section, index, e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2"
            placeholder={`Agregar ${title.toLowerCase()}`}
          />

          <button
            onClick={() => removeItem(section, index)}
            className="text-red-500 px-3"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={() => addItem(section)}
        className="text-blue-600 text-sm"
      >
        + Añadir
      </button>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input {...props} className="border border-gray-200 rounded-xl px-4 py-3" />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <textarea {...props} rows={3} className="border border-gray-200 rounded-xl px-4 py-3" />
    </div>
  );
}
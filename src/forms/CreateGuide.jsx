import { useState, useEffect } from "react";
import { LuX, LuSave, LuPlus } from "react-icons/lu";
import { Input, Textarea, DynamicSection } from "../components/Utils";
import NavBack from "../components/NavBack";

export default function CreateGuide({ editingGuide, closeModal, setGuides }) {
  const isEditing = !!editingGuide;

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

  useEffect(() => {
    if (isEditing) {
      setForm({
        title: editingGuide.title || "",
        category: editingGuide.category || "",
        urgency: editingGuide.urgency || "",
        description: editingGuide.description || "",
      });
      if (editingGuide.content) {
        setContent(editingGuide.content);
      }
    }
  }, [editingGuide]);

  const handleArrayChange = (section, index, value) => {
    const updated = [...content[section]];
    updated[index] = value;
    setContent({ ...content, [section]: updated });
  };

  const addItem = (section) => {
    setContent({ ...content, [section]: [...content[section], ""] });
  };

  const removeItem = (section, index) => {
    const updated = content[section].filter((_, i) => i !== index);
    setContent({ ...content, [section]: updated });
  };

  const handleSubmit = async () => {
    const finalData = { ...form, content };
    const url = isEditing
      ? `${import.meta.env.VITE_API_BACKEND}/doctors/guides/${editingGuide.id}`
      : `${import.meta.env.VITE_API_BACKEND}/doctors/guides`;

    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        const savedGuide = await res.json();

        if (isEditing) {
          setGuides(prev => prev.map(g => g.id === editingGuide.id ? { ...g, ...finalData } : g));
          closeModal();
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <div className="bg-slate-50">
      {!isEditing && (
        <NavBack />
      )} 
      <div className={`${!isEditing ? 'min-h-screen py-10 px-6 flex justify-center' : 'p-8'}`}>
        <div className={`w-full ${!isEditing ? 'max-w-3xl bg-white rounded-[2.5rem] shadow-sm p-10' : ''} space-y-8`}>


          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900 italic">
              {isEditing ? "Editar Guía Médica" : "Crear Nueva Guía"}
            </h2>
            {isEditing && (
              <button onClick={closeModal} className="p-2 bg-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all">
                <LuX size={24} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Título de la guía"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              label="Categoría (Ej: Pediatría)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-2">Nivel de Urgencia</label>
              <select
                value={form.urgency}
                onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Seleccionar...</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Resumen / Descripción corta"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="space-y-6 border-t border-slate-100 pt-8">
            {["symptoms", "homeCare", "whenToSeeDoctor", "prevention"].map((sec) => (
              <DynamicSection
                key={sec}
                title={sec === "symptoms" ? "Síntomas" : sec === "homeCare" ? "Cuidados en Casa" : sec === "prevention" ? "Prevención" : "Cuándo acudir al médico"}
                section={sec}
                content={content}
                onChange={handleArrayChange}
                addItem={addItem}
                removeItem={removeItem}
              />
            ))}
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform active:scale-95"
            >
              <LuSave size={20} />
              {isEditing ? "Guardar Cambios" : "Publicar Guía"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
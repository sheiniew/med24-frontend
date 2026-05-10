import { useState } from "react";
import { LuTrash, LuPencil } from "react-icons/lu";
import DeleteModal from "./DeleteModal";
import CreateGuide from "../forms/CreateGuide";

export default function DoctorPersonalGuides({ guides, setGuides }) {
  const [guideToDelete, setGuideToDelete] = useState(null);
  const [guideToEdit, setGuideToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!guideToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_LOCAL}/doctors/guides/${guideToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setGuides(prev => prev.filter(g => g.id !== guideToDelete.id));
        setGuideToDelete(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {guides.map((guide) => (
        <div key={guide.id} className="border border-slate-100 rounded-[2rem] p-6 flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition-all">
          <div>
            <h4 className="font-black text-slate-900 text-lg">{guide.title}</h4>
            <p className="text-sm text-slate-500 mt-2 font-medium line-clamp-2">{guide.description}</p>
            <span className="text-[10px] mt-4 inline-block bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">
              {guide.category}
            </span>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <button
              onClick={() => setGuideToEdit(guide)}
              className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-colors"
            >
              <LuPencil size={20} />
            </button>
            <button
              onClick={() => setGuideToDelete(guide)}
              className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"
            >
              <LuTrash size={20} />
            </button>
          </div>
        </div>
      ))}

      {guideToEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-[2.5rem] shadow-2xl">
            <CreateGuide 
              editingGuide={guideToEdit} 
              closeModal={() => setGuideToEdit(null)} 
              setGuides={setGuides}
            />
          </div>
        </div>
      )}

      {guideToDelete && (
        <DeleteModal isDeleting={isDeleting} setElToDelete={setGuideToDelete} elToDelete={guideToDelete} confirmDelete={confirmDelete}/>
      )}
    </div>
  );
}
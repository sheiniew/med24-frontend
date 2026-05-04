import { LuTrash, LuTrash2, LuX } from "react-icons/lu";

export default function DeleteModal({ setElToDelete, isDeleting, elToDelete, confirmDelete }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => !isDeleting && setElToDelete(null)}
            />

            <div className="relative bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <LuTrash2 size={28} />
                </div>

                <h2 className="text-xl font-black text-gray-900">¿Eliminar guía?</h2>
                <p className="text-sm text-gray-500 mt-2">
                    Estás por eliminar <span className="font-bold text-gray-800">"{elToDelete.title}"</span>. Esta acción no se puede deshacer.
                </p>

                <div className="flex w-full gap-3 mt-8">
                    <button
                        disabled={isDeleting}
                        onClick={() => setElToDelete(null)}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        disabled={isDeleting}
                        onClick={confirmDelete}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50 flex justify-center"
                    >
                        {isDeleting ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                </div>
            </div>
        </div>
    )
}
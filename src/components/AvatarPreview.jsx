import { LuX } from "react-icons/lu";

export default function AvatarPreview({ image, open, onClose }) {
    if (!open || !image) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-6"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative"
            >
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
                >
                    <LuX size={20} />
                </button>

                <img
                    src={image}
                    alt="Avatar preview"
                    className="max-w-[90vw] max-h-[85vh] rounded-3xl shadow-2xl object-contain"
                />
            </div>
        </div>
    );
}
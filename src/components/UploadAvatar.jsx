import { useState } from "react";
import { LuCamera, LuPencil, LuTrash } from "react-icons/lu";
import Cropper from "react-easy-crop";
import { useAuth } from "../context/AuthContext";
import AvatarPreview from "./AvatarPreview";

function UploadAvatar({ profile, setProfile }) {
    const [uploading, setUploading] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const { user, setUser } = useAuth();
    const [previewOpen, setPreviewOpen] = useState(false);

    const onSelectFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.addEventListener("load", () => {
            setImageSrc(reader.result);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setShowCropModal(true);
        });

        reader.readAsDataURL(file);
    };

    const handleCropAndUpload = async () => {
        try {
            setUploading(true);

            if (!croppedAreaPixels) return;
            const croppedBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );

            const formData = new FormData();
            formData.append("avatar", croppedBlob, "avatar.jpg");

            const res = await fetch(
                `${import.meta.env.VITE_API_BACKEND}/auth/upload-avatar`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error subiendo imagen");
            }

            const newAvatar = `${data.avatar_url}?v=${data.version}`;

            setProfile((prev) => ({
                ...prev,
                avatar_url: newAvatar
            }));

            setUser((prev) => ({
                ...prev,
                avatar_url: newAvatar
            }));

            setShowCropModal(false);

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const deleteAvatar = async () => {
        try {
            setUploading(true);

            const res = await fetch(
                `${import.meta.env.VITE_API_BACKEND}/auth/delete-avatar`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error eliminando avatar");
            }

            setProfile((prev) => ({
                ...prev,
                avatar_url: null
            }));

            setUser((prev) => ({
                ...prev,
                avatar_url: null
            }));
            setImageSrc(null);

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const getCroppedImg = async (imageSrc, crop) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = imageSrc;

        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("No se pudo generar imagen"));
                    return;
                }
                resolve(blob);
            }, "image/jpeg", 0.95);
        });
    };

    return (
        <div className="relative z-10 shrink-0 group">
            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl shadow-blue-100 border-4 border-white bg-slate-100"
                onClick={() => profile.avatar_url && setPreviewOpen(true)}
            >
                {profile.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-4xl font-semibold">
                        {profile.full_name?.charAt(0) || "U"}
                    </div>
                )}
            </div>

            <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-all">
                <LuCamera className="text-slate-700" size={18} />
                <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="hidden"
                />
            </label>
            {profile.avatar_url && (
                <button
                    type="button"
                    onClick={() => {
                        if (!imageSrc) {
                            setImageSrc(profile.avatar_url);
                        }
                        setShowCropModal(true);
                    }}
                    className="absolute -top-2 -right-2 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-[10px] font-semibold shadow-lg hover:bg-blue-700 transition-all z-20"
                >
                    <LuPencil size={14} />
                </button>
            )}

            {profile.avatar_url && (
                <button
                    type="button"
                    onClick={deleteAvatar}
                    className="absolute -top-2 left-0 px-3 py-1.5 rounded-xl bg-red-500 text-white text-[10px] font-semibold shadow-lg hover:bg-red-600 transition-all"
                >
                    <LuTrash size={14} />
                </button>
            )}

            {uploading && (
                <div className="absolute inset-0 rounded-3xl bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                    Subiendo...
                </div>
            )}

            {showCropModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-6 w-[90%] max-w-md space-y-6">
                        <h3 className="text-xl font-semibold text-slate-900">
                            Ajustar foto de perfil
                        </h3>

                        <div className="relative w-full h-80 bg-slate-100 rounded-2xl overflow-hidden">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, croppedPixels) =>
                                    setCroppedAreaPixels(croppedPixels)
                                }
                            />
                        </div>

                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-full"
                        />

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowCropModal(false)}
                                className="px-5 py-2 rounded-xl bg-slate-100 font-medium"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleCropAndUpload}
                                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium"
                            >
                                Guardar foto
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AvatarPreview
                image={profile.avatar_url}
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
            />

        </div>
    );
}

export default UploadAvatar;
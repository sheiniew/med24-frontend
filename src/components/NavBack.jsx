import { LuArrowLeft, LuActivity, LuHouse, LuCircleAlert, LuShieldCheck } from "react-icons/lu";
import { useNavigate, Link } from "react-router-dom";

export default function NavBack() {

    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-around pt-8">
            <div>

            </div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                <LuArrowLeft size={18} /> Volver
            </button>
        </div>
    )
}
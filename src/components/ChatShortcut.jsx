import { Link } from "react-router-dom"
import { LuBot } from "react-icons/lu"

export default function ChatShortcut() {
    return (
        <Link to="/chat">
            <div className="fixed bottom-8 right-8 z-50">
                <button className="group flex items-center bg-blue-600 text-white p-1 pr-6 rounded-full shadow-2xl hover:bg-blue-700 transition-all active:scale-95">
                    <div className="bg-white text-blue-600 p-3 rounded-full shadow-inner mr-3 transform group-hover:rotate-12 transition-transform">
                        <LuBot className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <span className="block text-[10px] uppercase font-bold opacity-80">Asistente Médico IA</span>
                        <span className="text-sm font-bold">Orientación 24/7</span>
                    </div>
                </button>
            </div>
        </Link>
    )
}
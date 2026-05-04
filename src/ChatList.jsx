import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatList() {

    const [chats, setChats] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BACKEND}/chat`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then(setChats);
    }, []);



    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f6fb] flex justify-center py-8 px-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    <div className="text-center py-8">
                        <p className="text-slate-500 mb-4">Selecciona una conversación para comenzar</p>
                    </div>
                </div>
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => navigate(`/chat/${chat.id}`)}
                        className="p-4 bg-white rounded-xl cursor-pointer"
                    >
                        {chat.title}
                    </div>
                ))}
            </div>
        </div>
    )
}
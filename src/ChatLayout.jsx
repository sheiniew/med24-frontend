import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { SkeletonChatSidebar } from "./components/Skeleton";

export default function ChatLayout() {
  const [chats, setChats] = useState([]);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchChats = async () => {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/chat`, {
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Error fetching chats");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setChats(data);
    setLoading(false);
  };

  const deleteChat = async () => {
    if (!chatToDelete) return;

    const res = await fetch(
      `${import.meta.env.VITE_API_BACKEND}/chat/${chatToDelete}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (res.ok) {
      setChatToDelete(null);
      fetchChats();
      navigate("/chat");
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="flex flex-1 h-[600px] max-w-[1400px] mx-auto bg-[#f9fafb]">

      {/* SIDEBAR */}
      {loading ? (
        <SkeletonChatSidebar />
      ) : (
        <div className="w-80 bg-white border-r flex flex-col">
          {/* HEADER */}
          <div className="p-4 border-b">
            <button
              onClick={() => navigate("/chat")}
              className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              + Nuevo chat
            </button>
          </div>

          {/* LISTA DE CHATS */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chats.map((chat) => {
              const isActive = location.pathname === `/chat/${chat.id}`;

              return (
                <div
                  key={chat.id}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition group
                    
                    ${isActive
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-100"
                    }
                  `}
                >
                  {/* TÍTULO */}
                  <div className="flex-1 truncate text-sm font-medium text-gray-800">
                    {chat.title}
                  </div>

                  {/* ELIMINAR */}
                  <FaRegTrashAlt
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatToDelete(chat.id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 flex justify-center h-full overflow-hidden">
        <div className="w-full max-w-3xl h-full flex flex-col">
          <Outlet context={{ refreshChats: fetchChats }} />
        </div>
      </div>

      {/* MODAL */}
      {chatToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              ¿Eliminar este chat?
            </h2>

            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setChatToDelete(null)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={deleteChat}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
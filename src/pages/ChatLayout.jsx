import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { SkeletonChatSidebar } from "../components/Skeleton";
import DeleteModal from "../components/DeleteModal"

export default function ChatLayout() {
  const [chats, setChats] = useState([]);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  console.log(import.meta.env.VITE_API_BACKEND)

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

    setIsDeleting(true)
    try {
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
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="flex flex-1 h-[600px] max-w-[1400px] mx-auto bg-[#f9fafb]">

      {loading ? (
        <SkeletonChatSidebar />
      ) : (
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <button
              onClick={() => navigate("/chat")}
              className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              + Nuevo chat
            </button>
          </div>

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
                  <div className="flex-1 truncate text-sm font-medium text-gray-800">
                    {chat.title}
                  </div>

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

      {chatToDelete && (
        <DeleteModal setElToDelete={setChatToDelete} confirmDelete={deleteChat} elToDelete={chatToDelete} isDeleting={isDeleting} />
      )}
    </div>
  );
}
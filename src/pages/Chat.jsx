import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  RiArrowLeftLine,
  RiRobot2Line,
  RiUser3Line,
  RiSendPlaneFill
} from "react-icons/ri";

import { FiLoader } from "react-icons/fi";
import { SkeletonChatMessage } from "../components/Skeleton";

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { refreshChats } = useOutletContext();
  const [isNewChat, setIsNewChat] = useState(false);

  const chatRef = useRef(null);

  const conversationTitle = "Consulta médica";

  const suggestedQuestions = [
    "Tengo dolor de cabeza",
    "Síntomas de gripe",
    "Dolor abdominal",
  ];

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setInitialLoading(false);
      return;
    }
    if (isNewChat) {
      setIsNewChat(false);
      setInitialLoading(false);
      return;
    }

    setMessages([]);
    setInitialLoading(true);

    fetch(`${import.meta.env.VITE_API_BACKEND}/chat/${chatId}/messages`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(data => {
        setMessages(data);
        setInitialLoading(false);
      })
      .catch(() => setInitialLoading(false));
  }, [chatId]);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const createChat = async (firstMessage) => {
    const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/chat/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: firstMessage.slice(0, 40) }),
    });

    const data = await res.json();
    return data.id;
  };

  const handleSend = async (customMessage) => {
    const text = customMessage || input;
    if (!text.trim()) return;

    let currentChatId = chatId;

    setInput("");
    setLoading(true);

    if (!currentChatId) {
      currentChatId = await createChat(text);

      setIsNewChat(true);

      await refreshChats();
      navigate(`/chat/${currentChatId}`, { replace: true });
    }

    const userMessage = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const assistantMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BACKEND}/chat/${currentChatId}/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: text }),
        }
      );

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.replace("data: ", ""));

              setMessages((prev) => {
                const newMessages = [...prev];
                const lastIndex = newMessages.length - 1;

                if (newMessages[lastIndex]?.role === "assistant") {
                  newMessages[lastIndex] = {
                    ...newMessages[lastIndex],
                    content: newMessages[lastIndex].content + (parsed.content || ""),
                  };
                }

                return newMessages;
              });
            } catch { }
          }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex justify-center px-4 py-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/chat")}
              className="p-2 hover:bg-white/20 rounded-xl"
            >
              <RiArrowLeftLine className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <RiRobot2Line className="w-6 h-6" />
            </div>

            <div>
              <h2 className="font-bold">{conversationTitle}</h2>
              <div className="flex items-center gap-2 text-sm text-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                En línea
              </div>
            </div>
          </div>
        </div>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
        >
          {initialLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonChatMessage key={i} />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center">
              <p className="text-slate-500 mb-4">
                Envía un mensaje para comenzar
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="px-4 py-2 bg-white border rounded-full text-sm hover:border-blue-400"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => {
              const isUser = m.role === "user";

              return (
                <div
                  key={i}
                  className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${isUser
                      ? "bg-blue-600"
                      : "bg-white border border-blue-100"
                      }`}
                  >
                    {isUser ? (
                      <RiUser3Line className="w-5 h-5 text-white" />
                    ) : (
                      <RiRobot2Line className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                      }`}
                  >
                    {m.content || (loading && i === messages.length - 1 && (
                      <FiLoader className="animate-spin w-5 h-5 text-blue-400" />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border rounded-xl px-4 py-3"
            placeholder="Escribe tu mensaje..."
          />

          <button
            onClick={() => handleSend()}
            className="bg-blue-600 text-white px-5 rounded-xl"
          >
            <RiSendPlaneFill className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
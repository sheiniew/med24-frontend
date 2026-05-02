import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiStethoscopeLine,
  RiStarFill, // Estrella rellena para el rating
  RiStarLine
} from "react-icons/ri";
import { SkeletonGridCards } from "./components/Skeleton";

export default function Team() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BACKEND}/doctors`)
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <RiStethoscopeLine size={24} />
          Médicos disponibles
        </h1>

        {loading ? (
          <SkeletonGridCards />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/doctors/${doc.id}`)}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl cursor-pointer transition border border-transparent hover:border-blue-100"
              >
                {/* Avatar */}
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl font-bold">
                  {doc.profiles?.full_name?.charAt(0) || "D"}
                </div>

                <h2 className="mt-4 font-bold text-lg">
                  {doc.profiles?.full_name}
                </h2>

                <p className="text-blue-600 text-sm font-medium">
                  {doc.specialty}
                </p>

                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {doc.bio}
                </p>

                {/* Footer con Rating */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {doc.experience}
                  </span>

                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    {/* Si el doctor tiene rating mostramos estrella llena, si no, vacía */}
                    {doc.avg_rating > 0 ? (
                        <RiStarFill className="text-yellow-500" size={16} />
                    ) : (
                        <RiStarLine className="text-gray-300" size={16} />
                    )}
                    <span className={`text-sm font-bold ${doc.avg_rating > 0 ? 'text-yellow-700' : 'text-gray-400'}`}>
                      {doc.avg_rating ? doc.avg_rating.toFixed(1) : "N/C"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
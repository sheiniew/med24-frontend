import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  RiBookOpenLine,
  RiTimeLine,
  RiShieldCheckLine,
  RiCloseLine,
  RiPulseLine
} from "react-icons/ri";
import { SkeletonDoctorDetail } from "./components/Skeleton";
import { StarRating } from "./components/StarRating";

export default function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorRating, setDoctorRating] = useState(0);

  const fetchRating = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/rating/doctor/${id}`);
      const data = await res.json();
      setDoctorRating(data.average || 0);
    } catch (err) {
      console.error("Error cargando rating:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/${id}`).then(res => res.json()).then(setDoctor),
        fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/doctor/${id}`).then(res => res.json()).then(setGuides),
        fetchRating()
      ]);
      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleRate = async (newRating, targetId, type) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND}/doctors/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          target_id: targetId,
          target_type: type,
          rating: newRating
        })
      });

      if (res.ok) {
        await fetchRating();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error al calificar");
      }
    } catch (err) {
      console.error("Error en la conexión:", err);
    }
  };

  if (loading) return <SkeletonDoctorDetail />;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold">
            {doctor?.profiles?.full_name}
          </h1>
          <p className="text-blue-600 font-medium">
            {doctor?.specialty}
          </p>

          <p className="mt-4 text-gray-600">
            {doctor?.bio}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="bg-gray-50 p-3 rounded-xl">
              <strong>Experiencia</strong>
              <p>{doctor?.experience}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl">
              <strong>Certificación</strong>
              <p>{doctor?.certification}</p>
            </div>
          </div>

          <div className="flex items-center mt-4 gap-2">
            <StarRating rating={doctorRating} interactive={true} setRating={(val) => handleRate(val, id, 'doctor')} />
            <span className="text-sm text-gray-500">({doctorRating.toFixed(1)})</span>
          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <RiBookOpenLine />
            Guías médicas
          </h2>

          <div className="space-y-4">
            {guides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className="border rounded-2xl p-4 cursor-pointer hover:shadow-md"
              >
                <h3 className="font-semibold">{guide.title}</h3>

                <p className="text-sm text-gray-600 mt-1">
                  {guide.description}
                </p>

                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <RiTimeLine /> 5 min
                  </span>

                  <span className="flex items-center gap-1 text-green-600">
                    <RiShieldCheckLine /> Verificado
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {selectedGuide && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white max-w-3xl w-full rounded-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between p-4 border-b">
              <h2 className="font-bold">{selectedGuide.title}</h2>
              <button onClick={() => setSelectedGuide(null)}>
                <RiCloseLine />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {selectedGuide.content?.symptoms && (
                <Section title="Síntomas" icon={<RiPulseLine />}>
                  {selectedGuide.content.symptoms}
                </Section>
              )}

              {selectedGuide.content?.homeCare && (
                <Section title="Cuidados en casa">
                  {selectedGuide.content.homeCare}
                </Section>
              )}

              {selectedGuide.content?.whenToSeeDoctor && (
                <Section title="Cuándo acudir al médico">
                  {selectedGuide.content.whenToSeeDoctor}
                </Section>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children, icon }) {
  return (
    <div>
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <ul className="list-disc ml-5 space-y-1">
        {children.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
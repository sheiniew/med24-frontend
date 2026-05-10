import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LuActivity,
  LuHouse,
  LuCircleAlert,
  LuClock3,
  LuBadgeCheck,
  LuBookOpen
} from "react-icons/lu";
import NavBack from "./NavBack";
import { SkeletonMedicalGuideDetail } from "./Skeleton";
import { Section } from "./Utils";

export default function MedicalGuideDetail() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_LOCAL}/doctors/guides/${id}`
        );
        const data = await res.json();
        setGuide(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [id]);

  if (loading) return <SkeletonMedicalGuideDetail />;
  if (!guide)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Guía no encontrada
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <NavBack />

      <main className="max-w-5xl mx-auto px-4 mt-8 space-y-8">

        <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full opacity-50" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-blue-50 text-blue-600 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border border-blue-100">
                Guía Médica
              </span>

              {guide.verified && (
                <span className="bg-green-50 text-green-700 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border border-green-100 flex items-center gap-1">
                  <LuBadgeCheck size={12} />
                  Verificada
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-5">
              {guide.title}
            </h1>

            <p className="text-lg text-slate-600 max-w-3xl leading-relaxed font-medium">
              {guide.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                <LuClock3 className="text-blue-600" size={18} />
                <span className="font-semibold text-slate-700">
                  {guide.read_time || "5 min"} lectura
                </span>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                <LuBookOpen className="text-blue-600" size={18} />
                <span className="font-semibold text-slate-700">
                  {guide.category || "General"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
          <h3 className="text-sm uppercase tracking-widest font-black text-slate-400 mb-4">
            Autor de la guía
          </h3>

          <div
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {guide?.doctors?.profiles?.full_name}
              </h2>
              <Link to="/team" className="text-slate-500 font-medium mt-1 hover:text-blue-600">
                {guide?.doctors?.specialty}
              </Link>
            </div>

            <Link to={`/doctors/${guide?.doctor_id}`} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-600 hover:text-white transition-all">
              Ver perfil
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          {guide.content?.symptoms && (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <Section
                title="Síntomas"
                items={guide.content.symptoms}
                icon={LuActivity}
                color="rose"
              />
            </div>
          )}

          {guide.content?.homeCare && (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <Section
                title="Cuidados en Casa"
                items={guide.content.homeCare}
                icon={LuHouse}
                color="blue"
              />
            </div>
          )}

          {guide.content?.whenToSeeDoctor && (
            <div className="bg-amber-50 rounded-[2rem] border border-amber-100 p-8 shadow-sm">
              <Section
                title="Cuándo buscar atención médica"
                items={guide.content.whenToSeeDoctor}
                icon={LuCircleAlert}
                color="amber"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LuArrowLeft, LuActivity, LuHouse, LuCircleAlert, LuShieldCheck } from "react-icons/lu";
import NavBack from './NavBack';
import { SkeletonMedicalGuideDetail } from './Skeleton';
import { Section } from './Utils';

export default function MedicalGuideDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_LOCAL}/doctors/guides/${id}`);
                const data = await res.json();
                setGuide(data);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGuide();
    }, [id]);


    if (loading) return <SkeletonMedicalGuideDetail />;
    if (!guide) return <div className="min-h-screen flex items-center justify-center">Guía no encontrada.</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <NavBack />
            <main className="max-w-4xl mx-auto p-6 md:p-12 overflow-hidden">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 mb-4">{guide.title}</h1>
                    <p className="text-xl text-slate-600 max-w-2xl break-words">
                        {guide.description}
                    </p>
                    <div className='mt-5'>
                        <Link className='hover:text-blue-500 font-semibold' to={`/doctors/${guide?.doctor_id}`}>{guide?.doctors.profiles.full_name}</Link>
                        <p className="text-l  text-slate-600">{guide?.doctors.specialty}</p>
                    </div>
                </header>

                <div className="space-y-10">
                    {guide.content?.symptoms && (
                        <Section
                            title="Síntomas"
                            items={guide.content.symptoms}
                            icon={LuActivity}
                            color="rose"
                        />
                    )}

                    {guide.content?.homeCare && (
                        <Section
                            title="Cuidados en Casa"
                            items={guide.content.homeCare}
                            icon={LuHouse}
                            color="blue"
                        />
                    )}

                    {guide.content?.whenToSeeDoctor && (
                        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                            <Section
                                title="Atención Médica"
                                items={guide.content.whenToSeeDoctor}
                                icon={LuCircleAlert}
                                color="amber"
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

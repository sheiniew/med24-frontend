import {
    LuHeart, LuArrowLeft, LuBookOpen, LuTrash2, LuX,
    LuActivity, LuInfo, LuHouse, LuCircleAlert, LuShieldCheck
} from "react-icons/lu";

export default function ModalGuideDetail({ selectedGuide, setSelectedGuide }) {

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                onClick={() => setSelectedGuide(null)}
            />
            <div className="relative bg-white max-w-2xl w-full rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white">

                {/* Modal Header */}
                <div className="relative p-8 pb-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-black text-slate-900">{selectedGuide.title}</h2>
                        <button onClick={() => setSelectedGuide(null)} className="p-2 rounded-full bg-slate-50 text-slate-400">
                            <LuX size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
                    {selectedGuide.description && (
                        <div className="flex gap-3 p-4 bg-blue-50 rounded-2xl text-blue-800 border border-blue-100">
                            <LuInfo className="shrink-0 mt-1" />
                            <p className="text-sm">{selectedGuide.description}</p>
                        </div>
                    )}

                    {selectedGuide.content?.symptoms && (
                        <Section title="Síntomas Comunes" items={selectedGuide.content.symptoms} icon={LuActivity} accentColor="rose" />
                    )}

                    {selectedGuide.content?.homeCare && (
                        <Section title="Cuidados en Casa" items={selectedGuide.content.homeCare} icon={LuHouse} accentColor="blue" />
                    )}

                    {selectedGuide.content?.whenToSeeDoctor && (
                        <Section title="Cuándo acudir al médico" items={selectedGuide.content.whenToSeeDoctor} icon={LuCircleAlert} accentColor="amber" />
                    )}

                    {selectedGuide.content?.prevention && (
                        <Section title="Prevención" items={selectedGuide.content.prevention} icon={LuShieldCheck} accentColor="emerald" />
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t flex justify-end">
                    <button onClick={() => setSelectedGuide(null)} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

function Section({ title, items, icon: Icon, accentColor }) {
    const colors = {
        rose: "bg-rose-100 text-rose-600",
        blue: "bg-blue-100 text-blue-600",
        amber: "bg-amber-100 text-amber-700",
        emerald: "bg-emerald-100 text-emerald-600"
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${colors[accentColor]}`}>
                    <Icon size={20} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            </div>
            <div className="grid gap-3 pl-2">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                        <p className="text-slate-600 text-sm">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
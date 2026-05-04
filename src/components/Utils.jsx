export function Input({ label, ...props }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">{label}</label>
            <input {...props} className="border rounded-xl px-4 py-3" />
        </div>
    );
}

export function Textarea({ label, ...props }) {
    return (
        <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm text-gray-600">{label}</label>
            <textarea {...props} rows={3} className="border rounded-xl px-4 py-3" />
        </div>
    );
}

export function Section({ title, items, icon: Icon, accentColor }) {
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


export const getUrgencyColor = (urgency) => {
    const styles = {
        low: "bg-green-50 text-green-700 border-green-100",
        medium: "bg-amber-50 text-amber-700 border-amber-100",
        high: "bg-red-50 text-red-700 border-red-100",
    };
    return styles[urgency] || "bg-slate-50 text-slate-700 border-slate-100";
};

export const getUrgencyText = (urgency) => {
    switch (urgency) {
        case 'low': return 'Baja';
        case 'medium': return 'Media';
        case 'high': return 'Alta';
        default: return '';
    }
};

export function DynamicSection({ title, section, content, onChange, addItem, removeItem }) {
    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">{title}</h3>

            {content[section].map((item, index) => (
                <div key={index} className="flex gap-2">
                    <input
                        value={item}
                        onChange={(e) => onChange(section, index, e.target.value)}
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2"
                        placeholder={`Agregar ${title.toLowerCase()}`}
                    />

                    <button
                        onClick={() => removeItem(section, index)}
                        className="text-red-500 px-3"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button
                onClick={() => addItem(section)}
                className="text-blue-600 text-sm"
            >
                + Añadir
            </button>
        </div>
    );
}
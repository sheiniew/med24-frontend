

export default function Footer() {
    return (
        <div>
            <footer className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                </div>
                                <span className="font-bold">MED 24</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Brindando atención médica de calidad con tecnología de vanguardia.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Navegación</h3>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>Servicios Básicos</li>
                                <li>Equipo e Investigación</li>
                                <li>Guías Médicas</li>
                                <li>Chat IA 24/7</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Horario</h3>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>Chat IA: 24/7</li>
                                <li>Atención: 24 horas</li>
                                <li>Emergencias: Siempre</li>
                                <li>Guías: Disponibles 24/7</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Contacto</h3>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li>Tel: +34 900 123 456</li>
                                <li>Email: info@med24.com</li>
                                <li>Chat IA disponible</li>
                                <li>Guías médicas gratuitas</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
                        <p>&copy; 2026 MED 24. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
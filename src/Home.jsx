import { 
  LuClock, 
  LuArrowRight, 
  LuHeart, 
  LuShieldCheck, 
  LuSparkles, 
  LuPhone, 
  LuHeadphones, 
  LuMessageCircle
} from "react-icons/lu";
import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: LuShieldCheck,
      title: "Profesionales Certificados",
      description: "Equipo médico altamente calificado con años de experiencia",
    },
    {
      icon: LuHeart,
      title: "Asistencia Inteligente",
      description: "Cualquier necesidad que tengas la puedes resolver con nuestra IA en chat...",
    },
    {
      icon: LuSparkles,
      title: "Chat IA Médico",
      description: "Asistente virtual disponible 24/7 para responder tus consultas",
    },
    {
      icon: LuClock,
      title: "Disponible Sin Conexión",
      description: "La página estará habilitada en todo momento incluso sin conexión",
    },
  ];

  const urgencyServices = [
    { 
      icon: LuPhone, 
      title: "Línea de Urgencias", 
      description: "Atención telefónica inmediata",
      contact: "+34 900 123 457"
    },
    { 
      icon: LuMessageCircle, 
      title: "Chat IA 24/7", 
      description: "Consultas virtuales instantáneas",
      contact: "Disponible ahora"
    },
    { 
      icon: LuHeadphones, 
      title: "Soporte Continuo", 
      description: "La página estará habilitada en todo momento",
      contact: "24 horas al día"
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <LuSparkles className="w-4 h-4" />
                <span className="text-sm">Con tecnología de IA</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Tu salud en las mejores manos</h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/chat" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg">
                  <span>Consulta con IA</span>
                  <LuArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 24/7 Attention Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {urgencyServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white/10 p-6 rounded-xl border border-white/20">
                  <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-bold text-lg">{service.title}</h3>
                  <p className="text-red-100 text-sm mb-3">{service.description}</p>
                  <div className="text-white font-semibold text-sm bg-white/20 px-3 py-2 rounded-lg inline-block">
                    {service.contact}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
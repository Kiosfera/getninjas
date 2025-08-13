import {
  Search,
  Star,
  MapPin,
  Clock,
  Wrench,
  Home,
  Palette,
  Car,
  Heart,
  Laptop,
  Scissors,
  TreePine,
  Bell,
  Filter,
  ArrowRight,
  Zap,
  Shield,
  Award,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationToast from "@/components/NotificationToast";
import AuthModal from "@/components/AuthModal";
import Logo from "@/components/Logo";

const serviceCategories = [
  {
    icon: Wrench,
    name: "Manutenção",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    icon: Home,
    name: "Casa & Jardim",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    icon: Palette,
    name: "Design",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    icon: Car,
    name: "Automotivo",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    icon: Heart,
    name: "Saúde",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
  },
  {
    icon: Laptop,
    name: "Tecnologia",
    color: "from-indigo-500 to-blue-500",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
  },
];

const featuredProfessionals = [
  {
    id: 1,
    name: "Carlos Silva",
    profession: "Eletricista Residencial",
    rating: 4.9,
    reviews: 127,
    image: "/placeholder.svg",
    location: "São Paulo, SP • 2.3 km",
    price: "R$ 85",
    verified: true,
    responseTime: "Responde em ~15 min",
    completedJobs: 234,
    tags: ["Disponível hoje", "Emergência 24h"],
  },
  {
    id: 2,
    name: "Ana Costa",
    profession: "Designer Gráfico",
    rating: 5.0,
    reviews: 89,
    image: "/placeholder.svg",
    location: "Rio de Janeiro, RJ • 1.8 km",
    price: "R$ 120",
    verified: true,
    responseTime: "Responde em ~30 min",
    completedJobs: 156,
    tags: ["Portfolio premium", "Entrega rápida"],
  },
  {
    id: 3,
    name: "João Santos",
    profession: "Paisagista",
    rating: 4.8,
    reviews: 203,
    image: "/placeholder.svg",
    location: "Brasília, DF • 3.1 km",
    price: "R$ 75",
    verified: true,
    responseTime: "Responde em ~45 min",
    completedJobs: 312,
    tags: ["Eco-sustentável", "Orçamento grátis"],
  },
];

const quickStats = [
  {
    icon: Shield,
    value: "50k+",
    label: "Profissionais Verificados",
    color: "text-blue-600",
  },
  {
    icon: Award,
    value: "4.8★",
    label: "Avaliação Média",
    color: "text-yellow-600",
  },
  {
    icon: CheckCircle,
    value: "2M+",
    label: "Serviços Realizados",
    color: "text-green-600",
  },
];

export default function Index() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({ message: "", type: "info", visible: false });

  const showNotification = (
    message: string,
    type: "success" | "error" | "info",
  ) => {
    setNotification({ message, type, visible: true });
  };

  const handleQuickAction = (action: string) => {
    showNotification(`${action} selecionado! Redirecionando...`, "success");
  };

  const handleHireProfessional = (name: string) => {
    showNotification(`Solicitação enviada para ${name}!`, "success");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Clean Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo size="sm" variant="full" />
              <div className="hidden sm:flex items-center body-text text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1 text-primary" />
                São Paulo, SP
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <button className="relative p-2.5 bg-secondary rounded-xl hover:bg-muted transition-smooth">
                    <Bell className="w-5 h-5 text-foreground" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  </button>
                  <div className="flex items-center space-x-2">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-8 h-8 rounded-full bg-secondary"
                    />
                    <div className="hidden sm:block">
                      <p className="subtitle text-sm text-foreground truncate max-w-20">
                        {user.name}
                      </p>
                      <p className="body-text text-xs text-muted-foreground capitalize">
                        {user.type}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="gradient-primary text-white px-4 py-2 rounded-xl button-text text-sm hover:shadow-soft-hover transition-smooth"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Search */}
      <section className="px-4 pt-6 pb-4 bg-white">
        <div className="mb-6">
          <h2 className="text-2xl title-bold text-foreground mb-2">
            Encontre o profissional ideal
          </h2>
          <p className="body-text text-muted-foreground">
            Conecte-se com especialistas qualificados perto de você
          </p>
        </div>

        <div className="relative mb-4">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Ex: Encanador, Designer, Jardineiro..."
            className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-border shadow-soft focus:shadow-soft-hover focus:ring-2 focus:ring-primary/20 focus:border-primary body-text transition-smooth"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth">
            <Filter className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => handleQuickAction("Serviço urgente")}
            className="flex items-center px-4 py-2.5 bg-primary/10 text-primary rounded-xl button-text text-sm hover:bg-primary/20 transition-smooth whitespace-nowrap ripple"
          >
            <Clock className="w-4 h-4 mr-2" />
            Urgente
          </button>
          <button
            onClick={() => handleQuickAction("Filtro: Mais avaliados")}
            className="flex items-center px-4 py-2.5 bg-secondary text-foreground rounded-xl button-text text-sm hover:bg-muted transition-smooth whitespace-nowrap ripple"
          >
            <Star className="w-4 h-4 mr-2" />
            Mais Avaliados
          </button>
          <button
            onClick={() => handleQuickAction("Filtro: Próximos")}
            className="flex items-center px-4 py-2.5 bg-secondary text-foreground rounded-xl button-text text-sm hover:bg-muted transition-smooth whitespace-nowrap ripple"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Próximos
          </button>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="px-4 py-4 bg-secondary/30">
        <div className="grid grid-cols-3 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center py-3">
              <div
                className={`inline-flex items-center justify-center w-10 h-10 ${stat.color.replace("text-", "bg-").replace("-600", "-50")} rounded-xl mb-2`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="title-bold text-lg text-foreground">
                {stat.value}
              </div>
              <div className="body-text text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-6 bg-white">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg title-semibold text-foreground">
            Categorias Populares
          </h3>
          <Link
            to="/search"
            className="flex items-center text-primary button-text text-sm hover:text-primary-600 transition-smooth"
          >
            Ver todas
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {serviceCategories.map((category, index) => (
            <Link
              key={index}
              to="/search"
              className="group transition-bounce hover:scale-105"
            >
              <div className="bg-white rounded-2xl p-4 shadow-soft hover:shadow-soft-hover transition-smooth border border-border group-hover:border-primary/20">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-3 shadow-soft`}
                >
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h4
                  className={`subtitle text-sm text-foreground leading-tight`}
                >
                  {category.name}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg title-semibold text-foreground">
            Profissionais em Destaque
          </h3>
          <Link
            to="/search"
            className="flex items-center text-primary button-text text-sm hover:text-primary-600 transition-smooth"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {featuredProfessionals.map((professional) => (
            <div
              key={professional.id}
              className="bg-white rounded-2xl p-5 shadow-soft hover:shadow-soft-hover transition-smooth cursor-pointer border border-border hover:border-primary/20 group"
            >
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={professional.image}
                    alt={professional.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-secondary"
                  />
                  {professional.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white shadow-soft">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="title-semibold text-foreground truncate mb-1">
                        {professional.name}
                      </h4>
                      <p className="body-text text-muted-foreground text-sm mb-2">
                        {professional.profession}
                      </p>

                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="subtitle text-sm text-foreground ml-1">
                            {professional.rating}
                          </span>
                          <span className="body-text text-xs text-muted-foreground ml-1">
                            ({professional.reviews})
                          </span>
                        </div>
                        <div className="body-text text-xs text-muted-foreground">
                          {professional.completedJobs} trabalhos
                        </div>
                      </div>

                      <div className="flex items-center text-muted-foreground mb-3">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="body-text text-xs">
                          {professional.location}
                        </span>
                      </div>

                      <div className="body-text text-xs text-success mb-3">
                        {professional.responseTime}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {professional.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs button-text rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="title-bold text-lg text-foreground mb-1">
                        {professional.price}
                        <span className="body-text text-sm text-muted-foreground font-normal">
                          /hora
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleHireProfessional(professional.name)
                        }
                        className="gradient-primary text-white px-5 py-2.5 rounded-xl button-text text-sm hover:shadow-soft-hover transition-smooth group-hover:scale-105 transition-bounce ripple"
                      >
                        Contratar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-6">
        <div className="gradient-primary rounded-2xl p-6 text-white shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="title-bold text-xl mb-2">
                Precisa de ajuda agora?
              </h3>
              <p className="body-text text-blue-100 text-sm mb-4 opacity-90">
                Receba orçamentos em minutos dos melhores profissionais
              </p>
              <button
                onClick={() =>
                  showNotification("Formulário de orçamento aberto!", "info")
                }
                className="bg-white text-primary px-6 py-3 rounded-xl button-text hover:bg-gray-50 transition-smooth shadow-soft ripple"
              >
                Solicitar Orçamento
              </button>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Toast */}
      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

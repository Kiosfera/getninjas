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
} from "lucide-react";
import { Link } from "react-router-dom";

const serviceCategories = [
  {
    icon: Wrench,
    name: "Manutenção",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Home,
    name: "Casa & Jardim",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Palette,
    name: "Design",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Car,
    name: "Automotivo",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Heart,
    name: "Saúde & Bem-estar",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    icon: Laptop,
    name: "Tecnologia",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

const featuredProfessionals = [
  {
    id: 1,
    name: "Carlos Silva",
    profession: "Eletricista Especializado",
    rating: 4.9,
    reviews: 127,
    image: "/placeholder.svg",
    location: "São Paulo, SP",
    price: "R$ 80",
    verified: true,
    responseTime: "~15 min",
    tags: ["Urgente", "Residencial"],
  },
  {
    id: 2,
    name: "Ana Costa",
    profession: "Designer Gráfico",
    rating: 5.0,
    reviews: 89,
    image: "/placeholder.svg",
    location: "Rio de Janeiro, RJ",
    price: "R$ 120",
    verified: true,
    responseTime: "~30 min",
    tags: ["Digital", "Branding"],
  },
  {
    id: 3,
    name: "João Santos",
    profession: "Jardineiro Paisagista",
    rating: 4.8,
    reviews: 203,
    image: "/placeholder.svg",
    location: "Brasília, DF",
    price: "R$ 60",
    verified: true,
    responseTime: "~45 min",
    tags: ["Eco-friendly", "Sustentável"],
  },
];

const quickStats = [
  { icon: Shield, value: "50k+", label: "Profissionais Verificados" },
  { icon: Award, value: "4.8", label: "Avaliação Média" },
  { icon: Zap, value: "24h", label: "Suporte Disponível" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Location */}
      <header className="gradient-card shadow-tech sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl title-bold text-gray-900">
                  ServiçosApp
                </h1>
                <div className="flex items-center text-sm body-text text-gray-600">
                  <MapPin className="w-3 h-3 mr-1 text-primary" />
                  São Paulo, SP
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <Bell className="w-5 h-5 text-gray-700" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="px-4 pt-6 pb-4">
        <div className="mb-6">
          <h2 className="text-2xl title-bold text-gray-900 mb-2">
            Encontre o profissional ideal
          </h2>
          <p className="body-text text-gray-600">
            Milhares de especialistas prontos para te atender
          </p>
        </div>

        <div className="relative mb-4">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Ex: Encanador, Designer, Jardineiro..."
            className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-0 shadow-tech focus:shadow-tech-hover focus:ring-2 focus:ring-primary body-text transition-all duration-200"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-primary-50 text-primary rounded-full button-text text-sm hover:bg-primary-100 transition-colors">
            <Clock className="w-4 h-4 mr-2" />
            Urgente
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full button-text text-sm hover:bg-gray-200 transition-colors">
            <Star className="w-4 h-4 mr-2" />
            Mais Avaliados
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 py-4">
        <div className="grid grid-cols-3 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center py-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-50 rounded-full mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="title-bold text-lg text-gray-900">
                {stat.value}
              </div>
              <div className="body-text text-xs text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg title-semibold text-gray-900">
            Categorias Populares
          </h3>
          <Link
            to="/search"
            className="flex items-center text-primary button-text text-sm hover:text-primary-600 transition-colors"
          >
            Ver todas
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {serviceCategories.map((category, index) => (
            <Link key={index} to="/search" className="group">
              <div className="bg-white rounded-2xl p-4 shadow-tech hover:shadow-tech-hover transition-all duration-200 group-hover:-translate-y-1">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-3`}
                >
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="subtitle text-sm text-gray-900 leading-tight">
                  {category.name}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg title-semibold text-gray-900">
            Profissionais Destacados
          </h3>
          <Link
            to="/search"
            className="flex items-center text-primary button-text text-sm hover:text-primary-600 transition-colors"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {featuredProfessionals.map((professional) => (
            <div
              key={professional.id}
              className="bg-white rounded-2xl p-4 shadow-tech hover:shadow-tech-hover transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={professional.image}
                    alt={professional.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-gray-200"
                  />
                  {professional.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="title-semibold text-gray-900 truncate">
                        {professional.name}
                      </h4>
                      <p className="body-text text-gray-600 text-sm mb-1">
                        {professional.profession}
                      </p>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="subtitle text-sm text-gray-700 ml-1">
                            {professional.rating}
                          </span>
                          <span className="body-text text-xs text-gray-500 ml-1">
                            ({professional.reviews})
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span className="body-text text-xs">
                            {professional.responseTime}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500 mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="body-text text-xs">
                          {professional.location}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {professional.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-primary-50 text-primary text-xs button-text rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="title-bold text-lg text-primary mb-1">
                        {professional.price}
                        <span className="body-text text-sm text-gray-500">
                          /hora
                        </span>
                      </div>
                      <button className="gradient-primary text-white px-4 py-2 rounded-xl button-text text-sm hover:shadow-lg transition-all duration-200 group-hover:scale-105">
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
        <div className="gradient-primary rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="title-bold text-lg mb-2">
                Precisa de um serviço agora?
              </h3>
              <p className="body-text text-blue-100 text-sm mb-4">
                Receba orçamentos em minutos de profissionais próximos a você
              </p>
              <button className="bg-white text-primary px-6 py-3 rounded-xl button-text hover:bg-gray-50 transition-colors">
                Solicitar Orçamento
              </button>
            </div>
            <div className="ml-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

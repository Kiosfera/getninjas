import { Search, Star, MapPin, Clock, Wrench, Home, Palette, Car, Heart, Laptop, Scissors, TreePine } from "lucide-react";
import { Link } from "react-router-dom";

const serviceCategories = [
  { icon: Wrench, name: "Manutenção", color: "bg-blue-500" },
  { icon: Home, name: "Casa & Jardim", color: "bg-green-500" },
  { icon: Palette, name: "Design", color: "bg-purple-500" },
  { icon: Car, name: "Automotivo", color: "bg-red-500" },
  { icon: Heart, name: "Saúde & Bem-estar", color: "bg-pink-500" },
  { icon: Laptop, name: "Tecnologia", color: "bg-indigo-500" },
  { icon: Scissors, name: "Beleza", color: "bg-yellow-500" },
  { icon: TreePine, name: "Meio Ambiente", color: "bg-emerald-500" },
];

const featuredProfessionals = [
  {
    id: 1,
    name: "Carlos Silva",
    profession: "Eletricista",
    rating: 4.9,
    reviews: 127,
    image: "/placeholder.svg",
    location: "São Paulo, SP",
    price: "R$ 80/hora"
  },
  {
    id: 2,
    name: "Ana Costa",
    profession: "Designer Gráfico",
    rating: 5.0,
    reviews: 89,
    image: "/placeholder.svg",
    location: "Rio de Janeiro, RJ",
    price: "R$ 120/hora"
  },
  {
    id: 3,
    name: "João Santos",
    profession: "Jardineiro",
    rating: 4.8,
    reviews: 203,
    image: "/placeholder.svg",
    location: "Brasília, DF",
    price: "R$ 60/hora"
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-poppins font-bold text-gray-900">
                ServiçosApp
              </h1>
              <p className="text-sm text-gray-600 font-montserrat">
                Encontre profissionais de confiança
              </p>
            </div>
            <div className="bg-primary-50 p-2 rounded-full">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Que serviço você precisa?"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-primary focus:bg-white transition-colors font-montserrat"
          />
        </div>
      </div>

      {/* Categories */}
      <section className="px-4 py-6">
        <h2 className="text-lg font-poppins font-semibold text-gray-900 mb-4">
          Categorias Populares
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {serviceCategories.map((category, index) => (
            <Link
              key={index}
              to="/search"
              className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${category.color} p-3 rounded-full mb-2`}>
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-montserrat font-medium text-gray-700 text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-poppins font-semibold text-gray-900">
            Profissionais em Destaque
          </h2>
          <Link to="/search" className="text-primary font-montserrat font-medium text-sm">
            Ver todos
          </Link>
        </div>
        
        <div className="space-y-4">
          {featuredProfessionals.map((professional) => (
            <div
              key={professional.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={professional.image}
                  alt={professional.name}
                  className="w-16 h-16 rounded-full object-cover bg-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-poppins font-semibold text-gray-900">
                        {professional.name}
                      </h3>
                      <p className="text-gray-600 font-montserrat text-sm">
                        {professional.profession}
                      </p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-montserrat font-medium text-gray-700 ml-1">
                          {professional.rating}
                        </span>
                        <span className="text-sm text-gray-500 font-montserrat ml-1">
                          ({professional.reviews} avaliações)
                        </span>
                      </div>
                      <div className="flex items-center mt-2 text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="text-xs font-montserrat">
                          {professional.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-poppins font-semibold text-primary">
                        {professional.price}
                      </p>
                      <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-montserrat font-medium mt-2 hover:bg-primary-600 transition-colors">
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

      {/* Quick Actions */}
      <section className="px-4 py-6">
        <h2 className="text-lg font-poppins font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/requests"
            className="bg-gradient-to-r from-primary to-primary-600 p-4 rounded-xl text-white"
          >
            <Clock className="w-6 h-6 mb-2" />
            <h3 className="font-poppins font-semibold">Urgente</h3>
            <p className="text-sm font-montserrat opacity-90">
              Preciso de ajuda agora
            </p>
          </Link>
          <Link
            to="/search"
            className="bg-gradient-to-r from-success to-green-600 p-4 rounded-xl text-white"
          >
            <Star className="w-6 h-6 mb-2" />
            <h3 className="font-poppins font-semibold">Melhor Avaliados</h3>
            <p className="text-sm font-montserrat opacity-90">
              Top profissionais
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

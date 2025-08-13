import { useState, useEffect } from "react";
import { Search as SearchIcon, Filter, MapPin, Star, ArrowLeft, SlidersHorizontal, Grid, List, Clock, Shield, ChevronDown } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NotificationToast from "@/components/NotificationToast";

const serviceCategories = [
  { id: "all", name: "Todos", count: 1247 },
  { id: "eletricista", name: "Eletricista", count: 156 },
  { id: "encanador", name: "Encanador", count: 134 },
  { id: "pedreiro", name: "Pedreiro", count: 98 },
  { id: "pintor", name: "Pintor", count: 87 },
  { id: "marceneiro", name: "Marceneiro", count: 76 },
  { id: "jardineiro", name: "Jardineiro", count: 65 },
  { id: "diarista", name: "Diarista", count: 234 },
  { id: "montador", name: "Montador", count: 89 },
];

const sortOptions = [
  { id: "relevance", name: "Mais Relevante" },
  { id: "rating", name: "Melhor Avaliado" },
  { id: "price_low", name: "Menor Preço" },
  { id: "price_high", name: "Maior Preço" },
  { id: "distance", name: "Mais Próximo" },
  { id: "recent", name: "Mais Recente" },
];

const professionals = [
  {
    id: 1,
    name: "Carlos Silva",
    profession: "Eletricista Predial",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 127,
    completedJobs: 234,
    responseTime: "~15 min",
    location: "São Paulo, SP",
    distance: 2.3,
    hourlyRate: 85,
    verified: true,
    available: true,
    tags: ["Emergência 24h", "Residencial", "Comercial"],
    description: "Eletricista com mais de 10 anos de experiência em instalações prediais, industriais e residenciais.",
    portfolio: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: 2,
    name: "Ana Costa",
    profession: "Designer Gráfico",
    avatar: "/placeholder.svg",
    rating: 5.0,
    reviewCount: 89,
    completedJobs: 156,
    responseTime: "~30 min",
    location: "Rio de Janeiro, RJ",
    distance: 5.7,
    hourlyRate: 120,
    verified: true,
    available: true,
    tags: ["Identidade Visual", "Web Design", "Print"],
    description: "Designer especializada em identidade visual e branding para pequenas e médias empresas.",
    portfolio: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: 3,
    name: "João Santos",
    profession: "Paisagista Sustentável",
    avatar: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 203,
    completedJobs: 312,
    responseTime: "~45 min",
    location: "Brasília, DF",
    distance: 8.1,
    hourlyRate: 75,
    verified: true,
    available: false,
    tags: ["Eco-friendly", "Jardim Vertical", "Orgânico"],
    description: "Paisagista com foco em soluções sustentáveis e jardins ecológicos para espaços urbanos.",
    portfolio: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  },
  {
    id: 4,
    name: "Maria Oliveira",
    profession: "Diarista Premium",
    avatar: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 345,
    completedJobs: 567,
    responseTime: "~20 min",
    location: "São Paulo, SP",
    distance: 3.2,
    hourlyRate: 45,
    verified: true,
    available: true,
    tags: ["Limpeza Pesada", "Organização", "Confiável"],
    description: "Profissional de limpeza especializada em limpeza residencial e organização de ambientes.",
    portfolio: ["/placeholder.svg", "/placeholder.svg"],
  },
];

export default function Search() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: "success" | "error" | "info", visible: boolean}>({ message: "", type: "info", visible: false });

  const [filters, setFilters] = useState({
    minRating: 0,
    maxDistance: 50,
    priceRange: { min: 0, max: 500 },
    availability: "all" as "all" | "available" | "busy",
    verified: false,
  });

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type, visible: true });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    setSearchParams(params);
    
    showNotification("Busca atualizada!", "info");
  };

  const handleContactProfessional = (professionalName: string) => {
    if (!user) {
      showNotification("Faça login para entrar em contato", "info");
      return;
    }
    showNotification(`Abrindo chat com ${professionalName}`, "success");
  };

  const filteredProfessionals = professionals.filter(prof => {
    // Category filter
    if (selectedCategory !== "all" && !prof.profession.toLowerCase().includes(selectedCategory)) {
      return false;
    }
    
    // Search query filter
    if (searchQuery && !prof.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !prof.profession.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Rating filter
    if (prof.rating < filters.minRating) return false;
    
    // Distance filter
    if (prof.distance > filters.maxDistance) return false;
    
    // Price filter
    if (prof.hourlyRate < filters.priceRange.min || prof.hourlyRate > filters.priceRange.max) return false;
    
    // Availability filter
    if (filters.availability === "available" && !prof.available) return false;
    if (filters.availability === "busy" && prof.available) return false;
    
    // Verified filter
    if (filters.verified && !prof.verified) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <Link to="/" className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl title-bold text-foreground">Buscar Profissionais</h1>
          </div>

          {/* Search Bar */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Buscar por nome ou profissão..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
              />
            </div>
            <button
              onClick={handleSearch}
              className="gradient-primary text-white px-4 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth"
            >
              Buscar
            </button>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="px-4 py-4 bg-white border-b border-border">
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm button-text transition-smooth ${
                selectedCategory === category.id
                  ? "bg-primary text-white shadow-soft"
                  : "bg-secondary text-foreground hover:bg-muted"
              }`}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="px-4 py-4 bg-white border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <span className="button-text text-sm">Filtros</span>
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-secondary rounded-xl px-4 py-2 pr-8 button-text text-sm hover:bg-muted transition-smooth cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="body-text text-sm text-muted-foreground">
              {filteredProfessionals.length} encontrados
            </span>
            <div className="flex bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded transition-smooth ${
                  viewMode === "list" ? "bg-white shadow-soft" : "hover:bg-muted"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded transition-smooth ${
                  viewMode === "grid" ? "bg-white shadow-soft" : "hover:bg-muted"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-secondary rounded-xl space-y-4">
            <div>
              <label className="block subtitle text-sm text-foreground mb-2">
                Avaliação Mínima: {filters.minRating > 0 ? `${filters.minRating}★` : "Qualquer"}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block subtitle text-sm text-foreground mb-2">
                Distância Máxima: {filters.maxDistance}km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={filters.maxDistance}
                onChange={(e) => setFilters({ ...filters, maxDistance: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block subtitle text-sm text-foreground mb-2">
                Faixa de Preço: R$ {filters.priceRange.min} - R$ {filters.priceRange.max}/hora
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    priceRange: { ...filters.priceRange, min: parseInt(e.target.value) || 0 }
                  })}
                  className="px-3 py-2 border border-border rounded-lg body-text"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    priceRange: { ...filters.priceRange, max: parseInt(e.target.value) || 500 }
                  })}
                  className="px-3 py-2 border border-border rounded-lg body-text"
                  placeholder="Máximo"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                />
                <span className="ml-2 body-text text-sm">Apenas verificados</span>
              </label>

              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value as any })}
                className="px-3 py-2 border border-border rounded-lg body-text text-sm"
              >
                <option value="all">Qualquer disponibilidade</option>
                <option value="available">Apenas disponíveis</option>
                <option value="busy">Apenas ocupados</option>
              </select>
            </div>
          </div>
        )}
      </section>

      {/* Results */}
      <section className="px-4 py-6">
        {filteredProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl title-semibold text-foreground mb-2">
              Nenhum profissional encontrado
            </h3>
            <p className="body-text text-muted-foreground mb-4">
              Tente ajustar seus filtros ou buscar por outros termos
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setFilters({
                  minRating: 0,
                  maxDistance: 50,
                  priceRange: { min: 0, max: 500 },
                  availability: "all",
                  verified: false,
                });
              }}
              className="gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
          }`}>
            {filteredProfessionals.map((professional) => (
              <div
                key={professional.id}
                className="bg-white rounded-2xl p-4 shadow-soft border border-border hover:shadow-soft-hover transition-smooth"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={professional.avatar}
                      alt={professional.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-secondary"
                    />
                    {professional.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {professional.available && (
                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Link
                          to={`/professional/${professional.id}`}
                          className="title-semibold text-foreground hover:text-primary transition-smooth"
                        >
                          {professional.name}
                        </Link>
                        <p className="body-text text-muted-foreground text-sm">
                          {professional.profession}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="title-bold text-lg text-primary">
                          R$ {professional.hourlyRate}
                          <span className="body-text text-sm text-muted-foreground font-normal">/hora</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="subtitle text-sm text-foreground ml-1">
                          {professional.rating}
                        </span>
                        <span className="body-text text-xs text-muted-foreground ml-1">
                          ({professional.reviewCount})
                        </span>
                      </div>
                      <div className="body-text text-xs text-muted-foreground">
                        {professional.completedJobs} trabalhos
                      </div>
                      <div className="flex items-center text-success">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="body-text text-xs">{professional.responseTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="body-text text-xs">
                        {professional.location} • {professional.distance}km
                      </span>
                    </div>

                    <p className="body-text text-sm text-muted-foreground mb-3 line-clamp-2">
                      {professional.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {professional.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs button-text rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/professional/${professional.id}`}
                        className="flex-1 bg-secondary text-foreground px-4 py-2 rounded-xl button-text text-sm text-center hover:bg-muted transition-smooth"
                      >
                        Ver Perfil
                      </Link>
                      <button
                        onClick={() => handleContactProfessional(professional.name)}
                        className="flex-1 gradient-primary text-white px-4 py-2 rounded-xl button-text text-sm hover:shadow-soft-hover transition-smooth"
                      >
                        Contatar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </div>
  );
}

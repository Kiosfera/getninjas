import { useState } from "react";
import { ArrowLeft, Plus, Search, Filter, MapPin, Clock, DollarSign, MessageCircle, Star, Eye, MoreVertical, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PlaceholderPage from "@/components/PlaceholderPage";
import NotificationToast from "@/components/NotificationToast";

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: { min: number; max: number; type: "range" | "fixed" };
  status: "open" | "quoted" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  urgency: "low" | "medium" | "high";
  quotesCount: number;
  viewsCount: number;
  images?: string[];
  selectedProfessional?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  deadline?: string;
}

const mockRequests: ServiceRequest[] = [
  {
    id: "req_1",
    title: "Instalação de Chuveiro Elétrico",
    description: "Preciso instalar um chuveiro elétrico novo no banheiro. O ponto já existe, apenas trocar o equipamento.",
    category: "Eletricista",
    location: "São Paulo, SP",
    budget: { min: 80, max: 150, type: "range" },
    status: "quoted",
    createdAt: "2024-01-15",
    urgency: "medium",
    quotesCount: 5,
    viewsCount: 23,
    images: ["/placeholder.svg"],
  },
  {
    id: "req_2", 
    title: "Design de Logo para Empresa",
    description: "Startup de tecnologia precisa de logo moderno e identidade visual completa.",
    category: "Design",
    location: "Rio de Janeiro, RJ",
    budget: { min: 500, max: 500, type: "fixed" },
    status: "in_progress",
    createdAt: "2024-01-10",
    urgency: "low",
    quotesCount: 8,
    viewsCount: 45,
    selectedProfessional: {
      id: "prof_2",
      name: "Ana Costa",
      avatar: "/placeholder.svg",
      rating: 5.0
    },
    deadline: "2024-01-25"
  },
  {
    id: "req_3",
    title: "Jardinagem e Paisagismo",
    description: "Reforma completa do jardim da casa, incluindo nova grama, plantas e sistema de irrigação.",
    category: "Jardineiro",
    location: "Brasília, DF", 
    budget: { min: 800, max: 1200, type: "range" },
    status: "completed",
    createdAt: "2023-12-20",
    urgency: "low",
    quotesCount: 3,
    viewsCount: 12,
    selectedProfessional: {
      id: "prof_3",
      name: "João Santos", 
      avatar: "/placeholder.svg",
      rating: 4.8
    }
  },
  {
    id: "req_4",
    title: "Limpeza Pós-Obra",
    description: "Limpeza completa após reforma. Casa de 120m² com 3 quartos.",
    category: "Diarista",
    location: "São Paulo, SP",
    budget: { min: 300, max: 400, type: "range" },
    status: "open",
    createdAt: "2024-01-18",
    urgency: "high",
    quotesCount: 2,
    viewsCount: 15,
  }
];

export default function Requests() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "open" | "in_progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{message: string, type: "success" | "error" | "info", visible: boolean}>({ message: "", type: "info", visible: false });

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type, visible: true });
  };

  if (!user) {
    return (
      <PlaceholderPage
        title="Suas Solicitações"
        description="Faça login para gerenciar seus pedidos de serviços e acompanhar o progresso."
      />
    );
  }

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" || request.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: ServiceRequest["status"]) => {
    switch (status) {
      case "open": return "text-blue-600 bg-blue-50";
      case "quoted": return "text-yellow-600 bg-yellow-50";
      case "in_progress": return "text-orange-600 bg-orange-50";
      case "completed": return "text-green-600 bg-green-50";
      case "cancelled": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: ServiceRequest["status"]) => {
    switch (status) {
      case "open": return "Aberto";
      case "quoted": return "Com orçamentos";
      case "in_progress": return "Em andamento";
      case "completed": return "Concluído";
      case "cancelled": return "Cancelado";
      default: return status;
    }
  };

  const getUrgencyColor = (urgency: ServiceRequest["urgency"]) => {
    switch (urgency) {
      case "low": return "text-gray-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: ServiceRequest["status"]) => {
    switch (status) {
      case "open": return <Clock className="w-4 h-4" />;
      case "quoted": return <MessageCircle className="w-4 h-4" />;
      case "in_progress": return <AlertCircle className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const tabCounts = {
    all: mockRequests.length,
    open: mockRequests.filter(r => r.status === "open").length,
    in_progress: mockRequests.filter(r => r.status === "in_progress").length,
    completed: mockRequests.filter(r => r.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link to="/" className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <h1 className="text-xl title-bold text-foreground">Suas Solicitações</h1>
            </div>
            <Link
              to="/post-request"
              className="flex items-center px-4 py-2 gradient-primary text-white rounded-xl button-text text-sm hover:shadow-soft-hover transition-smooth"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Solicitação
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar suas solicitações..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
            />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <section className="px-4 py-4 bg-white border-b border-border">
        <div className="flex space-x-1 bg-secondary rounded-xl p-1">
          {[
            { id: "all", name: "Todas", count: tabCounts.all },
            { id: "open", name: "Abertas", count: tabCounts.open },
            { id: "in_progress", name: "Em Andamento", count: tabCounts.in_progress },
            { id: "completed", name: "Concluídas", count: tabCounts.completed },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 rounded-lg button-text text-sm transition-smooth ${
                activeTab === tab.id
                  ? "bg-white text-primary shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-1 text-xs opacity-75">({tab.count})</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Requests List */}
      <section className="px-4 py-6">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl title-semibold text-foreground mb-2">
                  Nenhuma solicitação encontrada
                </h3>
                <p className="body-text text-muted-foreground mb-4">
                  Tente buscar por outros termos
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl title-semibold text-foreground mb-2">
                  Ainda não há solicitações
                </h3>
                <p className="body-text text-muted-foreground mb-6">
                  Publique sua primeira solicitação de serviço
                </p>
                <Link
                  to="/post-request"
                  className="inline-flex items-center gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Solicitação
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl p-6 shadow-soft border border-border hover:shadow-soft-hover transition-smooth"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="title-semibold text-lg text-foreground">
                        {request.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs button-text ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{getStatusText(request.status)}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <span className="inline-flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {request.location}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {request.category}
                      </span>
                      <span className={`text-sm ${getUrgencyColor(request.urgency)}`}>
                        <Clock className="w-4 h-4 inline mr-1" />
                        {request.urgency === "high" ? "Urgente" : request.urgency === "medium" ? "Moderado" : "Não urgente"}
                      </span>
                    </div>

                    <p className="body-text text-sm text-muted-foreground mb-4 line-clamp-2">
                      {request.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-muted-foreground">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="body-text text-sm">
                            {request.budget.type === "fixed" 
                              ? `R$ ${request.budget.min}`
                              : `R$ ${request.budget.min} - R$ ${request.budget.max}`
                            }
                          </span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="body-text text-sm">{request.quotesCount} orçamentos</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="body-text text-sm">{request.viewsCount} visualizações</span>
                        </div>
                      </div>

                      <button className="p-2 hover:bg-secondary rounded-lg transition-smooth">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Selected Professional */}
                    {request.selectedProfessional && (
                      <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="flex items-center space-x-3">
                          <img
                            src={request.selectedProfessional.avatar}
                            alt={request.selectedProfessional.name}
                            className="w-10 h-10 rounded-xl object-cover bg-secondary"
                          />
                          <div className="flex-1">
                            <p className="subtitle text-sm text-foreground">
                              Profissional selecionado: {request.selectedProfessional.name}
                            </p>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                              <span className="body-text text-xs text-muted-foreground">
                                {request.selectedProfessional.rating} estrelas
                              </span>
                              {request.deadline && (
                                <>
                                  <span className="mx-2 text-muted-foreground">•</span>
                                  <span className="body-text text-xs text-muted-foreground">
                                    Prazo: {new Date(request.deadline).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <Link
                            to={`/chat/${request.selectedProfessional.id}`}
                            className="p-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-smooth"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <Link
                    to={`/request/${request.id}`}
                    className="flex-1 bg-secondary text-foreground px-4 py-2 rounded-xl button-text text-sm text-center hover:bg-muted transition-smooth"
                  >
                    Ver Detalhes
                  </Link>
                  
                  {request.status === "open" && (
                    <button className="flex-1 bg-secondary text-foreground px-4 py-2 rounded-xl button-text text-sm hover:bg-muted transition-smooth">
                      Editar
                    </button>
                  )}
                  
                  {request.status === "quoted" && (
                    <Link
                      to={`/request/${request.id}/quotes`}
                      className="flex-1 gradient-primary text-white px-4 py-2 rounded-xl button-text text-sm text-center hover:shadow-soft-hover transition-smooth"
                    >
                      Ver Orçamentos ({request.quotesCount})
                    </Link>
                  )}
                  
                  {request.status === "completed" && (
                    <button
                      onClick={() => showNotification("Sistema de avaliação em desenvolvimento", "info")}
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-xl button-text text-sm hover:bg-yellow-600 transition-smooth"
                    >
                      Avaliar Serviço
                    </button>
                  )}
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

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Clock,
  MapPin,
  DollarSign,
  Eye,
  MessageCircle,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PlaceholderPage from "@/components/PlaceholderPage";
import Logo from "@/components/Logo";

interface ServiceRequest {
  id: string;
  category: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
  };
  urgency: "low" | "medium" | "high";
  budget: {
    min: string;
    max: string;
    type: "range" | "fixed";
  };
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  proposalsCount: number;
  viewsCount: number;
}

const urgencyColors = {
  low: "text-green-600 bg-green-50 border-green-200",
  medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  high: "text-red-600 bg-red-50 border-red-200",
};

const urgencyLabels = {
  low: "Não urgente",
  medium: "Moderado",
  high: "Urgente",
};

const statusColors = {
  open: "text-blue-600 bg-blue-50 border-blue-200",
  in_progress: "text-orange-600 bg-orange-50 border-orange-200",
  completed: "text-green-600 bg-green-50 border-green-200",
  cancelled: "text-gray-600 bg-gray-50 border-gray-200",
};

const statusLabels = {
  open: "Aberto",
  in_progress: "Em Andamento",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const statusIcons = {
  open: AlertCircle,
  in_progress: Clock,
  completed: CheckCircle,
  cancelled: XCircle,
};

export default function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");

  useEffect(() => {
    // Always fetch requests, even for guest users
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/requests", {
        headers: {
          Authorization: `Bearer ${user?.id || 'guest'}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Mock data since backend returns mock data
        setRequests([
          {
            id: "req_1",
            category: "eletricista",
            title: "Instalação de chuveiro elétrico",
            description:
              "Preciso instalar um chuveiro elétrico novo no banheiro. O ponto já existe, só precisa conectar.",
            location: {
              address: "Rua das Flores, 123",
              city: "São Paulo",
              state: "SP",
            },
            urgency: "medium",
            budget: {
              min: "150",
              max: "300",
              type: "range",
            },
            status: "open",
            createdAt: new Date().toISOString(),
            proposalsCount: 3,
            viewsCount: 12,
          },
          {
            id: "req_2",
            category: "pintor",
            title: "Pintura de sala e quartos",
            description:
              "Pintura completa de 2 quartos e sala. Apartamento de 80m². Tinta e material por conta do profissional.",
            location: {
              address: "Av. Paulista, 1000",
              city: "São Paulo",
              state: "SP",
            },
            urgency: "low",
            budget: {
              min: "800",
              max: "",
              type: "fixed",
            },
            status: "in_progress",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            proposalsCount: 5,
            viewsCount: 28,
          },
          {
            id: "req_3",
            category: "encanador",
            title: "Vazamento emergencial",
            description:
              "Vazamento na tubula��ão da cozinha. Preciso de atendimento imediato.",
            location: {
              address: "Rua Augusta, 500",
              city: "São Paulo",
              state: "SP",
            },
            urgency: "high",
            budget: {
              min: "200",
              max: "400",
              type: "range",
            },
            status: "completed",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            proposalsCount: 8,
            viewsCount: 45,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Allow access without authentication - show demo data if no user

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesUrgency =
      urgencyFilter === "all" || request.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const formatBudget = (budget: ServiceRequest["budget"]) => {
    if (budget.type === "fixed") {
      return `R$ ${budget.min}`;
    }
    return `R$ ${budget.min} - R$ ${budget.max}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div>
                <h1 className="text-xl title-bold text-foreground">
                  Minhas Solicitações
                </h1>
                <p className="body-text text-xs text-muted-foreground">
                  {filteredRequests.length} de {requests.length} solicitações
                </p>
              </div>
            </div>

            <Link
              to="/post-request"
              className="gradient-primary text-white p-3 rounded-xl hover:shadow-soft-hover transition-smooth"
            >
              <Plus className="w-5 h-5" />
            </Link>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar solicitações..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-secondary rounded-lg border border-border text-sm min-w-0"
            >
              <option value="all">Todos os Status</option>
              <option value="open">Aberto</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-3 py-2 bg-secondary rounded-lg border border-border text-sm min-w-0"
            >
              <option value="all">Todas as Urgências</option>
              <option value="low">Não urgente</option>
              <option value="medium">Moderado</option>
              <option value="high">Urgente</option>
            </select>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-soft animate-pulse"
              >
                <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-secondary rounded w-1/2 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-secondary rounded w-16"></div>
                  <div className="h-6 bg-secondary rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg title-semibold text-foreground mb-2">
              {searchQuery || statusFilter !== "all" || urgencyFilter !== "all"
                ? "Nenhuma solicitação encontrada"
                : "Ainda não há solicitações"}
            </h3>
            <p className="body-text text-muted-foreground mb-6">
              {searchQuery || statusFilter !== "all" || urgencyFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Crie sua primeira solicitação de serviço"}
            </p>
            <Link
              to="/post-request"
              className="gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Solicitação</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const StatusIcon = statusIcons[request.status];

              return (
                <div
                  key={request.id}
                  className="bg-white rounded-xl p-4 shadow-soft hover:shadow-soft-hover transition-smooth"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="title-semibold text-foreground mb-1">
                        {request.title}
                      </h3>
                      <p className="body-text text-sm text-muted-foreground line-clamp-2">
                        {request.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div
                        className={`px-2 py-1 rounded-lg border text-xs font-medium flex items-center space-x-1 ${statusColors[request.status]}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusLabels[request.status]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="body-text text-muted-foreground">
                        {request.location.city}, {request.location.state}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="body-text text-muted-foreground">
                        {formatBudget(request.budget)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="body-text text-muted-foreground">
                        Criado em {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div
                      className={`px-2 py-1 rounded-lg border text-xs font-medium ${urgencyColors[request.urgency]}`}
                    >
                      {urgencyLabels[request.urgency]}
                    </div>

                    <div className="text-xs body-text text-muted-foreground">
                      📂 {request.category}
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="body-text text-muted-foreground">
                          {request.proposalsCount} propostas
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span className="body-text text-muted-foreground">
                          {request.viewsCount} visualizações
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/chat/req_${request.id}`}
                        className="p-2 bg-secondary rounded-lg hover:bg-muted transition-smooth"
                      >
                        <MessageCircle className="w-4 h-4 text-muted-foreground" />
                      </Link>

                      <Link
                        to={`/requests/${request.id}`}
                        className="px-4 py-2 gradient-primary text-white rounded-lg button-text text-sm hover:shadow-soft-hover transition-smooth"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

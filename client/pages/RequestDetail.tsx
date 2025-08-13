import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  MessageCircle,
  User,
  Star,
  Send,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  MessageSquare,
  Heart,
  Share2,
  Zap,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PlaceholderPage from "@/components/PlaceholderPage";
import NotificationToast from "@/components/NotificationToast";
import RequestStatusTracker from "@/components/RequestStatusTracker";

interface ServiceRequest {
  id: string;
  userId: string;
  category: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: [number, number] | null;
  };
  urgency: "low" | "medium" | "high";
  budget: {
    min: string;
    max: string;
    type: "range" | "fixed";
  };
  preferredDate?: string;
  preferredTime?: string;
  contactPreference: "phone" | "chat" | "both";
  images: string[];
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  proposals: Proposal[];
  viewsCount?: number;
  favoritesCount?: number;
}

interface Proposal {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  professionalRating: number;
  professionalReviews: number;
  professionalVerified: boolean;
  message: string;
  price: number;
  estimatedDuration: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  deliveryDate?: string;
  includes?: string[];
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

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    message: "",
    price: "",
    estimatedDuration: "",
    deliveryDate: "",
    includes: [""],
  });
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({ message: "", type: "info", visible: false });

  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setNotification({ message, type, visible: true });
  };

  useEffect(() => {
    if (id) {
      fetchRequest();
    }
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        // Mock data since backend returns mock data
        setRequest({
          id: id || "req_1",
          userId: "user_1",
          category: "eletricista",
          title: "Instalação de chuveiro elétrico",
          description: "Preciso instalar um chuveiro elétrico novo no banheiro. O ponto já existe, só precisa conectar. O chuveiro é de 7500W e precisa de um disjuntor específico. Também gostaria de uma orientação sobre a melhor posição para instalação.",
          location: {
            address: "Rua das Flores, 123, Apartamento 45",
            city: "São Paulo",
            state: "SP",
            coordinates: [-23.550520, -46.633308],
          },
          urgency: "medium",
          budget: {
            min: "150",
            max: "300",
            type: "range",
          },
          preferredDate: "2024-02-15",
          preferredTime: "morning",
          contactPreference: "both",
          images: ["/placeholder.svg", "/placeholder.svg"],
          status: "open",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          viewsCount: 25,
          favoritesCount: 3,
          proposals: [
            {
              id: "prop_1",
              professionalId: "prof_1",
              professionalName: "Carlos Silva",
              professionalAvatar: "/placeholder.svg",
              professionalRating: 4.8,
              professionalReviews: 127,
              professionalVerified: true,
              message: "Olá! Sou eletricista especializado em instalações residenciais há 10 anos. Posso fazer a instalação do seu chuveiro com total segurança e dentro das normas técnicas. Tenho disponibilidade para amanhã pela manhã.",
              price: 180,
              estimatedDuration: "2-3 horas",
              status: "pending",
              createdAt: new Date().toISOString(),
              deliveryDate: "2024-02-15",
              includes: [
                "Instalação completa do chuveiro",
                "Verificação da rede elétrica",
                "Orientação de uso",
                "Garantia de 6 meses"
              ],
            },
            {
              id: "prop_2",
              professionalId: "prof_2",
              professionalName: "Ana Santos",
              professionalAvatar: "/placeholder.svg",
              professionalRating: 4.9,
              professionalReviews: 89,
              professionalVerified: true,
              message: "Oi! Sou eletricista certificada e posso te ajudar com a instalação. Trabalho sempre com material de qualidade e ofereço garantia. Posso fazer hoje mesmo se precisar urgente.",
              price: 220,
              estimatedDuration: "1-2 horas",
              status: "pending",
              createdAt: new Date().toISOString(),
              deliveryDate: "2024-02-14",
              includes: [
                "Instalação profissional",
                "Material incluso (se necessário)",
                "Teste completo",
                "Garantia de 1 ano"
              ],
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching request:", error);
      showNotification("Erro ao carregar solicitação", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async () => {
    if (!proposalData.message || !proposalData.price || !proposalData.estimatedDuration) {
      showNotification("Preencha todos os campos obrigatórios", "error");
      return;
    }

    setSubmittingProposal(true);

    try {
      const response = await fetch(`/api/requests/${id}/proposals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({
          professionalName: user?.name || "Professional",
          professionalAvatar: "/placeholder.svg",
          professionalRating: 4.5,
          professionalReviews: 50,
          professionalVerified: true,
          ...proposalData,
          price: Number(proposalData.price),
          includes: proposalData.includes.filter(item => item.trim()),
        }),
      });

      if (response.ok) {
        showNotification("Proposta enviada com sucesso!", "success");
        setShowProposalForm(false);
        setProposalData({
          message: "",
          price: "",
          estimatedDuration: "",
          deliveryDate: "",
          includes: [""],
        });
        fetchRequest(); // Refresh data
      } else {
        showNotification("Erro ao enviar proposta", "error");
      }
    } catch (error) {
      console.error("Error submitting proposal:", error);
      showNotification("Erro ao enviar proposta", "error");
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const response = await fetch(`/api/requests/${id}/proposals/${proposalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (response.ok) {
        showNotification("Proposta aceita com sucesso!", "success");
        fetchRequest();
      } else {
        showNotification("Erro ao aceitar proposta", "error");
      }
    } catch (error) {
      console.error("Error accepting proposal:", error);
      showNotification("Erro ao aceitar proposta", "error");
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      const response = await fetch(`/api/requests/${id}/proposals/${proposalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (response.ok) {
        showNotification("Proposta rejeitada", "info");
        fetchRequest();
      } else {
        showNotification("Erro ao rejeitar proposta", "error");
      }
    } catch (error) {
      console.error("Error rejecting proposal:", error);
      showNotification("Erro ao rejeitar proposta", "error");
    }
  };

  const addIncludeItem = () => {
    setProposalData(prev => ({
      ...prev,
      includes: [...prev.includes, ""]
    }));
  };

  const updateIncludeItem = (index: number, value: string) => {
    setProposalData(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => i === index ? value : item)
    }));
  };

  const removeIncludeItem = (index: number) => {
    setProposalData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  if (!user) {
    return (
      <PlaceholderPage
        title="Detalhes da Solicitação"
        description="Faça login para ver os detalhes da solicitação."
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-xl animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 bg-secondary rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-secondary rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>
        <div className="px-4 py-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-soft animate-pulse">
              <div className="h-4 bg-secondary rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-secondary rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-secondary rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <PlaceholderPage
        title="Solicitação não encontrada"
        description="A solicitação que você procura não existe ou foi removida."
      />
    );
  }

  const isOwner = request.userId === user.id;
  const isProfessional = user.type === "professional";
  const hasProposal = request.proposals.some(p => p.professionalId === user.id);

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

  const formatTime = (timeString: string) => {
    const timeMap = {
      morning: "Manhã (8h - 12h)",
      afternoon: "Tarde (12h - 18h)",
      evening: "Noite (18h - 22h)",
      flexible: "Horário flexível",
    };
    return timeMap[timeString as keyof typeof timeMap] || timeString;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/requests"
                className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div>
                <h1 className="text-lg title-bold text-foreground truncate">
                  {request.title}
                </h1>
                <p className="body-text text-xs text-muted-foreground">
                  {request.proposals.length} proposta(s) • {request.viewsCount} visualizações
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth">
                <Heart className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth">
                <Share2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Request Details */}
        <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
          {/* Status and Urgency */}
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`px-3 py-1 rounded-lg border text-sm font-medium ${statusColors[request.status]}`}
            >
              {statusLabels[request.status]}
            </div>
            <div
              className={`px-3 py-1 rounded-lg border text-sm font-medium ${urgencyColors[request.urgency]}`}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              {urgencyLabels[request.urgency]}
            </div>
            <div className="text-sm body-text text-muted-foreground">
              📂 {request.category}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl title-bold text-foreground mb-3">
              {request.title}
            </h2>
            <p className="body-text text-muted-foreground leading-relaxed">
              {request.description}
            </p>
          </div>

          {/* Images */}
          {request.images.length > 0 && (
            <div className="mb-6">
              <h3 className="subtitle text-sm text-foreground mb-3">Fotos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {request.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg bg-secondary"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="subtitle text-sm text-foreground">Localização</p>
                  <p className="body-text text-sm text-muted-foreground">
                    {request.location.address}
                  </p>
                  <p className="body-text text-sm text-muted-foreground">
                    {request.location.city}, {request.location.state}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="subtitle text-sm text-foreground">Orçamento</p>
                  <p className="body-text text-sm text-muted-foreground">
                    {formatBudget(request.budget)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {request.preferredDate && (
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="subtitle text-sm text-foreground">Data Preferida</p>
                    <p className="body-text text-sm text-muted-foreground">
                      {formatDate(request.preferredDate)}
                    </p>
                  </div>
                </div>
              )}

              {request.preferredTime && (
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="subtitle text-sm text-foreground">Horário</p>
                    <p className="body-text text-sm text-muted-foreground">
                      {formatTime(request.preferredTime)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons for Owner */}
          {isOwner && (
            <div className="flex space-x-3 pt-4 border-t border-border">
              <Link
                to={`/chat/req_${request.id}`}
                className="flex-1 gradient-primary text-white py-3 px-4 rounded-xl button-text text-center hover:shadow-soft-hover transition-smooth"
              >
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Mensagens
              </Link>
              <button className="px-4 py-3 bg-secondary text-foreground rounded-xl button-text hover:bg-muted transition-smooth">
                Editar
              </button>
            </div>
          )}
        </div>

        {/* Professional Action */}
        {isProfessional && !isOwner && !hasProposal && request.status === "open" && (
          <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="title-semibold text-foreground mb-1">
                  Interessado neste projeto?
                </h3>
                <p className="body-text text-sm text-muted-foreground">
                  Envie uma proposta personalizada para o cliente
                </p>
              </div>
              <button
                onClick={() => setShowProposalForm(true)}
                className="gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth"
              >
                Enviar Proposta
              </button>
            </div>
          </div>
        )}

        {/* Proposal Form */}
        {showProposalForm && (
          <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg title-semibold text-foreground">
                Criar Proposta
              </h3>
              <button
                onClick={() => setShowProposalForm(false)}
                className="p-2 hover:bg-secondary rounded-xl transition-smooth"
              >
                <XCircle className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block subtitle text-sm text-foreground mb-2">
                  Mensagem para o Cliente *
                </label>
                <textarea
                  value={proposalData.message}
                  onChange={(e) =>
                    setProposalData({ ...proposalData, message: e.target.value })
                  }
                  placeholder="Descreva sua experiência, como pretende executar o serviço..."
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    value={proposalData.price}
                    onChange={(e) =>
                      setProposalData({ ...proposalData, price: e.target.value })
                    }
                    placeholder="250"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                  />
                </div>

                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Duração Estimada *
                  </label>
                  <input
                    type="text"
                    value={proposalData.estimatedDuration}
                    onChange={(e) =>
                      setProposalData({
                        ...proposalData,
                        estimatedDuration: e.target.value,
                      })
                    }
                    placeholder="2-3 horas"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                  />
                </div>

                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Data de Entrega
                  </label>
                  <input
                    type="date"
                    value={proposalData.deliveryDate}
                    onChange={(e) =>
                      setProposalData({
                        ...proposalData,
                        deliveryDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                  />
                </div>
              </div>

              <div>
                <label className="block subtitle text-sm text-foreground mb-2">
                  O que está incluído
                </label>
                <div className="space-y-2">
                  {proposalData.includes.map((item, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateIncludeItem(index, e.target.value)}
                        placeholder="Ex: Material incluído, Garantia de 6 meses..."
                        className="flex-1 px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                      />
                      {proposalData.includes.length > 1 && (
                        <button
                          onClick={() => removeIncludeItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-smooth"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addIncludeItem}
                    className="text-sm text-primary hover:underline"
                  >
                    + Adicionar item
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowProposalForm(false)}
                  className="flex-1 px-6 py-3 bg-secondary text-foreground rounded-xl button-text hover:bg-muted transition-smooth"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitProposal}
                  disabled={submittingProposal}
                  className="flex-1 gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth disabled:opacity-50"
                >
                  {submittingProposal ? "Enviando..." : "Enviar Proposta"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Tracker */}
        <RequestStatusTracker
          requestStatus={request.status}
          acceptedProposal={
            request.proposals.find(p => p.status === "accepted")
              ? {
                  professionalName: request.proposals.find(p => p.status === "accepted")!.professionalName,
                  professionalAvatar: request.proposals.find(p => p.status === "accepted")!.professionalAvatar,
                  price: request.proposals.find(p => p.status === "accepted")!.price,
                  acceptedAt: new Date().toISOString(),
                }
              : undefined
          }
          completedAt={request.status === "completed" ? new Date().toISOString() : undefined}
          cancelledAt={request.status === "cancelled" ? new Date().toISOString() : undefined}
          reviewSubmitted={false}
          paymentStatus="pending"
          className="mb-6"
        />

        {/* Proposals */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h3 className="text-lg title-semibold text-foreground mb-6">
            Propostas ({request.proposals.length})
          </h3>

          {request.proposals.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="body-text text-muted-foreground">
                Ainda não há propostas para esta solicitação
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {request.proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className={`border rounded-xl p-6 transition-smooth ${
                    proposal.status === "accepted"
                      ? "border-green-200 bg-green-50"
                      : proposal.status === "rejected"
                      ? "border-red-200 bg-red-50"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {/* Professional Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img
                          src={proposal.professionalAvatar}
                          alt={proposal.professionalName}
                          className="w-16 h-16 rounded-xl object-cover bg-secondary"
                        />
                        {proposal.professionalVerified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="title-semibold text-foreground mb-1">
                          {proposal.professionalName}
                        </h4>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="body-text text-sm text-foreground">
                              {proposal.professionalRating}
                            </span>
                            <span className="body-text text-sm text-muted-foreground">
                              ({proposal.professionalReviews} avaliações)
                            </span>
                          </div>
                          {proposal.professionalVerified && (
                            <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Verificado
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl title-bold text-foreground">
                        R$ {proposal.price}
                      </div>
                      <div className="body-text text-sm text-muted-foreground">
                        {proposal.estimatedDuration}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <p className="body-text text-muted-foreground leading-relaxed">
                      {proposal.message}
                    </p>
                  </div>

                  {/* Includes */}
                  {proposal.includes && proposal.includes.length > 0 && (
                    <div className="mb-4">
                      <h5 className="subtitle text-sm text-foreground mb-2">
                        Incluído na proposta:
                      </h5>
                      <ul className="space-y-1">
                        {proposal.includes.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="body-text text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Delivery Date */}
                  {proposal.deliveryDate && (
                    <div className="mb-4">
                      <p className="body-text text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Entrega prevista: {formatDate(proposal.deliveryDate)}
                      </p>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      {proposal.status === "accepted" && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="body-text text-sm">Proposta Aceita</span>
                        </div>
                      )}
                      {proposal.status === "rejected" && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="body-text text-sm">Proposta Rejeitada</span>
                        </div>
                      )}
                      {proposal.status === "pending" && (
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="body-text text-sm">Aguardando Resposta</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/chat/conv_${proposal.professionalId}_${request.id}`}
                        className="p-2 bg-secondary rounded-lg hover:bg-muted transition-smooth"
                      >
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      </Link>

                      {isOwner && proposal.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleRejectProposal(proposal.id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg button-text text-sm hover:bg-red-100 transition-smooth"
                          >
                            Rejeitar
                          </button>
                          <button
                            onClick={() => handleAcceptProposal(proposal.id)}
                            className="px-4 py-2 gradient-primary text-white rounded-lg button-text text-sm hover:shadow-soft-hover transition-smooth"
                          >
                            Aceitar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </div>
  );
}

import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  User,
  MessageCircle,
  Star,
  Calendar,
  MapPin,
} from "lucide-react";

interface StatusStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "pending" | "cancelled";
  timestamp?: string;
  icon: React.ReactNode;
  details?: string;
}

interface RequestStatusTrackerProps {
  requestStatus: "open" | "in_progress" | "completed" | "cancelled";
  acceptedProposal?: {
    professionalName: string;
    professionalAvatar: string;
    price: number;
    acceptedAt: string;
  };
  completedAt?: string;
  cancelledAt?: string;
  reviewSubmitted?: boolean;
  paymentStatus?: "pending" | "paid" | "refunded";
  className?: string;
}

export default function RequestStatusTracker({
  requestStatus,
  acceptedProposal,
  completedAt,
  cancelledAt,
  reviewSubmitted,
  paymentStatus,
  className = "",
}: RequestStatusTrackerProps) {
  const getSteps = (): StatusStep[] => {
    const baseSteps: StatusStep[] = [
      {
        id: "created",
        title: "Solicitação Criada",
        description: "Sua solicitação foi publicada",
        status: "completed",
        timestamp: "2024-02-10 14:30",
        icon: <AlertCircle className="w-5 h-5" />,
        details: "Aguardando propostas de profissionais",
      },
      {
        id: "proposals",
        title: "Recebendo Propostas",
        description: "Profissionais estão enviando propostas",
        status: acceptedProposal ? "completed" : requestStatus === "cancelled" ? "cancelled" : "current",
        timestamp: acceptedProposal?.acceptedAt,
        icon: <User className="w-5 h-5" />,
        details: acceptedProposal 
          ? `Proposta de ${acceptedProposal.professionalName} aceita por R$ ${acceptedProposal.price}`
          : "Aguardando você escolher uma proposta",
      },
      {
        id: "in_progress",
        title: "Serviço em Andamento",
        description: "Profissional está executando o serviço",
        status: 
          requestStatus === "completed" ? "completed" :
          requestStatus === "in_progress" ? "current" :
          requestStatus === "cancelled" ? "cancelled" : "pending",
        timestamp: acceptedProposal?.acceptedAt,
        icon: <Clock className="w-5 h-5" />,
        details: acceptedProposal 
          ? `${acceptedProposal.professionalName} está trabalhando no seu projeto`
          : "Aguardando início do serviço",
      },
      {
        id: "completed",
        title: "Serviço Concluído",
        description: "Trabalho finalizado com sucesso",
        status: requestStatus === "completed" ? "completed" : requestStatus === "cancelled" ? "cancelled" : "pending",
        timestamp: completedAt,
        icon: <CheckCircle className="w-5 h-5" />,
        details: requestStatus === "completed" 
          ? "Serviço foi finalizado conforme solicitado"
          : "Aguardando conclusão do serviço",
      },
    ];

    if (requestStatus === "completed") {
      baseSteps.push({
        id: "review",
        title: "Avaliação",
        description: reviewSubmitted ? "Avaliação enviada" : "Avalie o profissional",
        status: reviewSubmitted ? "completed" : "current",
        icon: <Star className="w-5 h-5" />,
        details: reviewSubmitted 
          ? "Obrigado pelo seu feedback!"
          : "Compartilhe sua experiência com outros usuários",
      });

      baseSteps.push({
        id: "payment",
        title: "Pagamento",
        description: getPaymentDescription(),
        status: paymentStatus === "paid" ? "completed" : "current",
        icon: <CheckCircle className="w-5 h-5" />,
        details: getPaymentDetails(),
      });
    }

    if (requestStatus === "cancelled") {
      baseSteps.push({
        id: "cancelled",
        title: "Solicitação Cancelada",
        description: "A solicitação foi cancelada",
        status: "cancelled",
        timestamp: cancelledAt,
        icon: <XCircle className="w-5 h-5" />,
        details: "Esta solicitação foi cancelada pelo usuário",
      });
    }

    return baseSteps;
  };

  const getPaymentDescription = () => {
    switch (paymentStatus) {
      case "paid":
        return "Pagamento confirmado";
      case "refunded":
        return "Pagamento estornado";
      default:
        return "Processar pagamento";
    }
  };

  const getPaymentDetails = () => {
    switch (paymentStatus) {
      case "paid":
        return "Pagamento foi processado com sucesso";
      case "refunded":
        return "Valor foi estornado para sua conta";
      default:
        return "Efetue o pagamento para finalizar a transação";
    }
  };

  const getStatusColor = (status: StatusStep["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 border-green-200";
      case "current":
        return "text-primary bg-primary/10 border-primary/20";
      case "cancelled":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-400 bg-gray-100 border-gray-200";
    }
  };

  const getConnectorColor = (status: StatusStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "current":
        return "bg-primary";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const steps = getSteps();

  return (
    <div className={`bg-white rounded-xl p-6 shadow-soft ${className}`}>
      <h3 className="text-lg title-semibold text-foreground mb-6">
        Status do Projeto
      </h3>

      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex items-start space-x-4 pb-8 last:pb-0">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-6 top-12 w-0.5 h-8 ${getConnectorColor(
                  step.status
                )}`}
              />
            )}

            {/* Step Icon */}
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-xl border-2 flex items-center justify-center ${getStatusColor(
                step.status
              )}`}
            >
              {step.icon}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="title-semibold text-foreground">{step.title}</h4>
                {step.timestamp && (
                  <span className="body-text text-xs text-muted-foreground">
                    {formatTimestamp(step.timestamp)}
                  </span>
                )}
              </div>

              <p className="body-text text-sm text-muted-foreground mb-2">
                {step.description}
              </p>

              {step.details && (
                <p className="body-text text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2">
                  {step.details}
                </p>
              )}

              {/* Special Content for Specific Steps */}
              {step.id === "proposals" && acceptedProposal && (
                <div className="mt-3 flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
                  <img
                    src={acceptedProposal.professionalAvatar}
                    alt={acceptedProposal.professionalName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="subtitle text-sm text-foreground">
                      {acceptedProposal.professionalName}
                    </p>
                    <p className="body-text text-xs text-muted-foreground">
                      Proposta aceita • R$ {acceptedProposal.price}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {step.status === "current" && (
                <div className="mt-3 flex space-x-2">
                  {step.id === "proposals" && (
                    <button className="px-4 py-2 gradient-primary text-white rounded-lg button-text text-sm hover:shadow-soft-hover transition-smooth">
                      Ver Propostas
                    </button>
                  )}
                  
                  {step.id === "in_progress" && (
                    <>
                      <button className="px-4 py-2 bg-secondary text-foreground rounded-lg button-text text-sm hover:bg-muted transition-smooth">
                        <MessageCircle className="w-4 h-4 inline mr-1" />
                        Chat
                      </button>
                      <button className="px-4 py-2 gradient-primary text-white rounded-lg button-text text-sm hover:shadow-soft-hover transition-smooth">
                        Marcar como Concluído
                      </button>
                    </>
                  )}

                  {step.id === "review" && !reviewSubmitted && (
                    <button className="px-4 py-2 gradient-primary text-white rounded-lg button-text text-sm hover:shadow-soft-hover transition-smooth">
                      <Star className="w-4 h-4 inline mr-1" />
                      Avaliar Profissional
                    </button>
                  )}

                  {step.id === "payment" && paymentStatus !== "paid" && (
                    <button className="px-4 py-2 gradient-primary text-white rounded-lg button-text text-sm hover:shadow-soft-hover transition-smooth">
                      Processar Pagamento
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {requestStatus !== "cancelled" && requestStatus !== "completed" && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="subtitle text-sm text-foreground mb-3">Ações Rápidas</h4>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-2 bg-secondary text-foreground rounded-lg button-text text-sm hover:bg-muted transition-smooth">
              <MessageCircle className="w-4 h-4 inline mr-1" />
              Mensagens
            </button>
            <button className="px-3 py-2 bg-secondary text-foreground rounded-lg button-text text-sm hover:bg-muted transition-smooth">
              <Calendar className="w-4 h-4 inline mr-1" />
              Reagendar
            </button>
            <button className="px-3 py-2 bg-secondary text-foreground rounded-lg button-text text-sm hover:bg-muted transition-smooth">
              <MapPin className="w-4 h-4 inline mr-1" />
              Localização
            </button>
            {requestStatus === "open" && (
              <button className="px-3 py-2 text-red-600 bg-red-50 rounded-lg button-text text-sm hover:bg-red-100 transition-smooth">
                Cancelar Solicitação
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

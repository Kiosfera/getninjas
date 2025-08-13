import { useState } from "react";
import { ArrowLeft, TrendingUp, Users, MessageCircle, Star, Calendar, DollarSign, Eye, Bell, Settings, BarChart3, Clock, Award, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PlaceholderPage from "@/components/PlaceholderPage";
import NotificationToast from "@/components/NotificationToast";

const dashboardStats = {
  totalEarnings: 4580,
  monthlyEarnings: 1200,
  activeProjects: 3,
  completedJobs: 47,
  rating: 4.9,
  reviewCount: 127,
  profileViews: 89,
  responseRate: 95,
};

const recentRequests = [
  {
    id: "req_1",
    title: "Instalação de Sistema de Segurança",
    client: "Maria Santos",
    location: "São Paulo, SP",
    budget: "R$ 800 - R$ 1.200",
    urgency: "medium",
    postedTime: "2h atrás",
    description: "Instalação completa de câmeras e alarme em residência...",
    status: "new"
  },
  {
    id: "req_2", 
    title: "Manutenção Elétrica Preventiva",
    client: "João Silva",
    location: "São Paulo, SP",
    budget: "R$ 300 - R$ 500",
    urgency: "low",
    postedTime: "4h atrás",
    description: "Verificação geral da instalação elétrica de escritório...",
    status: "new"
  },
  {
    id: "req_3",
    title: "Troca de Disjuntores",
    client: "Ana Costa",
    location: "São Paulo, SP", 
    budget: "R$ 150 - R$ 250",
    urgency: "high",
    postedTime: "6h atrás",
    description: "Substituição de disjuntores antigos por novos...",
    status: "responded"
  }
];

const activeProjects = [
  {
    id: "proj_1",
    title: "Automação Residencial",
    client: "Carlos Pereira",
    progress: 75,
    deadline: "2024-01-25",
    value: 2500,
    status: "in_progress"
  },
  {
    id: "proj_2",
    title: "Instalação Industrial", 
    client: "Empresa XYZ",
    progress: 30,
    deadline: "2024-02-15",
    value: 5500,
    status: "in_progress"
  }
];

const recentReviews = [
  {
    id: "rev_1",
    client: "Maria Santos",
    rating: 5,
    comment: "Excelente profissional! Muito pontual e trabalho de qualidade.",
    service: "Instalação de chuveiro",
    date: "Há 2 dias"
  },
  {
    id: "rev_2",
    client: "João Silva", 
    rating: 5,
    comment: "Resolveu o problema rapidamente. Recomendo!",
    service: "Manutenção elétrica",
    date: "Há 1 semana"
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [notification, setNotification] = useState<{message: string, type: "success" | "error" | "info", visible: boolean}>({ message: "", type: "info", visible: false });

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type, visible: true });
  };

  if (!user || user.type !== "professional") {
    return (
      <PlaceholderPage
        title="Dashboard Profissional"
        description="Esta área é exclusiva para profissionais cadastrados na plataforma."
      />
    );
  }

  const handleRespondToRequest = (requestId: string) => {
    showNotification("Redirecionando para formulário de orçamento...", "info");
  };

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/" className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div>
                <h1 className="text-xl title-bold text-foreground">Dashboard</h1>
                <p className="body-text text-xs text-muted-foreground">Bem-vindo, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="relative p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth">
                <Bell className="w-5 h-5 text-foreground" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <Link to="/settings" className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth">
                <Settings className="w-5 h-5 text-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="px-4 py-6">
        <h2 className="title-semibold text-lg text-foreground mb-4">Resumo - {currentMonth}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-primary to-primary-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Ganhos do Mês</p>
                <p className="text-2xl title-bold">R$ {dashboardStats.monthlyEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-success to-green-600 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Trabalhos Ativos</p>
                <p className="text-2xl title-bold">{dashboardStats.activeProjects}</p>
              </div>
              <Clock className="w-8 h-8 text-green-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-soft border border-border text-center">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="title-bold text-lg text-foreground">{dashboardStats.rating}</div>
            <div className="body-text text-xs text-muted-foreground">Avaliação</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-soft border border-border text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="title-bold text-lg text-foreground">{dashboardStats.completedJobs}</div>
            <div className="body-text text-xs text-muted-foreground">Concluídos</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-soft border border-border text-center">
            <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="title-bold text-lg text-foreground">{dashboardStats.profileViews}</div>
            <div className="body-text text-xs text-muted-foreground">Visualizações</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-soft border border-border text-center">
            <MessageCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="title-bold text-lg text-foreground">{dashboardStats.responseRate}%</div>
            <div className="body-text text-xs text-muted-foreground">Resposta</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/search"
            className="flex items-center justify-center p-4 bg-white rounded-xl shadow-soft border border-border hover:shadow-soft-hover transition-smooth"
          >
            <Users className="w-5 h-5 text-primary mr-2" />
            <span className="button-text text-sm">Ver Solicitações</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center justify-center p-4 bg-white rounded-xl shadow-soft border border-border hover:shadow-soft-hover transition-smooth"
          >
            <BarChart3 className="w-5 h-5 text-success mr-2" />
            <span className="button-text text-sm">Meu Perfil</span>
          </Link>
        </div>
      </section>

      {/* New Requests */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-semibold text-lg text-foreground">Novas Solicitações</h3>
          <Link to="/search" className="text-primary button-text text-sm hover:text-primary-600 transition-smooth">
            Ver todas
          </Link>
        </div>

        <div className="space-y-4">
          {recentRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-2xl p-4 shadow-soft border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="subtitle text-sm text-foreground">{request.title}</h4>
                    {request.urgency === "high" && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs button-text rounded-lg">
                        Urgente
                      </span>
                    )}
                    {request.status === "responded" && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs button-text rounded-lg">
                        Respondido
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-2 text-muted-foreground">
                    <span className="body-text text-xs">Por {request.client}</span>
                    <span className="body-text text-xs">{request.location}</span>
                    <span className="body-text text-xs">{request.postedTime}</span>
                  </div>
                  
                  <p className="body-text text-xs text-muted-foreground mb-3 line-clamp-2">
                    {request.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-primary title-semibold text-sm">{request.budget}</span>
                    {request.status === "new" ? (
                      <button
                        onClick={() => handleRespondToRequest(request.id)}
                        className="px-4 py-2 gradient-primary text-white rounded-xl button-text text-xs hover:shadow-soft-hover transition-smooth"
                      >
                        Enviar Orçamento
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-secondary text-foreground rounded-xl button-text text-xs hover:bg-muted transition-smooth">
                        Ver Resposta
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Projects */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-semibold text-lg text-foreground">Projetos em Andamento</h3>
          <Link to="/projects" className="text-primary button-text text-sm hover:text-primary-600 transition-smooth">
            Ver todos
          </Link>
        </div>

        <div className="space-y-4">
          {activeProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-4 shadow-soft border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="subtitle text-sm text-foreground">{project.title}</h4>
                  <p className="body-text text-xs text-muted-foreground">Cliente: {project.client}</p>
                </div>
                <div className="text-right">
                  <div className="title-semibold text-primary">R$ {project.value.toLocaleString()}</div>
                  <div className="body-text text-xs text-muted-foreground">
                    Prazo: {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="body-text text-xs text-muted-foreground">Progresso</span>
                  <span className="body-text text-xs text-foreground font-semibold">{project.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-success h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-secondary text-foreground px-4 py-2 rounded-xl button-text text-xs hover:bg-muted transition-smooth">
                  Ver Detalhes
                </button>
                <Link
                  to={`/chat/${project.client}`}
                  className="flex-1 gradient-primary text-white px-4 py-2 rounded-xl button-text text-xs text-center hover:shadow-soft-hover transition-smooth"
                >
                  Conversar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-semibold text-lg text-foreground">Avaliações Recentes</h3>
          <Link to="/reviews" className="text-primary button-text text-sm hover:text-primary-600 transition-smooth">
            Ver todas
          </Link>
        </div>

        <div className="space-y-4">
          {recentReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-4 shadow-soft border border-border"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="subtitle text-sm text-foreground">{review.client}</h4>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= review.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="body-text text-xs text-muted-foreground">{review.date}</span>
              </div>
              
              <p className="body-text text-sm text-muted-foreground mb-2">
                "{review.comment}"
              </p>
              
              <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-lg inline-block">
                {review.service}
              </div>
            </div>
          ))}
        </div>
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

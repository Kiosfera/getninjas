import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Shield,
  MessageCircle,
  Phone,
  Calendar,
  Heart,
  Share2,
  Flag,
  Camera,
  ExternalLink,
  Award,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationToast from "@/components/NotificationToast";

// Mock professional data - in production, fetch from API
const professionalData = {
  id: 1,
  name: "Carlos Silva",
  profession: "Eletricista Predial Especializado",
  avatar: "/placeholder.svg",
  coverImage: "/placeholder.svg",
  rating: 4.9,
  reviewCount: 127,
  completedJobs: 234,
  responseTime: "Responde em ~15 min",
  memberSince: "Março 2020",
  location: "São Paulo, SP",
  distance: 2.3,
  hourlyRate: 85,
  verified: true,
  available: true,
  badge: "Profissional Premium",
  description:
    "Eletricista com mais de 15 anos de experiência em instalações prediais, industriais e residenciais. Especializado em sistemas de automação, painéis elétricos e manutenção preventiva. Atendo emergências 24h e ofereço garantia em todos os serviços.",
  skills: [
    "Instalações Elétricas",
    "Automação Residencial",
    "Painéis Elétricos",
    "Manutenção Preventiva",
    "Emergências 24h",
    "Sistemas Industriais",
    "Certificação NR-10",
    "Projeto Elétrico",
  ],
  certifications: [
    { name: "NR-10 - Segurança em Instalações", year: "2023" },
    { name: "Técnico em Eletrotécnica", year: "2019" },
    { name: "Automação Residencial", year: "2021" },
  ],
  portfolio: [
    {
      id: 1,
      image: "/placeholder.svg",
      title: "Instalação Residencial",
      description: "Sistema completo para casa de 200m²",
    },
    {
      id: 2,
      image: "/placeholder.svg",
      title: "Painel Industrial",
      description: "Modernização de painel para fábrica",
    },
    {
      id: 3,
      image: "/placeholder.svg",
      title: "Automação Casa",
      description: "Sistema inteligente com app móvel",
    },
    {
      id: 4,
      image: "/placeholder.svg",
      title: "Manutenção Preventiva",
      description: "Empresa com 50 colaboradores",
    },
  ],
  services: [
    { name: "Instalação Elétrica Completa", price: "R$ 150", unit: "ponto" },
    { name: "Manutenção Preventiva", price: "R$ 85", unit: "hora" },
    { name: "Automação Residencial", price: "R$ 200", unit: "hora" },
    { name: "Emergência 24h", price: "R$ 120", unit: "hora" },
  ],
  reviews: [
    {
      id: 1,
      author: "Maria Santos",
      rating: 5,
      date: "Há 3 dias",
      comment:
        "Excelente profissional! Muito pontual, trabalho limpo e explicou tudo detalhadamente. Recomendo!",
      service: "Instalação de chuveiro elétrico",
    },
    {
      id: 2,
      author: "João Pereira",
      rating: 5,
      date: "Há 1 semana",
      comment:
        "Carlos resolveu um problema complexo em nossa empresa. Muito conhecimento técnico e preço justo.",
      service: "Manutenção de painel elétrico",
    },
    {
      id: 3,
      author: "Ana Costa",
      rating: 4,
      date: "Há 2 semanas",
      comment:
        "Bom atendimento e serviço de qualidade. Chegou no horário combinado e deixou tudo funcionando perfeitamente.",
      service: "Troca de disjuntores",
    },
  ],
  availability: {
    today: "Disponível",
    thisWeek: "3 horários livres",
    nextWeek: "Agenda aberta",
  },
};

export default function ProfessionalDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({ message: "", type: "info", visible: false });
  const [activeTab, setActiveTab] = useState<
    "overview" | "portfolio" | "reviews"
  >("overview");
  const [isFavorited, setIsFavorited] = useState(false);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info",
  ) => {
    setNotification({ message, type, visible: true });
  };

  const handleContact = () => {
    if (!user) {
      showNotification("Faça login para entrar em contato", "info");
      return;
    }
    showNotification(`Abrindo chat com ${professionalData.name}`, "success");
  };

  const handleBookService = () => {
    if (!user) {
      showNotification("Faça login para contratar serviços", "info");
      return;
    }
    showNotification("Redirecionando para agendamento...", "info");
  };

  const handleToggleFavorite = () => {
    if (!user) {
      showNotification("Faça login para salvar profissionais", "info");
      return;
    }
    setIsFavorited(!isFavorited);
    showNotification(
      isFavorited ? "Removido dos favoritos" : "Adicionado aos favoritos",
      "success",
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${professionalData.name} - ${professionalData.profession}`,
        text: `Confira o perfil de ${professionalData.name} no ServiçosApp`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification("Link copiado para área de transferência", "success");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/search"
                className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <div>
                <h1 className="text-lg title-bold text-foreground">
                  Perfil Profissional
                </h1>
                <p className="body-text text-xs text-muted-foreground">
                  {professionalData.profession}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-xl transition-smooth ${
                  isFavorited
                    ? "bg-red-50 text-red-500"
                    : "bg-secondary text-muted-foreground hover:bg-muted"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
              >
                <Share2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <section className="bg-white">
        <div className="relative h-32 bg-gradient-to-r from-primary/20 to-success/20">
          <img
            src={professionalData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        <div className="px-4 pb-6">
          <div className="flex items-start space-x-4 -mt-8">
            <div className="relative">
              <img
                src={professionalData.avatar}
                alt={professionalData.name}
                className="w-20 h-20 rounded-2xl border-4 border-white bg-secondary object-cover"
              />
              {professionalData.verified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-success rounded-full flex items-center justify-center border-4 border-white">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
              {professionalData.available && (
                <div className="absolute top-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl title-bold text-foreground mb-1">
                    {professionalData.name}
                  </h2>
                  <p className="body-text text-muted-foreground mb-2">
                    {professionalData.profession}
                  </p>

                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="subtitle text-sm text-foreground ml-1">
                        {professionalData.rating}
                      </span>
                      <span className="body-text text-xs text-muted-foreground ml-1">
                        ({professionalData.reviewCount} avaliações)
                      </span>
                    </div>
                    <div className="body-text text-xs text-muted-foreground">
                      {professionalData.completedJobs} trabalhos
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="body-text text-xs">
                        {professionalData.location} •{" "}
                        {professionalData.distance}km
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="body-text text-xs text-success">
                        {professionalData.responseTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="title-bold text-xl text-primary">
                    R$ {professionalData.hourlyRate}
                    <span className="body-text text-sm text-muted-foreground font-normal">
                      /hora
                    </span>
                  </div>
                  {professionalData.badge && (
                    <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs button-text rounded-lg mt-1">
                      <Award className="w-3 h-3 mr-1" />
                      {professionalData.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-secondary rounded-xl">
            <div className="text-center">
              <div className="title-bold text-lg text-foreground">
                {professionalData.availability.today}
              </div>
              <div className="body-text text-xs text-muted-foreground">
                Hoje
              </div>
            </div>
            <div className="text-center">
              <div className="title-bold text-lg text-foreground">
                {professionalData.availability.thisWeek}
              </div>
              <div className="body-text text-xs text-muted-foreground">
                Esta semana
              </div>
            </div>
            <div className="text-center">
              <div className="title-bold text-lg text-foreground">
                {professionalData.availability.nextWeek}
              </div>
              <div className="body-text text-xs text-muted-foreground">
                Próxima semana
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="px-4 py-4 bg-white border-b border-border">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleContact}
            className="flex items-center justify-center px-4 py-3 bg-secondary text-foreground rounded-xl button-text hover:bg-muted transition-smooth"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Conversar
          </button>
          <button
            onClick={handleBookService}
            className="flex items-center justify-center px-4 py-3 gradient-primary text-white rounded-xl button-text hover:shadow-soft-hover transition-smooth"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Contratar
          </button>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-4 py-4 bg-white border-b border-border">
        <div className="flex space-x-1 bg-secondary rounded-xl p-1">
          {[
            { id: "overview", name: "Visão Geral" },
            { id: "portfolio", name: "Portfólio" },
            { id: "reviews", name: "Avaliações" },
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
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-4 py-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
              <h3 className="title-semibold text-lg text-foreground mb-4">
                Sobre
              </h3>
              <p className="body-text text-muted-foreground leading-relaxed">
                {professionalData.description}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
              <h3 className="title-semibold text-lg text-foreground mb-4">
                Especialidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {professionalData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-primary/10 text-primary text-sm button-text rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
              <h3 className="title-semibold text-lg text-foreground mb-4">
                Certificações
              </h3>
              <div className="space-y-3">
                {professionalData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <h4 className="subtitle text-sm text-foreground">
                        {cert.name}
                      </h4>
                      <p className="body-text text-xs text-muted-foreground">
                        Obtido em {cert.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services & Pricing */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
              <h3 className="title-semibold text-lg text-foreground mb-4">
                Serviços e Preços
              </h3>
              <div className="space-y-4">
                {professionalData.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                  >
                    <div>
                      <h4 className="subtitle text-sm text-foreground">
                        {service.name}
                      </h4>
                      <p className="body-text text-xs text-muted-foreground">
                        Por {service.unit}
                      </p>
                    </div>
                    <div className="title-semibold text-primary">
                      {service.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
              <h3 className="title-semibold text-lg text-foreground mb-4">
                Trabalhos Realizados
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {professionalData.portfolio.map((item) => (
                  <div key={item.id} className="bg-secondary rounded-xl p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 rounded-xl object-cover bg-muted"
                      />
                      <div className="flex-1">
                        <h4 className="subtitle text-sm text-foreground mb-1">
                          {item.title}
                        </h4>
                        <p className="body-text text-xs text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        <button className="flex items-center text-primary text-xs button-text hover:text-primary-600 transition-smooth">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Ver detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Reviews Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
              <div className="flex items-center space-x-6 mb-4">
                <div className="text-center">
                  <div className="text-3xl title-bold text-foreground">
                    {professionalData.rating}
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(professionalData.rating)
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="body-text text-sm text-muted-foreground">
                    Baseado em {professionalData.reviewCount} avaliações
                  </p>
                  <div className="space-y-1 mt-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center space-x-2">
                        <span className="body-text text-xs text-muted-foreground w-2">
                          {stars}
                        </span>
                        <div className="flex-1 h-2 bg-secondary rounded-full">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{
                              width: `${(professionalData.reviewCount / 5) * (6 - stars) * 10}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {professionalData.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-6 shadow-soft border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="subtitle text-sm text-foreground">
                        {review.author}
                      </h4>
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
                    <span className="body-text text-xs text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                  <p className="body-text text-sm text-muted-foreground mb-2">
                    {review.comment}
                  </p>
                  <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-lg inline-block">
                    {review.service}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Report Button */}
      <section className="px-4 py-4">
        <button className="flex items-center justify-center w-full py-3 text-muted-foreground hover:text-destructive transition-smooth">
          <Flag className="w-4 h-4 mr-2" />
          <span className="body-text text-sm">Reportar perfil</span>
        </button>
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

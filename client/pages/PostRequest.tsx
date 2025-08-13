import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Camera,
  X,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NotificationToast from "@/components/NotificationToast";
import AuthModal from "@/components/AuthModal";

const serviceCategories = [
  { id: "eletricista", name: "Eletricista", icon: "⚡" },
  { id: "encanador", name: "Encanador", icon: "🔧" },
  { id: "pedreiro", name: "Pedreiro", icon: "🧱" },
  { id: "pintor", name: "Pintor", icon: "🎨" },
  { id: "marceneiro", name: "Marceneiro", icon: "🪚" },
  { id: "jardineiro", name: "Jardineiro", icon: "🌱" },
  { id: "diarista", name: "Diarista", icon: "🧹" },
  { id: "montador", name: "Montador de Móveis", icon: "🔩" },
  { id: "arcondicionado", name: "Ar-Condicionado", icon: "❄️" },
  { id: "informatica", name: "Técnico em Informática", icon: "💻" },
];

const urgencyLevels = [
  {
    id: "low",
    name: "Não é urgente",
    description: "Posso aguardar alguns dias",
    color: "text-green-600",
  },
  {
    id: "medium",
    name: "Moderado",
    description: "Gostaria de resolver esta semana",
    color: "text-yellow-600",
  },
  {
    id: "high",
    name: "Urgente",
    description: "Preciso resolver hoje",
    color: "text-red-600",
  },
];

export default function PostRequest() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({ message: "", type: "info", visible: false });
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);

  const [requestData, setRequestData] = useState({
    category: "",
    title: "",
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
      coordinates: null as [number, number] | null,
    },
    urgency: "medium",
    budget: {
      min: "",
      max: "",
      type: "range" as "range" | "fixed",
    },
    preferredDate: "",
    preferredTime: "",
    contactPreference: "both" as "phone" | "chat" | "both",
  });

  const showNotification = (
    message: string,
    type: "success" | "error" | "info",
  ) => {
    setNotification({ message, type, visible: true });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target?.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...requestData,
          images,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao publicar solicitação");
      }

      showNotification("Solicitação publicada com sucesso!", "success");

      // Reset form
      setRequestData({
        category: "",
        title: "",
        description: "",
        location: { address: "", city: "", state: "", coordinates: null },
        urgency: "medium",
        budget: { min: "", max: "", type: "range" },
        preferredDate: "",
        preferredTime: "",
        contactPreference: "both",
      });
      setImages([]);
      setCurrentStep(1);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erro ao publicar solicitação",
        "error",
      );
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return (
          requestData.category && requestData.title && requestData.description
        );
      case 2:
        return (
          requestData.location.address &&
          requestData.location.city &&
          requestData.location.state
        );
      case 3:
        return (
          requestData.urgency &&
          (requestData.budget.type === "fixed"
            ? requestData.budget.min
            : requestData.budget.min && requestData.budget.max)
        );
      default:
        return false;
    }
  };

  const canProceed = isStepComplete(currentStep);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-20">
        <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <h1 className="text-xl title-bold text-foreground">
                Solicitar Serviço
              </h1>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl title-bold text-foreground mb-4">
              Faça login para continuar
            </h2>
            <p className="body-text text-muted-foreground mb-6">
              Para solicitar um serviço, você precisa estar logado em sua conta.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth"
            >
              Entrar ou Cadastrar
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl title-bold text-foreground">
                Solicitar Serviço
              </h1>
              <p className="body-text text-xs text-muted-foreground">
                Etapa {currentStep} de 4
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-white border-b border-border">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex-1">
              <div
                className={`h-2 rounded-full transition-smooth ${
                  step <= currentStep ? "bg-primary" : "bg-secondary"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Step 1: Service Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl title-bold text-foreground mb-2">
                Qual serviço você precisa?
              </h2>
              <p className="body-text text-muted-foreground mb-6">
                Escolha a categoria e descreva o que você precisa
              </p>
            </div>

            <div>
              <label className="block subtitle text-sm text-foreground mb-3">
                Categoria do Serviço
              </label>
              <div className="grid grid-cols-2 gap-3">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setRequestData({ ...requestData, category: category.id })
                    }
                    className={`p-4 rounded-xl border-2 transition-smooth text-left ${
                      requestData.category === category.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="subtitle text-sm text-foreground">
                      {category.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block subtitle text-sm text-foreground mb-2">
                Título do Serviço
              </label>
              <input
                type="text"
                value={requestData.title}
                onChange={(e) =>
                  setRequestData({ ...requestData, title: e.target.value })
                }
                placeholder="Ex: Instalação de chuveiro elétrico"
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
              />
            </div>

            <div>
              <label className="block subtitle text-sm text-foreground mb-2">
                Descrição Detalhada
              </label>
              <textarea
                value={requestData.description}
                onChange={(e) =>
                  setRequestData({
                    ...requestData,
                    description: e.target.value,
                  })
                }
                placeholder="Descreva detalhadamente o que precisa ser feito, materiais necessários, etc."
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text resize-none"
              />
            </div>

            <div>
              <label className="block subtitle text-sm text-foreground mb-2">
                Fotos (Opcional)
              </label>
              <div className="space-y-3">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-smooth cursor-pointer">
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="subtitle text-sm text-muted-foreground">
                      Adicionar fotos
                    </p>
                    <p className="body-text text-xs text-muted-foreground">
                      Ajuda os profissionais a entender melhor
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-soft"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl title-bold text-foreground mb-2">
                Onde será realizado o serviço?
              </h2>
              <p className="body-text text-muted-foreground mb-6">
                Informe o endereço para encontrarmos profissionais próximos
              </p>
            </div>

            <div>
              <label className="block subtitle text-sm text-foreground mb-2">
                Endereço Completo
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={requestData.location.address}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      location: {
                        ...requestData.location,
                        address: e.target.value,
                      },
                    })
                  }
                  placeholder="Rua, número, bairro"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block subtitle text-sm text-foreground mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={requestData.location.city}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      location: {
                        ...requestData.location,
                        city: e.target.value,
                      },
                    })
                  }
                  placeholder="São Paulo"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                />
              </div>
              <div>
                <label className="block subtitle text-sm text-foreground mb-2">
                  Estado
                </label>
                <input
                  type="text"
                  value={requestData.location.state}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      location: {
                        ...requestData.location,
                        state: e.target.value,
                      },
                    })
                  }
                  placeholder="SP"
                  maxLength={2}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                />
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="subtitle text-sm text-primary mb-1">
                    Localização Automática
                  </p>
                  <p className="body-text text-xs text-primary/80">
                    Permita o acesso à localização para encontrar profissionais
                    mais próximos
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Urgency */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl title-bold text-foreground mb-2">
                Orçamento e Urgência
              </h2>
              <p className="body-text text-muted-foreground mb-6">
                Nos ajude a encontrar profissionais que atendam suas
                necessidades
              </p>
            </div>

            <div>
              <label className="block subtitle text-sm text-foreground mb-3">
                Nível de Urgência
              </label>
              <div className="space-y-3">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() =>
                      setRequestData({ ...requestData, urgency: level.id })
                    }
                    className={`w-full p-4 rounded-xl border-2 transition-smooth text-left ${
                      requestData.urgency === level.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className={`w-5 h-5 ${level.color}`} />
                      <div>
                        <div className="subtitle text-sm text-foreground">
                          {level.name}
                        </div>
                        <div className="body-text text-xs text-muted-foreground">
                          {level.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block subtitle text-sm text-foreground mb-3">
                Orçamento Estimado
              </label>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() =>
                      setRequestData({
                        ...requestData,
                        budget: { ...requestData.budget, type: "range" },
                      })
                    }
                    className={`flex-1 p-3 rounded-xl border-2 transition-smooth ${
                      requestData.budget.type === "range"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border"
                    }`}
                  >
                    <DollarSign className="w-5 h-5 mx-auto mb-1" />
                    <div className="subtitle text-sm">Faixa de Preço</div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setRequestData({
                        ...requestData,
                        budget: { ...requestData.budget, type: "fixed" },
                      })
                    }
                    className={`flex-1 p-3 rounded-xl border-2 transition-smooth ${
                      requestData.budget.type === "fixed"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border"
                    }`}
                  >
                    <DollarSign className="w-5 h-5 mx-auto mb-1" />
                    <div className="subtitle text-sm">Valor Fixo</div>
                  </button>
                </div>

                {requestData.budget.type === "range" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block subtitle text-xs text-muted-foreground mb-1">
                        Valor Mínimo
                      </label>
                      <input
                        type="number"
                        value={requestData.budget.min}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            budget: {
                              ...requestData.budget,
                              min: e.target.value,
                            },
                          })
                        }
                        placeholder="R$ 0"
                        className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                      />
                    </div>
                    <div>
                      <label className="block subtitle text-xs text-muted-foreground mb-1">
                        Valor Máximo
                      </label>
                      <input
                        type="number"
                        value={requestData.budget.max}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            budget: {
                              ...requestData.budget,
                              max: e.target.value,
                            },
                          })
                        }
                        placeholder="R$ 0"
                        className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block subtitle text-xs text-muted-foreground mb-1">
                      Valor Desejado
                    </label>
                    <input
                      type="number"
                      value={requestData.budget.min}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          budget: {
                            ...requestData.budget,
                            min: e.target.value,
                          },
                        })
                      }
                      placeholder="R$ 0"
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Schedule & Contact */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl title-bold text-foreground mb-2">
                Agendamento e Contato
              </h2>
              <p className="body-text text-muted-foreground mb-6">
                Quando você gostaria que o serviço fosse realizado?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block subtitle text-sm text-foreground mb-2">
                  Data Preferida
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={requestData.preferredDate}
                    onChange={(e) =>
                      setRequestData({
                        ...requestData,
                        preferredDate: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                  />
                </div>
              </div>
              <div>
                <label className="block subtitle text-sm text-foreground mb-2">
                  Horário Preferido
                </label>
                <select
                  value={requestData.preferredTime}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      preferredTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                >
                  <option value="">Selecione</option>
                  <option value="morning">Manhã (8h - 12h)</option>
                  <option value="afternoon">Tarde (12h - 18h)</option>
                  <option value="evening">Noite (18h - 22h)</option>
                  <option value="flexible">Horário flexível</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block subtitle text-sm text-foreground mb-3">
                Como prefere ser contatado?
              </label>
              <div className="space-y-2">
                {[
                  { id: "phone", name: "Apenas por telefone" },
                  { id: "chat", name: "Apenas pelo chat do app" },
                  { id: "both", name: "Telefone e chat" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setRequestData({
                        ...requestData,
                        contactPreference: option.id as
                          | "phone"
                          | "chat"
                          | "both",
                      })
                    }
                    className={`w-full p-3 rounded-xl border-2 transition-smooth text-left ${
                      requestData.contactPreference === option.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="subtitle text-sm">{option.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-4 border border-primary/20">
              <h3 className="title-semibold text-sm text-foreground mb-2">
                Resumo da Solicitação
              </h3>
              <div className="space-y-1 text-sm">
                <p className="body-text text-muted-foreground">
                  <span className="subtitle text-foreground">Serviço:</span>{" "}
                  {requestData.title}
                </p>
                <p className="body-text text-muted-foreground">
                  <span className="subtitle text-foreground">Local:</span>{" "}
                  {requestData.location.city}, {requestData.location.state}
                </p>
                <p className="body-text text-muted-foreground">
                  <span className="subtitle text-foreground">Orçamento:</span>{" "}
                  R$ {requestData.budget.min}
                  {requestData.budget.type === "range" &&
                    requestData.budget.max &&
                    ` - R$ ${requestData.budget.max}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 bg-secondary text-foreground rounded-xl button-text hover:bg-muted transition-smooth"
            >
              Voltar
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed}
              className="gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth"
            >
              Publicar Solicitação
            </button>
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

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Settings,
  LogOut,
  Camera,
  Briefcase,
  Shield,
  Plus,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NotificationToast from "@/components/NotificationToast";
import AuthModal from "@/components/AuthModal";

const serviceCategoriesOptions = [
  "Eletricista",
  "Encanador",
  "Pedreiro",
  "Pintor",
  "Marceneiro",
  "Jardineiro",
  "Diarista",
  "Montador de Móveis",
  "Técnico em Ar-Condicionado",
  "Técnico em Informática",
  "Designer Gráfico",
  "Fotógrafo",
  "Cabeleireiro",
  "Manicure",
  "Massagista",
  "Personal Trainer",
  "Professor Particular",
  "Advogado",
  "Contador",
];

export default function Profile() {
  const { user, logout, updateProfile, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({ message: "", type: "info", visible: false });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    categories: [] as string[],
    serviceRadius: 10,
    location: {
      city: "",
      state: "",
    },
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profession: user.profession || "",
        categories: user.categories || [],
        serviceRadius: user.serviceRadius || 10,
        location: {
          city: user.location?.city || "",
          state: user.location?.state || "",
        },
      });
    }
  }, [user]);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info",
  ) => {
    setNotification({ message, type, visible: true });
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateProfile(profileData);
      setEditing(false);
      showNotification("Perfil atualizado com sucesso!", "success");
    } catch (error) {
      showNotification("Erro ao atualizar perfil", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showNotification("Logout realizado com sucesso!", "success");
    } catch (error) {
      showNotification("Erro ao fazer logout", "error");
    }
  };

  const toggleCategory = (category: string) => {
    setProfileData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="body-text text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-20">
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
              <h1 className="text-xl title-bold text-foreground">Perfil</h1>
            </div>
          </div>
        </header>

        {/* Not logged in state */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl title-bold text-foreground mb-4">
              Faça login para continuar
            </h2>
            <p className="body-text text-muted-foreground mb-6">
              Acesse seu perfil, gerencie suas informações e acompanhe seus
              serviços.
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <h1 className="text-xl title-bold text-foreground">Perfil</h1>
            </div>
            <div className="flex items-center space-x-2">
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
                >
                  <Settings className="w-5 h-5 text-foreground" />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="p-2 bg-secondary rounded-xl hover:bg-destructive hover:text-white transition-smooth"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-border mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover bg-secondary"
              />
              {editing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-soft">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
              {user.verified && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-xl title-bold text-foreground">
                  {user.name}
                </h2>
                <span
                  className={`px-2 py-1 rounded-lg text-xs button-text ${
                    user.type === "professional"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {user.type === "professional" ? "Profissional" : "Cliente"}
                </span>
              </div>

              {user.type === "professional" && user.profession && (
                <p className="body-text text-muted-foreground mb-2">
                  {user.profession}
                </p>
              )}

              {user.type === "professional" && user.rating !== undefined && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="subtitle text-sm text-foreground">
                      {user.rating > 0 ? user.rating.toFixed(1) : "Novo"}
                    </span>
                  </div>
                  <span className="body-text text-xs text-muted-foreground">
                    {user.reviewCount || 0} avaliações
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
            <h3 className="text-lg title-semibold text-foreground mb-4">
              Informações Básicas
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block subtitle text-sm text-foreground mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text disabled:bg-secondary disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block subtitle text-sm text-foreground mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text disabled:bg-secondary disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block subtitle text-sm text-foreground mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text disabled:bg-secondary disabled:cursor-not-allowed"
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
                    value={profileData.location.city}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        location: {
                          ...profileData.location,
                          city: e.target.value,
                        },
                      })
                    }
                    disabled={!editing}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text disabled:bg-secondary disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={profileData.location.state}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        location: {
                          ...profileData.location,
                          state: e.target.value,
                        },
                      })
                    }
                    disabled={!editing}
                    maxLength={2}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text disabled:bg-secondary disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          {user.type === "professional" && (
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-border">
              <h3 className="text-lg title-semibold text-foreground mb-4">
                Informações Profissionais
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Profissão Principal
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={profileData.profession}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          profession: e.target.value,
                        })
                      }
                      disabled={!editing}
                      placeholder="Ex: Eletricista Predial"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text disabled:bg-secondary disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Categorias de Serviços
                  </label>
                  {editing ? (
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {serviceCategoriesOptions.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => toggleCategory(category)}
                          className={`text-left px-3 py-2 rounded-lg border transition-smooth text-sm ${
                            profileData.categories.includes(category)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profileData.categories.length > 0 ? (
                        profileData.categories.map((category) => (
                          <span
                            key={category}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm button-text"
                          >
                            {category}
                          </span>
                        ))
                      ) : (
                        <p className="body-text text-muted-foreground text-sm">
                          Nenhuma categoria selecionada
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Raio de Atendimento: {profileData.serviceRadius}km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={profileData.serviceRadius}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        serviceRadius: parseInt(e.target.value),
                      })
                    }
                    disabled={!editing}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1km</span>
                    <span>50km</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {editing && (
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex-1 gradient-primary text-white py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth"
              >
                Salvar Alterações
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  // Reset form data
                  if (user) {
                    setProfileData({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      profession: user.profession || "",
                      categories: user.categories || [],
                      serviceRadius: user.serviceRadius || 10,
                      location: {
                        city: user.location?.city || "",
                        state: user.location?.state || "",
                      },
                    });
                  }
                }}
                className="px-6 py-3 bg-secondary text-foreground rounded-xl button-text hover:bg-muted transition-smooth"
              >
                Cancelar
              </button>
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

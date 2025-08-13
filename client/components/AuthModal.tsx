import { useState } from "react";
import { X, Mail, Phone, Eye, EyeOff, MapPin, User, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationToast from "./NotificationToast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "phone-login">(defaultMode);
  const [userType, setUserType] = useState<"client" | "professional">("client");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: "success" | "error" | "info", visible: boolean}>({ message: "", type: "info", visible: false });

  const { login, loginWithPhone, signup } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    name: "",
    city: "",
    state: "",
    code: "",
  });

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type, visible: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        showNotification("Login realizado com sucesso!", "success");
        setTimeout(() => onClose(), 1000);
      } else if (mode === "phone-login") {
        await loginWithPhone(formData.phone, formData.code);
        showNotification("Login realizado com sucesso!", "success");
        setTimeout(() => onClose(), 1000);
      } else if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          showNotification("As senhas não coincidem!", "error");
          return;
        }

        await signup({
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
          name: formData.name,
          type: userType,
          location: formData.city && formData.state ? {
            city: formData.city,
            state: formData.state,
          } : undefined,
        });
        
        showNotification("Conta criada com sucesso!", "success");
        setTimeout(() => onClose(), 1000);
      }
    } catch (error) {
      showNotification(error instanceof Error ? error.message : "Erro ao processar solicitação", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-soft max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl title-bold text-foreground">
              {mode === "login" ? "Entrar" : mode === "phone-login" ? "Login por Telefone" : "Criar Conta"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-xl transition-smooth"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {mode === "signup" && (
              <div className="mb-6">
                <p className="body-text text-muted-foreground mb-4">Escolha o tipo de conta:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType("client")}
                    className={`p-4 rounded-xl border-2 transition-smooth ${
                      userType === "client"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <div className="title-semibold text-sm">Cliente</div>
                    <div className="body-text text-xs text-muted-foreground">Contrato serviços</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("professional")}
                    className={`p-4 rounded-xl border-2 transition-smooth ${
                      userType === "professional"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Briefcase className="w-6 h-6 mx-auto mb-2" />
                    <div className="title-semibold text-sm">Profissional</div>
                    <div className="body-text text-xs text-muted-foreground">Ofereço serviços</div>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode !== "phone-login" && (
                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>
              )}

              {(mode === "signup" || mode === "phone-login") && (
                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Telefone {mode === "signup" ? "(Opcional)" : ""}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                      placeholder="(11) 99999-9999"
                      required={mode === "phone-login"}
                    />
                  </div>
                </div>
              )}

              {mode === "phone-login" && (
                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Código de Verificação
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text text-center text-lg tracking-widest"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                  <p className="body-text text-xs text-muted-foreground mt-2">
                    Digite o código enviado por SMS
                  </p>
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              )}

              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block subtitle text-sm text-foreground mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <label className="block subtitle text-sm text-foreground mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              )}

              {mode !== "phone-login" && (
                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-4 pr-12 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                      placeholder="Sua senha"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-secondary rounded-lg transition-smooth"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block subtitle text-sm text-foreground mb-2">
                    Confirmar Senha
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                    placeholder="Confirme sua senha"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-white py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processando..." : mode === "login" ? "Entrar" : mode === "phone-login" ? "Verificar" : "Criar Conta"}
              </button>
            </form>

            {/* Mode Switching */}
            <div className="mt-6 text-center space-y-3">
              {mode === "login" && (
                <>
                  <button
                    onClick={() => setMode("phone-login")}
                    className="text-primary button-text text-sm hover:text-primary-600 transition-smooth"
                  >
                    Entrar com telefone
                  </button>
                  <div className="body-text text-sm text-muted-foreground">
                    Não tem uma conta?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="text-primary button-text hover:text-primary-600 transition-smooth"
                    >
                      Cadastre-se
                    </button>
                  </div>
                </>
              )}

              {(mode === "signup" || mode === "phone-login") && (
                <div className="body-text text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="text-primary button-text hover:text-primary-600 transition-smooth"
                  >
                    Entrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </>
  );
}

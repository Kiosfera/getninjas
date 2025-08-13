import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, Eye, EyeOff, ArrowLeft, Zap, User, Briefcase, MapPin, Shield, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationToast from "@/components/NotificationToast";
import Logo from "@/components/Logo";

export default function Register() {
  const navigate = useNavigate();
  const { user, signup, loading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<"client" | "professional">("client");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: "success" | "error" | "info", visible: boolean}>({ message: "", type: "info", visible: false });

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    name: "",
    city: "",
    state: "",
    acceptTerms: false,
    acceptMarketing: false,
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type, visible: true });
  };

  const handleSocialSignup = async (provider: "google" | "apple" | "facebook") => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showNotification(`Redirecionando para ${provider}...`, "info");
      window.location.href = `/api/auth/${provider}`;
    } catch (error) {
      showNotification(`Erro no cadastro com ${provider}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showNotification("As senhas não coincidem", "error");
      return;
    }

    if (!formData.acceptTerms) {
      showNotification("Você deve aceitar os termos de serviço", "error");
      return;
    }
    
    setIsLoading(true);
    try {
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
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erro ao criar conta",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return userType !== undefined;
      case 2:
        return formData.name && formData.email && formData.password && formData.confirmPassword;
      case 3:
        return formData.acceptTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-success/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="body-text text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-success/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link to="/" className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <Logo size="sm" variant="full" />
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="bg-white rounded-3xl shadow-soft border border-border overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-8 pb-6 text-center">
              <h2 className="text-2xl title-bold text-foreground mb-2">
                Crie sua conta
              </h2>
              <p className="body-text text-muted-foreground">
                Junte-se a milhares de usuários
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 mb-6">
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex-1">
                    <div className={`h-2 rounded-full transition-smooth ${
                      step <= currentStep ? "bg-primary" : "bg-secondary"
                    }`}></div>
                  </div>
                ))}
              </div>
              <p className="text-center body-text text-xs text-muted-foreground mt-2">
                Etapa {currentStep} de 3
              </p>
            </div>

            {/* Step 1: User Type Selection */}
            {currentStep === 1 && (
              <div className="px-6 pb-6">
                <h3 className="title-semibold text-lg text-foreground mb-4 text-center">
                  Como você quer usar o app?
                </h3>
                
                <div className="space-y-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setUserType("client")}
                    className={`w-full p-6 rounded-2xl border-2 transition-smooth text-left ${
                      userType === "client"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        userType === "client" ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                      }`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="title-semibold text-foreground mb-1">Sou Cliente</h4>
                        <p className="body-text text-sm text-muted-foreground">
                          Quero contratar profissionais para realizar serviços
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {["Encontrar profissionais", "Solicitar orçamentos", "Agendar serviços"].map((feature) => (
                            <span key={feature} className="text-xs bg-secondary px-2 py-1 rounded-lg text-muted-foreground">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserType("professional")}
                    className={`w-full p-6 rounded-2xl border-2 transition-smooth text-left ${
                      userType === "professional"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        userType === "professional" ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                      }`}>
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="title-semibold text-foreground mb-1">Sou Profissional</h4>
                        <p className="body-text text-sm text-muted-foreground">
                          Quero oferecer meus serviços e encontrar clientes
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {["Receber solicitações", "Gerenciar agenda", "Crescer negócio"].map((feature) => (
                            <span key={feature} className="text-xs bg-secondary px-2 py-1 rounded-lg text-muted-foreground">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                <button
                  onClick={nextStep}
                  disabled={!validateStep(1)}
                  className="w-full gradient-primary text-white py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            )}

            {/* Step 2: Account Information */}
            {currentStep === 2 && (
              <div className="px-6 pb-6">
                <h3 className="title-semibold text-lg text-foreground mb-6 text-center">
                  Suas informações
                </h3>

                {/* Social Signup Options */}
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <button
                      onClick={() => handleSocialSignup("google")}
                      disabled={isLoading}
                      className="flex items-center justify-center p-3 border border-border rounded-xl hover:bg-secondary transition-smooth disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleSocialSignup("apple")}
                      disabled={isLoading}
                      className="flex items-center justify-center p-3 border border-border rounded-xl hover:bg-secondary transition-smooth disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 6.73.87 8.01-.22.58-.48 1.14-.93 1.2zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleSocialSignup("facebook")}
                      disabled={isLoading}
                      className="flex items-center justify-center p-3 border border-border rounded-xl hover:bg-secondary transition-smooth disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white body-text text-muted-foreground">ou preencha os dados</span>
                    </div>
                  </div>
                </div>

                <form className="space-y-4">
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

                  <div>
                    <label className="block subtitle text-sm text-foreground mb-2">
                      Telefone (Opcional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                        placeholder="(11) 99999-9999"
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
                        placeholder="Mínimo 6 caracteres"
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

                  <div>
                    <label className="block subtitle text-sm text-foreground mb-2">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-4 pr-12 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                        placeholder="Confirme sua senha"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-secondary rounded-lg transition-smooth"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Eye className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 bg-secondary text-foreground rounded-xl button-text hover:bg-muted transition-smooth"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!validateStep(2)}
                    className="flex-1 gradient-primary text-white py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Terms and Finish */}
            {currentStep === 3 && (
              <div className="px-6 pb-6">
                <h3 className="title-semibold text-lg text-foreground mb-6 text-center">
                  Finalizar cadastro
                </h3>

                <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-2xl p-6 border border-primary/20 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      {userType === "client" ? (
                        <User className="w-6 h-6 text-white" />
                      ) : (
                        <Briefcase className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="title-semibold text-foreground">
                        {userType === "client" ? "Cliente" : "Profissional"}
                      </h4>
                      <p className="body-text text-sm text-muted-foreground">
                        {formData.name} • {formData.email}
                      </p>
                    </div>
                  </div>
                  
                  {userType === "professional" && (
                    <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-5 h-5 text-success" />
                        <span className="subtitle text-sm text-success">Verificação Profissional</span>
                      </div>
                      <p className="body-text text-xs text-muted-foreground">
                        Após o cadastro, você poderá verificar seu perfil enviando documentos para aumentar a confiança dos clientes.
                      </p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                        className="w-5 h-5 text-primary border-border rounded focus:ring-primary/20 mt-0.5"
                        required
                      />
                      <span className="body-text text-sm text-foreground">
                        Aceito os{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Termos de Serviço
                        </Link>{" "}
                        e a{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Política de Privacidade
                        </Link>
                      </span>
                    </label>

                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.acceptMarketing}
                        onChange={(e) => setFormData({ ...formData, acceptMarketing: e.target.checked })}
                        className="w-5 h-5 text-primary border-border rounded focus:ring-primary/20 mt-0.5"
                      />
                      <span className="body-text text-sm text-muted-foreground">
                        Quero receber novidades e promoções por e-mail (opcional)
                      </span>
                    </label>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-3 bg-secondary text-foreground rounded-xl button-text hover:bg-muted transition-smooth"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !formData.acceptTerms}
                      className="flex-1 gradient-primary text-white py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Criando conta...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Criar Conta
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Login Link */}
            <div className="px-6 pb-6 text-center border-t border-border pt-6">
              <p className="body-text text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link
                  to="/login"
                  className="text-primary button-text hover:text-primary-600 transition-smooth"
                >
                  Faça login
                </Link>
              </p>
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
    </div>
  );
}

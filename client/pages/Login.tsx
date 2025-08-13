import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Phone, Eye, EyeOff, ArrowLeft, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationToast from "@/components/NotificationToast";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, loginWithPhone, loading } = useAuth();

  const [loginMode, setLoginMode] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({ message: "", type: "info", visible: false });

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    code: "",
  });

  const [phoneStep, setPhoneStep] = useState<"phone" | "code">("phone");

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info",
  ) => {
    setNotification({ message, type, visible: true });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      showNotification("Login realizado com sucesso!", "success");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erro ao fazer login",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneStep === "phone") {
      if (!formData.phone) return;

      setIsLoading(true);
      try {
        // Mock SMS sending
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPhoneStep("code");
        showNotification("Código enviado por SMS!", "success");
      } catch (error) {
        showNotification("Erro ao enviar código", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!formData.phone || !formData.code) return;

      setIsLoading(true);
      try {
        await loginWithPhone(formData.phone, formData.code);
        showNotification("Login realizado com sucesso!", "success");
      } catch (error) {
        showNotification(
          error instanceof Error ? error.message : "Código inválido",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "apple" | "facebook",
  ) => {
    setIsLoading(true);
    try {
      // Mock social login - in production, integrate with OAuth providers
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful social login
      showNotification(
        `Login com ${provider} realizado com sucesso!`,
        "success",
      );

      // In production, handle the OAuth callback and authentication
      window.location.href = `/auth/${provider}`;
    } catch (error) {
      showNotification(`Erro no login com ${provider}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-success/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="body-text text-muted-foreground">
            Verificando autenticação...
          </p>
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
            <Link
              to="/"
              className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg title-bold text-foreground">
                ServiçosApp
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center px-4 py-8 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-soft border border-border overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-8 pb-6 text-center">
              <h2 className="text-2xl title-bold text-foreground mb-2">
                Bem-vindo de volta!
              </h2>
              <p className="body-text text-muted-foreground">
                Faça login para acessar sua conta
              </p>
            </div>

            {/* Login Mode Toggle */}
            <div className="px-6 mb-6">
              <div className="bg-secondary rounded-xl p-1 flex">
                <button
                  onClick={() => {
                    setLoginMode("email");
                    setPhoneStep("phone");
                  }}
                  className={`flex-1 py-2 rounded-lg button-text text-sm transition-smooth ${
                    loginMode === "email"
                      ? "bg-white text-primary shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  E-mail
                </button>
                <button
                  onClick={() => {
                    setLoginMode("phone");
                    setPhoneStep("phone");
                  }}
                  className={`flex-1 py-2 rounded-lg button-text text-sm transition-smooth ${
                    loginMode === "phone"
                      ? "bg-white text-primary shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefone
                </button>
              </div>
            </div>

            {/* Login Forms */}
            <div className="px-6 pb-6">
              {loginMode === "email" ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block subtitle text-sm text-foreground mb-2">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                        placeholder="seu@email.com"
                        required
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
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                      />
                      <span className="ml-2 body-text text-sm text-muted-foreground">
                        Lembrar de mim
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="body-text text-sm text-primary hover:text-primary-600 transition-smooth"
                    >
                      Esqueci a senha
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isLoading || !formData.email || !formData.password
                    }
                    className="w-full gradient-primary text-white py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePhoneLogin} className="space-y-4">
                  {phoneStep === "phone" ? (
                    <>
                      <div>
                        <label className="block subtitle text-sm text-foreground mb-2">
                          Número do Telefone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text"
                            placeholder="(11) 99999-9999"
                            required
                          />
                        </div>
                        <p className="body-text text-xs text-muted-foreground mt-2">
                          Enviaremos um código por SMS para verificar seu número
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || !formData.phone}
                        className="w-full gradient-primary text-white py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Enviando..." : "Enviar Código"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block subtitle text-sm text-foreground mb-2">
                          Código de Verificação
                        </label>
                        <input
                          type="text"
                          value={formData.code}
                          onChange={(e) =>
                            setFormData({ ...formData, code: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth body-text text-center text-lg tracking-widest"
                          placeholder="123456"
                          maxLength={6}
                          required
                        />
                        <p className="body-text text-xs text-muted-foreground mt-2">
                          Digite o código enviado para {formData.phone}
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setPhoneStep("phone")}
                          className="flex-1 px-4 py-3 bg-secondary text-foreground rounded-xl button-text hover:bg-muted transition-smooth"
                        >
                          Voltar
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading || !formData.code}
                          className="flex-1 gradient-primary text-white py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "Verificando..." : "Entrar"}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>

            {/* Divider */}
            <div className="px-6 py-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white body-text text-muted-foreground">
                    ou continue com
                  </span>
                </div>
              </div>
            </div>

            {/* Social Login */}
            <div className="px-6 pb-8">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                  className="flex items-center justify-center p-3 border border-border rounded-xl hover:bg-secondary transition-smooth disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handleSocialLogin("apple")}
                  disabled={isLoading}
                  className="flex items-center justify-center p-3 border border-border rounded-xl hover:bg-secondary transition-smooth disabled:opacity-50"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 6.73.87 8.01-.22.58-.48 1.14-.93 1.2zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </button>

                <button
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={isLoading}
                  className="flex items-center justify-center p-3 border border-border rounded-xl hover:bg-secondary transition-smooth disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="px-6 pb-6 text-center">
              <p className="body-text text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link
                  to="/register"
                  className="text-primary button-text hover:text-primary-600 transition-smooth"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="text-center mt-6">
            <p className="body-text text-xs text-muted-foreground">
              Ao fazer login, você concorda com nossos{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </p>
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

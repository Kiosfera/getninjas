import { useState } from "react";
import { ArrowLeft, User, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Moon, Sun, Globe, Smartphone, Mail, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NotificationToast from "@/components/NotificationToast";

export default function Settings() {
  const { user, logout } = useAuth();
  const [notification, setNotification] = useState<{message: string, type: "success" | "error" | "info", visible: boolean}>({ message: "", type: "info", visible: false });
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showPhone: false,
    showEmail: false,
  });

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type, visible: true });
  };

  const handleLogout = async () => {
    try {
      await logout();
      showNotification("Logout realizado com sucesso!", "success");
    } catch (error) {
      showNotification("Erro ao fazer logout", "error");
    }
  };

  const handleSaveSettings = () => {
    showNotification("Configurações salvas com sucesso!", "success");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl title-bold text-foreground mb-4">
            Acesso Restrito
          </h2>
          <p className="body-text text-muted-foreground mb-6">
            Faça login para acessar as configurações da sua conta.
          </p>
          <Link
            to="/login"
            className="gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link to="/" className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl title-bold text-foreground">Configurações</h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-border mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover bg-secondary"
            />
            <div className="flex-1">
              <h2 className="title-semibold text-lg text-foreground">{user.name}</h2>
              <p className="body-text text-muted-foreground">{user.email}</p>
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs button-text rounded-lg mt-1">
                {user.type === "professional" ? "Profissional" : "Cliente"}
              </span>
            </div>
            <Link
              to="/profile"
              className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-border mb-6">
          <h3 className="title-semibold text-lg text-foreground mb-4">Aparência</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {darkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                <div>
                  <p className="subtitle text-sm text-foreground">Modo Escuro</p>
                  <p className="body-text text-xs text-muted-foreground">Tema escuro para interface</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="subtitle text-sm text-foreground">Idioma</p>
                  <p className="body-text text-xs text-muted-foreground">Português (Brasil)</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-border mb-6">
          <h3 className="title-semibold text-lg text-foreground mb-4">Notificações</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="subtitle text-sm text-foreground">Notificações Push</p>
                  <p className="body-text text-xs text-muted-foreground">Receber no dispositivo</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="subtitle text-sm text-foreground">E-mail</p>
                  <p className="body-text text-xs text-muted-foreground">Receber por e-mail</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="subtitle text-sm text-foreground">SMS</p>
                  <p className="body-text text-xs text-muted-foreground">Mensagens de texto</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="subtitle text-sm text-foreground">Marketing</p>
                  <p className="body-text text-xs text-muted-foreground">Promoções e novidades</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-border mb-6">
          <h3 className="title-semibold text-lg text-foreground mb-4">Privacidade</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="subtitle text-sm text-foreground">Perfil P��blico</p>
                  <p className="body-text text-xs text-muted-foreground">Seu perfil aparece nas buscas</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.profileVisible}
                  onChange={(e) => setPrivacy({ ...privacy, profileVisible: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="subtitle text-sm text-foreground">Mostrar Telefone</p>
                  <p className="body-text text-xs text-muted-foreground">Exibir número no perfil</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.showPhone}
                  onChange={(e) => setPrivacy({ ...privacy, showPhone: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="subtitle text-sm text-foreground">Mostrar E-mail</p>
                  <p className="body-text text-xs text-muted-foreground">Exibir e-mail no perfil</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.showEmail}
                  onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Options */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-border mb-6">
          <h3 className="title-semibold text-lg text-foreground mb-4">Conta</h3>
          
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary rounded-xl transition-smooth">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="subtitle text-sm text-foreground">Métodos de Pagamento</p>
                  <p className="body-text text-xs text-muted-foreground">Gerenciar cartões e PIX</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary rounded-xl transition-smooth">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="subtitle text-sm text-foreground">Segurança</p>
                  <p className="body-text text-xs text-muted-foreground">Alterar senha e 2FA</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-secondary rounded-xl transition-smooth">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="subtitle text-sm text-foreground">Ajuda e Suporte</p>
                  <p className="body-text text-xs text-muted-foreground">FAQ e contato</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-border mb-6">
          <h3 className="title-semibold text-lg text-foreground mb-4">Legal</h3>
          
          <div className="space-y-4">
            <Link to="/terms" className="w-full flex items-center justify-between p-4 hover:bg-secondary rounded-xl transition-smooth">
              <div className="text-left">
                <p className="subtitle text-sm text-foreground">Termos de Serviço</p>
                <p className="body-text text-xs text-muted-foreground">Última atualização: Jan 2024</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            <Link to="/privacy" className="w-full flex items-center justify-between p-4 hover:bg-secondary rounded-xl transition-smooth">
              <div className="text-left">
                <p className="subtitle text-sm text-foreground">Política de Privacidade</p>
                <p className="body-text text-xs text-muted-foreground">Última atualização: Jan 2024</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          className="w-full gradient-primary text-white py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth mb-4"
        >
          Salvar Configurações
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-4 text-destructive hover:bg-red-50 rounded-xl transition-smooth"
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span className="button-text">Sair da Conta</span>
        </button>

        {/* App Info */}
        <div className="text-center mt-8 py-4">
          <p className="body-text text-xs text-muted-foreground">
            PANASERVICE v1.0.0
          </p>
          <p className="body-text text-xs text-muted-foreground">
            © 2024 PANASERVICE. Todos os direitos reservados.
          </p>
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

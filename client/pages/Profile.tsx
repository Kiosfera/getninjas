import PlaceholderPage from "@/components/PlaceholderPage";
import { User } from "lucide-react";

export default function Profile() {
  return (
    <PlaceholderPage
      title="Seu Perfil"
      description="Central de controle da sua conta. Edite informações pessoais, visualize histórico completo de serviços, gerencie métodos de pagamento, configure notificações e acesse suas avaliações."
      icon={User}
    />
  );
}

import PlaceholderPage from "@/components/PlaceholderPage";
import { MessageCircle } from "lucide-react";

export default function Chat() {
  return (
    <PlaceholderPage
      title="Mensagens"
      description="Sistema de chat integrado para comunicação direta com profissionais. Compartilhe arquivos, fotos, tire dúvidas sobre orçamentos e acompanhe o progresso dos seus projetos em tempo real."
      icon={MessageCircle}
    />
  );
}

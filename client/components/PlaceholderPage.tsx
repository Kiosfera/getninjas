import { Construction, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function PlaceholderPage({
  title,
  description,
  icon: IconComponent = Construction,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Clean Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-soft sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="p-2 bg-secondary rounded-xl hover:bg-muted transition-smooth"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl title-bold text-foreground">{title}</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-soft">
              <IconComponent className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-soft">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl title-bold text-foreground mb-4">
            Em Desenvolvimento
          </h2>

          <p className="body-text text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-soft border border-border mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
            <p className="subtitle text-sm text-foreground mb-2">
              Funcionalidade em construção
            </p>
            <p className="body-text text-xs text-muted-foreground">
              PANASERVICE - Continue conversando para adicionar o conteúdo desta página!
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-soft-hover transition-smooth hover:scale-105 transition-bounce"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

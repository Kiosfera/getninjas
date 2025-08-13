import { Construction, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <header className="gradient-card shadow-tech sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-xl title-bold text-gray-900">{title}</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-tech">
              <IconComponent className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <h2 className="text-2xl title-bold text-gray-900 mb-4">
            Em Desenvolvimento
          </h2>

          <p className="body-text text-gray-600 mb-6 leading-relaxed">
            {description}
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-tech mb-6">
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
            <p className="subtitle text-sm text-gray-700 mb-2">
              Funcionalidade em construção
            </p>
            <p className="body-text text-xs text-gray-500">
              Continue conversando para adicionar o conteúdo desta página!
            </p>
          </div>

          <button className="gradient-primary text-white px-6 py-3 rounded-xl button-text hover:shadow-lg transition-all duration-200 hover:scale-105">
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
}

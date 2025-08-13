import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pb-20">
      <div className="text-center max-w-md">
        <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Construction className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-poppins font-semibold text-gray-900 mb-3">
          {title}
        </h1>
        <p className="text-gray-600 font-montserrat mb-6">
          {description}
        </p>
        <p className="text-sm text-gray-500 font-montserrat">
          Esta página está sendo desenvolvida. Continue conversando para adicionar o conteúdo aqui!
        </p>
      </div>
    </div>
  );
}

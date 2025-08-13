import PlaceholderPage from "@/components/PlaceholderPage";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <PlaceholderPage
      title="Buscar Serviços"
      description="Explore nossa base de milhares de profissionais qualificados. Use filtros avançados por categoria, localização, faixa de preço, avaliações e disponibilidade para encontrar exatamente o que você precisa."
      icon={SearchIcon}
    />
  );
}

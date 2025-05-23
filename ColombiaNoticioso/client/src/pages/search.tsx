import { useLocation } from "wouter";
import { useSearchArticles } from "@/hooks/use-news";
import { ArticleCard } from "@/components/article-card";
import { Sidebar } from "@/components/sidebar";
import { BannerAd } from "@/components/google-adsense";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Search() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get query from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || "";
    setSearchQuery(query);
  }, [location]);

  const { data: searchResults, isLoading, error } = useSearchArticles(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error en la búsqueda</h2>
          <p className="text-gray-600">Hubo un problema al realizar la búsqueda</p>
          <Button asChild className="mt-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Inicio
                </Link>
              </Button>
            </div>

            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-6">
              Búsqueda de Noticias
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative max-w-2xl">
                <Input
                  type="search"
                  placeholder="Buscar noticias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 h-12 text-lg"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-2 bg-brand-primary hover:bg-blue-700"
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Search Info */}
            {searchQuery && (
              <div className="text-gray-600">
                {isLoading ? (
                  <p>Buscando...</p>
                ) : searchResults ? (
                  <p>
                    {searchResults.length === 0 
                      ? "No se encontraron resultados" 
                      : `${searchResults.length} resultado${searchResults.length > 1 ? 's' : ''} encontrado${searchResults.length > 1 ? 's' : ''}`
                    } para "{searchQuery}"
                  </p>
                ) : null}
              </div>
            )}
          </div>

          {/* Search Results */}
          {!searchQuery ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="text-gray-400 text-2xl" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Busca noticias de Colombia
              </h3>
              <p className="text-gray-600">
                Ingresa palabras clave para encontrar las noticias que te interesan
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="w-full h-48 rounded-xl" />
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <>
              {/* AdSense Banner */}
              <BannerAd className="mb-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {searchResults.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="default"
                  />
                ))}
              </div>
            </>
          ) : searchQuery.length >= 2 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="text-gray-400 text-2xl" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600 mb-4">
                No hay noticias que coincidan con "{searchQuery}"
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-2">Sugerencias:</p>
                <ul className="space-y-1">
                  <li>• Verifica la ortografía de las palabras</li>
                  <li>• Usa términos más generales</li>
                  <li>• Intenta con palabras clave diferentes</li>
                </ul>
              </div>
            </div>
          ) : searchQuery.length > 0 && searchQuery.length < 2 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="text-gray-400 text-2xl" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Búsqueda muy corta
              </h3>
              <p className="text-gray-600">
                Por favor ingresa al menos 2 caracteres para buscar
              </p>
            </div>
          ) : null}

          {/* Search Tips */}
          {!searchQuery && (
            <div className="mt-12">
              <h2 className="text-xl font-playfair font-bold text-gray-800 mb-4">
                Búsquedas populares
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Política Colombia",
                  "Selección Nacional",
                  "Economía",
                  "Tecnología",
                  "Entretenimiento",
                  "Cultura",
                  "Deportes",
                  "Noticias Bogotá"
                ].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    onClick={() => {
                      setSearchQuery(term);
                      setLocation(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="h-auto p-3 text-left justify-start"
                  >
                    <SearchIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{term}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </main>
  );
}

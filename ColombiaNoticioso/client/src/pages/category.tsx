import { useParams } from "wouter";
import { useArticles, useCategory } from "@/hooks/use-news";
import { ArticleCard } from "@/components/article-card";
import { Sidebar } from "@/components/sidebar";
import { BannerAd } from "@/components/google-adsense";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(0);
  const articlesPerPage = 20;
  
  const { data: category, isLoading: categoryLoading } = useCategory(slug!);
  const { data: articles, isLoading: articlesLoading, error } = useArticles(
    category?.name,
    articlesPerPage,
    page * articlesPerPage
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error al cargar la categoría</h2>
          <p className="text-gray-600">Por favor intenta recargar la página</p>
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

  if (categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Skeleton className="h-12 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="w-full h-48 rounded-xl" />
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Categoría no encontrada</h2>
          <p className="text-gray-600">La categoría que buscas no existe</p>
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

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      "Política": "bg-news-politics",
      "Deportes": "bg-news-sports", 
      "Entretenimiento": "bg-news-entertainment",
      "Economía": "bg-news-economy",
      "Tecnología": "bg-news-technology",
      "Cultura": "bg-news-culture",
    };
    return colors[categoryName] || "bg-gray-500";
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Category Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Inicio
                </Link>
              </Button>
              <Badge className={`${getCategoryColor(category.name)} text-white px-4 py-2 text-lg`}>
                {category.name}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4">
              Noticias de {category.name}
            </h1>
            
            {category.description && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {category.description}
              </p>
            )}
          </div>

          {/* AdSense Banner */}
          <BannerAd className="mb-8" />

          {/* Articles Grid */}
          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(8)].map((_, i) => (
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
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="default"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-newspaper text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No hay noticias disponibles
              </h3>
              <p className="text-gray-600">
                No se encontraron noticias en la categoría {category.name} en este momento.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {!articlesLoading && articles && articles.length >= articlesPerPage && (
            <div className="text-center mt-8">
              <Button 
                onClick={() => setPage(page + 1)}
                className="bg-brand-primary hover:bg-blue-700 text-white"
              >
                Cargar más noticias
              </Button>
            </div>
          )}

          {/* Articles count info */}
          {!articlesLoading && articles && articles.length > 0 && (
            <div className="mt-8 text-center text-gray-500 text-sm">
              Mostrando {Math.min((page + 1) * articlesPerPage, articles.length)} noticias
              {articles.length >= articlesPerPage && " - Hay más disponibles"}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </main>
  );
}

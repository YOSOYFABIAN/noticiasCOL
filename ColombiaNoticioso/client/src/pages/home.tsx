import { useArticles, useBreakingNews } from "@/hooks/use-news";
import { ArticleCard } from "@/components/article-card";
import { Sidebar } from "@/components/sidebar";
import { BannerAd } from "@/components/google-adsense";
import { TrendingTopics } from "@/components/trending-topics";
import { LiveTicker } from "@/components/live-ticker";
import { SocialFeed } from "@/components/social-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const [page, setPage] = useState(0);
  const articlesPerPage = 20;
  
  const { data: articles, isLoading: articlesLoading, error } = useArticles(
    undefined, 
    articlesPerPage, 
    page * articlesPerPage
  );
  
  const { data: breakingNews, isLoading: breakingLoading } = useBreakingNews();

  const featuredArticle = articles?.[0];
  const secondaryArticles = articles?.slice(1, 4) || [];
  const latestArticles = articles?.slice(4) || [];

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error al cargar las noticias</h2>
          <p className="text-gray-600">Por favor intenta recargar la página</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Hero Section */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Featured Article */}
              {articlesLoading ? (
                <div className="md:col-span-1">
                  <Skeleton className="w-full h-64 rounded-xl" />
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ) : featuredArticle ? (
                <div className="md:col-span-1">
                  <ArticleCard 
                    article={featuredArticle} 
                    variant="featured" 
                  />
                </div>
              ) : null}

              {/* Secondary Articles Grid */}
              <div className="grid grid-cols-1 gap-6">
                {articlesLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <Skeleton className="w-20 h-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  secondaryArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="compact"
                      showStats={false}
                    />
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Live Ticker */}
          <section className="mb-8">
            <LiveTicker />
          </section>

          {/* AdSense Banner */}
          <BannerAd className="mb-8" />

          {/* Trending Topics Section */}
          <section className="mb-12">
            <TrendingTopics />
          </section>

          {/* Latest News Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-playfair font-bold text-gray-800 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-brand-primary" />
                Últimas Noticias
              </h2>
              <Button variant="outline" asChild>
                <Link href="/category/todas">Ver todas</Link>
              </Button>
            </div>

            {articlesLoading ? (
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {latestArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="default"
                  />
                ))}
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
          </section>

          {/* Video Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6 flex items-center">
              <Play className="w-6 h-6 mr-2 text-brand-secondary" />
              Videos Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
                    alt="Presentador de noticias colombiano en estudio de TV"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Button size="lg" className="bg-white bg-opacity-90 text-gray-800 rounded-full hover:bg-opacity-100">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    4:32
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Resumen semanal de noticias políticas
                  </h3>
                  <p className="text-sm text-gray-500">125,432 visualizaciones</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300" 
                    alt="Celebración de partido de fútbol colombiano"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <Button size="lg" className="bg-white bg-opacity-90 text-gray-800 rounded-full hover:bg-opacity-100">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    2:15
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Mejores goles de la fecha en Liga BetPlay
                  </h3>
                  <p className="text-sm text-gray-500">89,621 visualizaciones</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </main>
  );
}

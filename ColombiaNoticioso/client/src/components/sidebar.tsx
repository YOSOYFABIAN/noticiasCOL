import { useTrendingTopics, useMostRead, useWeather, useAISummary } from "@/hooks/use-news";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarAd } from "./google-adsense";
import { NewsletterSignup } from "./newsletter-signup";
import { SocialFeed } from "./social-feed";
import { Button } from "@/components/ui/button";
import { Cloud, Sun, CloudRain } from "lucide-react";

export function Sidebar() {
  const { data: trending, isLoading: trendingLoading } = useTrendingTopics(5);
  const { data: mostRead, isLoading: mostReadLoading } = useMostRead(5);
  const { data: weather, isLoading: weatherLoading } = useWeather();
  const { data: aiSummary, isLoading: summaryLoading } = useAISummary();

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun className="text-yellow-400" size={24} />;
      case 'cloud':
        return <Cloud className="text-gray-400" size={24} />;
      case 'rain':
        return <CloudRain className="text-blue-400" size={24} />;
      default:
        return <Sun className="text-yellow-400" size={24} />;
    }
  };

  return (
    <aside className="space-y-8">
      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-playfair">Resumen IA</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="text-sm text-gray-600 leading-relaxed">
              {aiSummary?.summary || "Cargando resumen inteligente..."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-playfair">Tendencias</CardTitle>
        </CardHeader>
        <CardContent>
          {trendingLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {trending?.map((topic, index) => (
                <div key={topic.id} className="flex items-start space-x-3">
                  <Badge 
                    variant="secondary" 
                    className="w-6 h-6 flex items-center justify-center text-xs p-0 bg-brand-primary text-white"
                  >
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm leading-tight">
                      {topic.hashtag}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {topic.count.toLocaleString()} tweets
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AdSense Sidebar */}
      <SidebarAd className="my-6" />

      {/* Weather Widget */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-lg font-playfair flex items-center">
            Clima
            <Sun className="ml-2 text-yellow-300" size={20} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weatherLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-16 bg-white/20" />
                  <Skeleton className="h-4 w-12 bg-white/20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {weather?.map((city) => (
                <div key={city.id} className="flex justify-between items-center">
                  <span className="text-sm">{city.city}</span>
                  <div className="flex items-center space-x-2">
                    {getWeatherIcon(city.icon)}
                    <span className="text-sm font-medium">{city.temperature}°C</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Most Read */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-playfair">Más Leídas</CardTitle>
        </CardHeader>
        <CardContent>
          {mostReadLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-3">
                  <Skeleton className="w-6 h-6 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {mostRead?.map((article, index) => (
                <article key={article.id} className="flex space-x-3">
                  <Badge 
                    variant="destructive"
                    className="w-6 h-6 flex items-center justify-center text-xs p-0 bg-brand-secondary"
                  >
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <Link href={`/article/${article.id}`}>
                      <h4 className="font-medium text-sm leading-tight hover:text-brand-primary cursor-pointer line-clamp-2">
                        {article.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {article.views.toLocaleString()} lecturas
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Feed */}
      <SocialFeed />

      {/* Newsletter Signup */}
      <Card className="bg-brand-primary text-white">
        <CardHeader>
          <CardTitle className="text-lg font-playfair">Mantente Informado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4 opacity-90">
            Recibe las noticias más importantes directo en tu email
          </p>
          <NewsletterSignup>
            <Button className="w-full bg-white text-brand-primary font-semibold hover:bg-gray-100">
              <i className="fas fa-envelope mr-2"></i>
              Suscribirme
            </Button>
          </NewsletterSignup>
        </CardContent>
      </Card>
    </aside>
  );
}

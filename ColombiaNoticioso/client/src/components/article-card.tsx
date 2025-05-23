import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "featured";
  showImage?: boolean;
  showStats?: boolean;
}

export function ArticleCard({ 
  article, 
  variant = "default", 
  showImage = true,
  showStats = true 
}: ArticleCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Política": "bg-news-politics",
      "Deportes": "bg-news-sports", 
      "Entretenimiento": "bg-news-entertainment",
      "Economía": "bg-news-economy",
      "Tecnología": "bg-news-technology",
      "Cultura": "bg-news-culture",
    };
    return colors[category] || "bg-gray-500";
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Hace unos minutos";
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    
    return new Date(date).toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric'
    });
  };

  const shareArticle = async () => {
    const url = `${window.location.origin}/article/${article.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
    }
  };

  if (variant === "compact") {
    return (
      <article className="flex space-x-4 p-4 hover:bg-gray-50 transition-colors">
        {showImage && article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <Link href={`/article/${article.id}`}>
            <h3 className="font-semibold text-gray-800 leading-tight hover:text-brand-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
            <Badge variant="secondary" className={`${getCategoryColor(article.category)} text-white text-xs`}>
              {article.category}
            </Badge>
            <span>{formatDate(article.publishedAt)}</span>
            {showStats && (
              <>
                <span>•</span>
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {article.views}
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-shadow">
        {showImage && article.imageUrl && (
          <div className="relative">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-64 object-cover"
            />
            {article.isBreaking && (
              <Badge className="absolute top-4 left-4 bg-brand-secondary text-white">
                ÚLTIMO MOMENTO
              </Badge>
            )}
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Badge className={`${getCategoryColor(article.category)} text-white`}>
              {article.category}
            </Badge>
            {article.readTime && (
              <span className="text-gray-500 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {article.readTime} min lectura
              </span>
            )}
          </div>
          
          <Link href={`/article/${article.id}`}>
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-3 leading-tight hover:text-brand-primary transition-colors">
              {article.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
            {article.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Por {article.author}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            {showStats && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {article.views.toLocaleString()}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={shareArticle}
                  className="text-gray-500 hover:text-brand-primary"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      {showImage && article.imageUrl && (
        <div className="relative">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-48 object-cover"
          />
          {article.isBreaking && (
            <Badge className="absolute top-2 left-2 bg-brand-secondary text-white text-xs">
              ÚLTIMO MOMENTO
            </Badge>
          )}
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={`${getCategoryColor(article.category)} text-white text-sm`}>
            {article.category}
          </Badge>
          {article.readTime && (
            <span className="text-gray-500 text-sm flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {article.readTime} min lectura
            </span>
          )}
        </div>
        
        <Link href={`/article/${article.id}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 leading-tight hover:text-brand-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Por {article.author}</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          {showStats && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {article.views.toLocaleString()}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={shareArticle}
                className="text-gray-500 hover:text-brand-primary"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

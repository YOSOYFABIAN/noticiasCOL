import { useParams } from "wouter";
import { useArticle, useArticles } from "@/hooks/use-news";
import { ArticleCard } from "@/components/article-card";
import { Sidebar } from "@/components/sidebar";
import { BannerAd } from "@/components/google-adsense";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  Clock, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  Copy,
  ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const { data: article, isLoading: articleLoading, error, incrementViews } = useArticle(parseInt(id!));
  const { data: relatedArticles, isLoading: relatedLoading } = useArticles(article?.category, 4, 0);

  // Increment views when article loads
  useEffect(() => {
    if (article && incrementViews) {
      incrementViews();
    }
  }, [article, incrementViews]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error al cargar el artículo</h2>
          <p className="text-gray-600">El artículo que buscas no pudo ser cargado</p>
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

  if (articleLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-6" />
            <Skeleton className="h-64 w-full mb-6" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
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

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Artículo no encontrado</h2>
          <p className="text-gray-600">El artículo que buscas no existe</p>
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
    return new Date(date).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shareArticle = async (platform?: string) => {
    const url = `${window.location.origin}/article/${article.id}`;
    const title = article.title;
    const text = article.summary;

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Enlace copiado",
          description: "El enlace del artículo se ha copiado al portapapeles",
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    } else if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
    setShowShareMenu(false);
  };

  const relatedArticlesFiltered = relatedArticles?.filter(a => a.id !== article.id).slice(0, 3) || [];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand-primary">Inicio</Link>
            <span>/</span>
            <Link href={`/category/${article.category.toLowerCase()}`} className="hover:text-brand-primary">
              {article.category}
            </Link>
            <span>/</span>
            <span className="text-gray-400">Artículo</span>
          </div>

          {/* Article Header */}
          <article className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Category and Breaking Badge */}
            <div className="p-6 pb-0">
              <div className="flex items-center space-x-3 mb-4">
                <Badge className={`${getCategoryColor(article.category)} text-white`}>
                  {article.category}
                </Badge>
                {article.isBreaking && (
                  <Badge variant="destructive" className="bg-brand-secondary animate-pulse">
                    ÚLTIMO MOMENTO
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 leading-tight mb-4">
                {article.title}
              </h1>

              {/* Summary */}
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {article.summary}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex flex-wrap items-center space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>Por {article.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  {article.readTime && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{article.readTime} min lectura</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{article.views.toLocaleString()} vistas</span>
                  </div>
                </div>

                {/* Share Button */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-48">
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareArticle('facebook')}
                          className="w-full justify-start text-blue-600 hover:bg-blue-50"
                        >
                          <Facebook className="w-4 h-4 mr-2" />
                          Facebook
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareArticle('twitter')}
                          className="w-full justify-start text-blue-400 hover:bg-blue-50"
                        >
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareArticle('linkedin')}
                          className="w-full justify-start text-blue-700 hover:bg-blue-50"
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareArticle('copy')}
                          className="w-full justify-start hover:bg-gray-50"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar enlace
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.imageUrl && (
              <div className="px-6">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            <Separator className="my-6" />

            {/* Article Content */}
            <div className="p-6">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {article.content}
                </div>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Etiquetas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Attribution */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
                <div className="flex items-center justify-between">
                  <span>Fuente: {article.sourceName}</span>
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-brand-primary"
                  >
                    Ver artículo original
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* AdSense Banner */}
          <BannerAd className="mb-8" />

          {/* Related Articles */}
          {!relatedLoading && relatedArticlesFiltered.length > 0 && (
            <section>
              <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-6">
                Artículos Relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticlesFiltered.map((relatedArticle) => (
                  <ArticleCard
                    key={relatedArticle.id}
                    article={relatedArticle}
                    variant="compact"
                    showImage={true}
                    showStats={false}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </main>
  );
}

import { useBreakingNews } from "@/hooks/use-news";
import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export function BreakingNews() {
  const { data: breakingNews, isLoading } = useBreakingNews();

  if (isLoading || !breakingNews || breakingNews.length === 0) {
    return null;
  }

  return (
    <div className="bg-brand-secondary text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex items-center bg-white text-brand-secondary px-3 py-1 rounded font-bold text-sm mr-4 flex-shrink-0">
            <AlertCircle className="w-4 h-4 mr-1" />
            ÚLTIMA HORA
          </div>
          <div className="flex animate-marquee space-x-8">
            {breakingNews.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="hover:underline whitespace-nowrap"
              >
                {article.title}
                {index < breakingNews.length - 1 && " • "}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
